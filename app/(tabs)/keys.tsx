import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { FlashList } from '@shopify/flash-list';
import { useKeyStore, AccessKey, KeyType } from '@/features/keys/keyStore';
import { Ionicons } from '@expo/vector-icons';

const KEY_TYPES: { label: string; type: KeyType; color: string }[] = [
  { label: 'Promo', type: 'promo', color: '#22c55e' },
  { label: 'Paid', type: 'paid', color: '#3b82f6' },
  { label: 'API', type: 'api', color: '#a855f7' },
];

export default function KeysScreen() {
  const { keys, generateKey, revokeKey, searchKeys } = useKeyStore();
  const [selectedType, setSelectedType] = useState<KeyType>('promo');
  const [search, setSearch] = useState('');
  const [maxUses, setMaxUses] = useState('1');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredKeys = search ? searchKeys(search) : keys;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateKey(selectedType, {
        maxUses: parseInt(maxUses) || 1,
      });
    } catch (e) {
      Alert.alert('Error', 'Failed to generate key');
    }
    setIsGenerating(false);
  };

  const copyToClipboard = async (value: string) => {
    await Clipboard.setStringAsync(value);
    Alert.alert('Copied', 'Key copied to clipboard');
  };

  const shareKey = async (key: AccessKey) => {
    await Share.share({ message: `${key.type.toUpperCase()} Key: ${key.value}` });
  };

  const renderKey = ({ item }: { item: AccessKey }) => {
    const typeInfo = KEY_TYPES.find(t => t.type === item.type)!;
    const isActive = item.status === 'active';

    return (
      <View className="bg-zinc-900 rounded-2xl p-4 mb-3 border border-zinc-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View style={{ backgroundColor: typeInfo.color }} className="px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">{typeInfo.label}</Text>
            </View>
            <Text className="ml-3 text-zinc-400 text-xs">{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
          <Text className={`text-xs font-medium ${isActive ? 'text-emerald-400' : 'text-red-400'}`}>
            {item.status.toUpperCase()}
          </Text>
        </View>

        <Text className="text-white font-mono text-sm mt-3 tracking-wider">{item.value}</Text>

        <View className="flex-row mt-4 justify-between items-center">
          <Text className="text-zinc-500 text-xs">
            Uses: {item.uses}/{item.maxUses}
          </Text>
          <View className="flex-row gap-2">
            <Pressable onPress={() => copyToClipboard(item.value)} className="p-2">
              <Ionicons name="copy-outline" size={18} color="#a1a1aa" />
            </Pressable>
            <Pressable onPress={() => shareKey(item)} className="p-2">
              <Ionicons name="share-outline" size={18} color="#a1a1aa" />
            </Pressable>
            {isActive && (
              <Pressable onPress={() => revokeKey(item.id)} className="p-2">
                <Ionicons name="ban-outline" size={18} color="#ef4444" />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-zinc-950 px-4 pt-12">
      <Text className="text-white text-3xl font-semibold mb-1">Key Generator</Text>
      <Text className="text-zinc-400 mb-6">Cryptographically secure access keys</Text>

      {/* Type Selector */}
      <View className="flex-row mb-4">
        {KEY_TYPES.map(t => (
          <Pressable
            key={t.type}
            onPress={() => setSelectedType(t.type)}
            className={`flex-1 py-3 rounded-xl mr-2 items-center ${selectedType === t.type ? 'bg-white' : 'bg-zinc-900'}`}
          >
            <Text className={selectedType === t.type ? 'text-zinc-950 font-semibold' : 'text-white'}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Options */}
      <View className="flex-row items-center mb-6">
        <TextInput
          value={maxUses}
          onChangeText={setMaxUses}
          keyboardType="numeric"
          placeholder="Max uses"
          placeholderTextColor="#52525b"
          className="flex-1 bg-zinc-900 text-white px-4 py-3 rounded-xl text-center"
        />
        <Pressable
          onPress={handleGenerate}
          disabled={isGenerating}
          className="ml-3 bg-white px-8 py-3 rounded-xl active:opacity-80"
        >
          <Text className="font-semibold text-zinc-950">
            {isGenerating ? 'Generating...' : 'Generate'}
          </Text>
        </Pressable>
      </View>

      {/* Search */}
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search keys..."
        placeholderTextColor="#52525b"
        className="bg-zinc-900 text-white px-4 py-3 rounded-2xl mb-4"
      />

      {/* List */}
      <FlashList
        data={filteredKeys}
        renderItem={renderKey}
        estimatedItemSize={120}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-16">
            <Ionicons name="key-outline" size={48} color="#3f3f46" />
            <Text className="text-zinc-500 mt-4">No keys yet</Text>
          </View>
        }
      />
    </View>
  );
}
