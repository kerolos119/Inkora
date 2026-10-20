/** JSON contracts exposed by the Spring DTOs. Keep UI-only/derived fields in index.ts. */
export type BackendRole = 'ADMIN' | 'USER' | 'AGENT';
export type BackendOrderStatus =
  | 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPING' | 'OUT_FOR_DELIVERY'
  | 'DELIVERED' | 'CANCELLED' | 'REFUNDED' | 'RETURNED';
export type BackendPaymentMethod = 'ONLINE' | 'CASH';
export type BackendReviewStatus = 'APPROVED' | 'PENDING' | 'REJECTED';
export type BackendCartStatus = 'ACTIVE' | 'CHECKED_OUT' | 'ABANDONED' | 'MERGED';

export interface BackendBookDto extends Record<string, unknown> {
  id: string;
  authorId: string;
  authorName?: string | null;
  bookTitle: string;
  bookDescription: string;
  numberOfPages: number;
  bookSize: string;
  coverType: string;
  paperType: string;
  publicationYear: string;
  language: string;
  imagePath?: string | null;
  isbn: string;
  price: number;
  stock: number;
  includes: boolean;
  categoryId: string[];
}
export interface BackendAuthorDto { id: string; name: string; isActive?: boolean | null }
export interface BackendCategoryDto extends Record<string, unknown> { id: string; name: string; parentCategoryId?: string | null }
export interface BackendUserDto {
  id: string; username: string; address: string; phoneNumber: string; email: string; role: BackendRole;
}
export interface BackendCartItem { bookId: string; bookTitle: string; quantity: number; price: number }
export interface BackendCartDto {
  id: string; userId: string; cartItems: BackendCartItem[]; cartStatus: BackendCartStatus;
}
export interface BackendOrderItem { bookId: string; bookTitle: string; quantity: number; price: number }
export interface BackendOrderDto extends Record<string, unknown> {
  id: string;
  orderNumber: string;
  shippingAddress: string;
  shippingPhone: string;
  note?: string | null;
  paymentMethod: BackendPaymentMethod | string;
  paymentReference?: string | null;
  items: BackendOrderItem[];
  usersId: string;
  orderStatus: BackendOrderStatus;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
}
export interface BackendBookReviewDto extends Record<string, unknown> {
  id: string; bookId: string; bookTitle: string; userId: string; username: string;
  rating: number; comment: string; status: BackendReviewStatus; createdAt: string;
}
export interface BackendPostDto extends Record<string, unknown> {
  id: string; title: string; content: string; imagePath?: string | null;
  likeCount: number; comments?: BackendPostCommentDto[] | null; createdAt: string; commentCount: number;
}
export interface BackendNewsDto extends Omit<BackendPostDto, 'comments'>, Record<string, unknown> {
  comments?: BackendNewsCommentDto[] | null;
}
export interface BackendPostCommentDto extends Record<string, unknown> {
  id: string; postId: string; userId: string; content: string; username: string; createdAt: string;
}
export interface BackendNewsCommentDto extends Record<string, unknown> {
  id: string; newsId: string; userId: string; content: string; username: string; createdAt: string;
}
export interface BackendShippingSettingDto { fee: number; freeShippingThreshold?: number | null }
export interface BackendLoginResponse { accessToken: string; refreshToken: string }
export interface BackendCredentials { email: string; password: string }
export interface BackendForgetPasswordRequest { email: string }
export interface BackendResetPasswordRequest { email: string; otp: string; newPassword: string }
export interface BackendLikeResponse { liked: boolean; likeCount: number }
export interface BackendPostLikeDto { id: string; userId: string; postId: string }
export interface BackendNewsLikeDto { id: string; userId: string; newsId: string }
export interface BackendReviewSummaryDto { bookId: string; average: number; count: number }
export interface BackendErrorResponse { message: string; status: string; timestamp: string }
export interface BackendCustomerDto {
  id: string; username: string; email: string; phoneNumber: string; address: string;
  role: BackendRole; ordersCount: number; totalSpent: number; lastOrderDate: string | null; status: string;
}
export interface BackendDashboardDto {
  totalRevenue: number; totalOrders: number; totalCustomers: number; totalBooks: number;
  lowStockBooks: Array<{ id: string; bookTitle: string; stock: number }>;
  recentOrders: Array<{
    id: string; orderNumber: string; customerName: string; customerEmail: string;
    totalAmount: number; status: BackendOrderStatus; createdAt: string;
  }>;
  statusDistribution: Record<string, number>;
  revenueTrends: Array<{ month: string; revenue: number }>;
}
export interface BackendPageResult<T> { size: T[]; totalSize: number; totalPages: number }
export interface BackendFilter {
  page?: number; size?: number; sortBy?: string; sortDirection?: 'ASC' | 'DESC';
}
export interface BackendSearchRequest extends BackendFilter {
  keyword?: string; isActive?: boolean; minPrice?: number; maxPrice?: number;
}
export interface BackendCreateOrderDto {
  shippingAddress: string; shippingPhone: string; note?: string;
  paymentMethod: string; paymentReference?: string; items: BackendOrderItem[];
}
export interface BackendCreateReviewDto { rating: number; comment: string }
export interface BackendCreateCommentDto { postId?: string; newsId?: string; content: string }
export interface BackendCreatePostDto { title: string; content: string; imagePath?: string }
export interface BackendCreateBookDto extends Omit<BackendBookDto, 'id' | 'authorName'> {}
export interface BackendCreateAuthorDto { name: string; isActive?: boolean | null }
export interface BackendCreateCategoryDto { name: string; parentCategoryId?: string | null }
export interface BackendCreateUserDto {
  username: string; password: string; address: string; phoneNumber: string; email: string;
}

