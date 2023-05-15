import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes'
import dbConnection from './database/config';
//Configuraciones
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

//Base de datos
dbConnection();


// Rutas
app.use('/api/auth/', authRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/product/', productRoutes);



const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
