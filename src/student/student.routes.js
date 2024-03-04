import express from 'express';
import { assignCourse, viewCourses, editProfile, deleteProfile } from '../student/student.controller.js';
import { validateJwt } from '../middlewares/validate-jwt.js';

const router = express.Router();

router.put('/courses/assing/:courseId', validateJwt, assignCourse);
router.get('/courses/student', validateJwt, viewCourses);
router.put('/profile', validateJwt, editProfile);
router.delete('/profile', validateJwt, deleteProfile);

export default router;