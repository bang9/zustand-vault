# zustand-vault

zustand-vault is a helper library built on top of zustand for creating and accessing multiple stores in an application.

It provides a central access point for all the stores and simplifies the state management process.

The library is designed to work with TypeScript and provides a clean API for accessing and managing state.

## Installation

To use 'zustand-vault', you need to install it first. You can install it via npm or yarn. Here are the commands for both:

`npm install zustand zustand-vault`

`yarn add zustand zustand-vault`

## Getting started

To use 'zustand-vault', you need to create a store first. You can create a store by using the `storeBuilder` function.

Here's an example:

```ts
import { storeBuilder } from 'zustand-vault';

type VaultStore = {
  counter: {
    counter: number;
    increment(): void;
    decrement(): void;
  };
};

const store = storeBuilder<VaultStore>()
  .put('counter', (set) => ({
    counter: 0,
    increment: () => set((state) => ({ counter: state.counter + 1 })),
    decrement: () => set((state) => ({ counter: state.counter - 1 })),
  }))
  .get();
```

In this example, we create a store with a counter property that has an initial value of 0 and two methods to increment and decrement the counter.

To use the store, you can create a `Vault` instance by using the `createVault` function and pass the store to it.

Here's an example:

```ts
import { createVault } from 'zustand-vault';

const vault = createVault(store);
```

Now, you can use the `useStore` method of the `Vault` instance to get the state and methods of the store.

Here's an example:

```tsx
import { createVault } from 'zustand-vault';

const vault = createVault(store);

function MyComponent() {
  const { counter, increment, decrement } = vault.useStore('counter');

  return (
    <div>
      <p>Counter: {counter}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}
```

## Example code

Here's an example code that uses 'zustand-vault' to create a store with multiple properties:

```tsx
import { createVault, storeBuilder } from 'zustand-vault';

type VaultStore = {
  counter: {
    counter: number;
    increment(): void;
    decrement(): void;
  };
  toast: {
    visible: boolean;
    show(): void;
    hide(): void;
    toggle(): void;
  };
};

const store = storeBuilder<VaultStore>()
  .put('counter', (set) => ({
    counter: 0,
    increment: () => set((state) => ({ counter: state.counter + 1 })),
    decrement: () => set((state) => ({ counter: state.counter - 1 })),
  }))
  .put('toast', (set) => ({
    visible: false,
    show: () => set({ visible: true }),
    hide: () => set({ visible: false }),
    toggle: () => set((state) => ({ visible: !state.visible })),
  }))
  .get();

const vault = createVault(store);

function MyComponent() {
  const { counter, increment, decrement } = vault.useStore('counter');
  const { visible, toggle } = vault.useStore('toast');

  useEffect(() => {
    console.log('getState():', vault.store('toast').getState().visible);

    return vault.store('toast').subscribe((state) => {
      console.log('state changed:', state.visible);
    });
  }, []);

  return (
    <div>
      <p>Counter: {counter}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>

      <p>Toast: {visible ? 'Visible' : 'Hidden'}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}
```
