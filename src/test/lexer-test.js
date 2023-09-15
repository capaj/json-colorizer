const { test } = require('tap')
const { getTokens } = require('../lib/lexer')

test('tokenizes a basic JSON object', (t) => {
  const result = getTokens({
    foo: 'bar'
  })

  t.strictSame(result, [
    { type: 'BRACE', value: '{' },
    { type: 'STRING_KEY', value: '"foo"' },
    { type: 'COLON', value: ':' },
    { type: 'STRING_LITERAL', value: '"bar"' },
    { type: 'BRACE', value: '}' }
  ])
  t.end()
})

test('tokenizes a basic JSON string', (t) => {
  const result = getTokens('{"foo":"bar"}')

  t.strictSame(result, [
    { type: 'BRACE', value: '{' },
    { type: 'STRING_KEY', value: '"foo"' },
    { type: 'COLON', value: ':' },
    { type: 'STRING_LITERAL', value: '"bar"' },
    { type: 'BRACE', value: '}' }
  ])
  t.end()
})

test('tokenizes an array', (t) => {
  const result = getTokens(['foo', 'bar'])

  t.strictSame(result, [
    { type: 'BRACKET', value: '[' },
    { type: 'STRING_LITERAL', value: '"foo"' },
    { type: 'COMMA', value: ',' },
    { type: 'STRING_LITERAL', value: '"bar"' },
    { type: 'BRACKET', value: ']' }
  ])
  t.end()
})

test('includes whitespace', (t) => {
  const result = getTokens('{\n  "foo": "bar"\n}')

  t.strictSame(result, [
    { type: 'BRACE', value: '{' },
    { type: 'WHITESPACE', value: '\n  ' },
    { type: 'STRING_KEY', value: '"foo"' },
    { type: 'COLON', value: ':' },
    { type: 'WHITESPACE', value: ' ' },
    { type: 'STRING_LITERAL', value: '"bar"' },
    { type: 'WHITESPACE', value: '\n' },
    { type: 'BRACE', value: '}' }
  ])
  t.end()
})

test('tokenizes boolean values', (t) => {
  let result = getTokens('true')
  t.strictSame(result, [{ type: 'BOOLEAN_LITERAL', value: 'true' }])

  result = getTokens('false')
  t.strictSame(result, [{ type: 'BOOLEAN_LITERAL', value: 'false' }])
  t.end()
})

test('tokenizes integer values', (t) => {
  let result = getTokens('123')
  t.strictSame(result, [{ type: 'NUMBER_LITERAL', value: '123' }])

  result = getTokens('-10')
  t.strictSame(result, [{ type: 'NUMBER_LITERAL', value: '-10' }])
  t.end()
})

test('tokenizes a decimal number', (t) => {
  const result = getTokens('1.234')
  t.strictSame(result, [{ type: 'NUMBER_LITERAL', value: '1.234' }])
  t.end()
})

test('tokenizes a scientific notation number', (t) => {
  let result = getTokens('12e5')
  t.strictSame(result, [{ type: 'NUMBER_LITERAL', value: '12e5' }])

  result = getTokens('12e+5')
  t.strictSame(result, [{ type: 'NUMBER_LITERAL', value: '12e+5' }])

  result = getTokens('12E-5')
  t.strictSame(result, [{ type: 'NUMBER_LITERAL', value: '12E-5' }])
  t.end()
})

test('tokenizes null', (t) => {
  const result = getTokens('null')
  t.strictSame(result, [{ type: 'NULL_LITERAL', value: 'null' }])
  t.end()
})

test('tokenizes a string literal with brace characters', (t) => {
  const result = getTokens('"{hello}"')
  t.strictSame(result, [{ type: 'STRING_LITERAL', value: '"{hello}"' }])
  t.end()
})

test('tokenizes a string literal with brace characters with pretty', (t) => {
  const result = getTokens('"{hello}"', { pretty: true })
  t.strictSame(result, [{ type: 'STRING_LITERAL', value: '"{hello}"' }])
  t.end()
})

test('tokenizes a string literal with bracket characters', (t) => {
  const result = getTokens('"[hello]"')
  t.strictSame(result, [{ type: 'STRING_LITERAL', value: '"[hello]"' }])
  t.end()
})

test('tokenizes a string literal with an escaped quote', (t) => {
  const result = getTokens('"a\\"b"')
  t.strictSame(result, [{ type: 'STRING_LITERAL', value: '"a\\"b"' }])
  t.end()
})

test('tokenizes a key-value pair with whitespace between the :', (t) => {
  const result = getTokens('"foo" : "bar"')
  t.strictSame(result, [
    { type: 'STRING_KEY', value: '"foo"' },
    { type: 'WHITESPACE', value: ' ' },
    { type: 'COLON', value: ':' },
    { type: 'WHITESPACE', value: ' ' },
    { type: 'STRING_LITERAL', value: '"bar"' }
  ])
  t.end()
})

test('given an undefined json when get token should have no results', (t) => {
  const result = getTokens(undefined)
  t.strictSame(result, [])
  t.end()
})
