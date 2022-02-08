import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  PartialType,
} from '@nestjs/graphql';
import {AsymKey} from '@ezyfs/repositories/entities';
import {CryptoService} from './crypto.service';
import {CreateKeyPairInput} from './dto/createKeyPair.input';
import {CreateKeyPairOutput} from './dto/createKeyPair.output';

@Resolver(() => AsymKey)
export class CryptoResolver {
  constructor(private readonly cryptoService: CryptoService) {}

  @Mutation(() => CreateKeyPairOutput)
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
