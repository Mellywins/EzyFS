import { Injectable } from '@nestjs/common';
import { CreateCryptoInput } from './dto/create-crypto.input';
import { UpdateCryptoInput } from './dto/update-crypto.input';

@Injectable()
export class CryptoService {
  create(createCryptoInput: CreateCryptoInput) {
    return 'This action adds a new crypto';
  }

  findAll() {
    return `This action returns all crypto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} crypto`;
  }

  update(id: number, updateCryptoInput: UpdateCryptoInput) {
    return `This action updates a #${id} crypto`;
  }

  remove(id: number) {
    return `This action removes a #${id} crypto`;
  }
}
