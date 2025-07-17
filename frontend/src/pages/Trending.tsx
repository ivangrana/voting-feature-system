
import { useState, useEffect } from 'react';
import { FeatureCard } from '@/components/FeatureCard';
import { TrendingUp, Flame } from 'lucide-react';
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

const Trending = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrendingFeatures();
  }, []);

  const fetchTrendingFeatures = async () => {
    setLoading(true);
    try {
      const data = await api.get('/trending');
      setFeatures(data);
    } catch (error) {
      console.error('Failed to fetch trending features:', error);
      toast({
        title: "Error",
        description: "Failed to load trending features. Please try again.",
        variant: "destructive",
      });
      setFeatures([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteChange = () => {
    fetchTrendingFeatures();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-orange-100 rounded-full p-3">
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Trending Features</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the most popular feature requests that are gaining momentum in our community. 
          These features are trending based on recent voting activity and community engagement.
        </p>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6 mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <Flame className="h-5 w-5 text-orange-600" />
          <h2 className="text-lg font-semibold text-orange-900">🔥 Hot Right Now</h2>
        </div>
        <p className="text-orange-800 text-sm">
          These features have received the most votes and engagement in the past 7 days. 
          Join the conversation and help shape the future of our platform!
        </p>
      </div>

      {features.length > 0 ? (
        <div className="space-y-6">
          {features.map((feature, index) => (
            <div key={feature.id} className="relative">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <FeatureCard
                    feature={feature}
                    onVoteChange={handleVoteChange}
                  />
                </div>
              </div>
              {index < 3 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  🔥 HOT
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Trending Features</h3>
          <p className="text-gray-600">
            Check back later to see what features are gaining popularity!
          </p>
        </div>
      )}
    </div>
  );
};

export default Trending;
