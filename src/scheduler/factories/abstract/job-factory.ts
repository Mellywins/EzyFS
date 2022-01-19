import {ProcessorType} from '../../../shared/enums/Processor-types.enum'
import { createCompressionJob } from '../concrete/create-compression-job'
export default function jobCreatorFactory(jobType:ProcessorType){
    switch(jobType){
        case(ProcessorType.COMPRESSION):
            return createCompressionJob
    }
}