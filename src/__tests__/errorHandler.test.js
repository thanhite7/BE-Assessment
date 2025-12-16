import { errorHandler } from '../../middleware/errorHandler.js';

describe('Error Handler Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('should handle generic errors with 500 status', () => {
    const error = new Error('Something went wrong');

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(console.error).toHaveBeenCalledWith('Error:', 'Something went wrong');
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Internal server error',
    });
  });

  it('should handle validation errors with 400 status', () => {
    const error = new Error('Validation failed');
    error.name = 'ValidationError';

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Validation failed',
    });
  });

  it('should handle database connection errors', () => {
    const error = new Error('Connection refused');
    error.code = 'ECONNREFUSED';

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Database connection error',
    });
  });

  it('should handle timeout errors', () => {
    const error = new Error('Request timeout');
    error.code = 'ETIMEDOUT';

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(408);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Request timeout',
    });
  });

  it('should handle Joi validation errors', () => {
    const error = {
      isJoi: true,
      details: [{ message: 'Email is required' }],
    };

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Email is required',
    });
  });

  it('should handle custom status code errors', () => {
    const error = new Error('Not found');
    error.statusCode = 404;

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Not found',
    });
  });

  it('should handle Prisma unique constraint errors', () => {
    const error = {
      code: 'P2002',
      message: 'Unique constraint failed',
      meta: {
        target: ['email'],
      },
    };

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Email already exists',
    });
  });

  it('should handle Prisma record not found errors', () => {
    const error = {
      code: 'P2025',
      message: 'Record not found',
    };

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Record not found',
    });
  });

  it('should log error details', () => {
    const error = new Error('Test error');
    error.stack = 'Error stack trace';

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(console.error).toHaveBeenCalledWith('Error:', 'Test error');
  });

  it('should handle errors without message', () => {
    const error = {};

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Internal server error',
    });
  });
});
