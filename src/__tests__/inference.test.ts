import { storeBuilder } from '../vault.store';
import { createVault } from '../vault.factory';

type Store = {
  toast: {
    visible: boolean;
    toggle(): void;
  };
  counter: {
    value: number;
    increment(): void;
    decrement(): void;
  };
  labels: {
    counterLabel(): string;
    toastLabel(): string;
  };
};

const store = storeBuilder<Store>()
  .set('counter', ({ set }) => ({
    value: 0,
    increment: () => set((state) => ({ value: state.value + 1 })),
    decrement: () => set((state) => ({ value: state.value - 1 })),
  }))
  .set('toast', ({ set }) => ({
    visible: false,
    toggle: () => set((state) => ({ visible: !state.visible })),
  }))
  .set('labels', ({ vaultStore }) => ({
    counterLabel: () => `counter: ${vaultStore.counter.getState().value}`,
    toastLabel: () => `toast :${vaultStore.toast.getState().visible}`,
  }))
  .get();

const vault = createVault(store);
vault.store('counter').setState({ value: 1 });
vault.store('counter').getState().value;
vault.store('toast').getState().visible;

vault.useStore('counter').value;
vault.useStore('toast').visible;
