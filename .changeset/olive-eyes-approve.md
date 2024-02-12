---
"constconst": minor
---

Support for maps

`freeze` and `deepFreeze` now support `Map`.

Maps in JavaScript work differently than an object due to its access to internal storage. Hence the way to proxy them also needed to be changed.

Also `fakeFreeze` and `fakeDeepFreeze` seems very redundant.
