
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp, Plus, Vote } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
            <Vote className="h-6 w-6" />
            <span>FeatureVote</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/features"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Features
            </Link>
            <Link
              to="/trending"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
            </Link>
            <Link
              to="/features/new"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Suggest Feature</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/features/new">
              <Button size="sm" className="flex items-center space-x-1">
                <Plus className="h-4 w-4" />
                <span>Suggest Feature</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
