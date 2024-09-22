import { constants, privateDecrypt } from "crypto";
import * as base64 from "jsr:@std/encoding/base64";

const env = Deno.env.toObject()
//console.log(env);
const credentialsPrivateKey: string =
  env.DB_CREDENTIALS__PRIVATE_KEY!.replace(/\\n/g, "\n");

export const decrypt = (encryptedValue: string) => {
  if (!encryptedValue) {
    console.error("Missing encrypted value from database credentials");
    process.exit(3);
  }
  const privateKey = credentialsPrivateKey.replace(/\\n/g, "\n");

  let ret = ""
  const decoder = new TextDecoder()
  try {
    ret= decoder.decode(privateDecrypt(
      {
        key: privateKey,
        padding: constants.TREX_RSA_PKCS1_OAEP_SHA256_PADDING,
        oaepHash: "sha256",
      },
      base64.decodeBase64(encryptedValue)
  ));
  } catch(e) {
    console.log(e);
    throw new Error("decrypt failed");
  }
  return ret
};
