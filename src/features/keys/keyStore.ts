import { create } from 'zustand';
import { storage } from '@/lib/mmkv';
import * as Crypto from 'expo-crypto';

export type KeyType = 'promo' | 'paid' | 'api';
export type KeyStatus = 'active' | 'used' | 'expired' | 'revoked';

export interface AccessKey {
  id: string;
  value: string;
  type: KeyType;
  status: KeyStatus;
  createdAt: string;
  expiresAt?: string;
  maxUses: number;
  uses: number;
  metadata?: Record<string, string>;
}

interface KeyState {
  keys: AccessKey[];
  generateKey: (type: KeyType, options?: Partial<AccessKey>) => AccessKey;
  revokeKey: (id: string) => void;
  searchKeys: (query: string) => AccessKey[];
}

const generateSecureKey = async (prefix: string, length: number = 24): Promise<string> => {
  const randomBytes = await Crypto.getRandomBytesAsync(length);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = prefix + '-';
  for (let i = 0; i < length; i++) {
    key += chars[randomBytes[i] % chars.length];
  }
  return key;
};

export const useKeyStore = create<KeyState>((set, get) => ({
  keys: JSON.parse(storage.getString('keys') || '[]'),
  generateKey: async (type: KeyType, options = {}) => {
    const prefixes = { promo: 'PROMO', paid: 'PAID', api: 'API' };
    const value = await generateSecureKey(prefixes[type]);
    const newKey: AccessKey = {
      id: Date.now().toString(36),
      value,
      type,
      status: 'active',
      createdAt: new Date().toISOString(),
      maxUses: options.maxUses ?? 1,
      uses: 0,
      ...options,
    };
    const updated = [...get().keys, newKey];
    storage.set('keys', JSON.stringify(updated));
    set({ keys: updated });
    return newKey;
  },
  revokeKey: (id) => {
    const updated = get().keys.map(k => k.id === id ? { ...k, status: 'revoked' as KeyStatus } : k);
    storage.set('keys', JSON.stringify(updated));
    set({ keys: updated });
  },
  searchKeys: (query) => get().keys.filter(k => k.value.includes(query) || k.type.includes(query)),
}));