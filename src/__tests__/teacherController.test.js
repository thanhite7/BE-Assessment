import { TeacherController } from '../../controllers/teacherController.js';
import { TeacherService } from '../../services/teacherService.js';

jest.mock('../../services/teacherService.js');

describe('TeacherController', () => {
  let teacherController;
  let mockReq;
  let mockRes;
  let mockNext;
  let mockTeacherService;

  beforeEach(() => {
    teacherController = new TeacherController();
    mockTeacherService = TeacherService.prototype;
    
    mockReq = {
      body: {},
      query: {},
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
    
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('registerStudents', () => {
    it('should register students successfully', async () => {
      const mockRequestBody = {
        teacher: 'teacher@example.com',
        students: ['student1@example.com', 'student2@example.com'],
      };

      mockReq.body = mockRequestBody;
      mockTeacherService.registerStudents = jest.fn().mockResolvedValue();

      await teacherController.registerStudents(mockReq, mockRes, mockNext);

      expect(mockTeacherService.registerStudents).toHaveBeenCalledWith(
        'teacher@example.com',
        ['student1@example.com', 'student2@example.com']
      );
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const mockError = new Error('Service error');
      mockReq.body = {
        teacher: 'teacher@example.com',
        students: ['student@example.com'],
      };

      mockTeacherService.registerStudents = jest.fn().mockRejectedValue(mockError);

      await teacherController.registerStudents(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.send).not.toHaveBeenCalled();
    });
  });

  describe('getCommonStudents', () => {
    it('should return common students for single teacher', async () => {
      const mockStudents = ['student1@example.com', 'student2@example.com'];
      
      mockReq.query = { teacher: 'teacher@example.com' };
      mockTeacherService.getCommonStudents = jest.fn().mockResolvedValue(mockStudents);

      await teacherController.getCommonStudents(mockReq, mockRes, mockNext);

      expect(mockTeacherService.getCommonStudents).toHaveBeenCalledWith(['teacher@example.com']);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ students: mockStudents });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return common students for multiple teachers', async () => {
      const mockStudents = ['commonstudent@example.com'];
      
      mockReq.query = { teacher: ['teacher1@example.com', 'teacher2@example.com'] };
      mockTeacherService.getCommonStudents = jest.fn().mockResolvedValue(mockStudents);

      await teacherController.getCommonStudents(mockReq, mockRes, mockNext);

      expect(mockTeacherService.getCommonStudents).toHaveBeenCalledWith([
        'teacher1@example.com',
        'teacher2@example.com',
      ]);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ students: mockStudents });
    });

    it('should handle service errors', async () => {
      const mockError = new Error('Service error');
      
      mockReq.query = { teacher: 'teacher@example.com' };
      mockTeacherService.getCommonStudents = jest.fn().mockRejectedValue(mockError);

      await teacherController.getCommonStudents(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('suspendStudent', () => {
    it('should suspend student successfully', async () => {
      const mockRequestBody = {
        student: 'student@example.com',
      };

      mockReq.body = mockRequestBody;
      mockTeacherService.suspendStudent = jest.fn().mockResolvedValue();

      await teacherController.suspendStudent(mockReq, mockRes, mockNext);

      expect(mockTeacherService.suspendStudent).toHaveBeenCalledWith('student@example.com');
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const mockError = new Error('Student not found');
      
      mockReq.body = { student: 'nonexistent@example.com' };
      mockTeacherService.suspendStudent = jest.fn().mockRejectedValue(mockError);

      await teacherController.suspendStudent(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('getNotificationRecipients', () => {
    it('should return notification recipients', async () => {
      const mockRequestBody = {
        teacher: 'teacher@example.com',
        notification: 'Hello @student@example.com',
      };

      const mockRecipients = [
        'registeredstudent@example.com',
        'student@example.com',
      ];

      mockReq.body = mockRequestBody;
      mockTeacherService.getNotificationRecipients = jest.fn().mockResolvedValue(mockRecipients);

      await teacherController.getNotificationRecipients(mockReq, mockRes, mockNext);

      expect(mockTeacherService.getNotificationRecipients).toHaveBeenCalledWith(
        'teacher@example.com',
        'Hello @student@example.com'
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ recipients: mockRecipients });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return empty recipients array', async () => {
      const mockRequestBody = {
        teacher: 'teacher@example.com',
        notification: 'Hello everyone',
      };

      mockReq.body = mockRequestBody;
      mockTeacherService.getNotificationRecipients = jest.fn().mockResolvedValue([]);

      await teacherController.getNotificationRecipients(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ recipients: [] });
    });

    it('should handle service errors', async () => {
      const mockError = new Error('Service error');
      
      mockReq.body = {
        teacher: 'teacher@example.com',
        notification: 'Hello',
      };
      mockTeacherService.getNotificationRecipients = jest.fn().mockRejectedValue(mockError);

      await teacherController.getNotificationRecipients(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });
});
