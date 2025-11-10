import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, MessageSquare, Share2, TrendingUp } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">LinkedIn</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/auth?mode=login")}>
            Log In
          </Button>
          <Button onClick={() => navigate("/auth?mode=signup")}>
            Sign Up
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Connect with professionals
            <span className="text-primary block mt-2">around the world</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your thoughts, build your network, and grow your career with our professional community platform.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => navigate("/auth?mode=signup")} className="gap-2">
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth?mode=login")}>
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border space-y-3">
            <MessageSquare className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Share Your Thoughts</h3>
            <p className="text-muted-foreground">
              Post updates with text and images to engage with your professional network.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border space-y-3">
            <Share2 className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Build Your Network</h3>
            <p className="text-muted-foreground">
              Connect with professionals and expand your reach in your industry.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border space-y-3">
            <TrendingUp className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Grow Your Career</h3>
            <p className="text-muted-foreground">
              Discover opportunities and insights from industry leaders worldwide.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-border">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2025 LinkedIn. Made with ❤️ by Sarthak</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
