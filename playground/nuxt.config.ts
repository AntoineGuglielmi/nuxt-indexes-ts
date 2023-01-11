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
        ignore: ['(.*).old.ts']
      },
      {
        dirs: ['./playground/composables'],
        ignore: 'useNot.ts'
      },
      {
        dirs: './playground/data',
        ignore: 'Ploup.ts'
      }
      // './data'
    ],
    ignore: 'Foo.ts'
    // from: ['./models', './data']
    // from: './models'
  }
})
