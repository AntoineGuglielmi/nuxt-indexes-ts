import { defineNuxtConfig } from 'nuxt/config'
import MyModule from '..'

export default defineNuxtConfig({
  modules: [
    MyModule
  ],
  myModule: {
    addPlugin: true
  },
  indexes: {
    from: [
      {
        dirs: ['./playground/models', './playground/store'],
        excludes: ['(.*).old.ts']
      },
      {
        dirs: ['./playground/composables'],
        excludes: 'useNot.ts'
      },
      {
        dirs: './playground/data',
        excludes: 'Ploup.ts'
      }
      // './data'
    ],
    excludes: 'Foo.ts'
    // from: ['./models', './data']
    // from: './models'
  }
})
