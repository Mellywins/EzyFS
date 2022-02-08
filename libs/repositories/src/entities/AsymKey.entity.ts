import {ObjectType, Field} from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {TimestampEntites} from './base/timestamp.entity';
import {User} from './user.entity';

@ObjectType()
@Entity()
export class AsymKey extends TimestampEntites {
  @Field()
  @PrimaryGeneratedColumn()
  keyId: number;

  @Column()
  @Field()
  publicKey: string;

  @Column()
  @Field()
  fingerprint: string;

  @OneToOne((_type) => User)
  @JoinColumn()
  @Field(() => User)
  owner: User;

  @Column({nullable: true})
  @Field()
  publicKeyEncoding: string;
}
