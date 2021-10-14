/* eslint-disable @typescript-eslint/no-unused-vars */
import {ObjectType, Field, Int} from '@nestjs/graphql';
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from '../../user/entities/user.entity';
import {EmailTypeEnum} from './email-type.enum';
import {EmailBuilder} from './email.builder';
import {TimestampEntites} from '../../generics/timestamp.entity';

@ObjectType()
@Entity()
export class Email extends TimestampEntites implements EmailBuilder {
  @PrimaryGeneratedColumn()
  @Field((type) => Int, {nullable: true})
  id: number;

  @Column({type: 'timestamptz'})
  @Field()
  sentDate: Date;

  @Column()
  @Field((type) => EmailTypeEnum)
  emailType: EmailTypeEnum;

  // @ManyToOne(() => User, (user) => user.sentEmails)
  // @Field((type) => User)
  // sender: User;

  @Field()
  @Column({type: 'uuid'})
  token: string;

  @Field()
  @Column({type: 'uuid'})
  verificationToken: string;

  @Field((type) => Boolean, {nullable: true})
  @Column({type: 'boolean', default: false})
  isExpired: boolean;

  // setSender(user: User): Email {
  //   this.sender = user;
  //   return this;
  // }

  setDate(date: Date): Email {
    this.sentDate = date;
    return this;
  }

  setEmailType(emailType: EmailTypeEnum): Email {
    this.emailType = emailType;
    return this;
  }

  setToken(token: string) {
    this.token = token;
    return this;
  }

  setVerificationToken(token: string) {
    this.verificationToken = token;
    return this;
  }

  setExpired(expired: boolean) {
    this.isExpired = expired;
    return this;
  }
}
