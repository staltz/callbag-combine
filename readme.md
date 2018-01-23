# callbag-combine

Callbag factory that combines the latest data points from multiple (2 or more) callbag sources. It delivers those latest values as an array. Works with both pullable and listenable sources.

`npm install callbag-combine`

## example

```js
const interval = require('callbag-interval');
const observe = require('callbag-observe');
const combine = require('callbag-combine');

const source = combine(interval(100), interval(350));

source(0, observe(x => console.log(x))); // [2,0]
// [3,0]
// [4,0]
// [5,0]
// [6,0]
// [6,1]
// [7,1]
// [8,1]
// ...
```
