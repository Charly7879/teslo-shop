import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer, fileFilter } from './helpers';
import express from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) { }

  @Get('product/:imageName')
  findProductImage(
    @Res() res: express.Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticImageName(imageName);

    return res.sendFile(path);
  }

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

    const secureUrl = `${this.configService.get('HOST_API')}/uploads/products/${file.filename}`;

    return {
      fileName: secureUrl,
    }
  }

}
