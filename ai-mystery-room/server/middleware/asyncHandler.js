// server/middleware/asyncHandler.js
/**
 * Simple wrapper for async express route handlers
 * Catches any unhandled Promise rejections and passes them to next()
 */
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

