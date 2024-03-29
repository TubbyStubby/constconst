# constconst

## 3.3.0

### Minor Changes

- 636ea32: Added env flag `CONST_CONST_SKIP` to turns off the checks for performance.

## 3.2.1

### Patch Changes

- 8bd54bd: Fix linter issues and updated @typescript-eslint

## 3.2.0

### Minor Changes

- 6541191: Support for maps

  `freeze` and `deepFreeze` now support `Map`.

  Maps in JavaScript work differently than an object due to its access to internal storage. Hence the way to proxy them also needed to be changed.

  Also `fakeFreeze` and `fakeDeepFreeze` seems very redundant.

## 3.1.0

###Feature Addition

- Added support for Maps.

###Minor Changes

- `@types/jest` bumped up from `v29.5.2` to `v29.5.12`

## 3.0.1

### Patch Changes

- 7fe5994: Fix issues with complex objects freezing.

## 3.0.0

### Major Changes

- c0212c3: Added exception for Date objects and Original objects are no longer frozen or sealed.

## 2.0.1

### Patch Changes

- 0613516: fixed fakeFreezer exports

## 2.0.0

### Major Changes

- 2ab3b57: Added fakeFreeze and fakeDeepFreeze

### Minor Changes

- 2ab3b57: Added tests to CI and codecov support

### Patch Changes

- 2ab3b57: Added docs for `fakeFreeze` & `fakeDeepFreeze` and updated warnings and notes

## 1.0.0

### Major Changes

- f433013: Added Frozen and DeepFrozen types
  and fn is not frozen anymore

### Minor Changes

- f5f3886: Combined freezer and handler
  and internal `mutationHandler` object is more exported

## 1.0.0-beta.0

### Major Changes

- f433013: Added Frozen and DeepFrozen types
  and fn is not frozen anymore

### Minor Changes

- f5f3886: Combined freezer and handler
  and internal `mutationHandler` object is more exported

## 0.0.2

### Patch Changes

- 82b0bd7: Added freeze and deepFreeze with simple tests.
