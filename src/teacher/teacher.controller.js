import Course from '../course/course.model.js';
import Student from '../student/student.model.js';
import jwt from 'jsonwebtoken'

//Crear un nuevo curso se necesita el token default o el ya agregado
export const createCourse = async (req, res) => {
    try {
        let token = req.headers.authorization
        let decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        let id = decodeToken.id
        //Crear un nuevo curso, tiene que registrar el id del profesor ya sea el default o el que ya registro
        const newCourse = await Course.create({
            name: req.body.name,
            description: req.body.description,
            teacher: id
        });
        res.status(201).send({ message: `Curso ${newCourse} creado exitosamente` });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error creando curso' });
    }
};

//editar curso y verificar si el profesor pertenese a un curso existente
export const editCourse = async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.params.id, teacher: req.user.id })
        if (!course) {
            return res.status(404).send({ message: 'Curso no encontrado o no autorizado' })
        }
        course.name = req.body.name || course.name;
        course.description = req.body.description || course.description;
        await course.save();
        res.status(200).send({ message: `Curso ${course} actualizado existosamente` });
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Error al actualizar el curso' })
    }
}
//Eliminar un curso
export const deleteCourse = async (req, res) => {
    try {
        //Verificar si existe el curso para eliminarlo
        const course = await Course.findOne({ _id: req.params.id, teacher: req.user.id })
        if (!course) {
            return res.status(404).send({ message: 'Curso no encontrado o no autorizado' });
        }
        //Desvincula el estudiante del curso
        await Student.updateMany({ courses: req.params.id }, { $pull: { courses: req.params.id } });
        await course.remove();
        res.status(200).send({ message: 'Curso eliminado exitosamente' })
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error al eliminar el curso' });
    }
};

//obtiene los cursos asociados que tiene un profesor por el id
export const getCoursesForTeacher = async (req, res) => {
    try {
        let token = req.headers.authorization
        let decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        let id = decodeToken.id
        console.log(id)
        const courses = await Course.find({ teacher: id });
        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: 'No courses found for this teacher' });
        }
        res.status(200).send(courses);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'There was an error on the server, check the server' });
    }
};