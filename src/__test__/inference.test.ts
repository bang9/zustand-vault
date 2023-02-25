import { storeBuilder } from '../vault.store';
import { createVault } from '../vault.factory';

type Store = {
  counter: {
    value: number;
    increment(): void;
    decrement(): void;
  };
  test: {
    what: number;
    foo(): void;
    bar(): void;
  };
};

const store = storeBuilder<Store>()
  .put('counter', (set) => ({
    value: 1,
    increment: () => set((state) => ({ value: state.value + 1 })),
    decrement: () => set((state) => ({ value: state.value - 1 })),
  }))
  .put('test', (set) => ({
    what: 1,
    foo: () => set((state) => ({ what: state.what + 1 })),
    bar: () => set((state) => ({ what: state.what - 1 })),
  }))
  .get();

const vault = createVault(store);
vault.store('counter').setState({ value: 1 });
vault.store('counter').getState().value;
vault.store('test').getState().what;

vault.useStore('counter').value;
vault.useStore('test').what;
