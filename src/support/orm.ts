import { createId } from './createId';
import { getStore } from './kvstore';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type Model<T extends { id: string }> = {
  insert: (item: Expand<Omit<T, 'id'>>) => Promise<T>;
  update: (id: string, updates: Partial<T>) => Promise<T | null>;
  delete: (id: string) => Promise<boolean>;
  getById: (id: string) => Promise<T | null>;
  getAll: () => Promise<Array<T>>;
  findWhere: (fn: (item: T) => boolean) => Promise<Array<T>>;
};

export function Model<T extends { id: string }>() {
  return (name: string) => createModel<T>(name);
}

export function fromSchema<T extends Record<string, { id: string }>>(schema: {
  [K in keyof T]: (name: string) => Model<T[K]>;
}) {
  const db: Record<string, any> = {};
  for (const [name, fn] of Object.entries(schema)) {
    db[name] = fn(name);
  }
  return db as { [K in keyof T]: Model<T[K]> };
}

function createModel<T extends { id: string }>(name: string): Model<T> {
  const store = getStore();
  const self = {
    insert: async (item: Expand<Omit<T, 'id'>>): Promise<T> => {
      const id = createId();
      const record: T = { id, ...item } as any;
      const idList = toArray(await store.get(name));
      idList.push(id);
      await store.set(name, idList);
      await store.set(toKey(name, id), record);
      return record;
    },
    update: async (id: string, updates: Partial<T>): Promise<T | null> => {
      const key = toKey(name, id);
      const record: T | null = (await store.get(key)) as any;
      if (record) {
        const newRecord = { ...record };
        for (const [key, value] of Object.entries(updates)) {
          if (key !== 'id' && value !== undefined) {
            newRecord[key as keyof T] = value;
          }
        }
        await store.set(key, newRecord);
        return newRecord;
      }
      return null;
    },
    delete: async (id: string): Promise<boolean> => {
      const idList = toArray(await store.get(name));
      await store.set(
        name,
        idList.filter((n) => n !== id),
      );
      return await store.del(toKey(name, id));
    },
    getById: async (id: string): Promise<T | null> => {
      const record = await store.get(toKey(name, id));
      return record as any;
    },
    getAll: async (): Promise<Array<T>> => {
      const idList = toArray(await store.get(name));
      const results: Array<T> = [];
      for (const id of idList) {
        const record = await store.get(toKey(name, id));
        results.push(record as any);
      }
      return results;
    },
    findWhere: async (fn: (item: T) => boolean): Promise<Array<T>> => {
      const items = await self.getAll();
      return items.filter(fn);
    },
  };
  return self;
}

function toArray(input: unknown): Array<string> {
  return Array.isArray(input) ? input : [];
}

function toKey(name: string, id: string) {
  return `${name}/${id}`;
}
