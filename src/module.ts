import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { parseMap } from 'yaml/util'

const fs = require('fs')
const chokidar = require('chokidar')

type dirPath = string
type fileNameWithExtension = string

interface fromItem {
  dirs: dirPath|Array<dirPath>,
  ignore?: fileNameWithExtension|Array<fileNameWithExtension>
}

interface ModuleOptions {
  from: dirPath|Array<dirPath|fromItem>,
  ignoreAll: Array<fileNameWithExtension>
}

/**
 * Generate an index.ts file in dir folder, excluding excludes items from exports
 * @param dir
 * @param ignore
 */
const generateIndex = (dir: dirPath, ignore: Array<string>) => {
  if (!fs.existsSync(dir)) { return }

  const ignoreRegexpArray = ignore.map((ignore: any) => {
    return new RegExp(ignore)
  })

  const scanDir = fs.readdirSync(dir)
    .filter((item: string) => {
      return !ignoreRegexpArray.some((regexp: any) => {
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
  for (const { dirs, ignore } of fromPackages) {
    for (const dir of dirs) {
      generateIndex(dir, ignore)
    }
  }
}

const adapt = (params: any) => {
  if (typeof params.from === 'string') {
    return [{
      dirs: [params.from],
      ignore: typeof params.ignoreAll === 'string'
        ? [params.ignoreAll]
        : [].concat(...params.ignoreAll.map((item: any) => {
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
        ignore: [
          ...typeof params.ignoreAll === 'string'
            ? [params.ignoreAll]
            : params.ignoreAll,
          ...item.ignore
            ? typeof item.ignore === 'string'
              ? [item.ignore]
              : item.ignore
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
    ignore: []
  }),

  setup (options, nuxt) {
    const {
      from: fromPackages,
      ignoreAll
    }: {
      from: dirPath|Array<dirPath|fromItem>,
      ignoreAll: fileNameWithExtension|Array<fileNameWithExtension>
    } = options

    options.ignoreAll = typeof options.ignoreAll === 'string'
      ? [options.ignoreAll, 'index.ts']
      : [...options.ignoreAll, 'index.ts']

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
