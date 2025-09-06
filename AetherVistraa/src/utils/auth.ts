import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { AuthProvider, User } from '../types';

// Register for the authentication callback
WebBrowser.maybeCompleteAuthSession();

// Google OAuth configuration
const googleConfig = {
  clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with actual client ID in production
  redirectUri: AuthSession.makeRedirectUri(),
  scopes: ['profile', 'email'],
};

/**
 * Sign in with Google
 * @returns Promise that resolves to User object or null if authentication failed
 */
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');
    
    const request = new AuthSession.AuthRequest({
      clientId: googleConfig.clientId,
      redirectUri: googleConfig.redirectUri,
      scopes: googleConfig.scopes,
    });

    const result = await request.promptAsync(discovery);

    if (result.type === 'success') {
      // Get user info using the access token
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${result.authentication?.accessToken}` },
        }
      );

      const userInfo = await userInfoResponse.json();

      return {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        photoUrl: userInfo.picture,
      };
    }

    return null;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return null;
  }
};

/**
 * Sign in with WhatsApp (placeholder - actual implementation would require WhatsApp Business API)
 * @returns Promise that resolves to User object or null if authentication failed
 */
export const signInWithWhatsApp = async (): Promise<User | null> => {
  // This is a placeholder. In a real app, you would integrate with WhatsApp Business API
  // or use a third-party service that provides WhatsApp authentication
  console.warn('WhatsApp authentication not implemented yet');
  return null;
};

/**
 * Sign in with the specified provider
 * @param provider Authentication provider (google or whatsapp)
 * @returns Promise that resolves to User object or null if authentication failed
 */
export const signIn = async (provider: AuthProvider): Promise<User | null> => {
  switch (provider) {
    case 'google':
      return await signInWithGoogle();
    case 'whatsapp':
      return await signInWithWhatsApp();
    default:
      return null;
  }
};