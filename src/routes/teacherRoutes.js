import { Router } from 'express';
import { TeacherController } from '../controllers/teacherController.js';
import {
  validateRegisterRequest,
  validateCommonStudentsQuery,
  validateSuspendRequest,
  validateNotificationRequest
} from '../middleware/validation.js';
const router = Router();
const teacherController = new TeacherController();
router.post('/register', validateRegisterRequest, (req, res, next) => {
  teacherController.registerStudents(req, res, next);
});
router.get('/commonstudents', validateCommonStudentsQuery, (req, res, next) => {
  teacherController.getCommonStudents(req, res, next);
});
router.post('/suspend', validateSuspendRequest, (req, res, next) => {
  teacherController.suspendStudent(req, res, next);
});
router.post('/retrievefornotifications', validateNotificationRequest, (req, res, next) => {
  teacherController.getNotificationRecipients(req, res, next);
});
export default router;
