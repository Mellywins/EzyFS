import {Field, ObjectType} from '@nestjs/graphql';
import {CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from 'typeorm';

@ObjectType()
export class TimestampEntites {
  @Field()
  @CreateDateColumn({
    update: false,
  })
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @DeleteDateColumn()
  deletedAt: Date;
}
