import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    image_url?: string;
    created_at: string;
    profiles: {
      full_name: string;
      avatar_url?: string;
    };
  };
}

const PostCard = ({ post }: PostCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={post.profiles.avatar_url} alt={post.profiles.full_name} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(post.profiles.full_name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold text-foreground">{post.profiles.full_name}</h3>
            <p className="text-sm text-muted-foreground">{timeAgo}</p>
          </div>
          <div className="space-y-3">
            {post.content && (
              <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
            )}
            {post.image_url && (
              <img 
                src={post.image_url} 
                alt="Post content" 
                className="rounded-md w-full object-cover max-h-96"
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
