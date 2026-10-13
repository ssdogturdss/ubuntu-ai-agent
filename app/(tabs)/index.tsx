import { View, Text } from 'react-native';

export default function Dashboard() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-950">
      <Text className="text-2xl font-bold text-zinc-900 dark:text-white">Ubuntu AI Agent</Text>
      <Text className="text-zinc-600 dark:text-zinc-400 mt-2">Autonomous server management ready</Text>
    </View>
  );
}