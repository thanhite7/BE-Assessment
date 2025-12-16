export const mockTeachers = [
  {
    id: 1,
    email: 'teacher1@example.com',
    students: [],
  },
  {
    id: 2,
    email: 'teacher2@example.com',
    students: [],
  },
  {
    id: 3,
    email: 'teacher3@example.com',
    students: [],
  },
];

export const mockStudents = [
  {
    id: 1,
    email: 'student1@example.com',
    suspended: false,
    teachers: [],
  },
  {
    id: 2,
    email: 'student2@example.com',
    suspended: false,
    teachers: [],
  },
  {
    id: 3,
    email: 'student3@example.com',
    suspended: true,
    teachers: [],
  },
  {
    id: 4,
    email: 'commonstudent@example.com',
    suspended: false,
    teachers: [],
  },
];

export const mockTeacherWithStudents = {
  id: 1,
  email: 'teacher@example.com',
  students: [
    {
      id: 1,
      email: 'student1@example.com',
      suspended: false,
    },
    {
      id: 2,
      email: 'student2@example.com',
      suspended: false,
    },
  ],
};

export const mockMultipleTeachersWithCommonStudents = [
  {
    id: 1,
    email: 'teacher1@example.com',
    students: [
      { email: 'commonstudent1@example.com' },
      { email: 'commonstudent2@example.com' },
      { email: 'uniquestudent1@example.com' },
    ],
  },
  {
    id: 2,
    email: 'teacher2@example.com',
    students: [
      { email: 'commonstudent1@example.com' },
      { email: 'commonstudent2@example.com' },
      { email: 'uniquestudent2@example.com' },
    ],
  },
];

export const mockValidRegistrationData = {
  teacher: 'teacher@example.com',
  students: ['student1@example.com', 'student2@example.com'],
};

export const mockValidSuspendData = {
  student: 'student@example.com',
};

export const mockValidNotificationData = {
  teacher: 'teacher@example.com',
  notification: 'Hello students @mentioned@example.com',
};

export const mockInvalidEmailData = {
  teacher: 'invalid-email',
  students: ['student@example.com'],
};

export const mockEmptyStudentsData = {
  teacher: 'teacher@example.com',
  students: [],
};

export const mockNotificationWithMentions = {
  teacher: 'teacher@example.com',
  notification: 'Hello @student1@example.com and @student2@example.com! How are you today?',
};

export const mockNotificationWithoutMentions = {
  teacher: 'teacher@example.com',
  notification: 'Hello everyone! Please submit your assignments.',
};

export const mockMentionedStudents = [
  { email: 'student1@example.com' },
  { email: 'student2@example.com' },
];

export const mockSuspendedStudent = {
  id: 1,
  email: 'student@example.com',
  suspended: true,
  teachers: [],
};

export const mockPrismaError = {
  code: 'P2002',
  message: 'Unique constraint failed on the fields: (`email`)',
  meta: {
    target: ['email'],
  },
};

export const mockValidationError = {
  isJoi: true,
  details: [
    {
      message: 'Email must be a valid email address',
      path: ['teacher'],
    },
  ],
};

export const createMockRequest = (data = {}) => ({
  body: {},
  query: {},
  params: {},
  ...data,
});

export const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export const createMockNext = () => jest.fn();

export const createMockPrismaClient = () => ({
  teacher: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  student: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});
