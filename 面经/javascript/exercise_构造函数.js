1 in Object(1.0).constructor;   // true or false ?
Number[1] = 123;
1 in Object(1.0).constructor;   // true or false ?




// false
// true

// Object(1.0).constructor === Number