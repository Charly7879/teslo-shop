import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {

    getStaticImageName(imageName: string) {

        // Directorio donde se guardan las imágenes de productos
        const path = join(__dirname, '../../uploads/products', imageName);

        if (!existsSync(path))
            throw new BadRequestException(`No product found with image ${imageName}`);

        return path;
    }

}
