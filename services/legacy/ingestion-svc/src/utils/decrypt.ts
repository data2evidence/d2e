import crypto from 'crypto';

export function decrypt_v1(file: Buffer, PHDP_DD_DECRYPTION_PRIVATE_KEY_V1: string): any {

    const aesBlockSize: number = 16; // aes_Blocksize or IV size
    const totalLength: number = file.length; // total_length
    const buff = file;
    let buffIndex = 3;

    const version = buff[0].toString();
    const keyLength = ((buff[2] << 24) >>> 16) + ((buff[1] << 24) >>> 24) // length_key
    const encryptedKey = buff.subarray(buffIndex, keyLength + buffIndex)
    buffIndex += keyLength
    let str;

    const key = crypto.privateDecrypt({
        oaepHash: 'sha256',
        key: PHDP_DD_DECRYPTION_PRIVATE_KEY_V1
    }, encryptedKey);

    if(version === '1') {

        const byte1 = buff[buffIndex++]
        const byte2 = buff[buffIndex++]
        const byte3 = buff[buffIndex++]
        const byte4 = buff[buffIndex++]
        const byte5 = buff[buffIndex++]
        const byte6 = buff[buffIndex++]
        const byte7 = buff[buffIndex++]
        const byte8 = buff[buffIndex++]
        const textLength = (byte8 << 56) + ((byte7 << 56) >>> 8) + ((byte6 << 56) >>> 16) + ((byte5 << 56) >>> 24) + 
            ((byte4 << 56) >>> 32) +((byte3 << 56) >>> 40) +((byte2 << 56) >>> 48) + ((byte1 << 56) >>> 56)

        const iv = buff.subarray(buffIndex, aesBlockSize + buffIndex)
        buffIndex += aesBlockSize
        const ciphertextLength = totalLength - version.length - 2 - keyLength - 8 - aesBlockSize
        const cipherText = buff.subarray(buffIndex, ciphertextLength + buffIndex)
        buffIndex += ciphertextLength;

        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decryptedText = decipher.update(cipherText, <any>'base64', 'utf8');
        decryptedText += decipher.final('utf8');

        str = decryptedText.substr(0, textLength);
    }
    else {

        const iv = buff.subarray(buffIndex, aesBlockSize + buffIndex)
        buffIndex += aesBlockSize;

        const byte1 = buff[buffIndex++]
        const byte2 = buff[buffIndex++]
        const byte3 = buff[buffIndex++]
        const byte4 = buff[buffIndex++]
        const byte5 = buff[buffIndex++]
        const byte6 = buff[buffIndex++]
        const byte7 = buff[buffIndex++]
        const byte8 = buff[buffIndex++]
        const textLength = (byte8 << 56) + ((byte7 << 56) >>> 8) + ((byte6 << 56) >>> 16) + ((byte5 << 56) >>> 24) + 
            ((byte4 << 56) >>> 32) +((byte3 << 56) >>> 40) +((byte2 << 56) >>> 48) + ((byte1 << 56) >>> 56)
    
        const cipherText = buff.subarray(buffIndex, textLength + buffIndex - 16)
        buffIndex += textLength - 16;
        const authTag = buff.subarray(buffIndex, 16+buffIndex)
        buffIndex += 16;

        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authTag);
        str = decipher.update(cipherText, <any>'base64', 'utf8');
        str += decipher.final('utf8');
    }
    
    return { text: str };
}

export function generateUUID(): string {
    return crypto.randomUUID();
}