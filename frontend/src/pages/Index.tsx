
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Lightbulb, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Shape the Future with Your
          <span className="text-blue-600"> Ideas</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover, vote on, and suggest features that matter most to your community.
          Join thousands of users making products better, one vote at a time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/features">
            <Button size="lg" className="flex items-center space-x-2">
              <span>Explore Features</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          {!user && (
            <Link to="/register">
              <Button variant="outline" size="lg">
                Join the Community
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-8 py-16">
        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <Lightbulb className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">1,247</h3>
            <p className="text-gray-600">Feature Suggestions</p>
          </CardContent>
        </Card>
        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">8,432</h3>
            <p className="text-gray-600">Active Voters</p>
          </CardContent>
        </Card>
        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">342</h3>
            <p className="text-gray-600">Features Implemented</p>
          </CardContent>
        </Card>
      </div>

      {/* How it Works */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Browse Features</h3>
            <p className="text-gray-600">
              Explore feature suggestions from the community and see what's trending.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Vote & Discuss</h3>
            <p className="text-gray-600">
              Vote on features you want to see and share your thoughts with others.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">See Results</h3>
            <p className="text-gray-600">
              Watch as popular features get implemented and make a real impact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
