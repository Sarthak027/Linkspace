import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Send, Image, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreatePostProps {
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  onPostCreated: () => void;
}

const CreatePost = ({ user, onPostCreated }: CreatePostProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !selectedImage) {
      toast.error("Please write something or add an image!");
      return;
    }

    setIsSubmitting(true);
    
    try {
      let imageUrl = null;

      // Upload image if selected
      if (selectedImage) {
        const fileExt = selectedImage.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(fileName, selectedImage);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from("post-images")
          .getPublicUrl(fileName);
        
        imageUrl = urlData.publicUrl;
      }

      // Create post with image URL
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content: content.trim(),
        image_url: imageUrl,
      });

      if (error) throw error;

      toast.success("Post created successfully!");
      setContent("");
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onPostCreated();
    } catch (error) {
      toast.error("Failed to create post");
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={user.avatar_url} alt={user.full_name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {imagePreview && (
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-h-64 rounded-md object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
            >
              <Image className="h-4 w-4" />
              {selectedImage ? "Replace Photo" : "Add Photo"}
            </Button>
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting || (!content.trim() && !selectedImage)} 
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreatePost;
