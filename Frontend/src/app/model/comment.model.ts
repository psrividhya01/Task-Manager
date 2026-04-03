export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  authorName: string;
}

export interface CreateCommentModel {
  content: string;
}
