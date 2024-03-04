import Student from '../student/student.model.js';
import Course from '../course/course.model.js';
import jwt from 'jsonwebtoken'

export const assignCourse = async (req, res) => {
    try {
        let token = req.headers.authorization

        let decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        let id = decodeToken.id
        let course = await Course.findOne({ _id: req.params.courseId })
        if (!course) {
            return res.status(404).send({ message: 'Course not found' })
        }
        let studentCoursesCount = await Course.countDocuments({ students: id })
        if (studentCoursesCount >= 3) {
            return res.status(400).send({ message: 'The student is already assigned to 3 courses.' })
        }
        if (course.students.includes(id)) {
            return res.status(400).send({ message: 'The student is already assigned to this course' })
        }
        course.students = id;
        await course.save();

        res.status(200).send({ message: `Assigned to ${course} successfully` });

    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Error assigning to course' })
    }
}

// Controlador para ver todos los cursos disponibles para un estudiante
export const viewCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting courses' });
    }
};

export const editProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        student.username = req.body.username || student.username;
        student.email = req.body.email || student.email;
        await student.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting profile' });
    }
};