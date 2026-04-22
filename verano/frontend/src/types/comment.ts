export type Comment = {
  id: number;
  content: string;
  user_id: number;
  report_id: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
  };
};