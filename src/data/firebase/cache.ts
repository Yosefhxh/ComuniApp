import AsyncStorage from '@react-native-async-storage/async-storage';

type CacheEnvelope<T> = {
  value: T;
  updatedAt: number;
};

const cachePrefix = '@comuniapp/firebase';

const cacheKey = (key: string) => `${cachePrefix}:${key}`;

async function readEnvelope<T>(key: string): Promise<CacheEnvelope<T> | null> {
  const serializedValue = await AsyncStorage.getItem(cacheKey(key));

  if (!serializedValue) {
    return null;
  }

  try {
    return JSON.parse(serializedValue) as CacheEnvelope<T>;
  } catch {
    return null;
  }
}

async function writeEnvelope<T>(key: string, value: T): Promise<void> {
  const envelope: CacheEnvelope<T> = {
    value,
    updatedAt: Date.now(),
  };

  await AsyncStorage.setItem(cacheKey(key), JSON.stringify(envelope));
}

export async function readCachedValue<T>(key: string): Promise<T | null> {
  const envelope = await readEnvelope<T>(key);
  return envelope?.value ?? null;
}

export async function writeCache<T>(key: string, value: T): Promise<void> {
  await writeEnvelope(key, value);
}

export async function upsertCachedCollectionItem<T extends { id: string }>(key: string, value: T): Promise<void> {
  const items = (await readCachedValue<T[]>(key)) ?? [];
  const nextItems = [...items.filter((item) => item.id !== value.id), value];
  await writeEnvelope(key, nextItems);
}

export async function removeCachedCollectionItem(key: string, id: string): Promise<void> {
  const items = (await readCachedValue<Array<{ id: string }>>(key)) ?? [];
  const nextItems = items.filter((item) => item.id !== id);
  await writeEnvelope(key, nextItems);
}

export async function clearCache(key: string): Promise<void> {
  await AsyncStorage.removeItem(cacheKey(key));
}
