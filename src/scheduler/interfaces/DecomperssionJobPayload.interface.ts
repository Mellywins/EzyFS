import { User } from "src/user/entities/user.entity";

export interface DecompressionJobPayload{
    sourcePath:string;
    outputPath:string;
    ownerId:number;
}