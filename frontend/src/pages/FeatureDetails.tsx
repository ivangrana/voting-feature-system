
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Calendar, User, ArrowLeft } from 'lucide-react';
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

const FeatureDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [feature, setFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeature();
  }, [id]);

  const fetchFeature = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/features/${id}`);
      setFeature(data);
    } catch (error) {
      console.error('Failed to fetch feature:', error);
      toast({
        title: "Error",
        description: "Failed to load feature details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!feature) return;

    try {
      if (feature.voted) {
        await api.delete(`/votes/${feature.id}`);
        setFeature(prev => prev ? {
          ...prev,
          voted: false,
          vote_count: prev.vote_count - 1
        } : null);
        toast({
          title: "Vote removed",
          description: "Your vote has been removed.",
        });
      } else {
        await api.post('/votes', { feature_id: feature.id });
        setFeature(prev => prev ? {
          ...prev,
          voted: true,
          vote_count: prev.vote_count + 1
        } : null);
        toast({
          title: "Vote cast",
          description: "Your vote has been recorded.",
        });
      }
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!feature) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Feature Not Found</h1>
        <p className="text-gray-600 mb-6">The feature you're looking for doesn't exist.</p>
        <Link to="/features">
          <Button>Back to Features</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to="/features"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Features</span>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
                <Badge className="bg-gray-100 text-gray-800">
                  pending
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>by User {feature.user_id}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(feature.created_at)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Button
                size="lg"
                variant={feature.voted ? "default" : "outline"}
                onClick={handleVote}
                className="flex items-center space-x-2"
              >
                {feature.voted ? (
                  <ArrowDown className="h-5 w-5" />
                ) : (
                  <ArrowUp className="h-5 w-5" />
                )}
                <span>{feature.voted ? 'Unvote' : 'Vote'}</span>
              </Button>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{feature.vote_count}</div>
                <div className="text-sm text-gray-500">votes</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none">
            {feature.description.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureDetails;
