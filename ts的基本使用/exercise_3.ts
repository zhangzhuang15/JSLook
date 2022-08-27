enum ERole {
    admin = 3,
    monitor = 5,
};

console.log([ERole.admin, ERole.monitor].includes(5))

// NOTE: 加入这个声明，ts文件将被理解为一个模块处理，
// ERole作用域为本文件，不会受到其他ts文件定义的ERole的影响。
// 删除这个声明，ERole.admin将会产生冲突，因为在 exercise_2.ts
// 中也定义了一个 ERole。
export default {};