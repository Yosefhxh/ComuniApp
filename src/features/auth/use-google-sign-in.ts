import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

import { googleAuthEnv } from '@/config/env';
import { signInWithGoogle } from '@/services/firebase';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleSignIn() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: googleAuthEnv.expoClientId,
    iosClientId: googleAuthEnv.iosClientId,
    androidClientId: googleAuthEnv.androidClientId,
    webClientId: googleAuthEnv.webClientId,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response?.type !== 'success') {
      return;
    }

    const idToken = response.authentication?.idToken ?? response.params.id_token;
    const accessToken = response.authentication?.accessToken ?? response.params.access_token;

    if (!idToken) {
      return;
    }

    void signInWithGoogle({ idToken, accessToken });
  }, [response]);

  return {
    request,
    response,
    promptAsync,
    ready: Boolean(request),
  };
}
