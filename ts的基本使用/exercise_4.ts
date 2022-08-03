export default {};

interface People {
    name: string;
    age: number;
};

interface Child {
    name: string;
    age: number;
    grade: number;
}

const child: Child = { name: 'Jack', age: 4, grade: 5};

const p = child as People;

// NOTE: as 类型断言不会截断原数据，只会影响数据的访问权限
console.log('p: ', p);