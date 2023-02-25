import { create as createStore } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand';

type StoreCreateParams<T> = {
  (
    set: (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean | undefined) => void,
    get: () => T,
  ): T;
};

export type GetVaultStore<T> = {
  [key in keyof T]: UseBoundStore<StoreApi<T[key]>>;
};

type ExtractStore<U, K extends keyof U> = U extends { [key in K]: infer S } ? S : never;

/**
 * @description
 * The storeBuilder function is a helper function provided by the zustand-vault library that simplifies the process of creating and managing Zustand stores.
 * It allows developers to create a custom store by providing an object of store hooks and their respective state and action objects.
 *
 * The storeBuilder function returns an object with two methods - put and get.
 * The put method allows developers to add a new store hook to the store builder by providing a name for the store and a function that creates the store.
 * The function should accept a set function to update the store's state, a get function to retrieve the store's current state, and return the initial state object.
 *
 * The get method returns the final store object, which contains all the defined store hooks.
 * The storeBuilder function is an expressive and concise way to define multiple Zustand stores with their respective state and action objects.
 * It simplifies the process of creating and managing Zustand stores in larger applications, making it easier to organize and maintain the state of the application.
 *
 * @example
 * ```
 * import { storeBuilder, GetVaultStore } from 'zustand-vault';
 *
 * export type VaultStore = GetVaultStore<{
 *   toast: { visible: boolean; show(): void; hide(): void; toggle(): void };
 * }>;
 *
 * const vaultStore = storeBuilder<VaultStore>()
 *   .put('toast', (set) => ({
 *     visible: true,
 *     show: () => set({ visible: true }),
 *     hide: () => set({ visible: false }),
 *     toggle: () => set((state) => ({ visible: !state.visible })),
 *   }))
 *   .get();
 * ```
 * */
export function storeBuilder<U, VS extends GetVaultStore<U> = GetVaultStore<U>, Name extends keyof U = keyof U>() {
  const vaultStore: Partial<VS> = {};

  return {
    put<K extends Name, Store extends StoreCreateParams<ExtractStore<U, K>>>(name: K, value: Store) {
      vaultStore[name] = createStore(value) as VS[K];
      return this;
    },
    get() {
      return vaultStore as VS;
    },
  };
}
