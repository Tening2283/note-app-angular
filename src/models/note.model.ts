export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
}