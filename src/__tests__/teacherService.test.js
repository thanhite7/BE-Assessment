import { TeacherService } from '../../services/teacherService.js';
import prisma from '../../services/database.js';

jest.mock('../../services/database.js', () => ({
  __esModule: true,
  default: {
    teacher: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    student: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      createMany: jest.fn(),
    },
  },
}));

describe('TeacherService', () => {
  let teacherService;
  const mockTeacher = {
    id: 1,
    email: 'teacher@example.com',
    students: [],
  };

  const mockStudent = {
    id: 1,
    email: 'student@example.com',
    suspended: false,
  };

  beforeEach(() => {
    teacherService = new TeacherService();
    jest.clearAllMocks();
  });

  describe('registerStudents', () => {
    it('should register new students to existing teacher', async () => {
      const studentEmails = ['student1@example.com', 'student2@example.com'];
      const teacherEmail = 'teacher@example.com';

      const mockExistingTeacher = {
        ...mockTeacher,
        students: [],
      };

      const mockStudents = [
        { id: 1, email: 'student1@example.com' },
        { id: 2, email: 'student2@example.com' },
      ];

      prisma.teacher.findUnique.mockResolvedValue(mockExistingTeacher);
      prisma.student.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      prisma.student.create
        .mockResolvedValueOnce(mockStudents[0])
        .mockResolvedValueOnce(mockStudents[1]);
      prisma.teacher.update.mockResolvedValue(mockExistingTeacher);

      await teacherService.registerStudents(teacherEmail, studentEmails);

      expect(prisma.teacher.findUnique).toHaveBeenCalledWith({
        where: { email: teacherEmail },
        include: { students: true },
      });
      expect(prisma.student.create).toHaveBeenCalledTimes(2);
      expect(prisma.teacher.update).toHaveBeenCalledWith({
        where: { id: mockExistingTeacher.id },
        data: {
          students: {
            connect: [{ id: 1 }, { id: 2 }],
          },
        },
      });
    });

    it('should create new teacher if not exists', async () => {
      const studentEmails = ['student@example.com'];
      const teacherEmail = 'newteacher@example.com';

      const newTeacher = {
        id: 2,
        email: teacherEmail,
        students: [],
      };

      prisma.teacher.findUnique.mockResolvedValue(null);
      prisma.teacher.create.mockResolvedValue(newTeacher);
      prisma.student.findUnique.mockResolvedValue(null);
      prisma.student.create.mockResolvedValue(mockStudent);
      prisma.teacher.update.mockResolvedValue(newTeacher);

      await teacherService.registerStudents(teacherEmail, studentEmails);

      expect(prisma.teacher.create).toHaveBeenCalledWith({
        data: { email: teacherEmail },
        include: { students: true },
      });
    });

    it('should not connect already registered students', async () => {
      const studentEmails = ['student@example.com'];
      const teacherEmail = 'teacher@example.com';

      const teacherWithStudents = {
        ...mockTeacher,
        students: [mockStudent],
      };

      prisma.teacher.findUnique.mockResolvedValue(teacherWithStudents);
      prisma.student.findUnique.mockResolvedValue(mockStudent);

      await teacherService.registerStudents(teacherEmail, studentEmails);

      expect(prisma.teacher.update).not.toHaveBeenCalled();
    });
  });

  describe('getCommonStudents', () => {
    it('should return common students for multiple teachers', async () => {
      const teacherEmails = ['teacher1@example.com', 'teacher2@example.com'];
      const mockTeachers = [
        {
          id: 1,
          email: 'teacher1@example.com',
          students: [
            { email: 'common1@example.com' },
            { email: 'common2@example.com' },
            { email: 'unique1@example.com' },
          ],
        },
        {
          id: 2,
          email: 'teacher2@example.com',
          students: [
            { email: 'common1@example.com' },
            { email: 'common2@example.com' },
            { email: 'unique2@example.com' },
          ],
        },
      ];

      prisma.teacher.findMany.mockResolvedValue(mockTeachers);

      const result = await teacherService.getCommonStudents(teacherEmails);

      expect(result).toEqual(['common1@example.com', 'common2@example.com']);
      expect(prisma.teacher.findMany).toHaveBeenCalledWith({
        where: {
          email: { in: teacherEmails },
        },
        include: {
          students: {
            where: { suspended: false },
            select: { email: true },
          },
        },
      });
    });

    it('should return students for single teacher', async () => {
      const teacherEmails = ['teacher@example.com'];
      const mockTeachers = [
        {
          id: 1,
          email: 'teacher@example.com',
          students: [
            { email: 'student1@example.com' },
            { email: 'student2@example.com' },
          ],
        },
      ];

      prisma.teacher.findMany.mockResolvedValue(mockTeachers);

      const result = await teacherService.getCommonStudents(teacherEmails);

      expect(result).toEqual(['student1@example.com', 'student2@example.com']);
    });

    it('should return empty array if no teachers found', async () => {
      const teacherEmails = ['nonexistent@example.com'];

      prisma.teacher.findMany.mockResolvedValue([]);

      const result = await teacherService.getCommonStudents(teacherEmails);

      expect(result).toEqual([]);
    });
  });

  describe('suspendStudent', () => {
    it('should suspend existing student', async () => {
      const studentEmail = 'student@example.com';

      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.student.update.mockResolvedValue({ ...mockStudent, suspended: true });

      await teacherService.suspendStudent(studentEmail);

      expect(prisma.student.findUnique).toHaveBeenCalledWith({
        where: { email: studentEmail },
      });
      expect(prisma.student.update).toHaveBeenCalledWith({
        where: { email: studentEmail },
        data: { suspended: true },
      });
    });

    it('should throw error if student not found', async () => {
      const studentEmail = 'nonexistent@example.com';

      prisma.student.findUnique.mockResolvedValue(null);

      await expect(teacherService.suspendStudent(studentEmail))
        .rejects.toThrow('Failed to suspend student: Error: Student not found');
    });
  });

  describe('getNotificationRecipients', () => {
    it('should return registered students and mentioned students', async () => {
      const teacherEmail = 'teacher@example.com';
      const notification = 'Hello @mentioned1@example.com and @mentioned2@example.com';

      const mockTeacherWithStudents = {
        id: 1,
        email: teacherEmail,
        students: [
          { email: 'registered1@example.com' },
          { email: 'registered2@example.com' },
        ],
      };

      const mockMentionedStudents = [
        { email: 'mentioned1@example.com' },
      ];

      prisma.teacher.findUnique.mockResolvedValue(mockTeacherWithStudents);
      prisma.student.findMany.mockResolvedValue(mockMentionedStudents);
      prisma.student.createMany.mockResolvedValue({ count: 1 });

      const result = await teacherService.getNotificationRecipients(teacherEmail, notification);

      expect(result).toEqual([
        'mentioned2@example.com',
        'mentioned1@example.com',
        'registered1@example.com',
        'registered2@example.com',
      ]);
    });

    it('should return only registered students when no mentions', async () => {
      const teacherEmail = 'teacher@example.com';
      const notification = 'Hello everyone';

      const mockTeacherWithStudents = {
        id: 1,
        email: teacherEmail,
        students: [
          { email: 'student1@example.com' },
          { email: 'student2@example.com' },
        ],
      };

      prisma.teacher.findUnique.mockResolvedValue(mockTeacherWithStudents);

      const result = await teacherService.getNotificationRecipients(teacherEmail, notification);

      expect(result).toEqual(['student1@example.com', 'student2@example.com']);
    });

    it('should handle teacher with no students', async () => {
      const teacherEmail = 'teacher@example.com';
      const notification = 'Hello @mentioned@example.com';

      prisma.teacher.findUnique.mockResolvedValue(null);
      prisma.student.findMany.mockResolvedValue([]);
      prisma.student.createMany.mockResolvedValue({ count: 1 });

      const result = await teacherService.getNotificationRecipients(teacherEmail, notification);

      expect(result).toEqual(['mentioned@example.com']);
    });
  });
});
