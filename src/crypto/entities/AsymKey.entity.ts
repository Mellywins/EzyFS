import {ObjectType, Field, Int} from '@nestjs/graphql';
import {User} from 'src/user/entities/user.entity';
import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from 'typeorm';

@ObjectType()
@Entity()
export class AsymKey {
  @Field()
  @PrimaryGeneratedColumn()
  keyId: number;
  @Column()
  @Field()
  publicKey: string;
  @Column()
  @Field()
  privateKey: string;

  // @OneToOne(() => User)
  // @Field(() => User)
  // owner: User;
}
