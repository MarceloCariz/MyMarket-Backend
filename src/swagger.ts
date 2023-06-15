import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi, { SwaggerOptions } from 'swagger-ui-express';
import {Express} from 'express';


const options:SwaggerOptions = {
    definition: {
        openapi: '3.0.0',
            info: {
                title: 'MyMarket API Documentation',
                version: '1.0.0',
                description: 'API Documentation for MyMarket API',
            },
            servers:[
                {
                    url: "http://localhost:4000/api"
                }
            ]
    },
  apis: ['**/*.ts'], // Especifica la ubicación de tus archivos de rutas de Express
};

const specs = swaggerJsdoc(options);

export default function setupSwagger(app:Express) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
