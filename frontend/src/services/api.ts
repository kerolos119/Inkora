import { Book, Category, Author, Cart, Order, Review, Post, User, LoginResponse, OrderStatus } from '../types/index.js';

const API_BASE = '/api/v1';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('inkora_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errMessage = 'An error occurred';
    try {
      const errData = await res.json();
      errMessage = errData.error || errData.message || res.statusText;
    } catch {
      errMessage = res.statusText;
    }
    throw new Error(errMessage);
  }

  return res.json();
}

export const api = {
  // ── Auth ─────────────────────────────────────────────────────────────
  login: async (credentials: { email?: string; username?: string; password: string }): Promise<LoginResponse> => {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: { username: string; email: string; password: string; address?: string; phoneNumber?: string }): Promise<LoginResponse> => {
    return request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (data: { email: string; otp: string; newPassword: string }): Promise<{ message: string }> => {
    return request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<{ message: string }> => {
    return request<{ message: string }>('/auth/logout', { method: 'POST' });
  },

  // ── Books ────────────────────────────────────────────────────────────
  getBooks: async (): Promise<Book[]> => {
    return request<Book[]>('/book/all');
  },

  searchBooks: async (params: {
    query?: string;
    categoryId?: string;
    authorId?: string;
    minPrice?: number;
    maxPrice?: number;
    availability?: string;
    sortBy?: string;
    coverType?: string;
  }): Promise<Book[]> => {
    const queryParts: string[] = [];
    if (params.query) queryParts.push(`query=${encodeURIComponent(params.query)}`);
    if (params.categoryId && params.categoryId !== 'all') queryParts.push(`categoryId=${encodeURIComponent(params.categoryId)}`);
    if (params.authorId && params.authorId !== 'all') queryParts.push(`authorId=${encodeURIComponent(params.authorId)}`);
    if (params.minPrice) queryParts.push(`minPrice=${params.minPrice}`);
    if (params.maxPrice) queryParts.push(`maxPrice=${params.maxPrice}`);
    if (params.availability) queryParts.push(`availability=${params.availability}`);
    if (params.sortBy) queryParts.push(`sortBy=${params.sortBy}`);
    if (params.coverType && params.coverType !== 'all') queryParts.push(`coverType=${encodeURIComponent(params.coverType)}`);

    const q = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    return request<Book[]>(`/book/search${q}`);
  },

  getBookById: async (id: string): Promise<Book> => {
    return request<Book>(`/book/${id}`);
  },

  createBook: async (bookData: Partial<Book>): Promise<Book> => {
    return request<Book>('/book', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  },

  updateBook: async (id: string, bookData: Partial<Book>): Promise<Book> => {
    return request<Book>(`/book/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  },

  deleteBook: async (id: string): Promise<{ message: string }> => {
    return request<{ message: string }>(`/book/${id}`, {
      method: 'DELETE',
    });
  },

  // ── Categories & Authors ─────────────────────────────────────────────
  getCategories: async (): Promise<Category[]> => {
    return request<Category[]>('/category/all');
  },

  createCategory: async (category: Partial<Category>): Promise<Category> => {
    return request<Category>('/category', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  updateCategory: async (id: string, category: Partial<Category>): Promise<Category> => {
    return request<Category>(`/category/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },

  deleteCategory: async (id: string): Promise<{ message: string }> => {
    return request<{ message: string }>(`/category/${id}`, { method: 'DELETE' });
  },

  getAuthors: async (): Promise<Author[]> => {
    return request<Author[]>('/author/all');
  },

  createAuthor: async (author: Partial<Author>): Promise<Author> => {
    return request<Author>('/author', {
      method: 'POST',
      body: JSON.stringify(author),
    });
  },

  updateAuthor: async (id: string, author: Partial<Author>): Promise<Author> => {
    return request<Author>(`/author/${id}`, {
      method: 'PUT',
      body: JSON.stringify(author),
    });
  },

  deleteAuthor: async (id: string): Promise<{ message: string }> => {
    return request<{ message: string }>(`/author/${id}`, { method: 'DELETE' });
  },

  // ── Cart ─────────────────────────────────────────────────────────────
  getCart: async (): Promise<Cart> => {
    return request<Cart>('/cart');
  },

  addToCart: async (bookId: string, quantity = 1): Promise<Cart> => {
    return request<Cart>('/cart', {
      method: 'POST',
      body: JSON.stringify({ bookId, quantity }),
    });
  },

  removeFromCart: async (bookId: string): Promise<Cart> => {
    return request<Cart>(`/cart/${bookId}`, {
      method: 'DELETE',
    });
  },

  clearCart: async (): Promise<Cart> => {
    return request<Cart>('/cart/clear', {
      method: 'DELETE',
    });
  },

  // ── Checkout & Orders ────────────────────────────────────────────────
  checkout: async (payload: {
    items: any[];
    shippingDetails: any;
    paymentMethod: string;
    discountCode?: string;
  }): Promise<Order> => {
    return request<Order>('/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getMyOrders: async (): Promise<Order[]> => {
    return request<Order[]>('/order/my');
  },

  getAllOrders: async (): Promise<Order[]> => {
    return request<Order[]>('/order');
  },

  getOrderById: async (id: string): Promise<Order> => {
    return request<Order>(`/order/${id}`);
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    return request<Order>(`/order/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  cancelOrder: async (id: string): Promise<{ message: string; order: Order }> => {
    return request<{ message: string; order: Order }>(`/order/${id}/cancel`, {
      method: 'PATCH',
    });
  },

  // ── Reviews ──────────────────────────────────────────────────────────
  getBookReviews: async (bookId: string): Promise<Review[]> => {
    return request<Review[]>(`/book/${bookId}/reviews`);
  },

  submitReview: async (bookId: string, review: { rating: number; comment: string; userName?: string }): Promise<Review> => {
    return request<Review>(`/book/${bookId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  },

  getAllReviews: async (): Promise<Review[]> => {
    return request<Review[]>('/admin/reviews');
  },

  updateReviewStatus: async (id: string, status: 'APPROVED' | 'PENDING' | 'REJECTED'): Promise<Review> => {
    return request<Review>(`/admin/reviews/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // ── Admin Dashboard & Customers ──────────────────────────────────────
  getAdminDashboard: async (): Promise<any> => {
    return request<any>('/admin/dashboard');
  },

  getAdminCustomers: async (): Promise<any[]> => {
    return request<any[]>('/admin/customers');
  },

  // ── Posts ────────────────────────────────────────────────────────────
  getPosts: async (): Promise<Post[]> => {
    return request<Post[]>('/post/all');
  },

  likePost: async (id: string): Promise<{ likesCount: number; isLiked: boolean }> => {
    return request<{ likesCount: number; isLiked: boolean }>(`/post-likes/${id}`, {
      method: 'PATCH',
    });
  },
};
