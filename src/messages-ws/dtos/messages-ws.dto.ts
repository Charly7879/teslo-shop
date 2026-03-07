import { IsString, MinLength } from "class-validator";

export class MessagesWsDto {
    @IsString()
    @MinLength(1)
    message: string;
}