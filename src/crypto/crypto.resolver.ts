import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CryptoService } from './crypto.service';
import { Crypto } from './entities/crypto.entity';
import { CreateCryptoInput } from './dto/create-crypto.input';
import { UpdateCryptoInput } from './dto/update-crypto.input';

@Resolver(() => Crypto)
export class CryptoResolver {
  constructor(private readonly cryptoService: CryptoService) {}

  @Mutation(() => Crypto)
  createCrypto(@Args('createCryptoInput') createCryptoInput: CreateCryptoInput) {
    return this.cryptoService.create(createCryptoInput);
  }

  @Query(() => [Crypto], { name: 'crypto' })
  findAll() {
    return this.cryptoService.findAll();
  }

  @Query(() => Crypto, { name: 'crypto' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.cryptoService.findOne(id);
  }

  @Mutation(() => Crypto)
  updateCrypto(@Args('updateCryptoInput') updateCryptoInput: UpdateCryptoInput) {
    return this.cryptoService.update(updateCryptoInput.id, updateCryptoInput);
  }

  @Mutation(() => Crypto)
  removeCrypto(@Args('id', { type: () => Int }) id: number) {
    return this.cryptoService.remove(id);
  }
}
