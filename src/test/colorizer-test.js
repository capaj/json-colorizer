const { test } = require('tap')

const { getTokens } = require('../lib/lexer')
const { colorize } = require('../lib/colorizer')
const customColors = {
  BRACE: 'white',
  BRACKET: 'white',
  COLON: 'white',
  COMMA: 'white',
  STRING_KEY: 'yellow',
  NULL_LITERAL: 'red',
  STRING_LITERAL: 'green',
  NUMBER_LITERAL: 'magentaBright',
  BOOLEAN_LITERAL: 'cyan'
}

const fixture = {
  foo: null,
  bar: { baz: true },
  number: 13,
  array: ['values']
}

test('does not throw an error when there is whitespace', (t) => {
  t.doesNotThrow(() => colorize(getTokens(JSON.stringify(fixture, null, 2))))
  t.end()
})

test('colorizes with default options', (t) => {
  const tokens = getTokens(fixture)
  const result = colorize(tokens)

  t.matchSnapshot(result)
  t.end()
})

test('colorizes with custom colors', (t) => {
  const tokens = getTokens(fixture)
  const result = colorize(tokens, { colors: customColors })

  t.matchSnapshot(result)
  t.end()
})

test('colorizes with only specific overrides for colors', (t) => {
  const tokens = getTokens(fixture)
  const result = colorize(tokens, { colors: { NUMBER_LITERAL: 'red' } })

  t.matchSnapshot(result)
  t.end()
})
