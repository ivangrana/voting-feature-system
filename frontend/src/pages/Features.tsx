
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FeatureCard } from '@/components/FeatureCard';
import { Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
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

const Features = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'votes' | 'date'>('votes');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const { toast } = useToast();
  const featuresPerPage = 12;

  useEffect(() => {
    fetchFeatures();
  }, [sortBy, currentPage]);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/features?sort_by=${sortBy}&page=${currentPage}&limit=${featuresPerPage}`);
      setFeatures(data);
      setHasNextPage(data.length === featuresPerPage);
    } catch (error) {
      console.error('Failed to fetch features:', error);
      toast({
        title: "Error",
        description: "Failed to load features. Please try again.",
        variant: "destructive",
      });
      setFeatures([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteChange = () => {
    fetchFeatures();
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Feature Requests</h1>
          <p className="text-gray-600">
            Discover and vote on features that matter to you
          </p>
        </div>
        <Link to="/features/new">
          <Button className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Plus className="h-4 w-4" />
            <span>Suggest Feature</span>
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Sort by:</span>
          <Select value={sortBy} onValueChange={(value: 'votes' | 'date') => setSortBy(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="votes">Most Votes</SelectItem>
              <SelectItem value="date">Most Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-gray-500">
          Showing {features.length} features
        </div>
      </div>

      {features.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onVoteChange={handleVoteChange}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            <span className="text-sm text-gray-600">
              Page {currentPage}
            </span>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!hasNextPage}
              className="flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No features found</p>
          <Link to="/features/new">
            <Button>Be the first to suggest a feature</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Features;
