export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  if (err.message.includes('Unique constraint')) {
    statusCode = 409;
    message = 'Resource already exists';
  } else if (err.message.includes('Record to update not found')) {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.message.includes('Foreign key constraint')) {
    statusCode = 400;
    message = 'Invalid reference to related resource';
  }
  if (err.message.includes('Student not found')) {
    statusCode = 404;
  }
  res.status(statusCode).json({
    message: message
  });
};
