import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import {
  initialBooks,
  initialCategories,
  initialAuthors,
  initialOrders,
  initialReviews,
  initialPosts,
  demoUsers,
} from './server/data.js';
import { Book, Category, Author, Order, Review, Post, User, CartItem, OrderStatus } from './src/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'inkora-secret-key-production-grade-2026';

app.use(cors());
app.use(express.json());

// In-Memory Database Stores
let books: Book[] = [...initialBooks];
let categories: Category[] = [...initialCategories];
let authors: Author[] = [...initialAuthors];
let orders: Order[] = [...initialOrders];
let reviews: Review[] = [...initialReviews];
let posts: Post[] = [...initialPosts];
let users: User[] = [...demoUsers];

// User carts mapped by userId
const userCarts = new Map<string, CartItem[]>();

// Seed Eleanor's initial cart
userCarts.set('usr-demo-user', [
  {
    bookId: 'book-1',
    quantity: 1,
    book: books[0],
  },
]);

// Helper: Extract user from Authorization Bearer token
function authenticate(req: express.Request): User | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    const foundUser = users.find((u) => u.id === decoded.id || u.email === decoded.email);
    return foundUser || null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Health & Docs
// ─────────────────────────────────────────────────────────────────────────────
app.get('/actuator/health', (_req, res) => {
  res.json({
    status: 'UP',
    components: {
      db: { status: 'UP', details: { database: 'MongoDB In-Memory Mock' } },
      diskSpace: { status: 'UP', details: { total: 107374182400, free: 85899345920 } },
      ping: { status: 'UP' },
    },
  });
});

app.get('/api-docs', (_req, res) => {
  res.json({
    openapi: '3.0.1',
    info: {
      title: 'Inkora E-Commerce & Bookstore API',
      description: 'API documentation for Inkora Bookstore, catalog, auth, cart, orders, and community.',
      version: '1.0.0',
    },
    servers: [{ url: `http://localhost:${PORT}/api/v1` }],
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 1. Authentication Endpoints (/api/v1/auth)
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/v1/auth/login', (req, res) => {
  const { email, username, password } = req.body;
  const identifier = (email || username || '').toLowerCase();

  const user = users.find(
    (u) => u.email.toLowerCase() === identifier || u.username.toLowerCase() === identifier
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Generate real JWT tokens
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, username: user.username },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
  const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

  return res.json({
    accessToken,
    refreshToken,
    user,
  });
});

app.post('/api/v1/auth/register', (req, res) => {
  const { username, email, password, address, phoneNumber } = req.body;
  if (!email || !username) {
    return res.status(400).json({ error: 'Email and username are required' });
  }

  const existing = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase()
  );
  if (existing) {
    return res.status(409).json({ error: 'User with this email or username already exists' });
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    username,
    email,
    role: 'USER',
    address: address || '',
    phoneNumber: phoneNumber || '',
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);

  const accessToken = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, username: newUser.username },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
  const refreshToken = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

  return res.status(201).json({
    message: 'User registered successfully',
    accessToken,
    refreshToken,
    user: newUser,
  });
});

app.post('/api/v1/auth/refresh', (req, res) => {
  const token = req.query.refreshToken as string || req.body.refreshToken;
  if (!token) return res.status(400).json({ error: 'Refresh token is required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = users.find((u) => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role, username: user.username },
      JWT_SECRET,
      { expiresIn: '2h' }
    );
    const newRefreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken, user });
  } catch {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

app.post('/api/v1/auth/logout', (_req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.post('/api/v1/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  res.json({ message: `Verification OTP has been sent to ${email || 'your email'}. Demo code: 849201` });
});

app.post('/api/v1/auth/reset-password', (_req, res) => {
  res.json({ message: 'Password has been successfully updated' });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Books Endpoints (/api/v1/book)
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/v1/book/all', (_req, res) => {
  res.json(books);
});

app.get('/api/v1/book/search', (req, res) => {
  let result = [...books];
  const { query, categoryId, authorId, minPrice, maxPrice, availability, sortBy, coverType } = req.query;

  if (query && typeof query === 'string' && query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (b) =>
        b.bookTitle.toLowerCase().includes(q) ||
        b.authorName.toLowerCase().includes(q) ||
        b.bookDescription.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q)
    );
  }

  if (categoryId && typeof categoryId === 'string' && categoryId !== 'all') {
    result = result.filter((b) => b.categoryId.includes(categoryId));
  }

  if (authorId && typeof authorId === 'string' && authorId !== 'all') {
    result = result.filter((b) => b.authorId === authorId);
  }

  if (coverType && typeof coverType === 'string' && coverType !== 'all') {
    result = result.filter((b) => b.coverType.toLowerCase() === coverType.toLowerCase());
  }

  if (minPrice) {
    const min = parseFloat(minPrice as string);
    if (!isNaN(min)) result = result.filter((b) => b.price >= min);
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice as string);
    if (!isNaN(max)) result = result.filter((b) => b.price <= max);
  }

  if (availability === 'in_stock') {
    result = result.filter((b) => b.stock > 0);
  }

  // Sorting
  if (sortBy === 'price_asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'newest') {
    result.sort((a, b) => new Date(b.publicationYear).getTime() - new Date(a.publicationYear).getTime());
  } else if (sortBy === 'title') {
    result.sort((a, b) => a.bookTitle.localeCompare(b.bookTitle));
  }

  res.json(result);
});

