function numberToString(n, toFixed = 1) {

	if (n % 1)
		return n.toFixed(toFixed)

	return n.toString()

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

            ? `${currentKey}(${functionSignature(object)})`

            : `${currentKey}: ${object.name || 'f'}(${functionSignature(object)})`

        : `${currentKey}: ${ifstring(object, options, currentKey)}`

}

export function functionSignature(fn) {

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
			return str.slice(start, current)

    }

	return ''

}

export default function ots(object, options = {}) {

	if (typeof options === 'number')
		options = { depth: options }

	let { depth = 2, printKeys = true, arrayMax = 100, toFixed = 2, printFunction = false, joinPattern = ', ' } = options

	options = { depth: depth - 1, printKeys, arrayMax, toFixed, printFunction, joinPattern }

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
			: `${object.name || 'f'}(${functionSignature(object)})`

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

	let prefix = object.constructor.name

	prefix = prefix === 'Object' ? '' : prefix + ' '

	let keys = Object.keys(object)

	let body = !depth
		? (keys.length ? (printKeys ? keys.join(joinPattern) : `... (${keys.length})`) : '')
		: keys.map(key => iffunction(object[key], options, key)).join(joinPattern)

	return prefix + (body ? `{ ${body} }` : '{}')

}
