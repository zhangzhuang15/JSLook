enum ERole {
    admin = 3
};

const privilege: number = 3;

const role = ERole.admin;

console.log(privilege === role);

console.log('ERole -> string: ', String(role));

console.log('ERole.toString: ', role.toString());