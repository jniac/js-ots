# js-ots

Object-To-String

```javascript
import ots from './ots.js'

let object = {

    // string
    name: 'foo',

    // integer
    age: 7,

    // decimals
    parts: 1 / 3,

    // nested
    child: { name: 'bar' },

    // named function
    sayHello() {
        return `Hello, my name is ${this.name}`
    },

    // anonymous function
    saySomething: (() => (n = 6) => {

        let alphabet = 'abcdefghijklmnopqrstuvwxyz'

        return new Array(n).fill(0).map(() => alphabet[Math.floor(alphabet.length * Math.random())]).join('')

    })(),

}

ots(object)                 // { name: "foo", age: 7, parts: 0.33, child: { name: "bar" }, sayHello(), saySomething: f(n = 6) }
ots(object, 0)              // { name, age, parts, child, sayHello, saySomething }
ots(object, 1)              // { name: "foo", age: 7, parts: 0.33, child: { name }, sayHello(), saySomething: f(n = 6) }
ots(object.saySomething())  // sdltwj
ots(x => x * x)             // f(x)
ots(object.sayHello)        // sayHello()


```
