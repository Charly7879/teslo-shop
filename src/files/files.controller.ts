import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer, fileFilter } from './helpers';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    //limits: {fieldSize: 1024}
    storage: diskStorage({
      destination: './uploads/products', // Directorio donde alojar imagen
      filename: fileNamer, // Renombrar archivo
    })
  }))
  uploadFile(
    @UploadedFile() file: Express.Multer.File
  ) {

    if (!file)
      throw new BadRequestException('Make sure that the file is an image');

    return {
      fileName: file.fieldname,
    }
  }

}
