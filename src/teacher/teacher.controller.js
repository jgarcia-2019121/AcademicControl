import Course from '../models/courseModel.js';
import Student from '../models/studentModel.js';
import jwt from 'jsonwebtoken'

//Crear un nuevo curso
export const createCourse = async (req, res) => {
    try {
        let token = req.headers.authorization


        let decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        let id = decodeToken.id

        //Crear un nuevo curso
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

//editar curso

export const editCourse = async (req, res) => {
    try {
        //Verificar si el curso existe y pertenece al maestro
        const course = await Course.findOne({ _id: req.params.id, teacher: req.user.id })
        if (!course) {
            return res.status(404).send({ message: 'Curso no encontrado o no autorizado' })
        }
        //Actualizar los datos del curso
        course.name = req.body.name || course.name;
        course.description = req.body.description || course.description;

        //Guardar cambios
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
        //Verificar si el curso existe y pertenece al maestro
        const course = await Course.findOne({ _id: req.params.id, teacher: req.user.id })
        if (!course) {
            return res.status(404).send({ message: 'Curso no encontrado o no autorizado' });
        }

        //Desvincular estudiantes asociados al curso
        await Student.updateMany({ courses: req.params.id }, { $pull: { courses: req.params.id } });


        //Eliminar el curso
        await course.remove();

        res.status(200).send({ message: 'Curso eliminado exitosamente' })

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error al eliminar el curso' });

    }
};


//obtener los cursos asociados a un maestro
export const getCoursesForTeacher = async (req, res) => {
    try {
        // Obtenemos el ID del maestro autenticado
        let token = req.headers.authorization


        let decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        let id = decodeToken.id
        //const teacherId = req.user._id;
        console.log(id)

        // Buscamos los cursos asociados al maestro por su ID
        const courses = await Course.find({ teacher: id });

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: 'No courses found for this teacher.' });
        }

        // Respondemos con los cursos encontrados
        res.status(200).send(courses);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error.' });
    }
};