name = 'jack'

function tell() {
    console.log(global.name)

    console.log(name) // 报错
    class name {}    // let const class 不会变量提升
    console.log(name)
}


tell()