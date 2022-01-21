import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {CryptoService} from './crypto.service';
import {AsymKey} from './entities/AsymKey.entity';
import {CreateKeyPairInput} from './dto/createKeyPair.input';

@Resolver(() => AsymKey)
export class CryptoResolver {
  constructor(private readonly cryptoService: CryptoService) {}

  @Mutation(() => AsymKey)
  createKeyPair(
    @Args('createKeyPairInput') createCryptoInput: CreateKeyPairInput,
  ) {
    return this.cryptoService.createKeyPair(createCryptoInput);
  }

  // @Query(() => [Crypto], { name: 'crypto' })
  // findAll() {
  //   return this.cryptoService.findAll();
  // }

  // @Query(() => Crypto, { name: 'crypto' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.cryptoService.findOne(id);
  // }

  // @Mutation(() => Crypto)
  // updateCrypto(@Args('updateCryptoInput') updateCryptoInput: UpdateCryptoInput) {
  //   return this.cryptoService.update(updateCryptoInput.id, updateCryptoInput);
  // }

  // @Mutation(() => Crypto)
  // removeCrypto(@Args('id', { type: () => Int }) id: number) {
  //   return this.cryptoService.remove(id);
  // }
}
