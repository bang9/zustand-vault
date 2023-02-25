import { GetVaultStore } from './vault.store';

/**
 * @description
 * The createVault function simplifies the process of accessing and managing the state of the application's stores by providing a central access point for all the stores.
 * It makes it easier to maintain the state of the application and provides a clean and concise way to access the state and actions of each store hook.
 *
 * The createVault function accepts a generic type T that extends the GetVaultStore type.
 * GetVaultStore is a helper type that maps the defined store hooks to their respective state and action objects.
 *
 * The createVault function returns an object with two methods - useStore and store.
 *
 * The useStore method is a hook that returns the state and actions of a specified store hook.
 * It accepts the name of the store hook as its argument and returns the current state and actions of the store hook.
 *
 * The store method returns the Zustand store object associated with the specified store hook.
 * It accepts the name of the store hook as its argument and returns the subscribe, setState, getState, and destroy methods associated with the store hook.
 *
 * @example
 * ```
 * import { createVault, storeBuilder, GetVaultStore } from 'zustand-vault';
 *
 * export type MyStore = GetVaultStore<{
 *   toast: { visible: boolean; show(): void; hide(): void; toggle(): void };
 * }>;
 *
 * const vaultStore = storeBuilder<MyStore>()
 *   .put('toast', (set) => ({
 *     visible: true,
 *     show: () => set({ visible: true }),
 *     hide: () => set({ visible: false }),
 *     toggle: () => set((state) => ({ visible: !state.visible })),
 *   }))
 *   .get();
 *
 * const vault = createVault(vaultStore);
 *
 * function App() {
 *   const { visible, toggle } = vault.useStore('toast');
 *
 *   useEffect(() => {
 *     return vault.store('toast').subscribe((state) => {
 *       console.log('state changed:', state.visible);
 *       console.log('Vault.getState():', vault.store('toast').getState().visible);
 *     });
 *   }, []);
 *
 *   return (
 *     <div>
 *         <p>{`visible: ${visible}`}</p>
 *         <button onClick={toggle}>{'Click}</button>
 *     </div>
 *   )
 * ```
 * */
export const createVault = <T extends GetVaultStore<U>, U extends T extends GetVaultStore<infer X> ? X : never>(
  vaultStore: T,
) => {
  return {
    useStore: <K extends keyof U>(name: K): U[K] => {
      const storeHook = vaultStore[name];
      return storeHook() as U[K];
    },
    store: <K extends keyof T>(name: K): Pick<T[K], 'subscribe' | 'setState' | 'getState' | 'destroy'> => {
      return vaultStore[name];
    },
  };
};
