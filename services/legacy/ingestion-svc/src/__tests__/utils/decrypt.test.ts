import { decrypt_v1 } from '../../utils/decrypt'
import * as config from '../../utils/config'

import { mock_decrypt } from '../data/utils/mock_decrypt'

describe('TEST decrypt.ts', () => {
  test('Test decryption of encrypted donations from PHDP', () => {
    // Prepare buffer for decrypt function
    let buff = Buffer.from(mock_decrypt.encryptedText, 'base64')

    const PHDP_DD_DECRYPTION_PRIVATE_KEYS: any = config.getProperties().PHDP_DD_DECRYPTION_PRIVATE_KEYS
    let text: any
    for (let i in PHDP_DD_DECRYPTION_PRIVATE_KEYS) {
      let decryptedText = decrypt_v1(buff, PHDP_DD_DECRYPTION_PRIVATE_KEYS[i])
      if (decryptedText) {
        text = decryptedText.text
        break
      }
    }
    expect(text).toEqual(mock_decrypt.expectedDecryptedText)
  }, 10000)
})
