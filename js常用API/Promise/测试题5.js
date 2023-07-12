Promise
  .resolve(
    new Promise((resolve, _) => {
        setTimeout( () => resolve('hello '), 5 * 1000)
    })
      .then(message => message + 'world')
  )
  .then(data => console.log('data: ', data))