import {Resolver, Query, Args, Int} from '@nestjs/graphql';
import {EmailService} from './email.service';
import {Email} from '@ezyfs/repositories/entities';
// import {CreateEmailInput} from './dto/create-email.input';
// import {UpdateEmailInput} from './dto/update-email.input';

@Resolver(() => Email)
export class EmailResolver {
  constructor(private readonly emailService: EmailService) {}

  // @Mutation(() => Email)
  // createEmail(@Args('createEmailInput') createEmailInput: CreateEmailInput) {
  //   return this.emailService.create(createEmailInput);
  // }

  @Query(() => [Email], {name: 'email'})
  findAll(): Promise<Email[]> {
    return this.emailService.findAll();
  }

  @Query(() => Email, {name: 'emails'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.emailService.findOne(id);
  }

  // @Mutation(() => Email)
  // updateEmail(@Args('updateEmailInput') updateEmailInput: UpdateEmailInput) {
  //   return this.emailService.update(updateEmailInput.id, updateEmailInput);
  // }

  // @Mutation(() => Email)
  // removeEmail(@Args('id', { type: () => Int }) id: number) {
  //   return this.emailService.remove(id);
  // }
}
