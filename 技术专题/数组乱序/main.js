const shuffleArray = (array) => array.sort(() => Math.random() - 0.5)

const data = [1, 2, 3, 4, 5, 6, 7, 8]

console.log(shuffleArray(data))