const visit = require("unist-util-visit")
const prettier = require("prettier")

module.exports = ({ markdownAST }, options = {}) =>
  resolveConfig(options).then(prettierOptions => {
    visit(markdownAST, "code", node => {
      const parser = mapLanguageToParser(node.lang)
      if (parser) {
        const config = Object.assign({ parser }, prettierOptions)
        try {
          const formatted = prettier.format(node.value, config)
          node.value = formatted
        } catch (err) {
          console.error("error formatting block", err)
        }
      }
    })
  })

function resolveConfig({ usePrettierrc = true, prettierOptions }) {
  if (usePrettierrc) {
    return prettier.resolveConfig(process.cwd()).then(options => {
      return Object.assign({}, options, prettierOptions)
    })
  }
  return Promise.resolve(prettierOptions)
}

function mapLanguageToParser(language) {
  switch (language) {
    case "javascript":
      return "babylon"
    case "typescript":
      return "typescript"
    case "flow":
      return "flow"
    case "css":
    case "scss":
      return "css"
    case "json":
      return "json"
    case "graphql":
      return "graphql"
    case "markdown":
      return "markdown"
    default:
      return null
  }
}
