package com.kerolos119.inkora.exception;

public final class ExceptionMessage {

    private ExceptionMessage() {}

    // User
    public static final String USER_EXISTS    = "user.exists";
    public static final String USER_NOT_FOUND = "user.not.found";

    // Author
    public static final String AUTHOR_EXISTS        = "author.exists";
    public static final String AUTHOR_NOT_FOUND     = "author.not.found";
    public static final String AUTHOR_CANNOT_DELETE = "author.cannot.delete";

    // Book
    public static final String BOOK_EXISTS    = "book.exists";
    public static final String BOOK_NOT_FOUND = "book.not.found";

    // Category
    public static final String CATEGORY_EXISTS        = "category.exists";
    public static final String CATEGORY_NOT_FOUND     = "category.not.found";
    public static final String CATEGORY_CANNOT_DELETE = "category.cannot.delete";
    public static final String PARENT_CATEGORY_NOT_FOUND = "parent.category.not.found";

    // News
    public static final String NEWS_EXISTS            = "news.exists";
    public static final String NEWS_NOT_FOUND         = "news.not.found";
    public static final String NEWS_COMMENT_NOT_FOUND = "newsComment.not.found";

    // Post
    public static final String POST_EXISTS            = "post.exists";
    public static final String POST_NOT_FOUND         = "post.not.found";
    public static final String POST_COMMENT_NOT_FOUND = "postComment.not.found";

    // Order
    public static final String ORDER_NOT_FOUND    = "order.not.found";
    public static final String ORDER_NOT_ENOUGH   = "order.not.enough";
    public static final String ORDER_NOT_EDITABLE = "order.not.editable";

    // Auth
    public static final String FORBIDDEN           = "forbidden";
    public static final String INVALID_CREDENTIALS = "invalid.credentials";
    public static final String INVALID_PASSWORD    = "invalid.password";
    public static final String INVALID_TOKEN       = "invalid.token";

    // Cart
    public static final String CART_EMPTY     = "cart.empty";
    public static final String CART_NOT_FOUND = "cart.not.found";
    public static final String STOCK_EXCEEDED = "stock.exceeded";

    // Email
    public static final String EMAIL_SENDING_FAILED = "email.sending.failed";

    // OTP
    public static final String INVALID_OTP      = "invalid.otp";
    public static final String OTP_EXPIRED      = "otp.expired";
    public static final String OTP_ALREADY_SENT = "otp.already.sent";
    public static final String OTP_MAX_ATTEMPTS = "otp.max.attempts";
}