![License](https://img.shields.io/npm/l/constconst)
![Version](https://img.shields.io/npm/v/constconst)
![Build Status](https://github.com/TubbyStubby/constconst/actions/workflows/ci.yml/badge.svg)
![Codecov](https://codecov.io/gh/tubbystubby/constconst/branch/main/graph/badge.svg)


# ConstConst

ConstConst is a JavaScript package that provides two functions, `freeze` and `deepFreeze`, which allow you to freeze objects and prevent any mutation. These functions return a proxy that throws an error when attempting to modify or delete any property. The `deepFreeze` function handles circular references properly, ensuring that all nested objects are frozen.

## New: `fakeFreeze` and `fakeDeepFreeze`
Unveiling an exciting new update to the ConstConst – the introduction of `fakeFreeze` and `fakeDeepFreeze` functions. This expansion provides enhanced flexibility while adhering to the core principles of immutability with controlled modification.

These functions augment your toolkit for immutability-like behavior while allowing controlled modification access.

***Note:*** As of `v3.1.0` usage of `fakeFreeze` and `fakeDeepFreeze` is hereby disencouraged and they might be removed in future versions subject to failure of finding any significant difference with the respective non fake  varients.

Refer to [`CHANGELOG.md`](CHANGELOG.md) for detailed changes.

## Motivation

The main motivation behind ConstConst is to simplify the usage of constant information within modules. For example, when working with game development, you may have modules that store constant stats for characters or other game entities. With ConstConst, you can export and use these constant objects without the need for deep cloning them every time.

By freezing the objects, you ensure that their values remain unchanged throughout the execution of your code. This provides immutability and prevents accidental modifications that could lead to bugs or unexpected behavior.

## Installation

You can install ConstConst using npm:

```bash
npm install constconst
```

## Usage

- `freeze`: returns a proxy which throws error when trying to mutate

```javascript
const { freeze } = require('constconst');

const myObject = {
  prop1: 'value1',
  prop2: 'value2'
};

const myMap = new Map([
  "prop1", "value1",
  "prop2": "value2"
]);

const frozenObject = freeze(myObject);
const frozenMap = freeze(myMap);

frozenObject.prop1 = 'new value'; // ConstConstError: Cannot set property 'prop1' to value 'new value' since object is a constconst
frozenMap.set("prop1", "value3"); //ConstConstError: Cannot set property since map is a constconst
frozenMap.clear(); //ConstConstError: Cannot clear properties since map is a constconst
frozenMap.delete("prop1"); //ConstConstError: Cannot delete property since map is a constconst
```

- `deepFreeze`: similar to freeze but recursively freezes nested objects

```javascript
const { deepFreeze } = require('constconst');

const obj1 = {
  prop1: 'value'
};

const obj2 = {
  prop2: obj1
};
const myMap = new Map([
  "prop1", "value1",
  "prop2": {
    "innerProp": "value2"
  }
]);

obj1.prop2 = obj2;

const frozenObject = deepFreeze(obj1);
const frozenMap = deepFreeze(myMap);
frozenObject.prop2.prop1 = 'new value'; // ConstConstError: Cannot set property 'prop1' to value 'new value' since object is a constconst
frozenMap.get("prop2").innerProp = "value3"; //// ConstConstError: Cannot set property 'prop1' to value 'new value' since object is a constconst
```

> [!WARNING]
> `deepFreeze` function operates by modifying the fields of the passed object, replacing them with proxies to enforce immutability. To ensure the safest usage of this function, it's recommended to directly freeze the object without saving any reference to it in a variable.

> [!NOTE]
> - Any object which was frozen before passing to `freeze` or `deepFreeze` will be returned as is and will not be proxied either. Hence they will not produce any errors on mutation.
> - freezing objects with setters and getters is not tested and is undefined behaviour.

- `fakeFreeze`: Modifications to the original object reflect in the returned proxy object. Modifications via the proxy trigger an error.

```javascript
const { fakeFreeze } = require('constconst');

const myObject = {
  prop1: 'value1'
};

const frozenObject = fakeFreeze(myObject);

myObject.prop1 = 'value2';
console.log(frozenObject.prop1) // value2

frozenObject.prop1 = 'new value'; // ConstConstError: Cannot set property 'prop1' to value 'new value' since object is a constconst
```

- `fakeDeepFreeze`: Extends fakeFreeze capabilities to nested object also handles circular references. Object sealing remains consistent.
```javascript
const { fakeDeepFreeze } = require('constconst');

const obj1 = {
  prop1: {
    subProp1: 'value'
  }
};

const frozenObject = fakeDeepFreeze(obj1);

obj1.prop1.subProp1 = "value2";
console.log(frozenObject.prop1.subProp1); // value2

frozenObject.prop1.subProp1 = 'new value'; // ConstConstError: Cannot set property 'prop1' to value 'new value' since object is a constconst
```
> [!NOTE]
> `fakeFreeze` and `fakeDeepFreeze` do not replace the fields of the original object via proxies. The proxies returned by these functions are configured such that while accessing a property, a proxy of the property is returned.

> [!NOTE]
> Only simple Objects are frozen. Instances of any class is untouched. Best use is with simple POJOs.

## Contribution Guidelines

To contribute to ConstConst, please follow these guidelines:

1. Fork and clone the repository.
2. Install project dependencies using `npm install`.
3. Create a new branch for your contribution.
4. Make your changes and ensure that tests pass (`npm test`).
5. Add new tests if applicable.
6. Use `npx changeset` to create a changeset:
   - Select an appropriate bump type.
   - Provide a summary (WHAT, WHY, HOW).
7. Commit the changeset file and your code changes.
8. Open a pull request against the `main` branch.

For more information on using Changesets, refer to the [Changesets documentation](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md#i-am-in-a-single-package-repository).
