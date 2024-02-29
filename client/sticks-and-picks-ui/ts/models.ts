export type UserSerializer = {
  id: string;
  display_name: string;
  clerk_id: string;
  user_type: "ADMIN" | "USER";
  created_at: string;
};
