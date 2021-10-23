import { Injectable } from '@nestjs/common';
import { CreateSchedulerInput } from './dto/create-scheduler.input';
import { UpdateSchedulerInput } from './dto/update-scheduler.input';

@Injectable()
export class SchedulerService {
  create(createSchedulerInput: CreateSchedulerInput) {
    return 'This action adds a new scheduler';
  }

  findAll() {
    return `This action returns all scheduler`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scheduler`;
  }

  update(id: number, updateSchedulerInput: UpdateSchedulerInput) {
    return `This action updates a #${id} scheduler`;
  }

  remove(id: number) {
    return `This action removes a #${id} scheduler`;
  }
}
