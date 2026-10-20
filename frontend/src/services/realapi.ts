/// <reference types="vite/client" />
import type {
  Author,
  Book,
  Cart,
  Category,
  LoginResponse,
  Order,
  OrderStatus,
  Post,
  PostComment,
  Review,
  ShippingSetting,
  User,
} from '../types/index.js';
import type {
  BackendAuthorDto,
  BackendBookDto,
  BackendBookReviewDto,
  BackendCategoryDto,
  BackendCustomerDto,
  BackendDashboardDto,
  BackendLikeResponse,
  BackendNewsCommentDto,
  BackendNewsDto,
  BackendOrderDto,
  BackendPostCommentDto,
  BackendPostDto,
} from '../types/backend.js';

export type CommentKind = 'post' | 'news';
type ShippingSettings = ShippingSetting;
type ApiRecord = Record<string, unknown>;
type TokenResponse = Pick<LoginResponse, 'accessToken' | 'refreshToken'>;

let refreshRequest: Promise<string | null> | null = null;

function getCollection(value: unknown): ApiRecord[] {
  if (Array.isArray(value)) return value as ApiRecord[];
  if (value && typeof value === 'object') {
    const collection = (value as ApiRecord).size;
    if (Array.isArray(collection)) return collection as ApiRecord[];
  }
  throw new Error('The server returned an invalid collection response');
}

function mapBook(value: BackendBookDto | ApiRecord): Book {
  return {
    id: String(value.id ?? ''),
    authorId: String(value.authorId ?? ''),
    authorName: String(value.authorName ?? ''),
    bookTitle: String(value.bookTitle ?? ''),
    bookDescription: String(value.bookDescription ?? ''),
    numberOfPages: Number(value.numberOfPages ?? 0),
    bookSize: String(value.bookSize ?? ''),
    coverType: String(value.coverType ?? 'Paperback') as Book['coverType'],
    paperType: String(value.paperType ?? ''),
    publicationYear: String(value.publicationYear ?? ''),
    language: String(value.language ?? ''),
    isbn: String(value.isbn ?? ''),
    price: Number(value.price ?? 0),
    stock: Number(value.stock ?? 0),
    coverImage: String(value.imagePath ?? value.coverImage ?? ''),
    rating: Number(value.rating ?? 0),
    reviewCount: Number(value.reviewCount ?? 0),
    categoryId: Array.isArray(value.categoryId) ? value.categoryId.map(String) : [],
    categoryNames: Array.isArray(value.categoryNames) ? value.categoryNames.map(String) : [],
    publisher: String(value.publisher ?? ''),
    featured: Boolean(value.featured),
    bestseller: Boolean(value.bestseller),
    newArrival: Boolean(value.newArrival),
  };
}

function mapCategory(value: BackendCategoryDto | ApiRecord): Category {
  const name = String(value.name ?? '');
  return {
    id: String(value.id ?? ''),
    name,
    parentCategoryId: typeof value.parentCategoryId === 'string' ? value.parentCategoryId : null,
    description: '',
    slug: name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    bookCount: 0,
  };
}

function mapAuthor(value: BackendAuthorDto | ApiRecord): Author {
  return {
    id: String(value.id ?? ''),
    name: String(value.name ?? ''),
    bio: '',
    photo: '',
    booksCount: 0,
    notableWork: '',
    isActive: typeof value.isActive === 'boolean' ? value.isActive : null,
  };
}

function bookPayload(book: Partial<Book>): ApiRecord {
  return {
    authorId: book.authorId,
    bookTitle: book.bookTitle,
    bookDescription: book.bookDescription,
    numberOfPages: book.numberOfPages,
    bookSize: book.bookSize,
    coverType: book.coverType,
    paperType: book.paperType,
    publicationYear: book.publicationYear,
    language: book.language,
    isbn: book.isbn,
    price: book.price,
    stock: book.stock,
    categoryId: book.categoryId,
    imagePath: book.coverImage,
  };
}

function getUserIdFromToken(token: string): string {
  const payload = token.split('.')[1];
  if (!payload) throw new Error('The login response did not contain a valid access token');

  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
  const claims = JSON.parse(new TextDecoder().decode(bytes)) as ApiRecord;
  if (typeof claims._id !== 'string' || !claims._id) {
    throw new Error('The access token did not contain a user identifier');
  }
  return claims._id;
}

