import { Platform } from 'react-native';

/**
 * API Configuration (Production - EC2)
 */

const EC2_IP = "52.62.2.182";   // 🔥 your EC2 public IP

export const BASE_URL = `http://${EC2_IP}:8000/api`;
export const MEDIA_BASE_URL = `http://${EC2_IP}:8000`;
console.log("BASE_URL:", BASE_URL);
console.log("API URL:", BASE_URL);
console.log("MEDIA URL:", MEDIA_BASE_URL);

export default BASE_URL;