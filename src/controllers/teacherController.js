import { TeacherService } from '../services/teacherService.js';
const teacherService = new TeacherService();
export class TeacherController {
  async registerStudents(req, res, next) {
    try {
      const { teacher, students } = req.body;
      await teacherService.registerStudents(teacher, students);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
  async getCommonStudents(req, res, next) {
    try {
      const teachers = Array.isArray(req.query.teacher) 
        ? req.query.teacher
        : [req.query.teacher];
      const students = await teacherService.getCommonStudents(teachers);
      res.status(200).json({ students });
    } catch (error) {
      next(error);
    }
  }
  async suspendStudent(req, res, next) {
    try {
      const { student } = req.body;
      await teacherService.suspendStudent(student);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
  async getNotificationRecipients(req, res, next) {
    try {
      const { teacher, notification } = req.body;
      const recipients = await teacherService.getNotificationRecipients(teacher, notification);
      res.status(200).json({ recipients });
    } catch (error) {
      next(error);
    }
  }
}
