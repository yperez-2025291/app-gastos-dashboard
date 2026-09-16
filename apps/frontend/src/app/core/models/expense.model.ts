export interface Category {
  id: string;
  name: string;
  userId: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  description?: string;
  date: string;
  userId: string;
  categoryId: string;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}