import {
  validateRegisterRequest,
  validateCommonStudentsQuery,
  validateSuspendRequest,
  validateNotificationRequest,
} from '../../middleware/validation.js';

describe('Validation Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      query: {},
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('validateRegisterRequest', () => {
    it('should pass validation with valid data', () => {
      mockReq.body = {
        teacher: 'teacher@example.com',
        students: ['student1@example.com', 'student2@example.com'],
      };

      validateRegisterRequest(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid teacher email', () => {
      mockReq.body = {
        teacher: 'invalid-email',
        students: ['student@example.com'],
      };

      validateRegisterRequest(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Teacher must be a valid email address',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with missing teacher', () => {
      mockReq.body = {
        students: ['student@example.com'],
      };

      validateRegisterRequest(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Teacher email is required',
      });
    });

    it('should fail validation with empty students array', () => {
      mockReq.body = {
        teacher: 'teacher@example.com',
        students: [],
      };

      validateRegisterRequest(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'At least one student email is required',
      });
    });

    it('should fail validation with invalid student emails', () => {
      mockReq.body = {
        teacher: 'teacher@example.com',
        students: ['invalid-email', 'student@example.com'],
      };

      validateRegisterRequest(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'All student entries must be valid email addresses',
      });
    });

    it('should fail validation with missing students', () => {
      mockReq.body = {
        teacher: 'teacher@example.com',
      };

      validateRegisterRequest(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Students array is required',
      });
    });
  });

  describe('validateCommonStudentsQuery', () => {
    it('should pass validation with single teacher', () => {
      mockReq.query = {
        teacher: 'teacher@example.com',
      };

      validateCommonStudentsQuery(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should pass validation with multiple teachers', () => {
      mockReq.query = {
        teacher: ['teacher1@example.com', 'teacher2@example.com'],
      };

      validateCommonStudentsQuery(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should fail validation with missing teacher parameter', () => {
      mockReq.query = {};

      validateCommonStudentsQuery(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'At least one teacher email is required',
      });
    });

    it('should fail validation with invalid teacher email', () => {
      mockReq.query = {
        teacher: 'invalid-email',
      };

      validateCommonStudentsQuery(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'All teacher emails must be valid',
      });
    });

    it('should fail validation with empty teacher array', () => {
      mockReq.query = {
        teacher: [],
      };

      validateCommonStudentsQuery(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'At least one teacher email is required',
      });
    });
  });

  describe('validateSuspendRequest', () => {
    it('should pass validation with valid student email', () => {
      mockReq.body = {
        student: 'student@example.com',
      };

      validateSuspendRequest(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid student email', () => {
      mockReq.body = {
        student: 'invalid-email',
      };

      validateSuspendRequest(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Student must be a valid email address',
      });
    });

    it('should fail validation with missing student', () => {
      mockReq.body = {};

      validateSuspendRequest(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Student email is required',
      });
    });
  });

  describe('validateNotificationRequest', () => {
    it('should pass validation with valid data', () => {
      mockReq.body = {
        teacher: 'teacher@example.com',
        notification: 'Hello students @student@example.com',
      };

      validateNotificationRequest(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid teacher email', () => {
      mockReq.body = {
        teacher: 'invalid-email',
        notification: 'Hello students',
      };

      validateNotificationRequest(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Teacher must be a valid email address',
      });
    });

    it('should fail validation with missing teacher', () => {
      mockReq.body = {
        notification: 'Hello students',
      };

      validateNotificationRequest(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Teacher email is required',
      });
    });

    it('should fail validation with missing notification', () => {
      mockReq.body = {
        teacher: 'teacher@example.com',
      };

      validateNotificationRequest(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Notification text is required',
      });
    });

    it('should fail validation with empty notification', () => {
      mockReq.body = {
        teacher: 'teacher@example.com',
        notification: '   ',
      };

      validateNotificationRequest(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Notification text is required',
      });
    });
  });
});
