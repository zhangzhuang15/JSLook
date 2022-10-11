// NOTICE: Promise.all 如果并发数量很大的时候，会对浏览器造成负担，因此
//         要加入最大并发限制

const tokens = new Array(60).fill(0);
const LIMIT = 30;
let limit = 0;

async function testWithLimit() {
    const start = new Date();

    await Promise
            .all(
                tokens.map((token, index) => 
                    new Promise((resolve, reject) => {

                        const next = () => {
                            setTimeout(() => {
                                if (limit < LIMIT) {
                                    limit += 1;
                                    setTimeout(() => { resolve(index); limit -= 1; }, 1000);
                                } else {
                                    next();
                                }
                            }, 0);
                        };
                
                        next();
                    })
                )
            )
            .then(results => console.log("results: ", results));
    const end = new Date();
    console.log("cost time: ", end - start);
    return 0;
}

async function testWithoutLimit() {
    const start = new Date();

    await Promise
            .all(
                tokens.map(
                    token => new Promise(
                        (resolve, _) => setTimeout(() => resolve(token), 1000))
            ))
            .then(results => console.log("results: ", results));

    const end = new Date();
    console.log("cost time: ", end - start);
    return 0;
}

async function main() {
    console.log("testWithLimit");
    await testWithLimit();
    console.log("------------");
    console.log("testWithoutLimit");
    await testWithoutLimit();
}


main();