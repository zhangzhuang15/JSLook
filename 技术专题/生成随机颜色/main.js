const getRandomHexColor = () => `#${Math.floor(Math.random() * 0xffffff).toString(16)}`

console.log(getRandomHexColor())