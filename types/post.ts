export type Post = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updateAt: number | null;
  authorId: string;
};
