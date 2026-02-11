/**
 * fileNamer
 * Helper para renombrar el archivo
 * desde FileInterceptors.
 */
import { v4 as uuid } from 'uuid';

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    // Sí no hay archivo, rechazar con "false"
    if (!file) return callback(new Error('File es impte'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const fileName = `${uuid()}.${fileExtension}`;

    return callback(null, fileName);
};