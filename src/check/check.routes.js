import express from 'express';
import { validateJwt } from '../middlewares/validate-jwt.js';
import { registerStudent, registerTeacher, login } from '../check/check.controller.js';

const router = express.Router();

router.post('/register/student', registerStudent);
router.post('/register/teacher', validateJwt, registerTeacher);
router.post('/login', login);

export default router;