/** Persistence shapes are documented separately; these are not sent to the browser API. */
export interface BackendAuditableDocument {
  version?: number; createdAt?: string; createdBy?: string; updatedAt?: string; updatedBy?: string;
}
export interface BackendBookDocument extends BackendAuditableDocument {
  id: string; author: BackendAuthorDocument | null; bookTitle: string; bookDescription: string;
  numberOfPages: number; bookSize: string; coverType: string; paperType: string;
  publicationDate: string; language: string; imagePath?: string | null; isbn: string;
  price: number; isActive: boolean; stock: number; includes: boolean; categories: BackendCategoryDocument[];
}
export interface BackendAuthorDocument extends BackendAuditableDocument { id: string; name: string; isActive?: boolean | null }
export interface BackendCategoryDocument extends BackendAuditableDocument {
  id: string; name: string; parentCategory: BackendCategoryDocument | null;
}
export interface BackendBookReviewDocument extends BackendAuditableDocument {
  id: string; bookId: string; userId: string; rating: number; comment: string; status: BackendReviewStatus;
}
export interface BackendCartDocument extends BackendAuditableDocument {
  id: string; userId: string; status: BackendCartStatus; cartItems: BackendCartItem[];
}
export interface BackendOrderDocument extends BackendAuditableDocument {
  id: string; orderNumber: string; userId: string; status: BackendOrderStatus; totalAmount: number;
  shippingDetails: { address: string; city: string; phoneNumber: string; name: string };
  note?: string | null; paymentReference?: string | null; paymentMethod?: BackendPaymentMethod | null;
  orderedAt: string; orderItems: BackendOrderItem[]; subtotal: number; shippingFee: number;
}
export interface BackendUserDocument extends BackendAuditableDocument {
  id: string; username: string; password: string; address: string; phoneNumber: string; email: string;
  role: BackendRole; otpCode?: string | null; otpExpiry?: string | null;
}
export interface BackendPostDocument extends BackendAuditableDocument {
  id: string; title: string; content: string; imagePath?: string | null; likeCount: number;
}
export interface BackendNewsDocument extends BackendPostDocument {}
export interface BackendPostCommentDocument extends BackendAuditableDocument {
  id: string; userId: string; postId: string; content: string;
}
export interface BackendNewsCommentDocument extends BackendAuditableDocument {
  id: string; userId: string; newsId: string; content: string;
}
export interface BackendPostLikesDocument extends BackendAuditableDocument { id: string; userId: string; postId: string }
export interface BackendNewsLikesDocument extends BackendAuditableDocument { id: string; userId: string; newsId: string }
export interface BackendRefreshTokenDocument {
  id: string; userId: string; expiresAt: string; revoked: boolean;
}
export interface BackendShippingSettingDocument {
  id: string; fee: number; freeShippingThreshold?: number | null;
}
export interface BackendCounterDocument { id: string; seq: number }
export interface BackendShippingDetails {
  address: string; city: string; phoneNumber: string; name: string;
}
export interface BackendTokenInfo {
  username: string; email: string; userId: string; role: string; expiresAt: string; issuedAt: string;
}
