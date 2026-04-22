import type { Comment } from "./comment";
import type { Like } from "./like";

export type Report = {
  id: string;
  summary: string;
  description: string;
  priority: "low" | "medium" | "high";
  lat: number;
  lng: number;
  address?: string | null;
  user_id: number | null;
  user?: {
    id: number;
    name: string;
  };
  comments?: Comment[];
  likes?: Like[];
  likes_count: number;
  comments_count: number;
  liked_by_user?: boolean;
  created_at: string;
  category?: string | null;
  images?: { id: number; url: string; image_url: string }[];
};






