import React, { useState } from 'react';
import { View, Text, Pressable, Alert, Linking } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

const CLIENT_ID = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID || 'YOUR_CLIENT_ID';

export default function GitHubScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    SecureStore.getItemAsync('github_token').then(setToken);
  }, []);

  const startDeviceFlow = async () => {
    if (!CLIENT_ID || CLIENT_ID === 'YOUR_CLIENT_ID') {
      Alert.alert('Setup Required', 'Add EXPO_PUBLIC_GITHUB_CLIENT_ID to .env');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://github.com/login/device/code', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: CLIENT_ID, scope: 'repo' }),
      });
      const data = await res.json();
      if (data.user_code) {
        Alert.alert(
          'GitHub Device Flow',
          `Go to github.com/login/device and enter: ${data.user_code}`,
          [
            { text: 'Open Browser', onPress: () => Linking.openURL(data.verification_uri) },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        // Poll for token (simplified for production demo)
        setTimeout(async () => {
          const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: JSON.stringify({ client_id: CLIENT_ID, device_code: data.device_code, grant_type: 'urn:ietf:params:oauth:grant-type:device_code' }),
          });
          const tokenData = await tokenRes.json();
          if (tokenData.access_token) {
            await SecureStore.setItemAsync('github_token', tokenData.access_token);
            setToken(tokenData.access_token);
            Alert.alert('Success', 'GitHub connected');
          }
        }, 15000);
      }
    } catch (e) {
      Alert.alert('Error', 'Device flow failed');
    }
    setLoading(false);
  };

  const disconnect = async () => {
    await SecureStore.deleteItemAsync('github_token');
    setToken(null);
  };

  return (
    <View className="flex-1 bg-zinc-950 px-6 pt-16">
      <Text className="text-white text-3xl font-semibold mb-2">GitHub</Text>
      <Text className="text-zinc-400 mb-10">Connect to manage repositories and issues</Text>

      {!token ? (
        <Pressable
          onPress={startDeviceFlow}
          disabled={loading}
          className="bg-white py-4 rounded-2xl items-center active:opacity-80"
        >
          <Text className="font-semibold text-zinc-950 text-lg">
            {loading ? 'Connecting...' : 'Connect with GitHub'}
          </Text>
        </Pressable>
      ) : (
        <View>
          <View className="bg-emerald-900/30 border border-emerald-800 rounded-2xl p-4 mb-6">
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={24} color="#4ade80" />
              <Text className="ml-3 text-emerald-400 font-medium">Connected to GitHub</Text>
            </View>
          </View>

          <Pressable onPress={disconnect} className="bg-zinc-900 py-4 rounded-2xl items-center">
            <Text className="text-red-400">Disconnect</Text>
          </Pressable>
        </View>
      )}

      <Text className="text-zinc-500 text-xs mt-auto mb-8 text-center">
        Tokens are stored securely in device keychain
      </Text>
    </View>
  );
}