function mapUser(value: ApiRecord): User {
  const role = value.role;
  if (role !== 'USER' && role !== 'ADMIN' && role !== 'AGENT') {
    throw new Error('The server returned an unsupported user role');
  }
  return {
    id: String(value.id ?? ''),
    username: String(value.username ?? ''),
    email: String(value.email ?? ''),
    role,
    address: typeof value.address === 'string' ? value.address : undefined,
    phoneNumber: typeof value.phoneNumber === 'string' ? value.phoneNumber : undefined,
  };
}

function mapOrder(value: BackendOrderDto | ApiRecord): Order {
  const id = String(value.id ?? '');
  const status = value.orderStatus ?? value.status;
  if (typeof status !== 'string') {
    throw new Error('The server returned an order without a status');
  }

  return {
    id,
    orderNumber: String(value.orderNumber ?? id),
    userId: String(value.usersId ?? value.userId ?? ''),
    customerName: String(value.customerName ?? ''),
    customerEmail: String(value.customerEmail ?? ''),
    customerPhone: String(value.shippingPhone ?? ''),
    items: getCollection(value.items).map((item) => ({
      bookId: String(item.bookId ?? ''),
      bookTitle: String(item.bookTitle ?? ''),
      coverImage: String(item.coverImage ?? ''),
      authorName: String(item.authorName ?? ''),
      price: Number(item.price ?? 0),
      quantity: Number(item.quantity ?? 0),
    })),
    subtotal: Number(value.subtotal ?? 0),
    discountAmount: Number(value.discountAmount ?? 0),
    shippingFee: Number(value.shippingFee ?? 0),
    totalAmount: Number(value.totalAmount ?? 0),
    status: status as OrderStatus,
    paymentMethod: value.paymentMethod === 'CASH' || value.paymentMethod === 'ONLINE'
      ? value.paymentMethod
      : null,
    paymentStatus: 'UNKNOWN',
    shippingDetails: {
      fullName: String(value.customerName ?? ''),
      email: '',
      phone: String(value.shippingPhone ?? ''),
      address: String(value.shippingAddress ?? ''),
      city: '',
      postalCode: '',
      country: '',
      notes: String(value.note ?? ''),
    },
    // OrderDto does not expose timestamps; those fields exist only on the Mongo document.
    createdAt: null,
    updatedAt: null,
  };
}

