import app from './configs/app.js';

//Espera que se inicie el servidor
const PORT = process.env.PORT || 3056;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
