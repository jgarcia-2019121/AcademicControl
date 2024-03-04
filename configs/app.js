import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import authRoutes from '../src/check/check.routes.js';
import teacherRoutes from '../src/teacher/teacher.routes.js';
import studentRoutes from '../src/student/student.routes.js';
import { connectDB } from './mongo.js';
import { validateJwt, errorHandler } from '../src/middlewares/validate-jwt.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3056;
connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Definir rutas
app.use('/api/check', authRoutes);
app.use(teacherRoutes);
app.use(studentRoutes);
app.use(validateJwt)
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('Welcome to School Management System');
});

export default app;
