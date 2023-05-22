import express from 'express';
import path from 'path';
import * as dotenv from "dotenv";
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import shopRoutes from './routes/shop.routes';
import productRoutes from './routes/product.routes'
import dbConnection from './database/config';




//Configuraciones
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));//directorio publico archivos e imagenes
app.use(express.urlencoded({extended: false}))


//Base de datos
dbConnection();


// Rutas
app.use('/api/auth/', authRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/shop/', shopRoutes);
app.use('/api/product/', productRoutes);



const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
