/// <reference types="vite/client" />
// Adapter: talks to the real Spring Boot backend and converts its DTOs into the
// shapes the UI expects. Used only when running `npm run dev:real` (vite --mode real).
import type { Book, Category, Author, Cart, Order, OrderStatus, Review, Post, User, LoginResponse } from '../types/index.js';

const BASE = '/api/v1';
const TOKEN = 'inkora_token';
const REFRESH = 'inkora_refresh';

async function refreshTokens(): Promise<boolean> {
  try {
    const rt = localStorage.getItem(REFRESH) || '';
    const r = await fetch(`${BASE}/auth/refresh?refreshToken=${encodeURIComponent(rt)}`, { method: 'POST' });
    if (!r.ok) return false;
    const d = await r.json();
    localStorage.setItem(TOKEN, d.accessToken);
    if (d.refreshToken) localStorage.setItem(REFRESH, d.refreshToken);
    return true;
  } catch { return false; }
}

// The backend sometimes answers with plain text ("Registration successful") or an empty body.
async function call(path: string, init: RequestInit = {}, retry = true): Promise<any> {
  const token = localStorage.getItem(TOKEN);
  const headers: Record<string, string> = {
    ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(BASE + path, { ...init, headers });
  if (res.status === 401 && retry && !path.startsWith('/auth/') && localStorage.getItem(REFRESH)) {
    if (await refreshTokens()) return call(path, init, false);
  }
  const text = await res.text();
  let data: any = text;
  try { data = text ? JSON.parse(text) : null; } catch { /* plain text */ }
  if (!res.ok) {
    const msg = (data && typeof data === 'object' && (data.message || data.error || data.detail)) || (typeof data === 'string' && data) || res.statusText;
    throw new Error(String(msg));
  }
  return data;
}

const arr = (d: any): any[] => (Array.isArray(d) ? d : Array.isArray(d?.size) ? d.size : Array.isArray(d?.content) ? d.content : []);
// NOTE: the backend's PageResult serialises its item list under the key "size".

function userFromToken(t: string): User {
  const b64 = t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const p = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))));
  return { id: p._id || p.sub, username: p.username, email: p.email, role: String(p.role).replace('ROLE_', '') as User['role'] };
}

