from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    created_at = Column(DateTime, default=func.now())

    votes = relationship("Vote", back_populates="user")
    features = relationship("Feature", back_populates="user")

class Feature(Base):
    __tablename__ = "features"
    id = Column(Integer, primary_key=True)
    title = Column(String, index=True)
    description = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="features")
    votes = relationship("Vote", back_populates="feature")

class Vote(Base):
    __tablename__ = "votes"
    feature_id = Column(Integer, ForeignKey("features.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    created_at = Column(DateTime, default=func.now())

    feature = relationship("Feature", back_populates="votes")
    user = relationship("User", back_populates="votes")
