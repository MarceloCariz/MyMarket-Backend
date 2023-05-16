import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';



const assign = multer.diskStorage({
    destination: (req, file, cb) => {
        const dirImage = 'src/public/img';
        const dirPdf = '/public/reportes/';
        if (file.fieldname === 'image') {
            cb(null, dirImage);
            } else if (file.fieldname === 'reporte') {
            cb(null, dirPdf);
        }
        },
    filename: (req, file, cb) => {
        if (file.fieldname === 'reporte') {
            cb(null, uuidv4() + '.pdf');
        }
        if (file.fieldname === 'image') {
            cb(null, uuidv4() + '.jpg');
        }
    }
})

export default assign;