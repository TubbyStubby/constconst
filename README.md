# ConstConst

ConstConst is a JavaScript package that provides two functions, `freeze` and `deepFreeze`, which allow you to freeze objects and prevent any mutation. These functions return a proxy that throws an error when attempting to modify or delete any property. The `deepFreeze` function handles circular references properly, ensuring that all nested objects are frozen.

## Motivation

The main motivation behind ConstConst is to simplify the usage of constant information within modules. For example, when working with game development, you may have modules that store constant stats for characters or other game entities. With ConstConst, you can expotr and use these constant objects without the need for deep cloning them every time.

By freezing the objects, you ensure that their values remain unchanged throughout the execution of your code. This provides immutability and prevents accidental modifications that could lead to bugs or unexpected behavior.

## Installation

You can install ConstConst using npm:

```bash
npm install constconst
```

## Usage

To freeze an object, you can use the `freeze` function:

```javascript
const { freeze } = require('constconst');

const myObject = {
  prop1: 'value1',
  prop2: 'value2'
};

const frozenObject = freeze(myObject);

frozenObject.prop1 = 'new value'; // ConstConstError: Cannot set property 'prop1' to value 'new value' since object is a constconst
```

Similarly, you can use the `deepFreeze` function to deep freeze an object and it will also handle circular references:

```javascript
const { deepFreeze } = require('constconst');

const obj1 = {
  prop1: 'value'
};

const obj2 = {
  prop2: obj1
};

obj1.prop2 = obj2;

const frozenObject = deepFreeze(obj1);

frozenObject.prop2.prop1 = 'new value'; // ConstConstError: Cannot set property 'prop1' to value 'new value' since object is a constconst
```

> **Note:**
> - When deep freezing, objects properties are replaced with proxies.
> - Any object which was frozen before passing to `freeze` or `deepFreeze` will be returned as is and will not be proxied either. Hence they will not produce any errors on mutation.

## Contribution Guidelines

To contribute to ConstConst, please follow these guidelines:

1. Fork and clone the repository.
2. Install project dependencies using `npm install`.
3. Create a new branch for your contribution.
4. Make your changes and ensure that tests pass (`npm test`).
5. Add new tests if applicable.
6. Use `npx changeset` or `yarn changeset` to create a changeset:
   - Select an appropriate bump type.
   - Provide a summary (WHAT, WHY, HOW).
7. Commit the changeset file and your code changes.
8. Open a pull request against the `main` branch.

For more information on using Changesets, refer to the [Changesets documentation](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md#i-am-in-a-single-package-repository).

## What's Next?

In the future release of ConstConst, we have exciting additions planned: `fakeFreeze` and `fakeDeepFreeze` functions. These functions will introduce new capabilities, allowing you to work with immutability-like behavior through `fakeFrozen` objects while retaining controlled modification access via the `proxiedOriginal`. Stay tuned for these upcoming enhancements!
