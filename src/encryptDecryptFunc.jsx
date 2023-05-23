import CryptoJS from "crypto-js"
import { sha1 } from 'crypto-hash'

export const encryptData = (data) => {
    const cipherText = CryptoJS.AES.encrypt(JSON.stringify(data), 'U2FsdGVkX18K3fwQ7Bl5z7hT8/in6OAwtwpDnqA3mm4=').toString()
    return cipherText
}

export const decryptData = (cipherText) => {
    const byte = CryptoJS.AES.decrypt(cipherText, 'U2FsdGVkX18K3fwQ7Bl5z7hT8/in6OAwtwpDnqA3mm4=')
    const data = JSON.parse(byte.toString(CryptoJS.enc.Utf8))
    return data
}

export const generateDocID = async(senderUID, receiverUID) => {
    const createDocId = senderUID + receiverUID
    const chatDocId = await sha1(createDocId)
    return chatDocId
}