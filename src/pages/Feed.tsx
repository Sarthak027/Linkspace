import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import { Loader2 } from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
}

interface Post {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url?: string;
  };
}

const Feed = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth?mode=login");
      }
    });

    // Then check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth?mode=login");
      }
    };

    checkSession();

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPosts();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setProfile(data);
    }
    setIsLoading(false);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        content,
        image_url,
        created_at,
        user_id
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      return;
    }

    // Fetch profiles for each post
    const postsWithProfiles = await Promise.all(
      (data || []).map(async (post) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", post.user_id)
          .single();

        return {
          ...post,
          profiles: profile || { full_name: "Unknown User", avatar_url: undefined },
        };
      })
    );

    setPosts(postsWithProfiles as Post[]);
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={profile} />
      <main className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
        <CreatePost user={profile} onPostCreated={fetchPosts} />
        
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </main>
    </div>
  );
};

export default Feed;
