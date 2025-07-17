
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Lightbulb } from 'lucide-react';

const CreateFeature = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and description for your feature.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/features', { title, description });
      
      toast({
        title: "Feature submitted!",
        description: "Your feature request has been created successfully.",
      });
      navigate('/features');
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Failed to create feature request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Lightbulb className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Suggest a Feature</CardTitle>
          <CardDescription>
            Share your idea to help improve our platform. Provide clear details to help others understand and vote on your suggestion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Feature Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Dark Mode Support"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
              />
              <p className="text-sm text-gray-500">
                {title.length}/100 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your feature idea in detail. What problem does it solve? How would it work? Why is it important?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                maxLength={2000}
                required
              />
              <p className="text-sm text-gray-500">
                {description.length}/2000 characters
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for a great feature request:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be specific about what you want and why</li>
                <li>• Explain the problem you're trying to solve</li>
                <li>• Consider how it would benefit other users</li>
                <li>• Keep it focused on one main feature</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Feature'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/features')}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateFeature;
