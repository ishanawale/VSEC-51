// Central error handler: every error ends up here and becomes a friendly JSON message.
module.exports = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong';
  let errors = err.errors && err.name === 'Error' ? err.errors : undefined;

  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Malformed JSON in request body';
  } else if (err.name === 'ValidationError' && err.errors) {
    status = 400;
    message = 'Validation failed. Please check the highlighted fields.';
    errors = {};
    Object.values(err.errors).forEach((e) => { errors[e.path] = e.message; });
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Invalid value for "${err.path}"`;
  } else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = field === 'productId'
      ? 'This Product ID already exists. Please use a different one.'
      : `A record with this ${field} already exists.`;
    errors = { [field]: message };
  } else if (/MongoServerSelectionError|MongoNetworkError|ECONNREFUSED/.test(`${err.name} ${err.message}`)) {
    status = 503;
    message = 'Database is unavailable. Please make sure MongoDB is running.';
  }

  if (status >= 500) {
    console.error(err);
    if (status === 500) message = 'Internal server error';
  }
  res.status(status).json({ message, errors: errors || {} });
};
