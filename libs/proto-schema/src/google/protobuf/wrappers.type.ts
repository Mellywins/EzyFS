/* eslint-disable max-classes-per-file */
import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class NumericValue {
  @Field({nullable: false})
  value: number;
}
export class DoubleValue extends NumericValue {}
export class FloatValue extends NumericValue {}
export class Int64Value extends NumericValue {}
export class UInt64Value extends NumericValue {}
export class Int32Value extends NumericValue {}
export class UInt32Value extends NumericValue {}
@ObjectType()
export class BoolValue {
  @Field({nullable: false})
  value: boolean;
}
@ObjectType()
export class StringValue {
  @Field({nullable: false})
  value: string;
}
export class BytesValue extends NumericValue {}