async function mapCart(value: ApiRecord): Promise<Cart> {
  if (!Array.isArray(value.cartItems)) {
    throw new Error('The server returned an invalid cart response');
  }

  const [booksResponse, shippingResponse] = await Promise.all([
    request<unknown>('/book/all'),
    request<ApiRecord>('/setting/shipping'),
  ]);
  const books = getCollection(booksResponse).map(mapBook);
  const shippingSettings = mapShipping(shippingResponse);
  const items = (value.cartItems as ApiRecord[]).map((item) => {
    const bookId = String(item.bookId ?? '');
    const book = books.find((candidate) => candidate.id === bookId);
    if (!book) throw new Error('A book in the cart is no longer available');
    return {
      bookId,
      quantity: Number(item.quantity ?? 0),
      book,
    };
  });
  const subtotal = items.reduce(
    (total, item) => total + item.book.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 &&
    (shippingSettings.freeShippingThreshold == null || subtotal < shippingSettings.freeShippingThreshold)
    ? shippingSettings.fee
    : 0;

  return {
    items,
    subtotal,
    discount: 0,
    shipping,
    total: subtotal + shipping,
    freeShippingThreshold: shippingSettings.freeShippingThreshold,
  };
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('inkora_refresh');
  if (!refreshToken) return null;
  if (refreshRequest) return refreshRequest;

  refreshRequest = (async () => {
    const response = await fetch(
      `${API_BASE}/auth/refresh?refreshToken=${encodeURIComponent(refreshToken)}`,
      { method: 'POST' },
    );
    if (!response.ok) return null;

    const tokens = (await response.json()) as TokenResponse;
    if (!tokens.accessToken || !tokens.refreshToken) {
      throw new Error('The refresh response did not contain both tokens');
    }

    localStorage.setItem('inkora_token', tokens.accessToken);
    localStorage.setItem('inkora_refresh', tokens.refreshToken);
    window.dispatchEvent(new CustomEvent(ACCESS_TOKEN_REFRESHED_EVENT, {
      detail: tokens.accessToken,
    }));
    return tokens.accessToken;
  })()
    .catch(() => null)
    .finally(() => {
      refreshRequest = null;
    });

  return refreshRequest;
}

export const ACCESS_TOKEN_REFRESHED_EVENT = 'inkora:access-token-refreshed';
export const SESSION_EXPIRED_EVENT = 'inkora:session-expired';

export function mapReview(value: ApiRecord): Review {
  return {
    id: String(value.id),
    bookId: String(value.bookId),
    bookTitle: String(value.bookTitle ?? ''),
    userId: String(value.userId),
    userName: String(value.username ?? value.userName ?? ''),
    rating: Number(value.rating),
    comment: String(value.comment ?? ''),
    date: String(value.createdAt ?? value.date ?? ''),
    status: value.status as Review['status'],
  };
}

export function mapComment(value: ApiRecord): PostComment {
  return {
    id: String(value.id),
    postId: String(value.postId ?? value.newsId),
    userId: String(value.userId),
    userName: String(value.username ?? value.userName ?? ''),
    content: String(value.content ?? ''),
    createdAt: String(value.createdAt ?? ''),
  };
}

export function mapPost(value: ApiRecord): Post {
  return {
    id: String(value.id),
    title: String(value.title ?? ''),
    content: String(value.content ?? ''),
    authorName: String(value.authorName ?? ''),
    authorRole: String(value.authorRole ?? ''),
    coverImage: String(value.imagePath ?? value.coverImage ?? ''),
    publishedAt: String(value.createdAt ?? value.publishedAt ?? ''),
    likesCount: Number(value.likeCount ?? value.likesCount ?? 0),
    commentsCount: Number(value.commentCount ?? value.commentsCount ?? 0),
    tags: Array.isArray(value.tags) ? value.tags.map(String) : [],
    isLiked: Boolean(value.isLiked),
  };
}

export function mapShipping(value: ApiRecord): ShippingSettings {
  return {
    fee: Number(value.fee),
    freeShippingThreshold:
      value.freeShippingThreshold == null ? null : Number(value.freeShippingThreshold),
  };
}

const API_BASE = '/api/v1';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('inkora_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  retryUnauthorized = true,
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401 && retryUnauthorized && !endpoint.startsWith('/auth/')) {
    const accessToken = await refreshAccessToken();
    if (accessToken) {
      return request<T>(
        endpoint,
        {
          ...options,
          headers: { ...options.headers, Authorization: `Bearer ${accessToken}` },
        },
        false,
      );
    }
    localStorage.removeItem('inkora_token');
    localStorage.removeItem('inkora_refresh');
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }

  if (!res.ok) {
    let errMessage = 'An error occurred';
    try {
      const text = await res.text();
      const errData = text ? JSON.parse(text) as ApiRecord : {};
      errMessage = String(errData.error ?? errData.message ?? text ?? res.statusText);
    } catch {
      errMessage = res.statusText;
    }
    throw new Error(errMessage);
  }

  const text = await res.text();
  if (!text) return null as T;
  if (res.headers.get('content-type')?.includes('application/json')) {
    return JSON.parse(text) as T;
  }
  return text as T;
}

export async function uploadImage(file: File, type: 'book' | 'post' | 'news'): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('type', type);

  const response = await fetch(`${API_BASE}/image/upload`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = response.statusText || 'Image upload failed';
    try {
      const error = await response.json();
      errorMessage = error.error || error.message || errorMessage;
    } catch {
      // Keep the HTTP status message when the response is not JSON.
    }
    throw new Error(errorMessage);
  }

  const result = (await response.json()) as { url: string };
  return result.url;
}

