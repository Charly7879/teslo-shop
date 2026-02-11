/**
 * fileFilter
 * Helper para utilizar en un request para subir un archivo y validar
 * desde FileInterceptors.
 */
export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    // Sí no hay archivo, rechazar con "false"
    if (!file) return callback(new Error('File es impte'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpeg', 'jpe', 'gif', 'png'];

    if (validExtensions.includes(fileExtension)) {
        // Retornar callback sin error "null" y aceptar el archivo "true"
        return callback(null, true);
    }

    return callback(null, false);
};