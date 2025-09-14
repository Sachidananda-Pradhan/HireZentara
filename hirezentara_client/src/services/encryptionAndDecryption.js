import axios from 'axios'

const BASE_URL = 'http://localhost:8080/hirezentara/api/v1/secure'
const HEADERS = {
  'Content-Type': 'application/json',
  // Add Cookie header if needed dynamically
}

/**
 * Encrypts a payload using the backend encryption API
 * @param {Object} payload - The plain object to encrypt
 * @returns {Promise<string>} - Encrypted string
 */
export const encryptPayload = async (payload) => {
  try {
     const jsonString   = JSON.stringify(payload)
     console.log("jsonString is ",jsonString); 
    const res = await axios.post(
      `${BASE_URL}/encryptRequest`,
      { encryptedRequestData: jsonString },
      { headers: HEADERS }
    )
        console.log("Full encryption response:", res.data)
    const encrypted = res.data
    return encrypted
  } catch (error) {
    console.error('Encryption failed:', error)
    throw error
  }
}

/**
 * Decrypts an encrypted response using the backend decryption API
 * @param {string} encryptedResponseData - Encrypted string from backend
 * @returns {Promise<Object>} - Decrypted object
 */
export const decryptPayload = async (encryptedResponseData) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/decryptRequest`,
      { encryptedResponseData },
      { headers: HEADERS }
    )
    return res.data
  } catch (error) {
    console.error('Decryption failed:', error)
    throw error
  }
}