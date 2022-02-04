import { registerEnumType } from "@nestjs/graphql";

export enum KeyEncodingTypeEnum{
    SPKI='spki',
    PKCS8='pkcs8'
}
registerEnumType(KeyEncodingTypeEnum,{
    name:'KeyEncodingTypeEnum'
})