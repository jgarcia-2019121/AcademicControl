import jwt from 'jsonwebtoken';

//Validar el token JWT
export const validateJwt = (req, res, next) => {
    const token = req.headers.authorization;
    const currentRoute = req.path;
    const publicRoutes = ['api/check/login'];

    if (publicRoutes.includes(currentRoute)) {
        return next();
    }
    if (!token) {
        return res.status(401).json({ message: 'Token de autenticación no proporcionado.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Token de autenticación inválido.' });
    }
};

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Internal Server Error' });
};