const clean = (s: string) => String(s || '').replace(/[<>&"']/g, '').slice(0, 30);
const cover = (title: string) =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="560"><rect width="400" height="560" fill="#F1E9D6"/><rect x="22" y="22" width="356" height="516" fill="none" stroke="#8A6238" stroke-width="3"/><text x="200" y="280" font-family="Georgia,serif" font-size="26" text-anchor="middle" fill="#3B2B1E">${clean(title)}</text></svg>`);

const mapBook = (b: any): Book => ({
  id: b.id, authorId: b.authorId, authorName: b.authorName || '', bookTitle: b.bookTitle || '',
  bookDescription: b.bookDescription || '', numberOfPages: b.numberOfPages || 0, bookSize: b.bookSize || '',
  coverType: (b.coverType || 'Hardcover') as Book['coverType'], paperType: b.paperType || '',
  publicationYear: String(b.publicationYear || '').slice(0, 4), language: b.language || '', isbn: b.isbn || '',
  price: Number(b.price) || 0, stock: b.stock ?? 0, coverImage: cover(b.bookTitle),
  rating: 0, reviewCount: 0, categoryId: b.categoryId || [], categoryNames: [], publisher: '',
});

const toBackendBook = (b: Partial<Book>) => ({
  authorId: b.authorId, bookTitle: b.bookTitle, bookDescription: b.bookDescription, numberOfPages: b.numberOfPages,
  bookSize: b.bookSize, coverType: b.coverType, paperType: b.paperType,
  publicationYear: b.publicationYear ? (/^\d{4}$/.test(String(b.publicationYear)) ? `${b.publicationYear}-01-01` : b.publicationYear) : undefined,
  language: b.language, isbn: b.isbn, price: b.price, stock: b.stock, categoryId: b.categoryId,
});

async function listBooks(): Promise<Book[]> {
  const books = arr(await call('/book/all')).map(mapBook);
  // The backend has no featured/bestseller flags yet: fill the home sections from the list order.
  return books.map((b, i) => ({ ...b, featured: i < 4, bestseller: i % 3 === 0, newArrival: i < 6 }));
}

const mapOrder = (o: any, s: any = {}): Order => {
  const items = (o.items || []).map((i: any) => ({
    bookId: i.bookId, bookTitle: i.bookTitle, coverImage: cover(i.bookTitle), authorName: '',
    price: Number(i.price) || 0, quantity: i.quantity,
  }));
  const subtotal = items.reduce((t: number, i: any) => t + i.price * i.quantity, 0);
  const status = (o.orderStatus || 'PENDING') as OrderStatus;
  const pm = (o.paymentMethod || 'CASH') as Order['paymentMethod'];
  const when = o.createdAt || o.orderedAt || new Date().toISOString(); // OrderDto has no date yet
  return {
    id: o.id, orderNumber: 'INK-' + String(o.id).slice(-6).toUpperCase(), userId: o.usersId || '',
    customerName: s.fullName || '', customerEmail: s.email || '', customerPhone: o.shippingPhone,
    items, subtotal, discountAmount: 0, shippingFee: 0, totalAmount: subtotal, status, paymentMethod: pm,
    paymentStatus: status === 'REFUNDED' ? 'REFUNDED' : pm === 'ONLINE' ? 'PAID' : 'PENDING',
    shippingDetails: { fullName: s.fullName || '', email: s.email || '', phone: o.shippingPhone || '', address: o.shippingAddress || '', city: s.city || '', postalCode: s.postalCode || '', country: s.country || '', notes: o.note },
    createdAt: when, updatedAt: when,
  };
};

async function toCart(dto: any): Promise<Cart> {
  const books = new Map((await listBooks()).map((b) => [b.id, b]));
  const items = (dto?.cartItems || []).map((i: any) => ({
    bookId: i.bookId, quantity: i.quantity,
    book: books.get(i.bookId) || mapBook({ id: i.bookId, bookTitle: i.bookTitle, price: i.price, stock: i.quantity }),
  }));
  const subtotal = items.reduce((t: number, i: any) => t + i.book.price * i.quantity, 0);
  return { items, subtotal, discount: 0, shipping: 0, total: subtotal };
}

async function setCartQty(bookId: string, qty: number): Promise<Cart> {
  const cur = await call('/cart');
  let items = (cur?.cartItems || []).map((i: any) => ({ bookId: i.bookId, bookTitle: i.bookTitle, quantity: i.quantity, price: i.price }));
  const idx = items.findIndex((i: any) => i.bookId === bookId);
  if (qty <= 0) items = items.filter((i: any) => i.bookId !== bookId);
  else if (idx > -1) items[idx].quantity = qty;
  else { const b = await call(`/book/${bookId}`); items.push({ bookId, bookTitle: b.bookTitle, quantity: qty, price: b.price }); }
  return toCart(await call('/cart', { method: 'POST', body: JSON.stringify({ cartItems: items }) }));
}

const slug = (s: string) => String(s).toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '');
const notYet = (what: string) => { throw new Error(`${what} is not available on the server yet`); };

export const realApi: any = {
  // ── Auth ──
  login: async (c: { email?: string; username?: string; password: string }): Promise<LoginResponse> => {
    const d = await call('/auth/login', { method: 'POST', body: JSON.stringify({ email: c.email ?? c.username, password: c.password }) });
    localStorage.setItem(TOKEN, d.accessToken);
    localStorage.setItem(REFRESH, d.refreshToken);
    return { accessToken: d.accessToken, refreshToken: d.refreshToken, user: userFromToken(d.accessToken) };
  },
  register: async (u: any): Promise<LoginResponse> => {
    await call('/auth/register', { method: 'POST', body: JSON.stringify(u) });
    return realApi.login({ email: u.email, password: u.password });
  },
  forgotPassword: async (email: string) => ({ message: String(await call('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })) }),
  resetPassword: async (d: any) => ({ message: String(await call('/auth/reset-password', { method: 'POST', body: JSON.stringify(d) })) }),
  logout: async () => {
    const rt = localStorage.getItem(REFRESH);
    localStorage.removeItem(REFRESH);
    if (rt) { try { await call(`/auth/logout?refreshToken=${encodeURIComponent(rt)}`, { method: 'POST' }, false); } catch { /* ignore */ } }
    return { message: 'Logged out' };
  },

  // ── Books (search/filter/sort run in the browser; the catalog is small) ──
  getBooks: listBooks,
  searchBooks: async (p: any): Promise<Book[]> => {
    let r = await listBooks();
    const q = (p.query || '').toLowerCase();
    if (q) r = r.filter((b) => [b.bookTitle, b.authorName, b.bookDescription, b.isbn].some((x) => String(x).toLowerCase().includes(q)));
    if (p.categoryId && p.categoryId !== 'all') r = r.filter((b) => b.categoryId.includes(p.categoryId));
    if (p.authorId && p.authorId !== 'all') r = r.filter((b) => b.authorId === p.authorId);
    if (p.minPrice) r = r.filter((b) => b.price >= p.minPrice);
    if (p.maxPrice) r = r.filter((b) => b.price <= p.maxPrice);
    if (p.availability === 'in_stock') r = r.filter((b) => b.stock > 0);
    if (p.coverType && p.coverType !== 'all') r = r.filter((b) => b.coverType === p.coverType);
    if (p.sortBy === 'price_asc') r = [...r].sort((a, b) => a.price - b.price);
    if (p.sortBy === 'price_desc') r = [...r].sort((a, b) => b.price - a.price);
    if (p.sortBy === 'title') r = [...r].sort((a, b) => a.bookTitle.localeCompare(b.bookTitle));
    if (p.sortBy === 'newest') r = [...r].sort((a, b) => Number(b.publicationYear) - Number(a.publicationYear));
    return r;
  },
  getBookById: async (id: string) => mapBook(await call(`/book/${id}`)),
  createBook: async (b: Partial<Book>) => mapBook(await call('/book', { method: 'POST', body: JSON.stringify(toBackendBook(b)) })),
  updateBook: async (id: string, b: Partial<Book>) => mapBook(await call(`/book/${id}`, { method: 'PUT', body: JSON.stringify(toBackendBook(b)) })),
  deleteBook: async (id: string) => { await call(`/book/${id}`, { method: 'DELETE' }); return { message: 'Deleted' }; },

  // ── Categories & authors ──
  getCategories: async (): Promise<Category[]> => {
    const [c, b] = await Promise.all([call('/category/all'), listBooks()]);
    return arr(c).map((x: any) => ({ id: x.id, name: x.name, description: '', slug: slug(x.name), bookCount: b.filter((k) => k.categoryId.includes(x.id)).length }));
  },
  createCategory: async (c: Partial<Category>) => { const x = await call('/category', { method: 'POST', body: JSON.stringify({ name: c.name }) }); return { id: x.id, name: x.name, description: '', slug: slug(x.name), bookCount: 0 }; },
  updateCategory: async (id: string, c: Partial<Category>) => { const x = await call(`/category/${id}`, { method: 'PUT', body: JSON.stringify({ name: c.name }) }); return { id: x.id, name: x.name, description: '', slug: slug(x.name), bookCount: 0 }; },
  deleteCategory: async (id: string) => { await call(`/category/${id}`, { method: 'DELETE' }); return { message: 'Deleted' }; },
  getAuthors: async (): Promise<Author[]> => {
    const [a, b] = await Promise.all([call('/author/all'), listBooks()]);
    return arr(a).map((x: any) => ({ id: x.id, name: x.name, bio: '', photo: '', nationality: '', booksCount: b.filter((k) => k.authorId === x.id).length, notableWork: '' }));
  },
  createAuthor: async (a: Partial<Author>) => { const x = await call('/author', { method: 'POST', body: JSON.stringify({ name: a.name, isActive: true }) }); return { id: x.id, name: x.name, bio: '', photo: '', nationality: '', booksCount: 0, notableWork: '' }; },
  updateAuthor: async (id: string, a: Partial<Author>) => { const x = await call(`/author/${id}`, { method: 'PUT', body: JSON.stringify({ name: a.name, isActive: true }) }); return { id: x.id, name: x.name, bio: '', photo: '', nationality: '', booksCount: 0, notableWork: '' }; },
  deleteAuthor: async (id: string) => { await call(`/author/${id}`, { method: 'DELETE' }); return { message: 'Deleted' }; },

  // ── Cart ──
  getCart: async () => toCart(await call('/cart')),
  addToCart: (bookId: string, quantity = 1) => setCartQty(bookId, quantity), // same meaning as the mock: sets the quantity
  removeFromCart: async (bookId: string) => toCart(await call(`/cart/${bookId}`, { method: 'DELETE' })),
  clearCart: async (): Promise<Cart> => { await call('/cart/clear', { method: 'DELETE' }); return { items: [], subtotal: 0, discount: 0, shipping: 0, total: 0 }; },

  // ── Checkout & orders ──
  // The backend's /checkout takes no body: it turns the server-side cart into an order.
  checkout: async (p: any): Promise<Order> => {
    const lines = [];
    for (const it of p.items || []) {
      const b = await call(`/book/${it.bookId}`);
      lines.push({ bookId: it.bookId, bookTitle: b.bookTitle, quantity: it.quantity, price: b.price });
    }
    await call('/cart', { method: 'POST', body: JSON.stringify({ cartItems: lines }) });
    let dto = await call('/checkout', { method: 'POST' });
    const s = p.shippingDetails || {};
    try { // best effort: attach the shipping details to the new order
      dto = await call(`/order/${dto.id}`, { method: 'PUT', body: JSON.stringify({ ...dto, shippingAddress: [s.address, s.city, s.postalCode, s.country].filter(Boolean).join(', '), shippingPhone: s.phone, note: s.notes, paymentMethod: p.paymentMethod }) });
    } catch { /* keep the order as created */ }
    return mapOrder(dto, s);
  },
  getMyOrders: async (): Promise<Order[]> => arr(await call('/order/my?size=100')).map((o) => mapOrder(o)),
  getAllOrders: async (): Promise<Order[]> => arr(await call('/order?size=100')).map((o) => mapOrder(o)),
  getOrderById: async (id: string): Promise<Order> => {
    const all = await (localStorage.getItem(TOKEN) && userFromToken(localStorage.getItem(TOKEN)!).role === 'ADMIN' ? realApi.getAllOrders() : realApi.getMyOrders());
    const o = all.find((x: Order) => x.id === id);
    if (!o) throw new Error('Order not found');
    return o;
  },
  updateOrderStatus: async (id: string, status: OrderStatus) => mapOrder(await call(`/order/${id}/status?status=${status}`, { method: 'PATCH' })),
  cancelOrder: async (id: string) => ({ message: 'Order cancelled', order: mapOrder(await call(`/order/${id}/cancel`, { method: 'PATCH' })) }),

  // ── Reviews: not implemented by the backend yet ──
  getBookReviews: async (): Promise<Review[]> => [],
  submitReview: async () => notYet('Reviews'),
  getAllReviews: async (): Promise<Review[]> => [],
  updateReviewStatus: async () => notYet('Reviews'),

  // ── Admin: built from the endpoints that do exist ──
  getAdminDashboard: async () => {
    const [books, orders, users] = await Promise.all([listBooks(), realApi.getAllOrders(), call('/users')]);
    const active = orders.filter((o: Order) => o.status !== 'CANCELLED' && o.status !== 'REFUNDED');
    const totalRevenue = active.reduce((t: number, o: Order) => t + o.totalAmount, 0);
    const statusDistribution = orders.reduce((a: Record<string, number>, o: Order) => ({ ...a, [o.status]: (a[o.status] || 0) + 1 }), {});
    return { totalBooks: books.length, totalCustomers: arr(users).length, totalOrders: orders.length, totalRevenue,
      lowStockBooks: books.filter((b) => b.stock <= 5), recentOrders: orders.slice(0, 5), statusDistribution,
      revenueTrends: [{ month: 'Total', revenue: totalRevenue }] };
  },
  getAdminCustomers: async () => {
    const [users, orders] = await Promise.all([call('/users'), realApi.getAllOrders()]);
    return arr(users).map((u: any) => {
      const mine = orders.filter((o: Order) => o.userId === u.id);
      return { id: u.id, username: u.username, email: u.email, role: u.role, ordersCount: mine.length, totalSpent: mine.reduce((t: number, o: Order) => t + o.totalAmount, 0) };
    });
  },

  // ── Posts ──
  getPosts: async (): Promise<Post[]> => arr(await call('/post/all')).map((p: any) => ({
    id: p.id, title: p.title, content: p.content, authorName: 'Inkora', authorRole: 'Editor',
    coverImage: p.imagePath || cover(p.title), publishedAt: p.createdAt || new Date().toISOString(),
    likesCount: p.likeCount || 0, commentsCount: (p.comments || []).length, tags: [], isLiked: false,
  })),
  likePost: async (id: string) => { const r = await call(`/post-likes/${id}`, { method: 'PATCH' }); return { likesCount: r?.likeCount ?? r?.likesCount ?? 0, isLiked: r?.liked ?? r?.isLiked ?? true }; },
};