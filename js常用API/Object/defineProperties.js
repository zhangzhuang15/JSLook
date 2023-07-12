var dog = { name: "Lily" };

Object.defineProperties(dog,
                        {
                            "sex" : {
                                configurable: true,
                                enumerable:  true,
                                value: 'girl',
                                writable: false
                            },
                            "food": {
                                configurable: true,
                                enumerable: false,
                                value: "salad",
                                writable: true
                            }
                        }
);

console.log("dog: ", dog);

console.log("dog['food']: ", dog['food']);