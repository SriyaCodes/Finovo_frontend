import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Central API configuration.
 * Dynamically resolves to your local machine IP so you never have to hardcode it again.
 */
let LOCAL_IP = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';

// Get the Metro bundler IP address dynamically from Expo Constants
const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.hostUri;

if (hostUri) {
    // Usually looks like "192.168.1.110:8081"
    const parsedIp = hostUri.split(':')[0];

    // Ensure it's a real IP and not an ngrok tunnel string before using it
    if (parsedIp.match(/^[0-9.]+$/)) {
        LOCAL_IP = parsedIp;
    }
}

export const BASE_URL = `http://${LOCAL_IP}:8000/api`;
export const MEDIA_BASE_URL = `http://${LOCAL_IP}:8000`; // No trailing slash - Django provides /media/...

export default BASE_URL;
