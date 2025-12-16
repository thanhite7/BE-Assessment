import { beforeAll, afterAll } from '@jest/globals';
import prisma from '../services/database.js';
beforeAll(async () => {
  await prisma.teacher.deleteMany({});
  await prisma.student.deleteMany({});
});
afterAll(async () => {
  await prisma.teacher.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.$disconnect();
});
