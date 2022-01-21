import {ObjectType, Field, Int} from '@nestjs/graphql';
import {TimestampEntites} from 'src/generics/timestamp.entity';
import {User} from 'src/user/entities/user.entity';
import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from 'typeorm';

@ObjectType()
@Entity()
export class AsymKey extends TimestampEntites {
  @Field()
  @PrimaryGeneratedColumn()
  keyId: number;
  @Column()
  @Field()
  publicKey: string;
  // @Column()
  // @Field()
  // privateKey: string;

  @Column()
  @Field()
  fingerprint: string;
  @OneToOne(() => User)
  @Field(() => User)
  owner: User;
}
