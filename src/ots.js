/*

	Object-To-String
	https://github.com/jniac/js-ots

*/

/**
 * Auto-detect integer for shorter number strings, e.g.:
 * numberToString(10) => '10'
 * numberToString(1/3) => '.33'
 *
 */
export const numberToString = (n, toFixed = 2) => {

	if (n % 1)
		return n.toFixed(toFixed)

	return n.toString()

}

/**
 * Returns the parameters of a function (the signature).
 * functionSignature(x => x * x) => 'x'
 * functionSignature((x, y = 3) => x * y) => 'x, y = 3'
 */
export const functionSignature = fn => {

	let str = fn.toString()

	if (/^\w+\s*=>/.test(str))
		return str.match(/^(\w+)\s*=>/)[1]

	let start = str.indexOf('(') +1
	let current = start
	let count = 1
	let len = str.length

	while(++current < len) {

		let char = str.charAt(current)

		if (char === '(')
			count++

		if (char === ')')
			count--

		if (count === 0)
			return str.slice(start, current).trim().replace(/\s+/g, ' ')

	}

	return ''

}

export const functionToString = fn => {

	let signature = functionSignature(fn)

	let name = fn.name || 'f'

	return `${name}(${signature})`

}



function ifstring(object, options, currentKey) {

	let { stringPattern = '"' } = options

	return typeof object === 'string'

		? stringPattern + object + stringPattern

		: ots(object, Object.assign(options, { currentKey }))

}

function iffunction(object, options, currentKey) {

	return typeof object === 'function'

		? currentKey === object.name

			? functionToString(object)

			: `${currentKey}: ${functionToString(object)}`

		: `${currentKey}: ${ifstring(object, options, currentKey)}`

}

export default function ots(object, options = {}, ...args) {

	if (typeof options === 'number')
		options = { depth: options }

	let {
		depth = 2,
		level = 0,
		printKeys = true,
		arrayMax = 100,
		toFixed = 2,
		printFunction = false,
		joinPattern = ', ',
		multiline = false,
	} = options

	if (args.length === 1 && args[0] === '\t')
		multiline = true

	options = {
		depth: depth - 1,
		level: level + 1,
		printKeys,
		arrayMax,
		toFixed,
		printFunction,
		joinPattern,
		multiline,
	}

	if (object === undefined)
		return 'undefined'

	if (object === null)
		return 'null'

	let type = typeof object

	if (type === 'string')
		return object

	if (type === 'boolean' ||
		type === 'symbol')
		return object.toString()

	if (type === 'function')
		return printFunction
			? object.toString()
			: functionToString(object)

	if (type === 'number')
		return numberToString(object, toFixed)

	if (object instanceof Error)
		return `${object.constructor.name}: ${object.message}`

	if (Array.isArray(object)) {

		if (depth)
			return object.length < arrayMax
				? `[${object.map(value => ifstring(value, options)).join(joinPattern)}]`
				: `[${object.slice(0, arrayMax).map(value => ifstring(value, options)).join(joinPattern)}, ... (+${object.length - arrayMax})]`

		return `[(${object.length})]`

	}

	let prefix = object.constructor ? object.constructor.name : ''

	prefix = prefix === 'Object' ? '' : prefix + ' '

	let keys = Object.keys(object)

	let tab = '\t'.repeat(level + 1)

	if (depth === 0)
		multiline = false

	if (multiline)
		joinPattern = `${joinPattern}\n${tab}`

	let body = depth === 0
		? (keys.length ? (printKeys ? keys.join(joinPattern) : `... (${keys.length})`) : '')
		: keys.map(key => iffunction(object[key], options, key)).join(joinPattern)

	if (multiline) {

		return prefix + (body ? `{ \n${tab}${body}, \n${tab.slice(0, -1)}}` : '{}')

	}

	return prefix + (body ? `{ ${body} }` : '{}')

}
