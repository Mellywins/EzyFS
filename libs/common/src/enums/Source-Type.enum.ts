/* eslint-disable no-shadow */

import {registerEnumType} from '@nestjs/graphql';

export enum SourceTypeEnum {
  FILE,
  DIRECTORY,
}

registerEnumType(SourceTypeEnum, {
  name: 'SourceTypeEnum',
});
