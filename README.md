# nuxt-indexes-ts

This module automatically generates `index.ts` files in the directories of your choice.

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
The `from` option key can be a single string, an array of strings or an array of object:
```typescript
// Will watch ONLY inside ./foo directory
from: './foo'

// OR

from: ['./foo', './bar']

// OR

from: [
  // Will watch inside ./foo directory
  {
    dirs: './foo'
  },
  // And
  // Will watch inside ./foo and ./bar directories
  {
    dirs: ['./foo', './bar']
  },
  // And
  // Will watch inside ./baz directory, excluding whatever.ts file
  {
    dirs: ['./baz'],
    excludes: 'whatever.ts'
  },
  // And
  // Will watch inside ./lorem directory, excluding ipsum.ts file
  // and all files matching the regexp (.*).old.ts
  {
    dirs: ['./lorem'],
    excludes: ['ipsum.ts', '(.*).old.ts']
  },
]
```
The `excludes` option key can be a single string or an array of string:
```typescript
// Will exclude dolor.ts file
excludes: 'dolor.ts'

// OR

// Will exclude sit.ts and amet.ts files
excludes: ['sit.ts', 'amet.ts']
```

## Development

- Run `npm run dev:prepare` to generate type stubs.
- Use `npm run dev` to start [playground](./playground) in development mode.