app.get('/api/v1/book/:id', (req, res) => {
  const book = books.find((b) => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

// Admin Book Mutators
app.post('/api/v1/book', (req, res) => {
  const user = authenticate(req);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }

  const newBook: Book = {
    id: `book-${Date.now()}`,
    ...req.body,
    price: Number(req.body.price) || 29.99,
    stock: Number(req.body.stock) || 10,
    numberOfPages: Number(req.body.numberOfPages) || 250,
    rating: 5.0,
    reviewCount: 0,
    coverImage:
      req.body.coverImage ||
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  };
  books.unshift(newBook);
  res.status(201).json(newBook);
});

app.put('/api/v1/book/:id', (req, res) => {
  const user = authenticate(req);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }

  const index = books.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Book not found' });

  books[index] = {
    ...books[index],
    ...req.body,
    id: req.params.id,
    price: Number(req.body.price ?? books[index].price),
    stock: Number(req.body.stock ?? books[index].stock),
  };
  res.json(books[index]);
});

app.delete('/api/v1/book/:id', (req, res) => {
  const user = authenticate(req);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }

  const index = books.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Book not found' });

  const deleted = books.splice(index, 1)[0];
  res.json({ message: 'Book deleted successfully', book: deleted });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Categories Endpoints (/api/v1/category)
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/v1/category/all', (_req, res) => {
  // compute live count
  const updated = categories.map((c) => ({
    ...c,
    bookCount: books.filter((b) => b.categoryId.includes(c.id)).length,
  }));
  res.json(updated);
});

app.get('/api/v1/category/:id', (req, res) => {
  const category = categories.find((c) => c.id === req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json(category);
});

app.post('/api/v1/category', (req, res) => {
  const user = authenticate(req);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name: req.body.name,
    slug: req.body.slug || req.body.name.toLowerCase().replace(/\s+/g, '-'),
    description: req.body.description || '',
    bookCount: 0,
    image: req.body.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  };
  categories.push(newCat);
  res.status(201).json(newCat);
});

app.put('/api/v1/category/:id', (req, res) => {
  const user = authenticate(req);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  const index = categories.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Category not found' });
  categories[index] = { ...categories[index], ...req.body, id: req.params.id };
  res.json(categories[index]);
});

app.delete('/api/v1/category/:id', (req, res) => {
  const user = authenticate(req);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  categories = categories.filter((c) => c.id !== req.params.id);
  res.json({ message: 'Category deleted' });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Authors Endpoints (/api/v1/author)
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/v1/author/all', (_req, res) => {
  res.json(authors);
});

app.get('/api/v1/author/:id', (req, res) => {
  const author = authors.find((a) => a.id === req.params.id);
  if (!author) return res.status(404).json({ error: 'Author not found' });
  res.json(author);
});

app.post('/api/v1/author', (req, res) => {
  const user = authenticate(req);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  const newAuthor: Author = {
    id: `aut-${Date.now()}`,
    name: req.body.name,
    bio: req.body.bio || '',
    photo: req.body.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    nationality: req.body.nationality || 'International',
    booksCount: 1,
    notableWork: req.body.notableWork || '',
  };
  authors.push(newAuthor);
  res.status(201).json(newAuthor);
});

