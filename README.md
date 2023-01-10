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
    excludes: ...
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
    excludes?: ...
  }
]
```
The `dirs` and `excludes` keys (`excludes` is optional) in object can be a single string
or an array of strings.  
`dirs` is pointing to each directory you want to target.  
`excludes` gives all files that will be ignored in these directories. 

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
    excludes: 'baz.ts'
  },
  // Will watch inside ./foo and ./bar directories, ignoring ipsum.ts file
  // and all files matching the regexp (.*).old.ts in both ./foo and ./bar directories
  {
    dirs: ['./foo', './bar'],
    excludes: ['ipsum.ts', '(.*).old.ts']
  },
]
```
<br>  

### The `excludes` option
The `excludes` option key gives all files that will be ignored for all directories  
indicated in `from` option key. By default, all `index.ts` files are ignored.  
It can be a single string or an array of string:
```typescript
// Will exclude all dolor.ts file
excludes: 'dolor.ts'

// OR

// Will exclude all sit.ts and all amet.ts files
excludes: ['sit.ts', 'amet.ts']

// By default
excludes: ['index.ts']
```
