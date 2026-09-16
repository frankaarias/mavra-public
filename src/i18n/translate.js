import catalog from './catalog.json'

const normalize = value => value.replace(/\s+/g, ' ').trim()
const lookup = new Map()
for (const [source, pair] of Object.entries(catalog)) {
  lookup.set(normalize(source), pair)
  // Components may pass translated children to a presentational component.
  // Resolve either version to the same entry so translation is idempotent.
  lookup.set(normalize(pair.en), pair)
  lookup.set(normalize(pair.es), pair)
}

export function translateText(value, language) {
  if (Array.isArray(value)) return value.map(item => translateText(item, language))
  if (typeof value !== 'string' || !value.trim()) return value
  const key = normalize(value)
  const pair = lookup.get(key)
  if (pair) return value.match(/^\s*/)[0] + pair[language] + value.match(/\s*$/)[0]
  // A decorative symbol must not prevent a complete editorial label matching.
  const decorated = key.match(/^([^\p{L}\p{N}<]+)(.+)$/u)
  if (decorated && lookup.has(decorated[2])) return decorated[1] + lookup.get(decorated[2])[language]
  return value
}

export function translateHtml(value, language) {
  const complete = translateText(value, language)
  if (complete !== value) return complete
  // Only translate text in repository-owned markup. Never alter HTML attributes.
  return value.replace(/(^|>)([^<>]+)(?=<|$)/g, (_, prefix, text) => prefix + translateText(text, language))
}
