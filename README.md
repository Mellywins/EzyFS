# EzyFS
EzyFS( Easy File System ) is an application that facilitates File system operations, making them accessible to non technical users.

## Multi-threadded? YES!
Compression And encryption come in really handy, but they also consume alot of computation power when used on large files. This may lead to performance issues in NodeJs APPs. NodeJs is a single threaded engine. So to make use of multiple CPUs cores, EzyFS introduced Parallel Processors.

### How it works:
![Image](under_the_hood.png)

## Supported Processors

* Compression/Decompression: `.tgz`
* Encryption/Decryption: Coming soon (Will support multiple encoding types and ciphers)