import { Job, DoneCallback } from "bull";
import { CompressionJobPayload } from "src/scheduler/interfaces/CompressionJobPayload.interface";
import {basename,dirname} from 'path'
import {ExtractOptions, x} from 'tar'

export default function (job: Job<CompressionJobPayload>, cb: DoneCallback){
    const {sourcePath,outputPath}=job.data;
    console.log(`[${process.pid}] Attempting decompression delegated to job with UUID:  ${job.id}`)
    x({
        file:sourcePath,
        cwd:outputPath   
    },undefined,(err)=>{
        if(err){       
        console.error(err);
        cb(err,null);
        }
        cb(null,'success')
    })
}