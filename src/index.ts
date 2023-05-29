import express from 'express';
import path from 'path';
import * as dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import shopRoutes from './routes/shop.routes';
import productRoutes from './routes/product.routes'
import categoryRoutes from './routes/category.routes';
import dbConnection from './database/config';
import setupSwagger from './swagger';


const allowedOrigins = ['http://localhost:5173', 'https://mymarketm.netlify.app']

//Configuraciones
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors({ credentials: true, origin: allowedOrigins }))
app.use(express.static(path.join(__dirname, "public")));//directorio publico archivos e imagenes
app.use(express.urlencoded({extended: false}))
//Cookie
app.use(cookieParser());


//Base de datos
dbConnection();


// Rutas
app.use('/api/auth/', authRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/shop/', shopRoutes);
app.use('/api/product/', productRoutes);
app.use('/api/category/', categoryRoutes);

setupSwagger(app);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})


export {
    app,
    server
};