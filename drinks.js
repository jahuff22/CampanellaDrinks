const traits = [
    "strength",
    "sweetness",
    "sourness",
    "bitterness",
    "thickness",
    "rarity"
];

const drinks = [
    {
        name: "Margarita",
        liquor: "",
        scores: {
            strength: 4,
            sweetness: 3,
            sourness: 4,
            bitterness: 1,
            thickness: 2,
            rarity: 1
        },
        weights: {
            strength: 4,
            sweetness: 5,
            sourness: 7,
            bitterness: 0,
            thickness: 2,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Old Fashioned",
        liquor: "",
        scores: {
            strength: 6,
            sweetness: 3,
            sourness: 1,
            bitterness: 2,
            thickness: 3,
            rarity: 1
        },
        weights: {
            strength: 9,
            sweetness: 5,
            sourness: 0,
            bitterness: 7,
            thickness: 3,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Mojito",
        liquor: "",
        scores: {
            strength: 3,
            sweetness: 3,
            sourness: 3,
            bitterness: 1,
            thickness: 2,
            rarity: 1
        },
        weights: {
            strength: 3,
            sweetness: 4,
            sourness: 6,
            bitterness: 0,
            thickness: 2,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Gin & Tonic",
        liquor: "",
        scores: {
            strength: 2,
            sweetness: 3,
            sourness: 1,
            bitterness: 2,
            thickness: 1,
            rarity: 1
        },
        weights: {
            strength: 3,
            sweetness: 3,
            sourness: 1,
            bitterness: 6,
            thickness: 2,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Whiskey Sour",
        liquor: "",
        scores: {
            strength: 4,
            sweetness: 4,
            sourness: 4,
            bitterness: 1,
            thickness: 4,
            rarity: 1
        },
        weights: {
            strength: 5,
            sweetness: 6,
            sourness: 9,
            bitterness: 0,
            thickness: 3,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Sidecar",
        liquor: "",
        scores: {
            strength: 5,
            sweetness: 3,
            sourness: 4,
            bitterness: 1,
            thickness: 3,
            rarity: 1
        },
        weights: {
            strength: 5,
            sweetness: 5,
            sourness: 7,
            bitterness: 0,
            thickness: 2,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Piña Colada",
        liquor: "",
        scores: {
            strength: 2,
            sweetness: 7,
            sourness: 1,
            bitterness: 1,
            thickness: 7,
            rarity: 1
        },
        weights: {
            strength: 2,
            sweetness: 8,
            sourness: 2,
            bitterness: 0,
            thickness: 10,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "White Sangria",
        liquor: "",
        scores: {
            strength: 2,
            sweetness: 3,
            sourness: 3,
            bitterness: 1,
            thickness: 2,
            rarity: 1
        },
        weights: {
            strength: 3,
            sweetness: 5,
            sourness: 5,
            bitterness: 0,
            thickness: 2,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Red Sangria",
        liquor: "",
        scores: {
            strength: 3,
            sweetness: 3,
            sourness: 2,
            bitterness: 1,
            thickness: 2,
            rarity: 1
        },
        weights: {
            strength: 3,
            sweetness: 5,
            sourness: 4,
            bitterness: 0,
            thickness: 3,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Martini",
        liquor: "",
        scores: {
            strength: 6,
            sweetness: 1,
            sourness: 1,
            bitterness: 1,
            thickness: 1,
            rarity: 1
        },
        weights: {
            strength: 10,
            sweetness: 8,
            sourness: 0,
            bitterness: 2,
            thickness: 2,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Bloody Mary",
        liquor: "",
        scores: {
            strength: 2,
            sweetness: 1,
            sourness: 3,
            bitterness: 1,
            thickness: 5,
            rarity: 2
        },
        weights: {
            strength: 2,
            sweetness: 2,
            sourness: 4,
            bitterness: 0,
            thickness: 5,
            rarity: 2
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Negroni",
        liquor: "",
        scores: {
            strength: 4,
            sweetness: 3,
            sourness: 1,
            bitterness: 7,
            thickness: 4,
            rarity: 1
        },
        weights: {
            strength: 5,
            sweetness: 5,
            sourness: 0,
            bitterness: 9,
            thickness: 3,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Americano",
        liquor: "",
        scores: {
            strength: 1,
            sweetness: 4,
            sourness: 1,
            bitterness: 5,
            thickness: 2,
            rarity: 1
        },
        weights: {
            strength: 2,
            sweetness: 4,
            sourness: 0,
            bitterness: 8,
            thickness: 2,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Aperol Spritz",
        liquor: "",
        scores: {
            strength: 2,
            sweetness: 4,
            sourness: 1,
            bitterness: 3,
            thickness: 1,
            rarity: 1
        },
        weights: {
            strength: 2,
            sweetness: 5,
            sourness: 1,
            bitterness: 6,
            thickness: 2,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Last Word",
        liquor: "",
        scores: {
            strength: 5,
            sweetness: 4,
            sourness: 5,
            bitterness: 2,
            thickness: 4,
            rarity: 4
        },
        weights: {
            strength: 5,
            sweetness: 5,
            sourness: 6,
            bitterness: 2,
            thickness: 3,
            rarity: 4
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Manhattan",
        liquor: "",
        scores: {
            strength: 6,
            sweetness: 2,
            sourness: 1,
            bitterness: 2,
            thickness: 2,
            rarity: 1
        },
        weights: {
            strength: 8,
            sweetness: 5,
            sourness: 0,
            bitterness: 5,
            thickness: 3,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Sazerac",
        liquor: "",
        scores: {
            strength: 7,
            sweetness: 2,
            sourness: 1,
            bitterness: 4,
            thickness: 3,
            rarity: 3
        },
        weights: {
            strength: 9,
            sweetness: 4,
            sourness: 0,
            bitterness: 6,
            thickness: 3,
            rarity: 3
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Mint Julep",
        liquor: "",
        scores: {
            strength: 6,
            sweetness: 4,
            sourness: 1,
            bitterness: 1,
            thickness: 3,
            rarity: 1
        },
        weights: {
            strength: 8,
            sweetness: 5,
            sourness: 0,
            bitterness: 0,
            thickness: 3,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Daiquiri",
        liquor: "",
        scores: {
            strength: 3,
            sweetness: 5,
            sourness: 6,
            bitterness: 1,
            thickness: 2,
            rarity: 1
        },
        weights: {
            strength: 4,
            sweetness: 6,
            sourness: 8,
            bitterness: 0,
            thickness: 2,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Coffee Flip",
        liquor: "",
        scores: {
            strength: 3,
            sweetness: 5,
            sourness: 1,
            bitterness: 1,
            thickness: 7,
            rarity: 3
        },
        weights: {
            strength: 3,
            sweetness: 5,
            sourness: 0,
            bitterness: 2,
            thickness: 9,
            rarity: 3
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Ramos Gin Fizz",
        liquor: "",
        scores: {
            strength: 2,
            sweetness: 3,
            sourness: 3,
            bitterness: 1,
            thickness: 6,
            rarity: 4
        },
        weights: {
            strength: 2,
            sweetness: 4,
            sourness: 5,
            bitterness: 0,
            thickness: 9,
            rarity: 4
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Brandy Alexander",
        liquor: "",
        scores: {
            strength: 3,
            sweetness: 6,
            sourness: 1,
            bitterness: 1,
            thickness: 7,
            rarity: 1
        },
        weights: {
            strength: 3,
            sweetness: 6,
            sourness: 0,
            bitterness: 2,
            thickness: 9,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Espresso Martini",
        liquor: "",
        scores: {
            strength: 3,
            sweetness: 5,
            sourness: 1,
            bitterness: 3,
            thickness: 4,
            rarity: 1
        },
        weights: {
            strength: 3,
            sweetness: 5,
            sourness: 0,
            bitterness: 5,
            thickness: 4,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Irish Coffee",
        liquor: "",
        scores: {
            strength: 2,
            sweetness: 2,
            sourness: 1,
            bitterness: 4,
            thickness: 5,
            rarity: 1
        },
        weights: {
            strength: 4,
            sweetness: 3,
            sourness: 0,
            bitterness: 5,
            thickness: 6,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Tom Collins",
        liquor: "",
        scores: {
            strength: 2,
            sweetness: 4,
            sourness: 4,
            bitterness: 1,
            thickness: 2,
            rarity: 1
        },
        weights: {
            strength: 2,
            sweetness: 4,
            sourness: 6,
            bitterness: 0,
            thickness: 2,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "French 75",
        liquor: "",
        scores: {
            strength: 3,
            sweetness: 3,
            sourness: 3,
            bitterness: 1,
            thickness: 2,
            rarity: 1
        },
        weights: {
            strength: 2,
            sweetness: 4,
            sourness: 6,
            bitterness: 0,
            thickness: 2,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Mimosa",
        liquor: "",
        scores: {
            strength: 1,
            sweetness: 3,
            sourness: 2,
            bitterness: 1,
            thickness: 2,
            rarity: 1
        },
        weights: {
            strength: 1,
            sweetness: 4,
            sourness: 3,
            bitterness: 0,
            thickness: 2,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Moscow Mule",
        liquor: "",
        scores: {
            strength: 2,
            sweetness: 3,
            sourness: 2,
            bitterness: 1,
            thickness: 1,
            rarity: 1
        },
        weights: {
            strength: 2,
            sweetness: 4,
            sourness: 3,
            bitterness: 0,
            thickness: 1,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Paloma",
        liquor: "",
        scores: {
            strength: 2,
            sweetness: 3,
            sourness: 4,
            bitterness: 2,
            thickness: 2,
            rarity: 1
        },
        weights: {
            strength: 2,
            sweetness: 4,
            sourness: 6,
            bitterness: 3,
            thickness: 2,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Dark 'n' Stormy",
        liquor: "",
        scores: {
            strength: 2,
            sweetness: 3,
            sourness: 2,
            bitterness: 1,
            thickness: 1,
            rarity: 1
        },
        weights: {
            strength: 2,
            sweetness: 4,
            sourness: 3,
            bitterness: 0,
            thickness: 2,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Mai Tai",
        liquor: "",
        scores: {
            strength: 4,
            sweetness: 6,
            sourness: 5,
            bitterness: 1,
            thickness: 3,
            rarity: 3
        },
        weights: {
            strength: 4,
            sweetness: 6,
            sourness: 7,
            bitterness: 0,
            thickness: 4,
            rarity: 3
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Zombie",
        liquor: "",
        scores: {
            strength: 4,
            sweetness: 4,
            sourness: 4,
            bitterness: 1,
            thickness: 3,
            rarity: 4
        },
        weights: {
            strength: 5,
            sweetness: 5,
            sourness: 5,
            bitterness: 0,
            thickness: 4,
            rarity: 4
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Aviation",
        liquor: "",
        scores: {
            strength: 4,
            sweetness: 3,
            sourness: 5,
            bitterness: 1,
            thickness: 2,
            rarity: 5
        },
        weights: {
            strength: 4,
            sweetness: 3,
            sourness: 6,
            bitterness: 0,
            thickness: 2,
            rarity: 6
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Corpse Reviver #2",
        liquor: "",
        scores: {
            strength: 4,
            sweetness: 4,
            sourness: 5,
            bitterness: 1,
            thickness: 3,
            rarity: 3
        },
        weights: {
            strength: 4,
            sweetness: 4,
            sourness: 6,
            bitterness: 2,
            thickness: 2,
            rarity: 3
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Vodka Soda",
        liquor: "",
        scores: {
            strength: 2,
            sweetness: 1,
            sourness: 1,
            bitterness: 1,
            thickness: 1,
            rarity: 1
        },
        weights: {
            strength: 5,
            sweetness: 3,
            sourness: 0,
            bitterness: 0,
            thickness: 1,
            rarity: 1
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Bamboo",
        liquor: "",
        scores: {
            strength: 3,
            sweetness: 1,
            sourness: 1,
            bitterness: 3,
            thickness: 3,
            rarity: 4
        },
        weights: {
            strength: 3,
            sweetness: 3,
            sourness: 1,
            bitterness: 5,
            thickness: 5,
            rarity: 4
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Cocoa Puff",
        liquor: "",
        scores: {
            strength: 5,
            sweetness: 6,
            sourness: 1,
            bitterness: 3,
            thickness: 3,
            rarity: 7
        },
        weights: {
            strength: 5,
            sweetness: 7,
            sourness: 0,
            bitterness: 4,
            thickness: 3,
            rarity: 7
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Lemon Meringue Pie",
        liquor: "",
        scores: {
            strength: 2,
            sweetness: 6,
            sourness: 4,
            bitterness: 1,
            thickness: 5,
            rarity: 6
        },
        weights: {
            strength: 2,
            sweetness: 8,
            sourness: 6,
            bitterness: 0,
            thickness: 7,
            rarity: 6
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Purple",
        liquor: "",
        scores: {
            strength: 3,
            sweetness: 6,
            sourness: 5,
            bitterness: 1,
            thickness: 4,
            rarity: 5
        },
        weights: {
            strength: 3,
            sweetness: 6,
            sourness: 6,
            bitterness: 0,
            thickness: 4,
            rarity: 6
        },
        description: "",
        ingredients: ""
    },
    {
        name: "The Conference",
        liquor: "",
        scores: {
            strength: 7,
            sweetness: 2,
            sourness: 1,
            bitterness: 4,
            thickness: 3,
            rarity: 6
        },
        weights: {
            strength: 9,
            sweetness: 3,
            sourness: 0,
            bitterness: 5,
            thickness: 3,
            rarity: 6
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Creamy Tiki",
        liquor: "",
        scores: {
            strength: 4,
            sweetness: 6,
            sourness: 4,
            bitterness: 1,
            thickness: 5,
            rarity: 3
        },
        weights: {
            strength: 4,
            sweetness: 6,
            sourness: 4,
            bitterness: 0,
            thickness: 6,
            rarity: 3
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Rum Flip",
        liquor: "",
        scores: {
            strength: 5,
            sweetness: 2,
            sourness: 1,
            bitterness: 1,
            thickness: 6,
            rarity: 3
        },
        weights: {
            strength: 6,
            sweetness: 2,
            sourness: 0,
            bitterness: 0,
            thickness: 9,
            rarity: 3
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Cinnamon Girl",
        liquor: "",
        scores: {
            strength: 5,
            sweetness: 3,
            sourness: 4,
            bitterness: 1,
            thickness: 3,
            rarity: 4
        },
        weights: {
            strength: 5,
            sweetness: 4,
            sourness: 5,
            bitterness: 0,
            thickness: 3,
            rarity: 4
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Cucumber Thai",
        liquor: "",
        scores: {
            strength: 3,
            sweetness: 3,
            sourness: 5,
            bitterness: 1,
            thickness: 3,
            rarity: 5
        },
        weights: {
            strength: 3,
            sweetness: 4,
            sourness: 5,
            bitterness: 0,
            thickness: 3,
            rarity: 5
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Le CouCou",
        liquor: "",
        scores: {
            strength: 5,
            sweetness: 4,
            sourness: 2,
            bitterness: 2,
            thickness: 3,
            rarity: 7
        },
        weights: {
            strength: 5,
            sweetness: 4,
            sourness: 2,
            bitterness: 2,
            thickness: 4,
            rarity: 7
        },
        description: "",
        ingredients: ""
    },
    {
        name: "Mezcal Margarita",
        liquor: "",
        scores: {
            strength: 4,
            sweetness: 3,
            sourness: 5,
            bitterness: 1,
            thickness: 2,
            rarity: 3
        },
        weights: {
            strength: 4,
            sweetness: 4,
            sourness: 7,
            bitterness: 0,
            thickness: 2,
            rarity: 3
        },
        description: "",
        ingredients: ""
    }
];