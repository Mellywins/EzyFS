import { BadRequestException } from '@nestjs/common';
import {ProcessorType} from '../../../shared/enums/Processor-types.enum'
import { createCompressionJob } from '../concrete/create-compression-job'
import { createDecompressionJob } from '../concrete/create-decompression-job';
import { createDecryptionJob } from '../concrete/create-decryption-job';
import { createEncryptionJob } from '../concrete/create-encryption-job';
export default function jobCreatorFactory(jobType:ProcessorType){
    switch(jobType){
        case(ProcessorType.COMPRESSION):
            return createCompressionJob;
        case(ProcessorType.DECOMPRESSION):
            return createDecompressionJob;
        case(ProcessorType.ENCRYPTION):
            return createEncryptionJob;
        case(ProcessorType.DECRYPTION):
            return createDecryptionJob;
        default:
            throw new BadRequestException('Wrong Job Type introduced');
    }
}