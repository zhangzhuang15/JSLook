const methodTable = {
    'run4s': run4s,
    'run6s': run6s,
    'runParall': runParall
}

let data = Date.now();

function _run2s() {
    return new Promise(
        resolve => setTimeout( 
            function(){ 
                console.log('2s')
                resolve(2)
            },
            2000
        )
    )
}

function _run4s() {
    return new Promise(
        resolve => setTimeout(
            function(){
                console.log('4s')
                resolve(4)
            },
            4000
        )
    )
}

// 花费 6s
async function run6s() {
    await _run4s()
    await _run2s()
}

 
// 花费4s
async function run4s() {
    const task_4s = _run4s()
    const task_2s = _run2s()

    
    await task_4s
    await task_2s

    console.log("cost time(ms): ", Date.now() - date);
}

// 花费4s，
// 2s后 _run2s()结果输出，
// 再过2s后， _run4s()结果输出
function runParall() {
    Promise.all([
        _run4s(),
        _run2s()
    ])
}


function main() {
   date = Date.now();
   run4s();
}

main()

