const mongoose = require('mongoose');

// Wraps an async controller so thrown errors go to the error handler.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Creates an Error carrying an HTTP status (and optional field errors).
const httpError = (status, message, errors) => {
  const err = new Error(message);
  err.status = status;
  if (errors) err.errors = errors;
  return err;
};

// Rejects malformed MongoDB ids before they reach the database.
const validateId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next(httpError(400, 'Invalid ID format'));
  next();
};

// Makes user text safe to use inside a RegExp (prevents regex injection).
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Only accepts plain strings from the request (ignores objects such as {"$ne": ""}).
const str = (v) => (typeof v === 'string' ? v.trim() : '');

// Reads ?page and ?limit safely.
const getPaging = (query, defaultLimit = 10, maxLimit = 1000) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || defaultLimit, 1), maxLimit);
  return { page, limit, skip: (page - 1) * limit };
};

module.exports = { asyncHandler, httpError, validateId, escapeRegex, str, getPaging };