app.put('/api/v1/author/:id', (req, res) => {
  const user = authenticate(req);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  const index = authors.findIndex((a) => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Author not found' });
  authors[index] = { ...authors[index], ...req.body, id: req.params.id };
  res.json(authors[index]);
});

app.delete('/api/v1/author/:id', (req, res) => {
  const user = authenticate(req);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  authors = authors.filter((a) => a.id !== req.params.id);
  res.json({ message: 'Author deleted' });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Shopping Cart Endpoints (/api/v1/cart)
// ─────────────────────────────────────────────────────────────────────────────
function calculateCartTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => {
    const discountedPrice = item.book.discount
      ? item.book.price * (1 - item.book.discount / 100)
      : item.book.price;
    return sum + discountedPrice * item.quantity;
  }, 0);
  const discount = 0;
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.00;
  const total = Math.max(0, subtotal - discount + shipping);

  return {
    items,
    subtotal: Number(subtotal.toFixed(2)),
    discount,
    shipping: Number(shipping.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}

app.get('/api/v1/cart', (req, res) => {
  const user = authenticate(req);
  const userId = user ? user.id : 'guest-session';
  const items = userCarts.get(userId) || [];
  res.json(calculateCartTotals(items));
});

app.post('/api/v1/cart', (req, res) => {
  const user = authenticate(req);
  const userId = user ? user.id : 'guest-session';
  const { bookId, quantity } = req.body;
  const book = books.find((b) => b.id === bookId);

  if (!book) return res.status(404).json({ error: 'Book not found' });

  const currentItems = userCarts.get(userId) || [];
  const existingIndex = currentItems.findIndex((it) => it.bookId === bookId);

  const parsedQty = Number(quantity) || 1;
  if (existingIndex > -1) {
    if (parsedQty <= 0) {
      currentItems.splice(existingIndex, 1);
    } else {
      currentItems[existingIndex].quantity = parsedQty;
    }
  } else if (parsedQty > 0) {
    currentItems.push({ bookId, quantity: parsedQty, book });
  }

  userCarts.set(userId, currentItems);
  res.json(calculateCartTotals(currentItems));
});

app.delete('/api/v1/cart/clear', (req, res) => {
  const user = authenticate(req);
  const userId = user ? user.id : 'guest-session';
  userCarts.set(userId, []);
  res.json(calculateCartTotals([]));
});

app.delete('/api/v1/cart/:bookId', (req, res) => {
  const user = authenticate(req);
  const userId = user ? user.id : 'guest-session';
  let currentItems = userCarts.get(userId) || [];
  currentItems = currentItems.filter((it) => it.bookId !== req.params.bookId);
  userCarts.set(userId, currentItems);
  res.json(calculateCartTotals(currentItems));
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Checkout & Orders (/api/v1/checkout & /api/v1/order)
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/v1/checkout', (req, res) => {
  const user = authenticate(req);
  const { items, shippingDetails, paymentMethod, discountCode } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  if (!shippingDetails || !shippingDetails.fullName || !shippingDetails.address) {
    return res.status(400).json({ error: 'Complete shipping details are required' });
  }

  const orderItems = items.map((it: CartItem) => ({
    bookId: it.bookId,
    bookTitle: it.book.bookTitle,
    coverImage: it.book.coverImage,
    authorName: it.book.authorName,
    price: it.book.discount ? it.book.price * (1 - it.book.discount / 100) : it.book.price,
    quantity: it.quantity,
  }));

  const subtotal = orderItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  const discountAmount = discountCode === 'INKORA10' ? subtotal * 0.1 : 0;
  const shippingFee = subtotal > 50 ? 0 : 5.00;
  const totalAmount = Number((subtotal - discountAmount + shippingFee).toFixed(2));

  // Deduct stock
  items.forEach((it: CartItem) => {
    const book = books.find((b) => b.id === it.bookId);
    if (book) {
      book.stock = Math.max(0, book.stock - it.quantity);
    }
  });

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: `INK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: user ? user.id : 'guest',
    customerName: shippingDetails.fullName,
    customerEmail: shippingDetails.email || (user ? user.email : 'guest@inkora.com'),
    customerPhone: shippingDetails.phone,
    items: orderItems,
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    shippingFee,
    totalAmount,
    status: 'CONFIRMED',
    paymentMethod: paymentMethod || 'ONLINE',
    paymentStatus: paymentMethod === 'CASH' ? 'PENDING' : 'PAID',
    shippingDetails,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  orders.unshift(newOrder);

  // Clear user's cart
  const userId = user ? user.id : 'guest-session';
  userCarts.set(userId, []);

  res.status(201).json(newOrder);
});

app.get('/api/v1/order/my', (req, res) => {
  const user = authenticate(req);
  if (!user) {
    return res.json(orders.slice(0, 2)); // demo response for preview if not signed in
  }
  const userOrders = orders.filter((o) => o.userId === user.id || o.customerEmail === user.email);
  res.json(userOrders);
});

app.get('/api/v1/order', (req, res) => {
  const user = authenticate(req);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  res.json(orders);
});

app.get('/api/v1/order/:id', (req, res) => {
  const order = orders.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.patch('/api/v1/order/:id/status', (req, res) => {
  const user = authenticate(req);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const { status } = req.body as { status: OrderStatus };
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = status;
  order.updatedAt = new Date().toISOString();
  res.json(order);
});

app.patch('/api/v1/order/:id/cancel', (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = 'CANCELLED';
  order.updatedAt = new Date().toISOString();
  res.json({ message: 'Order cancelled successfully', order });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. Reviews Endpoints (/api/v1/book/:id/reviews & /api/v1/admin/reviews)
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/v1/book/:id/reviews', (req, res) => {
  const bookReviews = reviews.filter((r) => r.bookId === req.params.id && r.status === 'APPROVED');
  res.json(bookReviews);
});

app.post('/api/v1/book/:id/reviews', (req, res) => {
  const user = authenticate(req);
  const book = books.find((b) => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });

  const { rating, comment, userName } = req.body;
  const newReview: Review = {
    id: `rev-${Date.now()}`,
    bookId: book.id,
    bookTitle: book.bookTitle,
    userId: user ? user.id : 'anon',
    userName: userName || (user ? user.username : 'Reader'),
    rating: Number(rating) || 5,
    comment: comment || '',
    date: new Date().toISOString().split('T')[0],
    status: 'APPROVED',
  };

  reviews.unshift(newReview);
  book.reviewCount += 1;
  res.status(201).json(newReview);
});

app.get('/api/v1/admin/reviews', (req, res) => {
  const user = authenticate(req);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  res.json(reviews);
});

app.patch('/api/v1/admin/reviews/:id/status', (req, res) => {
  const user = authenticate(req);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const review = reviews.find((r) => r.id === req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });

  review.status = req.body.status;
  res.json(review);
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. Admin Customers & Dashboard Metrics
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/v1/admin/customers', (req, res) => {
  const user = authenticate(req);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const customerList = users.map((u) => {
    const userOrders = orders.filter((o) => o.userId === u.id || o.customerEmail === u.email);
    const totalSpent = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    return {
      ...u,
      ordersCount: userOrders.length,
      totalSpent: Number(totalSpent.toFixed(2)),
      lastOrderDate: userOrders[0]?.createdAt || null,
      status: 'ACTIVE',
    };
  });
  res.json(customerList);
});

app.get('/api/v1/admin/dashboard', (req, res) => {
  const user = authenticate(req);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'CANCELLED' ? sum + o.totalAmount : sum), 0);
  const totalOrders = orders.length;
  const totalCustomers = users.filter((u) => u.role === 'USER').length;
  const totalBooks = books.length;
  const lowStockBooks = books.filter((b) => b.stock < 10);

  // Status breakdown
  const statusDistribution = orders.reduce((acc: Record<string, number>, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  // Monthly revenue trend (last 6 months)
  const revenueTrends = [
    { month: 'Jan', revenue: 4200 },
    { month: 'Feb', revenue: 5120 },
    { month: 'Mar', revenue: 6480 },
    { month: 'Apr', revenue: 5900 },
    { month: 'May', revenue: 7850 },
    { month: 'Jun', revenue: Number(totalRevenue.toFixed(0)) },
  ];

  res.json({
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalOrders,
    totalCustomers,
    totalBooks,
    lowStockBooks,
    recentOrders: orders.slice(0, 5),
    statusDistribution,
    revenueTrends,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. Community Posts & News (/api/v1/post)
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/v1/post/all', (_req, res) => {
  res.json(posts);
});

app.get('/api/v1/post/:id', (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

app.patch('/api/v1/post-likes/:id', (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  post.likesCount += 1;
  res.json({ likesCount: post.likesCount, isLiked: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// Vite Dev Server / Static Production Serving
// ─────────────────────────────────────────────────────────────────────────────
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Inkora Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