const mockApi = {
  // ── Auth ─────────────────────────────────────────────────────────────
  login: async (credentials: { email?: string; username?: string; password: string }): Promise<LoginResponse> => {
    const tokens = await request<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    const userId = getUserIdFromToken(tokens.accessToken);
    const user = mapUser(await request<ApiRecord>(`/users/${encodeURIComponent(userId)}`, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    }));
    return { ...tokens, user };
  },

  register: async (userData: { username: string; email: string; password: string; address?: string; phoneNumber?: string }): Promise<LoginResponse> => {
    await request<string>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return mockApi.login({ email: userData.email, password: userData.password });
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const message = await request<string>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return { message };
  },

  resetPassword: async (data: { email: string; otp: string; newPassword: string }): Promise<{ message: string }> => {
    const message = await request<string>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return { message };
  },

  logout: async (): Promise<{ message: string }> => {
    const refreshToken = localStorage.getItem('inkora_refresh');
    if (!refreshToken) return { message: 'No refresh token was available to revoke' };
    const message = await request<string>(
      `/auth/logout?refreshToken=${encodeURIComponent(refreshToken)}`,
      { method: 'POST' },
    );
    return { message };
  },

  // ── Books ────────────────────────────────────────────────────────────
  getBooks: async (): Promise<Book[]> => {
    return (await request<BackendBookDto[]>('/book/all')).map(mapBook);
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
    if (params.query) queryParts.push(`keyword=${encodeURIComponent(params.query)}`);
    if (params.minPrice != null) queryParts.push(`minPrice=${params.minPrice}`);
    if (params.maxPrice != null) queryParts.push(`maxPrice=${params.maxPrice}`);
    queryParts.push('page=1', 'size=100');

    const q = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    const books = getCollection(await request<unknown>(`/book/search${q}`)).map(mapBook);
    const filtered = books.filter((book) =>
      (!params.categoryId || params.categoryId === 'all' || book.categoryId.includes(params.categoryId)) &&
      (!params.authorId || params.authorId === 'all' || book.authorId === params.authorId) &&
      (!params.availability || params.availability !== 'in_stock' || book.stock > 0) &&
      (!params.coverType || params.coverType === 'all' || book.coverType === params.coverType)
    );
    return filtered.sort((a, b) => {
      switch (params.sortBy) {
        case 'newest':
          return b.publicationYear.localeCompare(a.publicationYear);
        case 'rating':
          return b.rating - a.rating;
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'title':
          return a.bookTitle.localeCompare(b.bookTitle);
        case 'featured':
        default:
          return Number(b.featured) - Number(a.featured);
      }
    });
  },

  getBookById: async (id: string): Promise<Book> => {
    return mapBook(await request<BackendBookDto>(`/book/${id}`));
  },

  createBook: async (bookData: Partial<Book>): Promise<Book> => {
    return mapBook(await request<BackendBookDto>('/book', {
      method: 'POST',
      body: JSON.stringify(bookPayload(bookData)),
    }));
  },

  updateBook: async (id: string, bookData: Partial<Book>): Promise<Book> => {
    return mapBook(await request<BackendBookDto>(`/book/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookPayload(bookData)),
    }));
  },

  deleteBook: async (id: string): Promise<{ message: string }> => {
    return request<{ message: string }>(`/book/${id}`, {
      method: 'DELETE',
    });
  },

  // ── Categories & Authors ─────────────────────────────────────────────
  getCategories: async (): Promise<Category[]> => {
    return (await request<BackendCategoryDto[]>('/category/all')).map(mapCategory);
  },

  createCategory: async (category: Partial<Category>): Promise<Category> => {
    const response = await request<BackendCategoryDto>('/category', {
      method: 'POST',
       body: JSON.stringify({ name: category.name, parentCategoryId: null }),
    });
    return mapCategory(response);
  },

  updateCategory: async (id: string, category: Partial<Category>): Promise<Category> => {
    const response = await request<BackendCategoryDto>(`/category/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: category.name, parentCategoryId: null }),
    });
    return mapCategory(response);
  },

  deleteCategory: async (id: string): Promise<{ message: string }> => {
    return request<{ message: string }>(`/category/${id}`, { method: 'DELETE' });
  },

  getAuthors: async (): Promise<Author[]> => {
    return (await request<BackendAuthorDto[]>('/author/all')).map(mapAuthor);
  },

  createAuthor: async (author: Partial<Author>): Promise<Author> => {
    const response = await request<BackendAuthorDto>('/author', {
      method: 'POST',
      body: JSON.stringify({ name: author.name, isActive: true }),
    });
    return mapAuthor(response);
  },

  updateAuthor: async (id: string, author: Partial<Author>): Promise<Author> => {
    const response = await request<BackendAuthorDto>(`/author/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: author.name, isActive: true }),
    });
    return mapAuthor(response);
  },

  deleteAuthor: async (id: string): Promise<{ message: string }> => {
    return request<{ message: string }>(`/author/${id}`, { method: 'DELETE' });
  },

  // ── Cart ─────────────────────────────────────────────────────────────
  getCart: async (): Promise<Cart> => {
    return mapCart(await request<ApiRecord>('/cart'));
  },

  addToCart: async (bookId: string, quantity = 1): Promise<Cart> => {
    const current = await request<ApiRecord>('/cart');
    const cartItems = Array.isArray(current.cartItems)
      ? [...current.cartItems as ApiRecord[]]
      : [];
    const existing = cartItems.find((item) => item.bookId === bookId);
    if (existing) {
      existing.quantity = Number(existing.quantity ?? 0) + quantity;
    } else {
      const book = await mockApi.getBookById(bookId);
      cartItems.push({
        bookId,
        bookTitle: book.bookTitle,
        quantity,
        price: book.price,
      });
    }
    const updated = await request<ApiRecord>('/cart', {
      method: 'POST',
      body: JSON.stringify({ cartItems, cartStatus: current.cartStatus ?? 'ACTIVE' }),
    });
    return mapCart(updated);
  },

  removeFromCart: async (bookId: string): Promise<Cart> => {
    const updated = await request<ApiRecord>(`/cart/${bookId}`, {
      method: 'DELETE',
    });
    return mapCart(updated);
  },

  clearCart: async (): Promise<Cart> => {
    await request<null>('/cart/clear', {
      method: 'DELETE',
    });
    return mockApi.getCart();
  },

  // ── Checkout & Orders ────────────────────────────────────────────────
  checkout: async (): Promise<Order> => {
    return mapOrder(await request<BackendOrderDto>('/checkout', {
      method: 'POST',
    }));
  },

  getMyOrders: async (): Promise<Order[]> => {
    return getCollection(await request<unknown>('/order/my?page=1&size=100')).map(mapOrder);
  },

  getAllOrders: async (): Promise<Order[]> => {
    return getCollection(await request<unknown>('/order?page=1&size=100')).map(mapOrder);
  },

  getOrderById: async (id: string): Promise<Order> => {
    const orders = await mockApi.getMyOrders();
    const order = orders.find((item) => item.id === id);
    if (!order) throw new Error('Order not found in the current user order history');
    return order;
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    return mapOrder(await request<ApiRecord>(`/order/${id}/status?status=${encodeURIComponent(status)}`, {
      method: 'PATCH',
    }));
  },

  cancelOrder: async (id: string): Promise<{ message: string; order: Order }> => {
    const order = await request<ApiRecord>(`/order/${id}/cancel`, {
      method: 'PATCH',
    });
    return { message: 'Order cancelled', order: mapOrder(order) };
  },

  // ── Reviews (/book-review) ───────────────────────────────────────────
  getBookReviews: async (bookId: string): Promise<Review[]> => {
    return (await request<BackendBookReviewDto[]>(`/book-review/book/${bookId}`)).map(mapReview);
  },

  submitReview: async (bookId: string, review: { rating: number; comment: string }): Promise<Review> => {
    return mapReview(await request<BackendBookReviewDto>(`/book-review/book/${bookId}`, {
      method: 'POST',
      body: JSON.stringify(review),
    }));
  },

  updateReview: async (id: string, review: { rating: number; comment: string }): Promise<Review> => {
    return mapReview(await request<BackendBookReviewDto>(`/book-review/${id}`, {
      method: 'PUT',
      body: JSON.stringify(review),
    }));
  },

  deleteReview: async (id: string): Promise<{ message: string }> => {
    await request<null>(`/book-review/${id}`, { method: 'DELETE' });
    return { message: 'Deleted' };
  },

  getAllReviews: async (): Promise<Review[]> => {
    return (await request<BackendBookReviewDto[]>('/book-review/admin/all')).map(mapReview);
  },

  updateReviewStatus: async (id: string, status: 'APPROVED' | 'PENDING' | 'REJECTED'): Promise<Review> => {
    return mapReview(await request<BackendBookReviewDto>(`/book-review/${id}/status?status=${status}`, { method: 'PATCH' }));
  },

  // ── Comments on posts & news ─────────────────────────────────────────
  getComments: async (kind: CommentKind, id: string): Promise<PostComment[]> => {
    const rows = kind === 'post'
      ? await request<BackendPostCommentDto[]>(`/post-comment/post/${id}`)
      : await request<BackendNewsCommentDto[]>(`/news-comments/news/${id}`);
    return rows.map(mapComment);
  },

  addComment: async (kind: CommentKind, id: string, content: string): Promise<PostComment> => {
    return mapComment(await request<any>(kind === 'post' ? '/post-comment' : '/news-comments', {
      method: 'POST',
      body: JSON.stringify(kind === 'post' ? { postId: id, content } : { newsId: id, content }),
    }));
  },

  deleteComment: async (kind: CommentKind, id: string): Promise<{ message: string }> => {
    await request<null>(kind === 'post' ? `/post-comment/${id}` : `/news-comments/${id}`, { method: 'DELETE' });
    return { message: 'Deleted' };
  },

  // ── Shipping settings ────────────────────────────────────────────────
  getShippingSettings: async (): Promise<ShippingSettings> => {
    return mapShipping(await request<any>('/setting/shipping'));
  },

  updateShippingSettings: async (s: ShippingSettings): Promise<ShippingSettings> => {
    return mapShipping(await request<any>('/setting/shipping', {
      method: 'PUT',
      body: JSON.stringify({ fee: s.fee, freeShippingThreshold: s.freeShippingThreshold }),
    }));
  },

  // ── Admin Dashboard & Customers ──────────────────────────────────────
  getAdminDashboard: async (): Promise<BackendDashboardDto> => {
    return request<BackendDashboardDto>('/admin/dashboard');
  },

  getAdminCustomers: async (): Promise<BackendCustomerDto[]> => {
    return request<BackendCustomerDto[]>('/admin/customers');
  },

  // ── Posts ────────────────────────────────────────────────────────────
  getPosts: async (): Promise<Post[]> => {
    return (await request<BackendPostDto[]>('/post/all')).map(mapPost);
  },

  createPost: async (post: Partial<Post>): Promise<Post> => {
    return mapPost(await request<BackendPostDto>('/post', {
      method: 'POST',
      body: JSON.stringify({ title: post.title, content: post.content, imagePath: post.coverImage }),
    }));
  },

  updatePost: async (id: string, post: Partial<Post>): Promise<Post> => {
    return mapPost(await request<BackendPostDto>(`/post/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title: post.title, content: post.content, imagePath: post.coverImage }),
    }));
  },

  deletePost: async (id: string): Promise<{ message: string }> => {
    await request<null>(`/post/${id}`, { method: 'DELETE' });
    return { message: 'Deleted' };
  },

  createNews: async (news: Partial<Post>): Promise<Post> => {
    return mapPost(await request<BackendNewsDto>('/news', {
      method: 'POST',
      body: JSON.stringify({ title: news.title, content: news.content, imagePath: news.coverImage }),
    }));
  },

  updateNews: async (id: string, news: Partial<Post>): Promise<Post> => {
    return mapPost(await request<BackendNewsDto>(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title: news.title, content: news.content, imagePath: news.coverImage }),
    }));
  },

  deleteNews: async (id: string): Promise<{ message: string }> => {
    await request<null>(`/news/${id}`, { method: 'DELETE' });
    return { message: 'Deleted' };
  },

  getNews: async (): Promise<Post[]> => {
    return (await request<BackendNewsDto[]>('/news/all')).map(mapPost);
  },

  likeNews: async (id: string): Promise<{ likesCount: number; isLiked: boolean }> => {
    const r = await request<BackendLikeResponse>(`/news-likes/${id}`, { method: 'PATCH' });
    return { likesCount: Number(r.likeCount), isLiked: Boolean(r.liked) };
  },

  likePost: async (id: string): Promise<{ likesCount: number; isLiked: boolean }> => {
    const response = await request<BackendLikeResponse>(`/post-likes/${id}`, { method: 'PATCH' });
    return {
      likesCount: Number(response.likeCount),
      isLiked: Boolean(response.liked),
    };
  },
};

export const realApi = mockApi;

// Mock-compatible requests are selected only by the dedicated mock development server.
export const api: typeof mockApi = import.meta.env.MODE === 'mock' ? mockApi : (realApi as typeof mockApi);
