function hello(allWords, wordTemplateOne, wordTemplateTwo) {
    console.log(allWords)
    console.log(wordTemplateOne, wordTemplateTwo)
}

const wordOne = 'jack'
const wordTwo = 'peter'

// 反引号调用函数的写法，称之为标记函数，
// 去掉 ${} 的部分，剩下的内容将作为 allWords
// 实际值，而 wordTemplateOne 将接收 wordOne,
// wordTemplateTwo 将接收 wordTwo
hello`hello ${wordOne}, hello ${wordTwo}`