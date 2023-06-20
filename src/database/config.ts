import mongoose from "mongoose"


const dbConnection = async() => {
    try {
        const DB_URI = process.env.DB_URI || "";
        if(!DB_URI) return "No hay variable de entorno de conexion mongo";


        await mongoose.connect(DB_URI);

        console.log('Conexión exitosa a MongoDB');
    } catch (error) {
        console.error('Error al conectar a MongoDB', error);
    }
}

export default dbConnection;