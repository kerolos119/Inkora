export type Role = 'USER' | 'ADMIN' | 'AGENT';

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  address?: string;
  phoneNumber?: string;
  createdAt?: string;
}

export interface Book {
  id: string;
  authorId: string;
  authorName: string;
  bookTitle: string;
  bookDescription: string;
  numberOfPages: number;
  bookSize: string;
  coverType: 'Hardcover' | 'Paperback' | 'Clothbound' | 'Special Edition';
  paperType: string;
  publicationYear: string;
  language: string;
  isbn: string;
  price: number;
  discount?: number; // e.g. 15 for 15% off
  stock: number;
  coverImage: string;
  rating: number;
  reviewCount: number;
  categoryId: string[];
  categoryNames?: string[];
  publisher: string;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  bookCount: number;
  image?: string;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  photo: string;
  nationality: string;
  booksCount: number;
  notableWork: string;
}

export interface CartItem {
  bookId: string;
  quantity: number;
  book: Book;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentMethod = 'ONLINE' | 'CASH';

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes?: string;
}

export interface OrderItem {
  bookId: string;
  bookTitle: string;
  coverImage: string;
  authorName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  shippingDetails: ShippingDetails;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  coverImage: string;
  publishedAt: string;
  likesCount: number;
  commentsCount: number;
  tags: string[];
  isLiked?: boolean;
}

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
