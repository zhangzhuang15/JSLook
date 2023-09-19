function main() {
    // debugger
    console.log("welcome to California")
    console.log(process.argv)

    Promise.resolve(10).then(value => {
        setTimeout(() => console.log('value: ', value), 500)
    })

    setTimeout(() => console.log('hello Jason!'), 200)
}


main()