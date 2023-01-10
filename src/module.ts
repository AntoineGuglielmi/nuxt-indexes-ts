import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { parseMap } from 'yaml/util'

const fs = require('fs')
const chokidar = require('chokidar')
// const esr = require('escape-string-regexp')

type dirPath = string
type fileNameWithExtension = string

interface fromItem {
  dirs: dirPath|Array<dirPath>,
  excludes?: fileNameWithExtension|Array<fileNameWithExtension>
}

interface ModuleOptions {
  from: dirPath|Array<dirPath|fromItem>,
  excludes: Array<fileNameWithExtension>
}

/**
 * Generate an index.ts file in dir folder, excluding excludes items from exports
 * @param dir
 * @param excludes
 */
const generateIndex = (dir: dirPath, excludes: Array<string>) => {
  if (!fs.existsSync(dir)) { return }

  const excludesRegexpArray = excludes.map((exclude: any) => {
    return new RegExp(exclude)
  })

  const scanDir = fs.readdirSync(dir)
    .filter((item: string) => {
      return !excludesRegexpArray.some((regexp: any) => {
        return regexp.test(item)
      })
    })

  const indexTsContentArray = []

  for (const fileName of scanDir) {
    indexTsContentArray.push(`export * from './${fileName.split('.').slice(0, -1).join('.')}';`)
  }

  const indexTsContentString = indexTsContentArray.join('\n')

  try {
    fs.writeFileSync(`${dir}/index.ts`, indexTsContentString)
  } catch (e) {
    console.log(e)
  }
}

const indexes = (fromPackages: Array<any>) => {
  for (const { dirs, excludes } of fromPackages) {
    for (const dir of dirs) {
      generateIndex(dir, excludes)
    }
  }
}

const adapt = (params: any) => {
  if (typeof params.from === 'string') {
    return [{
      dirs: [params.from],
      excludes: typeof params.excludes === 'string'
        ? [params.excludes]
        : [].concat(...params.excludes.map((item: any) => {
            return [item]
          }))
    }]
  } else {
    return params.from.reduce((result: Array<any>, item: any) => {
      result.push({
        dirs: typeof item === 'string'
          ? [item]
          : typeof item.dirs === 'string'
            ? [item.dirs]
            : [].concat(...item.dirs),
        excludes: [
          ...typeof params.excludes === 'string'
            ? [params.excludes]
            : params.excludes,
          ...item.excludes
            ? typeof item.excludes === 'string'
              ? [item.excludes]
              : item.excludes
            : []
        ]
      })
      return result
    }, [])
  }
}

export default defineNuxtModule<ModuleOptions>({

  // Metas
  meta: {
    name: 'indexes',
    configKey: 'indexes'
  },

  // Defaults
  defaults: nuxt => ({
    from: [],
    excludes: []
  }),

  setup (options, nuxt) {
    const {
      from: fromPackages,
      excludes
    }: {
      from: dirPath|Array<dirPath|fromItem>,
      excludes: fileNameWithExtension|Array<fileNameWithExtension>
    } = options

    options.excludes = typeof options.excludes === 'string'
      ? [options.excludes, 'index.ts']
      : [...options.excludes, 'index.ts']

    const adapted = adapt(options)

    const allFroms: dirPath|Array<dirPath> = typeof fromPackages === 'string'
      ? fromPackages
      : ([] as Array<dirPath>).concat(...fromPackages.map((from: dirPath|fromItem) => {
          return typeof from === 'string'
            ? [from]
            : typeof from.dirs === 'string'
              ? [from.dirs]
              : from.dirs
        }))

    const watcher = chokidar.watch(allFroms, { ignored: /^\./, persistent: true })
    const watchNuxtConfig = chokidar.watch('./playground/nuxt.config.ts', { ignored: /^\./, persistent: true })

    watcher
      .on('add', (path: string) => {
        indexes(adapted)
      })
      .on('unlink', (path: string) => {
        indexes(adapted)
      })
    watchNuxtConfig
      .on('change', (path: string) => {
        indexes(adapted)
      })
  }
})
