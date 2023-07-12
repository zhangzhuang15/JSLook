const person = {
    address: {
        country: "china",
        city: "shanghai"
    },
    say: function() {
        console.log(`it's ${this.name}, from ${this.address.country}`)
    },
    setCountry: function(cty) {
        this.address.country = cty
    }
}


const p1 = Object.create(person)

const p2 = Object.create(person)


p1.name = "Jack"

p1.setCountry("USA")

p2.name = "Bob"

p2.setCountry("UK")


p1.say()

p2.say()

// p1 p2 都来自 UK 👀