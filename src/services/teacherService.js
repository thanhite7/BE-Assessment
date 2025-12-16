import prisma from './database.js';
export class TeacherService {
  async registerStudents(teacherEmail, studentEmails) {
    try {
      let teacher = await prisma.teacher.findUnique({
        where: { email: teacherEmail },
        include: { students: true }
      });
      if (!teacher) {
        teacher = await prisma.teacher.create({
          data: { email: teacherEmail },
          include: { students: true }
        });
      }
      const students = await Promise.all(
        studentEmails.map(async (email) => {
          let student = await prisma.student.findUnique({
            where: { email }
          });
          if (!student) {
            student = await prisma.student.create({
              data: { email }
            });
          }
          return student;
        })
      );
      const existingStudentIds = teacher.students.map(s => s.id);
      const newStudentIds = students
        .filter(s => !existingStudentIds.includes(s.id))
        .map(s => s.id);
      if (newStudentIds.length > 0) {
        await prisma.teacher.update({
          where: { id: teacher.id },
          data: {
            students: {
              connect: newStudentIds.map(id => ({ id }))
            }
          }
        });
      }
    } catch (error) {
      throw new Error(`Failed to register students: ${error}`);
    }
  }
  async getCommonStudents(teacherEmails) {
    try {
      if (teacherEmails.length === 0) {
        return [];
      }
      const teachers = await prisma.teacher.findMany({
        where: {
          email: { in: teacherEmails }
        },
        include: {
          students: {
            where: { suspended: false },
            select: { email: true }
          }
        }
      });
      if (teachers.length !== teacherEmails.length) {
        return []; 
      }
      if (teachers.length === 1) {
        return teachers[0].students.map(s => s.email);
      }
      let commonStudents = teachers[0].students.map(s => s.email);
      for (let i = 1; i < teachers.length; i++) {
        const currentTeacherStudents = teachers[i].students.map(s => s.email);
        commonStudents = commonStudents.filter(email => 
          currentTeacherStudents.includes(email)
        );
      }
      return commonStudents.sort();
    } catch (error) {
      throw new Error(`Failed to get common students: ${error}`);
    }
  }
  async suspendStudent(studentEmail) {
    try {
      const student = await prisma.student.findUnique({
        where: { email: studentEmail }
      });
      if (!student) {
        throw new Error('Student not found');
      }
      await prisma.student.update({
        where: { email: studentEmail },
        data: { suspended: true }
      });
    } catch (error) {
      throw new Error(`Failed to suspend student: ${error}`);
    }
  }
  async getNotificationRecipients(teacherEmail, notification) {
    try {
      const mentionPattern = /@([^\s@]+@[^\s@]+\.[^\s@]+)/g;
      const mentionedEmails = [];
      let match;
      while ((match = mentionPattern.exec(notification)) !== null) {
        mentionedEmails.push(match[1]);
      }
      const teacher = await prisma.teacher.findUnique({
        where: { email: teacherEmail },
        include: {
          students: {
            where: { suspended: false },
            select: { email: true }
          }
        }
      });
      const registeredStudents = teacher ? teacher.students.map(s => s.email) : [];
      const mentionedStudents = [];
      if (mentionedEmails.length > 0) {
        const existingMentionedStudents = await prisma.student.findMany({
          where: {
            email: { in: mentionedEmails },
            suspended: false
          },
          select: { email: true }
        });
        mentionedStudents.push(...existingMentionedStudents.map(s => s.email));
        const existingEmails = existingMentionedStudents.map(s => s.email);
        const newMentionedEmails = mentionedEmails.filter(email => !existingEmails.includes(email));
        if (newMentionedEmails.length > 0) {
          await prisma.student.createMany({
            data: newMentionedEmails.map(email => ({ email, suspended: false })),
            skipDuplicates: true
          });
          mentionedStudents.push(...newMentionedEmails);
        }
      }
      const allRecipients = [...new Set([...registeredStudents, ...mentionedStudents])];
      return allRecipients.sort();
    } catch (error) {
      throw new Error(`Failed to get notification recipients: ${error}`);
    }
  }
}
