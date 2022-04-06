const Peter = { 
    name: 'Peter', 
    age: 18 
}

const John = {
    name: 'John',
    age: 28
}

const julie = { 
    color: 'lightblue', 
    age: 17 
}

Object.assign(julie, Peter, John)

julie.name = 'julie'

console.log(julie) 
// { color: 'lightblue', age: 28, name: 'julie' }
// Peter的 age 会覆盖掉 julie 的 age，之后 John 的 age 覆盖掉 julie 的 age，
// 因此julie的 age  17 -> 18 -> 28