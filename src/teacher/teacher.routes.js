import express from 'express';
import { createCourse, editCourse, deleteCourse, getCoursesForTeacher } from '../src/teacher/teacherController.js';
import { validateJwt } from '../src/middlewares/validate-jwt.js';

const router = express.Router();

router.post('/createCourse', createCourse);
router.put('/courses/:id', validateJwt, editCourse);
router.delete('/courses/:id', validateJwt, deleteCourse);
router.get('/courses', validateJwt, getCoursesForTeacher)

export default router;