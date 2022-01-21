import { registerEnumType } from "@nestjs/graphql";

export enum EncryptionAlgorithmEnum{
    RSA="rsa",
    DSA="dsa",
    ED25519="ed25519",
    X448="x448",
    X25519="x25519",
    EC="ec",
    ED448="ed448",
    RSAPSS="rsa-pss"
}
registerEnumType(EncryptionAlgorithmEnum,{
    name:'EncryptionAlgorithmEnum'
})