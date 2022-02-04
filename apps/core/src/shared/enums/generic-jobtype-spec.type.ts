import {registerEnumType} from '@nestjs/graphql';

export enum GenericJobTypeSpec {
  PGP = 'PGP',
  HYBRID = 'HYBRID',
  TGZ = 'TGZ',
}
registerEnumType(GenericJobTypeSpec, {
  name: 'GenericJobTypeSpec',
});
