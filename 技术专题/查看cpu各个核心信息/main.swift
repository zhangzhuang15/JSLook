import Foundation

struct Man {
    var age: Int32 
    let name: String
}

func main() {
    // let paths = FileManager.default.mountedVolumeURLs(includingResourceValuesForKeys: [.volumeNameKey], options: [])!
    // for url in paths {
    //     print("\(url.pathComponents)\n")

    //     do {
    //         let systemAttributes = try FileManager.default.attributesOfFileSystem(forPath: url.pathComponents[0])
    //     // 查看总共磁盘容量， systemFreeSize 查看磁盘剩余容量
    //     if let totalSpace = (systemAttributes[FileAttributeKey.systemSize] as? NSNumber)?.int64Value {
    //         print("total disk size: \(totalSpace/(1000*1000*1000))")
    //     }
        

    var t: Array<String> = []

    t.append("hello")

    let p = t 

    t.append(contentsOf: ["ok", "world", "hello"])

    print("t: \(t), p:\(p)")

    let a = { (value: Int, fn: () -> Void) -> Void in 
        print("ok: \(value)")
        fn()
    }

    a(5) {
        print("hello hello ")
    }



    //     } catch let err {

    //     }
        
    // }
}

main()