import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Student from '../student/student.model.js';
import Teacher from '../teacher/teacher.model.js';

const generateAuthToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET);
};

//Verificamos si el estudiante fue registrado
export const registerStudent = async (req, res) => {
    try {
        let { username, password, name, surname, email } = req.body;
        let existingStudent = await Student.findOne({ username });
        if (existingStudent) {
            return res.status(400).send({ message: 'Username already exists for students' });
        }
        let existingTeacher = await Teacher.findOne({ username });
        if (existingTeacher) {
            return res.status(400).send({ message: 'Username already exists for teachers' });
        }
        let hashedPassword = await bcrypt.hash(password, 10);
        let student = new Student({ username, password: hashedPassword, name, surname, email });
        await student.save();
        let token = generateAuthToken(student._id, 'STUDENT');
        return res.send({ message: `Registered successfully as student, can be logged with username ${student.username}`, token });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error registering student' });
    }
};

//Verificamos si el profesor fue registrado
export const registerTeacher = async (req, res) => {
    try {
        let { username, password, name, surname } = req.body;
        let existingStudent = await Student.findOne({ username });
        if (existingStudent) {
            return res.status(400).send({ message: 'Username already exists for students' });
        }
        let existingTeacher = await Teacher.findOne({ username });
        if (existingTeacher) {
            return res.status(400).send({ message: 'Username already exists for teachers' });
        }
        let hashedPassword = await bcrypt.hash(password, 10);
        let teacher = new Teacher({ username, password: hashedPassword, name, surname });
        await teacher.save();
        let token = generateAuthToken(teacher._id, 'TEACHER');
        return res.send({ message: `Registered successfully as teacher, can be logged with username ${teacher.username}`, token });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error registering teacher' });
    }
};

//login para el check
export const login = async (req, res) => {
    try {
        let { username, password } = req.body;
        let user = await Teacher.findOne({ username }) || await Student.findOne({ username });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        let isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }
        let role = user instanceof Teacher ? 'TEACHER' : 'STUDENT';
        let token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET);
        res.json({ message: `Login successful ${username}`, token, role });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};