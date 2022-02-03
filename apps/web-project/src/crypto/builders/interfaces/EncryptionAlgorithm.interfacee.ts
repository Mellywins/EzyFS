export interface EncryptionAlgorithm {
  algo:
    | 'rsa'
    | 'dsa'
    | 'ed25519'
    | 'x448'
    | 'x25519'
    | 'ec'
    | 'ed448'
    | 'rsa-pss';
}
