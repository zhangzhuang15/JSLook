function reject() {
    return new Promise((resolve, reject) => {
        reject("Great")
    })
}

async function main() {
    try {
        const t = await Promise.race([reject(), Promise.resolve()]);
    } finally {
        
    }
}

main()