export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  member_type: 'student' | 'staff' | 'external';
  phone?: string;
  address?: string;
  date_of_birth?: string;
  profile_picture?: string;
  is_active_member: boolean;
  max_books_allowed: number;
  currently_issued_books: number;
  can_issue_more_books: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  books_count: number;
  created_at: string;
}

export interface Author {
  id: number;
  name: string;
  biography?: string;
  birth_date?: string;
  country?: string;
  books_count: number;
  created_at: string;
}

export interface Publisher {
  id: number;
  name: string;
  address?: string;
  website?: string;
  email?: string;
  books_count: number;
  created_at: string;
}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  authors?: Author[];
  authors_names?: string[];
  publisher?: Publisher;
  publisher_name?: string;
  category?: Category;
  category_name?: string;
  publication_year: number;
  language: string;
  pages?: number;
  description?: string;
  cover_image?: string;
  total_copies: number;
  available_copies: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface IssueRecord {
  id: number;
  user: number;
  user_name: string;
  user_username: string;
  book: number;
  book_title: string;
  book_isbn: string;
  issue_date: string;
  due_date: string;
  return_date?: string;
  status: 'issued' | 'returned' | 'overdue';
  fine_amount: string;
  renewal_count: number;
  is_overdue: boolean;
  days_overdue: number;
  notes?: string;
}

export interface Reservation {
  id: number;
  user: number;
  user_name: string;
  user_username: string;
  book: number;
  book_title: string;
  book_isbn: string;
  reservation_date: string;
  status: 'pending' | 'fulfilled' | 'cancelled' | 'expired';
  expiry_date: string;
  fulfilled_date?: string;
  notes?: string;
}

export interface DashboardStats {
  total_books: number;
  total_members: number;
  books_issued: number;
  books_available: number;
  overdue_books: number;
  pending_reservations: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  member_type: 'student' | 'staff' | 'external';
  phone?: string;
}
