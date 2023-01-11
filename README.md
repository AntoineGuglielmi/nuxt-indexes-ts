# nuxt-indexes-ts

This module allows you to turn
```typescript
import { Foo } from './whatever/Foo';
import { Bar } from './whatever/Bar';
```
into
```typescript
import { Foo, Bar } from './whatever'; // With autocompletion
```
by creating `index.ts` files in the directories of your choice.

## Installation
`npm i nuxt-indexes-ts`

## Usage
In `nuxt.config.ts` file:
```typescript
export default defineNuxtConfig({
  modules: [
    // ...
    'nuxt-indexes-ts'
    // ...
  ],
  indexes: {
    from: ...,
    ignore: ...
  }
})
```

## indexesOptions
### The `from` option
The `from` option key can be a single string, an array of strings or an array of objects:
```typescript
// Will watch ONLY inside ./foo directory
from: './foo'

// OR

// Will watch inside ./foo and ./bar directories
from: ['./foo', './bar']

// OR

from: [
  {
    dirs: ...,
    ignore?: ...
  }
]
```
The `dirs` and `ignore` keys (`ignore` is optional) in object can be a single string
or an array of strings.  
`dirs` is pointing to each directory you want to target.  
`ignore` gives all files that will be ignored in these directories. 

```typescript
from: [
  // Will watch inside ./foo directory
  {
    dirs: './foo'
  },
  // Will watch inside ./foo and ./bar directories
  {
    dirs: ['./foo', './bar']
  },
  // Will watch inside ./foo directory, ignoring baz.ts file only in ./foo directory
  {
    dirs: ['./foo'],
    ignore: 'baz.ts'
  },
  // Will watch inside ./foo and ./bar directories, ignoring ipsum.ts file
  // and all files matching the regexp (.*).old.ts in both ./foo and ./bar directories
  {
    dirs: ['./foo', './bar'],
    ignore: ['ipsum.ts', '(.*).old.ts']
  },
]
```
<br>  

### The `ignore` option
The `ignore` option key gives all files that will be ignored for all directories  
indicated in `from` option key. By default, all `index.ts` files are ignored.  
It can be a single string or an array of string:
```typescript
// Will exclude all dolor.ts file
ignore: 'dolor.ts'

// OR

// Will exclude all sit.ts and all amet.ts files
ignore: ['sit.ts', 'amet.ts']

// By default
ignore: ['index.ts']
```
