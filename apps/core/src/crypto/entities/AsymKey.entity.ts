import {ObjectType, Field, Int} from '@nestjs/graphql';
import {TimestampEntites} from '@ezyfs/common/entities/timestamp.entity';
import {User} from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  @OneToOne(() => User)
  @JoinColumn()
  @Field(() => User)
  owner: User;
  @Column({nullable: true})
  @Field()
  publicKeyEncoding: string;
}
