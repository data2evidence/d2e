import { constants, privateDecrypt } from "crypto";

const credentialsPrivateKey: string =
  process.env.DB_CREDENTIALS__PRIVATE_KEY!.replace(/\\n/g, "\n");

export const decrypt = (encryptedValue: string) => {
  if (!encryptedValue) {
    console.error("Missing encrypted value from database credentials");
    process.exit(3);
  }
  const privateKey = credentialsPrivateKey.replace(/\\n/g, "\n");
  return privateDecrypt(
    {
      key: privateKey,
      passphrase: process.env.DB_CREDENTIALS__PRIVATE_KEY_PASSPHRASE,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(encryptedValue, "base64")
  ).toString();
};
