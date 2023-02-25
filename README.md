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
  .set('counter', ({ set }) => ({
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
    toggle(): void;
  };
  labels: {
    counterLabel(): string;
    toastLabel(): string;
  };
};

const store = storeBuilder<VaultStore>()
  .set('counter', ({ set }) => ({
    counter: 0,
    increment: () => set((state) => ({ counter: state.counter + 1 })),
    decrement: () => set((state) => ({ counter: state.counter - 1 })),
  }))
  .set('toast', ({ set }) => ({
    visible: false,
    toggle: () => set((state) => ({ visible: !state.visible })),
  }))
  .set('labels', ({ vaultStore }) => ({
    counterLabel: () => `counter: ${vaultStore.counter.getState().value}`,
    toastLabel: () => `toast: ${vaultStore.toast.getState().visible}`,
  }))
  .get();

const vault = createVault(store);

function MyComponent() {
  const { increment, decrement } = vault.useStore('counter');
  const { visible, toggle } = vault.useStore('toast');
  const { counterLabel } = vault.useStore('labels');

  useEffect(() => {
    console.log('getState():', vault.store('toast').getState().visible);

    return vault.store('toast').subscribe((state) => {
      console.log('state changed:', state.visible);
    });
  }, []);

  return (
    <div>
      <p>{counterLabel()}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>

      <p>Toast: {visible ? 'Visible' : 'Hidden'}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}
```

## Advanced Usage

The `.set()` function in `storeBuilder` allows you to not only create stores, but also lazily access other stores that have been added to the builder.
This can be useful in scenarios where you have interdependent stores or where one store needs to access data from another.

For example, let's say you have two stores: `userStore` and `postStore`.
The `postStore` needs to access data from the `userStore` to get the user's name when displaying a post.
With the `.set()` function and the `vaultStore` parameter, you can create the `postStore` with access to the `userStore` like so:

```ts
const store = storeBuilder()
  .set('user', ({ set }) => ({
    name: 'John Doe',
    setName: (name: string) => set(() => ({ name })),
  }))
  .set('post', ({ vaultStore }) => ({
    title: 'My First Post',
    get author() {
      return vaultStore.user.getState().name;
    },
    // OR
    getAuthor: () => vaultStore.user.getState().name,
  }))
  .get();
```

In the above example, we create the user store first and set the name property to 'John Doe'.
Then we create the post store and access the user store's name property through the `vaultStore` parameter.
We set the author property of the post store to the user store's name property.
Now, whenever we access the author property of the post store, it will return 'John Doe'.

This is just one example of how you can use the `.set()` function and `vaultStore` parameter to create interdependent stores.
The possibilities are endless and can be used to create complex applications with multiple stores that interact with each other.

---

_written by ChatGPT_
