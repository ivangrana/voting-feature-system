from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from fastapi.requests import Request
from sqlalchemy import func, select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import cast, extract
import uvicorn

from models import Feature, Vote, User
from database import get_db
from schemas import FeatureCreate, FeatureOut, UserCreate, Token, VoteCreate
from auth import get_current_user, create_access_token, authenticate_user, get_password_hash

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

# Middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]
)

# Utility
def feature_to_out(feature, vote_count, voted):
    return FeatureOut(
        id=feature.id,
        title=feature.title,
        description=feature.description,
        user_id=feature.user_id,
        created_at=feature.created_at,
        vote_count=vote_count,
        voted=voted
    )

@app.post("/api/auth/register", response_model=Token)
@limiter.limit("5/minute")
async def register(request: Request,user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(User.__table__.select().where(User.email == user_in.email))
    if result.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = get_password_hash(user_in.password)
    new_user = User(email=user_in.email, password=hashed)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    token = create_access_token({"sub": new_user.email})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=Token)
@limiter.limit("5/minute")
async def login(request: Request,user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    user = await authenticate_user(db, user_in.email, user_in.password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/features", response_model=list[FeatureOut])
@limiter.limit("20/minute")
async def get_features(request: Request,
    sort_by: str = "votes",
    page: int = 1,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    offset = (page - 1) * limit
    if sort_by == "votes":
        stmt = (
            select(Feature, func.count(Vote.feature_id).label("vote_count"))
            .outerjoin(Vote)
            .group_by(Feature.id)
            .order_by(func.count(Vote.feature_id).desc())
            .offset(offset)
            .limit(limit)
        )
    elif sort_by == "date":
        stmt = (
            select(Feature)
            .options(joinedload(Feature.votes))
            .order_by(Feature.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid sort_by value")

    result = await db.execute(stmt)
    features = result.all()

    response = []
    for row in features:
        feature = row[0] if sort_by == "votes" else row
        vote_count = len(feature.votes) if hasattr(feature, "votes") else row.vote_count
        voted = any(vote.user_id == current_user.id for vote in feature.votes)
        response.append(feature_to_out(feature, vote_count, voted))

    return response

@app.post("/api/features", response_model=FeatureOut)
@limiter.limit("5/minute")
async def create_feature(request: Request,
    feature_in: FeatureCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    feature = Feature(**feature_in.dict(), user_id=current_user.id)
    db.add(feature)
    await db.commit()
    await db.refresh(feature)
    return feature_to_out(feature, vote_count=0, voted=False)

@app.get("/api/features/{feature_id}", response_model=FeatureOut)
@limiter.limit("20/minute")
async def get_feature(request: Request,
    feature_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Feature).options(joinedload(Feature.votes)).where(Feature.id == feature_id)
    result = await db.execute(stmt)
    feature = result.scalars().first()
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")

    vote_count = len(feature.votes)
    voted = any(vote.user_id == current_user.id for vote in feature.votes)
    return feature_to_out(feature, vote_count, voted)

@app.post("/api/votes", status_code=204)
@limiter.limit("10/minute")
async def cast_vote(request: Request,
    vote_in: VoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Vote).where(Vote.feature_id == vote_in.feature_id, Vote.user_id == current_user.id)
    result = await db.execute(stmt)
    existing = result.scalars().first()
    if existing:
        return JSONResponse(status_code=204, content={"detail": "Already voted"})

    new_vote = Vote(feature_id=vote_in.feature_id, user_id=current_user.id)
    db.add(new_vote)
    await db.commit()
    return JSONResponse(status_code=204, content={"detail": "Voted"})

@app.delete("/api/votes/{feature_id}", status_code=204)
@limiter.limit("10/minute")
async def remove_vote(request: Request,
    feature_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Vote).where(Vote.feature_id == feature_id, Vote.user_id == current_user.id)
    result = await db.execute(stmt)
    vote = result.scalars().first()
    if vote:
        await db.delete(vote)
        await db.commit()
    return JSONResponse(status_code=204, content={"detail": "Vote removed"})

@app.get("/api/trending", response_model=list[FeatureOut])
@limiter.limit("10/minute")
async def get_trending(request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    stmt = (
        select(Feature, func.count(Vote.feature_id).label("vote_count"))
        .outerjoin(Vote)
        .group_by(Feature.id)
        .order_by(
            (cast(func.count(Vote.feature_id), func.float) / extract("epoch", func.now() - Feature.created_at)).desc()
        )
        .limit(10)
    )

    result = await db.execute(stmt)
    rows = result.all()
    response = []

    for feature, vote_count in rows:
        voted = any(vote.user_id == current_user.id for vote in feature.votes)
        response.append(feature_to_out(feature, vote_count, voted))

    return response

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
