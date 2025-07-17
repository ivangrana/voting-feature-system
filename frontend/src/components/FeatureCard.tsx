
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Calendar, User } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Feature {
  id: number;
  title: string;
  description: string;
  vote_count: number;
  created_at: string;
  user_id: number;
  voted: boolean;
}

interface FeatureCardProps {
  feature: Feature;
  onVoteChange?: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature, onVoteChange }) => {
  const { toast } = useToast();

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (feature.voted) {
        await api.delete(`/votes/${feature.id}`);
        toast({
          title: "Vote removed",
          description: "Your vote has been removed.",
        });
      } else {
        await api.post('/votes', { feature_id: feature.id });
        toast({
          title: "Vote cast",
          description: "Your vote has been recorded.",
        });
      }
      onVoteChange?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update your vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link to={`/features/${feature.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg leading-6 pr-4">
              {feature.title}
            </CardTitle>
            <div className="flex flex-col items-center space-y-1 flex-shrink-0">
              <Button
                size="sm"
                variant={feature.voted ? "default" : "outline"}
                onClick={handleVote}
                className="flex items-center space-x-1"
              >
                {feature.voted ? (
                  <ArrowDown className="h-4 w-4" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
                <span>{feature.vote_count}</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {feature.description}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>User {feature.user_id}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(feature.created_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
