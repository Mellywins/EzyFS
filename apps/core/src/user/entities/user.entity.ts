/* eslint-disable @typescript-eslint/no-unused-vars */
import {ObjectType, Field, Int, HideField} from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import {IsEmail, IsPhoneNumber} from 'class-validator';
import * as bcrypt from 'bcrypt';
import {TimestampEntites} from '../../generics/timestamp.entity';
// eslint-disable-next-line import/no-cycle
import {Email} from '../../email/entities/email.entity';
import {Gender} from '@ezyfs/common/enums/gender.enum';
import {UserRoleEnum} from '@ezyfs/common/enums/user-role.enum';
import {QueuedJob} from '../../scheduler/entities/Job.entity';

@Entity()
@ObjectType()
export class User extends TimestampEntites {
  @PrimaryGeneratedColumn()
  @Field(() => Int, {nullable: true})
  id: number;

  @Column({unique: true})
  @Field()
  username: string;

  @Column({nullable: true})
  @Field({nullable: true})
  firstname: string;

  @Column({nullable: true})
  @Field({nullable: true})
  lastname: string;

  @Field()
  @Column({default: false})
  completedSignUp: boolean;

  @Column({nullable: true})
  @Field({nullable: true})
  age: number;

  @Column({unique: true})
  @Field()
  @IsEmail()
  email: string;

  @Column()
  @HideField()
  salt: string;

  @Column({nullable: true})
  @Field({nullable: true})
  localization: string;

  @Column({nullable: true})
  @Field({nullable: true})
  @IsPhoneNumber()
  telNumber: string;

  @Column()
  @HideField()
  password: string;

  @Column({default: false})
  @Field()
  isConfirmed: boolean;

  @OneToMany(() => Email, (email) => email.sender)
  @Field((type) => [Email], {nullable: true})
  sentEmails: [Email];

  @OneToMany(() => QueuedJob, (queuedJob) => queuedJob.owner)
  @Field((type) => [User], {nullable: true})
  Jobs: [QueuedJob];

  @Column({unique: true})
  @Field()
  lowerCasedUsername: string;

  @Column({nullable: true})
  @Field((type) => Gender, {nullable: true})
  gender: Gender;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: [UserRoleEnum.USER],
    array: true,
    nullable: true,
  })
  @Field((type) => [UserRoleEnum])
  roles: string[];

  @BeforeInsert()
  async hashPassword() {
    this.salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, this.salt);
  }
}
