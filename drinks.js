const traits = [
    "strength",
    "sweetness",
    "sourness",
    "bitterness",
    "thickness",
    "rarity"
];

const defaultDrinks = [
    {
        "name": "Amaretto Sour",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker",
            "Hedonist"
        ],
        "scores": {
            "strength": 3,
            "sweetness": 4,
            "sourness": 4,
            "bitterness": 1,
            "thickness": 2,
            "rarity": 4,
            "masculinity": 0,
            "calories": 3
        },
        "description": "Amaretto, lemon juice and simple syrup, shaken with egg white.",
        "ingredients": "Amaretto, lemon juice and simple syrup, shaken with egg white."
    },
    {
        "name": "Americano",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Bittersweet"
        ],
        "scores": {
            "strength": 1,
            "sweetness": 3,
            "sourness": 1,
            "bitterness": 5,
            "thickness": 2,
            "rarity": 2,
            "masculinity": 1,
            "calories": 3
        },
        "description": "Campari and sweet vermouth, topped with soda water.",
        "ingredients": "Campari and sweet vermouth, topped with soda water."
    },
    {
        "name": "Hugo Spritz",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker",
            "Harmonist"
        ],
        "scores": {
            "strength": 2,
            "sweetness": 4,
            "sourness": 2,
            "bitterness": 1,
            "thickness": 1,
            "rarity": 1,
            "masculinity": 0,
            "calories": 3
        },
        "description": "Elderflower liqueur, lemon and mint, topped with prosecco and club soda.",
        "ingredients": "Elderflower liqueur, lemon and mint, topped with prosecco and club soda."
    },
    {
        "name": "Bee's Knees",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker",
            "Harmonist"
        ],
        "scores": {
            "strength": 4,
            "sweetness": 4,
            "sourness": 4,
            "bitterness": 1,
            "thickness": 2,
            "rarity": 3,
            "masculinity": 0,
            "calories": 3
        },
        "description": "Gin, honey syrup and lemon juice.",
        "ingredients": "Gin, honey syrup and lemon juice."
    },
    {
        "name": "Boulevardier",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Purist",
            "Bittersweet"
        ],
        "scores": {
            "strength": 6,
            "sweetness": 3,
            "sourness": 1,
            "bitterness": 6,
            "thickness": 3,
            "rarity": 3,
            "masculinity": 1,
            "calories": 3
        },
        "description": "Bourbon, Campari and sweet vermouth.",
        "ingredients": "Bourbon, Campari and sweet vermouth."
    },
    {
        "name": "Bramble",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker"
        ],
        "scores": {
            "strength": 4,
            "sweetness": 4,
            "sourness": 4,
            "bitterness": 1,
            "thickness": 2,
            "rarity": 3,
            "masculinity": 0,
            "calories": 3
        },
        "description": "Gin, lemon juice and simple syrup, topped with blackberry liqueur.",
        "ingredients": "Gin, lemon juice and simple syrup, topped with blackberry liqueur."
    },
    {
        "name": "Brandy Alexander",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Hedonist"
        ],
        "scores": {
            "strength": 3,
            "sweetness": 6,
            "sourness": 1,
            "bitterness": 1,
            "thickness": 7,
            "rarity": 2,
            "masculinity": 0,
            "calories": 7
        },
        "description": "Brandy, crème de cacao and cream.",
        "ingredients": "Brandy, crème de cacao and cream."
    },
    {
        "name": "Clover Club",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker",
            "Harmonist"
        ],
        "scores": {
            "strength": 4,
            "sweetness": 4,
            "sourness": 4,
            "bitterness": 1,
            "thickness": 3,
            "rarity": 3,
            "masculinity": 0,
            "calories": 4
        },
        "description": "Gin, lemon juice, raspberry syrup and egg white.",
        "ingredients": "Gin, lemon juice, raspberry syrup and egg white."
    },
    {
        "name": "Corpse Reviver #2",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker"
        ],
        "scores": {
            "strength": 4,
            "sweetness": 4,
            "sourness": 5,
            "bitterness": 1,
            "thickness": 3,
            "rarity": 4,
            "masculinity": 1,
            "calories": 4
        },
        "description": "Gin, Cointreau, Lillet Blanc and lemon juice, with an absinthe rinse.",
        "ingredients": "Gin, Cointreau, Lillet Blanc and lemon juice, with an absinthe rinse."
    },
    {
        "name": "Cosmopolitan",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker"
        ],
        "scores": {
            "strength": 3,
            "sweetness": 3,
            "sourness": 3,
            "bitterness": 1,
            "thickness": 2,
            "rarity": 1,
            "masculinity": 0,
            "calories": 3
        },
        "description": "Vodka, triple sec, lime juice and cranberry juice.",
        "ingredients": "Vodka, triple sec, lime juice and cranberry juice."
    },
    {
        "name": "Daiquiri",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker"
        ],
        "scores": {
            "strength": 3,
            "sweetness": 3,
            "sourness": 4,
            "bitterness": 1,
            "thickness": 2,
            "rarity": 1,
            "masculinity": 0,
            "calories": 3
        },
        "description": "White rum, lime juice and simple syrup.",
        "ingredients": "White rum, lime juice and simple syrup."
    },
    {
        "name": "Dark 'n' Stormy",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker"
        ],
        "scores": {
            "strength": 2,
            "sweetness": 3,
            "sourness": 2,
            "bitterness": 1,
            "thickness": 2,
            "rarity": 2,
            "masculinity": 1,
            "calories": 3
        },
        "description": "Dark rum topped with ginger beer, with a lime squeeze.",
        "ingredients": "Dark rum topped with ginger beer, with a lime squeeze."
    },
    {
        "name": "Carajillo",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Hedonist",
            "Bittersweet",
            "Harmonist"
        ],
        "scores": {
            "strength": 3,
            "sweetness": 5,
            "sourness": 1,
            "bitterness": 2,
            "thickness": 4,
            "rarity": 1,
            "masculinity": 1,
            "calories": 5
        },
        "description": "Espresso and Licor 43.",
        "ingredients": "Espresso and Licor 43."
    },
    {
        "name": "French 75",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker"
        ],
        "scores": {
            "strength": 3,
            "sweetness": 3,
            "sourness": 3,
            "bitterness": 1,
            "thickness": 2,
            "rarity": 2,
            "masculinity": 0,
            "calories": 3
        },
        "description": "Gin, lemon juice and simple syrup, topped with champagne.",
        "ingredients": "Gin, lemon juice and simple syrup, topped with champagne."
    },
    {
        "name": "French Martini",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker",
            "Hedonist"
        ],
        "scores": {
            "strength": 3,
            "sweetness": 5,
            "sourness": 2,
            "bitterness": 1,
            "thickness": 2,
            "rarity": 2,
            "masculinity": 0,
            "calories": 4
        },
        "description": "Vodka, pineapple juice and Chambord.",
        "ingredients": "Vodka, pineapple juice and Chambord."
    },
    {
        "name": "Gimlet",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Purist",
            "Sunseeker"
        ],
        "scores": {
            "strength": 5,
            "sweetness": 2,
            "sourness": 4,
            "bitterness": 1,
            "thickness": 2,
            "rarity": 3,
            "masculinity": 1,
            "calories": 2
        },
        "description": "Gin, lime juice, simple syrup.",
        "ingredients": "Gin, lime juice, simple syrup."
    },
    {
        "name": "Gold Rush",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Purist",
            "Sunseeker"
        ],
        "scores": {
            "strength": 4,
            "sweetness": 4,
            "sourness": 4,
            "bitterness": 1,
            "thickness": 2,
            "rarity": 3,
            "masculinity": 1,
            "calories": 3
        },
        "description": "Bourbon, honey syrup and lemon juice.",
        "ingredients": "Bourbon, honey syrup and lemon juice."
    },
    {
        "name": "Grasshopper",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Hedonist"
        ],
        "scores": {
            "strength": 2,
            "sweetness": 6,
            "sourness": 1,
            "bitterness": 1,
            "thickness": 6,
            "rarity": 3,
            "masculinity": 0,
            "calories": 6
        },
        "description": "Crème de menthe, crème de cacao and cream.",
        "ingredients": "Crème de menthe, crème de cacao and cream."
    },
    {
        "name": "Last Word",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker",
            "Adventurer"
        ],
        "scores": {
            "strength": 5,
            "sweetness": 4,
            "sourness": 5,
            "bitterness": 2,
            "thickness": 2,
            "rarity": 6,
            "masculinity": 1,
            "calories": 3
        },
        "description": "Equal parts gin, green Chartreuse, maraschino liqueur and lime juice.",
        "ingredients": "Equal parts gin, green Chartreuse, maraschino liqueur and lime juice."
    },
    {
        "name": "Lemon Drop",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker"
        ],
        "scores": {
            "strength": 3,
            "sweetness": 4,
            "sourness": 4,
            "bitterness": 1,
            "thickness": 2,
            "rarity": 1,
            "masculinity": 0,
            "calories": 3
        },
        "description": "Vodka, triple sec and lemon juice, sugar rim.",
        "ingredients": "Vodka, triple sec and lemon juice, sugar rim."
    },
    {
        "name": "Mai Tai",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker",
            "Adventurer"
        ],
        "scores": {
            "strength": 4,
            "sweetness": 5,
            "sourness": 4,
            "bitterness": 1,
            "thickness": 3,
            "rarity": 4,
            "masculinity": 1,
            "calories": 4
        },
        "description": "Rum, orange curaçao, orgeat and lime juice.",
        "ingredients": "Rum, orange curaçao, orgeat and lime juice."
    },
    {
        "name": "Jungle Bird",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Bittersweet",
            "Adventurer"
        ],
        "scores": {
            "strength": 4,
            "sweetness": 4,
            "sourness": 3,
            "bitterness": 4,
            "thickness": 3,
            "rarity": 5,
            "masculinity": 1,
            "calories": 4
        },
        "description": "Dark rum, Campari, pineapple juice, lime juice and simple syrup.",
        "ingredients": "Dark rum, Campari, pineapple juice, lime juice and simple syrup."
    },
    {
        "name": "Mezcal Negroni",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Bittersweet",
            "Adventurer"
        ],
        "scores": {
            "strength": 5,
            "sweetness": 3,
            "sourness": 1,
            "bitterness": 7,
            "thickness": 3,
            "rarity": 5,
            "masculinity": 1,
            "calories": 3
        },
        "description": "Mezcal, Campari and sweet vermouth.",
        "ingredients": "Mezcal, Campari and sweet vermouth."
    },
    {
        "name": "Mint Julep",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Purist"
        ],
        "scores": {
            "strength": 7,
            "sweetness": 3,
            "sourness": 1,
            "bitterness": 1,
            "thickness": 3,
            "rarity": 1,
            "masculinity": 1,
            "calories": 3
        },
        "description": "Bourbon, mint and simple syrup, over crushed ice.",
        "ingredients": "Bourbon, mint and simple syrup, over crushed ice."
    },
    {
        "name": "Mojito",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker"
        ],
        "scores": {
            "strength": 3,
            "sweetness": 4,
            "sourness": 3,
            "bitterness": 1,
            "thickness": 2,
            "rarity": 1,
            "masculinity": 1,
            "calories": 3
        },
        "description": "White rum, lime, mint and sugar, topped with soda water.",
        "ingredients": "White rum, lime, mint and sugar, topped with soda water."
    },
    {
        "name": "Moscow Mule",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker"
        ],
        "scores": {
            "strength": 2,
            "sweetness": 3,
            "sourness": 2,
            "bitterness": 1,
            "thickness": 2,
            "rarity": 1,
            "masculinity": 1,
            "calories": 3
        },
        "description": "Vodka and lime juice, topped with ginger beer.",
        "ingredients": "Vodka and lime juice, topped with ginger beer."
    },
    {
        "name": "Naked and Famous",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Adventurer"
        ],
        "scores": {
            "strength": 4,
            "sweetness": 3,
            "sourness": 4,
            "bitterness": 3,
            "thickness": 2,
            "rarity": 7,
            "masculinity": 1,
            "calories": 3
        },
        "description": "Equal parts mezcal, Aperol, yellow Chartreuse and lime juice.",
        "ingredients": "Equal parts mezcal, Aperol, yellow Chartreuse and lime juice."
    },
    {
        "name": "Negroni",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Purist",
            "Bittersweet"
        ],
        "scores": {
            "strength": 5,
            "sweetness": 3,
            "sourness": 1,
            "bitterness": 7,
            "thickness": 3,
            "rarity": 1,
            "masculinity": 1,
            "calories": 3
        },
        "description": "Gin, Campari and sweet vermouth.",
        "ingredients": "Gin, Campari and sweet vermouth."
    },
    {
        "name": "Old Fashioned",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Purist"
        ],
        "scores": {
            "strength": 6,
            "sweetness": 3,
            "sourness": 1,
            "bitterness": 2,
            "thickness": 3,
            "rarity": 1,
            "masculinity": 1,
            "calories": 3
        },
        "description": "Bourbon (or rye), sugar and bitters.",
        "ingredients": "Bourbon (or rye), sugar and bitters."
    },
    {
        "name": "Painkiller",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Hedonist"
        ],
        "scores": {
            "strength": 3,
            "sweetness": 6,
            "sourness": 2,
            "bitterness": 1,
            "thickness": 6,
            "rarity": 3,
            "masculinity": 0,
            "calories": 6
        },
        "description": "Dark rum, pineapple juice, orange juice and cream of coconut.",
        "ingredients": "Dark rum, pineapple juice, orange juice and cream of coconut."
    },
    {
        "name": "Paloma",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker"
        ],
        "scores": {
            "strength": 2,
            "sweetness": 3,
            "sourness": 4,
            "bitterness": 2,
            "thickness": 2,
            "rarity": 2,
            "masculinity": 0,
            "calories": 3
        },
        "description": "Tequila and grapefruit soda with a squeeze of lime.",
        "ingredients": "Tequila and grapefruit soda with a squeeze of lime."
    },
    {
        "name": "Paper Plane",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Bittersweet",
            "Adventurer"
        ],
        "scores": {
            "strength": 4,
            "sweetness": 3,
            "sourness": 4,
            "bitterness": 5,
            "thickness": 2,
            "rarity": 6,
            "masculinity": 1,
            "calories": 3
        },
        "description": "Equal parts bourbon, Aperol, Amaro Nonino and lemon juice.",
        "ingredients": "Equal parts bourbon, Aperol, Amaro Nonino and lemon juice."
    },
    {
        "name": "Penicillin",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Purist",
            "Adventurer"
        ],
        "scores": {
            "strength": 4,
            "sweetness": 4,
            "sourness": 4,
            "bitterness": 3,
            "thickness": 4,
            "rarity": 7,
            "masculinity": 1,
            "calories": 4
        },
        "description": "Blended scotch, lemon juice and honey-ginger syrup, floated with smoky scotch.",
        "ingredients": "Blended scotch, lemon juice and honey-ginger syrup, floated with smoky scotch."
    },
    {
        "name": "Pisco Sour",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker",
            "Harmonist"
        ],
        "scores": {
            "strength": 3,
            "sweetness": 3,
            "sourness": 4,
            "bitterness": 1,
            "thickness": 3,
            "rarity": 3,
            "masculinity": 0,
            "calories": 3
        },
        "description": "Pisco, lime juice, simple syrup and egg white, topped with angostura bitters",
        "ingredients": "Pisco, lime juice, simple syrup and egg white, topped with angostura bitters"
    },
    {
        "name": "Sazerac",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Purist",
            "Bittersweet"
        ],
        "scores": {
            "strength": 7,
            "sweetness": 2,
            "sourness": 1,
            "bitterness": 3,
            "thickness": 3,
            "rarity": 4,
            "masculinity": 1,
            "calories": 3
        },
        "description": "Rye whiskey, sugar and Peychaud's bitters, with an absinthe rinse.",
        "ingredients": "Rye whiskey, sugar and Peychaud's bitters, with an absinthe rinse."
    },
    {
        "name": "Sidecar",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Purist",
            "Sunseeker"
        ],
        "scores": {
            "strength": 5,
            "sweetness": 3,
            "sourness": 4,
            "bitterness": 1,
            "thickness": 2,
            "rarity": 3,
            "masculinity": 1,
            "calories": 3
        },
        "description": "Cognac, triple sec and lemon juice.",
        "ingredients": "Cognac, triple sec and lemon juice."
    },
    {
        "name": "Tom Collins",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker",
            "Harmonist"
        ],
        "scores": {
            "strength": 2,
            "sweetness": 3,
            "sourness": 4,
            "bitterness": 1,
            "thickness": 2,
            "rarity": 2,
            "masculinity": 1,
            "calories": 3
        },
        "description": "Gin, lemon juice and simple syrup, topped with soda water.",
        "ingredients": "Gin, lemon juice and simple syrup, topped with soda water."
    },
    {
        "name": "Gin Fizz",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker",
            "Harmonist"
        ],
        "scores": {
            "strength": 3,
            "sweetness": 3,
            "sourness": 4,
            "bitterness": 1,
            "thickness": 3,
            "rarity": 4,
            "masculinity": 0,
            "calories": 3
        },
        "description": "Gin, lemon juice and simple syrup, shaken with egg white, topped with soda water.",
        "ingredients": "Gin, lemon juice and simple syrup, shaken with egg white, topped with soda water."
    },
    {
        "name": "Vieux Carré",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Purist",
            "Bittersweet"
        ],
        "scores": {
            "strength": 6,
            "sweetness": 3,
            "sourness": 1,
            "bitterness": 2,
            "thickness": 3,
            "rarity": 4,
            "masculinity": 1,
            "calories": 3
        },
        "description": "Rye whiskey, cognac, sweet vermouth, Bénédictine and bitters.",
        "ingredients": "Rye whiskey, cognac, sweet vermouth, Bénédictine and bitters."
    },
    {
        "name": "Whiskey Sour",
        "liquor": "Classic",
        "type": "Classic",
        "category": [
            "Sunseeker"
        ],
        "scores": {
            "strength": 3,
            "sweetness": 3,
            "sourness": 4,
            "bitterness": 1,
            "thickness": 4,
            "rarity": 1,
            "masculinity": 1,
            "calories": 4
        },
        "description": "Bourbon, lemon juice and simple syrup (egg white optional).",
        "ingredients": "Bourbon, lemon juice and simple syrup (egg white optional)."
    }
];

const restaurantDrinkRows = {
    testrest: [
        ["Margarita", "Classic", 3, 3, 4, 1, 2, 1, 1, 1, 0, "Sunseeker"],
        ["Old Fashioned", "Classic", 6, 3, 1, 2, 3, 1, 1, 1, 1, "Purist"],
        ["Mojito", "Classic", 3, 4, 3, 1, 2, 1, 1, 1, 1, "Sunseeker"],
        ["Gin & Tonic", "Classic", 2, 2, 1, 2, 1, 1, 1, 1, 1, "Harmonist/Bittersweet flex"],
        ["Whiskey Sour", "Classic", 3, 3, 4, 1, 4, 1, 1, 1, 1, "Sunseeker"],
        ["Sidecar", "Classic", 5, 3, 4, 1, 2, 1, 1, 2, 1, "Sunseeker/Purist flex"],
        ["Pina Colada", "Classic", 2, 7, 1, 1, 7, 1, 1, 1, 0, "Hedonist"],
        ["White Sangria", "Classic", 2, 3, 3, 1, 2, 1, 1, 1, 0, "Sunseeker/harmonist flex"],
        ["Red Sangria", "Classic", 2, 3, 2, 1, 2, 1, 1, 1, 0, "Sunseeker/harmonist flex"],
        ["Martini", "Classic", 7, 1, 1, 1, 2, 1, 1, 1, 1, "Purist"],
        ["Bloody Mary", "Classic", 2, 2, 3, 1, 4, 2, 2, 2, 1, "Bittersweet/harmonist/adventurer flex"],
        ["Negroni", "Classic", 5, 3, 1, 7, 3, 1, 1, 1, 1, "Bittersweet (purist adjacent)"],
        ["Americano", "Classic", 1, 3, 1, 5, 2, 1, 1, 1, 1, "Bittersweet"],
        ["Aperol Spritz", "Classic", 2, 4, 1, 2, 1, 1, 1, 1, 0, "Bittersweet/sunseeker (harmomist adjacent)"],
        ["Last Word", "Classic", 5, 4, 5, 2, 4, 4, 4, 4, 0, "Sunseeker/adventurer"],
        ["Manhattan", "Classic", 6, 3, 1, 2, 2, 1, 1, 1, 1, "Purist"],
        ["Sazerac", "Classic", 7, 2, 1, 3, 3, 3, 3, 3, 1, "Purist/bittersweet"],
        ["Mint Julep", "Classic", 7, 3, 1, 1, 3, 1, 1, 1, 1, "Purist"],
        ["Daiquiri", "Classic", 3, 3, 4, 1, 2, 1, 1, 1, 0, "Sunseeker"],
        ["Coffee Flip", "Classic", 3, 5, 1, 1, 7, 2, 3, 3, 0, "Hedonist"],
        ["Ramos Gin Fizz", "Classic", 2, 3, 3, 1, 6, 3, 4, 4, 0, "Hedonist (harmonist adjacent)"],
        ["Brandy Alexander", "Classic", 3, 6, 1, 1, 7, 1, 1, 1, 0, "Hedonist"],
        ["Espresso Martini", "Classic", 3, 5, 1, 2, 4, 1, 1, 1, 0, "Harmonist/Bittersweet (hedonist adjacent)"],
        ["Irish Coffee", "Classic", 2, 3, 1, 3, 5, 1, 1, 1, 0, "Bittersweet/Hedonist"],
        ["Tom Collins", "Classic", 2, 3, 4, 1, 2, 1, 1, 1, 0, "Sunseeker (harmonist adjacent)"],
        ["French 75", "Classic", 3, 3, 3, 1, 2, 1, 1, 1, 0, "Sunseeker"],
        ["Mimosa", "Classic", 1, 3, 2, 1, 2, 1, 1, 1, 0, "Harmonist"],
        ["Moscow Mule", "Classic", 2, 3, 2, 1, 2, 1, 1, 1, 1, "Sunseeker"],
        ["Paloma", "Classic", 2, 3, 4, 2, 2, 1, 1, 1, 0, "Sunseeker"],
        ["Dark 'n' Stormy", "Classic", 2, 3, 2, 1, 2, 1, 1, 1, 1, "Sunseeker"],
        ["Mai Tai", "Classic", 4, 5, 4, 1, 3, 3, 2, 3, 0, "Sunseeker (adventurer adjacent)"],
        ["Zombie", "Classic", 5, 5, 4, 1, 3, 4, 4, 4, 0, "Sunseeker, Purist, Adventurer"],
        ["Aviation", "Classic", 5, 3, 4, 1, 2, 5, 4, 4, 0, "Sunseeker, Purist (harmonist adjacent)"],
        ["Corpse Reviver #2", "Classic", 4, 4, 5, 1, 3, 3, 3, 3, 0, "Sunseeker"],
        ["Vodka Soda", "Classic", 2, 1, 1, 1, 1, 1, 1, 1, 0, "Harmonist"],
        ["Bamboo", "Classic", 2, 1, 1, 3, 3, 3, 4, 4, 0, "Bittersweet, harmonist flex"],
        ["Cocoa Puff", "Bespoke", 5, 6, 1, 3, 3, 7, 6, 7, 1, "Adventurer (bittwesweet, hedonist adjacent)"],
        ["Lemon Meringue Pie", "Bespoke", 3, 5, 3, 1, 4, 5, 6, 6, 0, "Sunseeker (harmonist/indulgent adjacent)"],
        ["Purple", "Bespoke", 3, 4, 4, 1, 4, 5, 4, 5, 0, "Sunseeker"],
        ["The Conference", "Bespoke", 6, 3, 1, 2, 3, 5, 6, 6, 1, "Adventurer, purist flex"],
        ["Creamy Tiki", "Bespoke", 4, 6, 3, 1, 5, 3, 3, 3, 0, "Hedonist, Adventurer"],
        ["Rum Flip", "Bespoke", 5, 2, 1, 1, 6, 2, 3, 3, 0, "Hedonist, Adventurer"],
        ["Cinnamon Girl", "Bespoke", 3, 3, 4, 1, 3, 4, 4, 4, 1, "Sunseeker, Adventurer"],
        ["Cucumber Thai", "Bespoke", 3, 3, 4, 1, 4, 4, 5, 5, 0, "Sunseeker, Adventurer"],
        ["Le CouCou", "Bespoke", 3, 3, 2, 1, 3, 6, 7, 7, 1, "Adventurer (harmonsist flex)"],
        ["Mezcal Margarita", "Bespoke", 3, 3, 4, 1, 2, 3, 2, 3, 1, "Sunseeker, Adventurer flex"]
    ],
    gabriellas: [
        ["Yuzu Zaza", "Signature", 3, 3, 4, 1, 2, 3, 3, 3, 0, "Sunseeker (adventurer adjacent)", "Gray Whale Gin, honeydew, kiwi, yuzu, fresh lemon"],
        ["Ciao, Bella", "Signature", 3, 4, 3, 1, 2, 2, 2, 2, 0, "Sunseeker", "Tasmanian vodka, strawberry, mint, agave, lime"],
        ["Tomato-Tini", "Signature", 4, 1, 3, 1, 3, 4, 4, 4, 1, "Adventurer (bittersweet flex)", "ALB Vodka, tomato, white balsamic, lemon, black pepper"],
        ["POM.com", "Signature", 4, 4, 3, 2, 3, 2, 2, 2, 0, "Adventurer / bittersweet flex", "Highwest, St. Germain, pomegranate, Peychaud's"],
        ["Scorpio Season", "Signature", 4, 4, 3, 1, 3, 3, 3, 3, 1, "Adventurer", "Tanteo Jalapeno, Grand Marnier, blood orange"],
        ["Incompearable", "Signature", 3, 5, 3, 1, 3, 2, 2, 2, 0, "Harmonist (hedonist adjacent)", "Grey Goose Pear, St. Germain, pear, lemon"],
        ["Mia Margarita", "Signature", 3, 4, 4, 1, 3, 1, 1, 1, 0, "Sunseeker", "Patron Silver, passionfruit, agave, fresh lime"],
        ["Where's the Beach?!", "Signature", 3, 4, 3, 2, 2, 2, 2, 2, 0, "Sunseeker (bittersweet adjacent)", "Ketel One, Cointreau, Aperol, orange, lime"],
        ["Class Act", "Signature", 2, 5, 2, 1, 2, 3, 3, 3, 0, "Harmonist / hedonist flex", "Prosecco, St. Germain, fig, plum, thyme, honey"],
        ["Gondola Ride", "Signature", 3, 3, 3, 1, 2, 2, 2, 2, 0, "Sunseeker", "Hendrick's, watermelon, mint, lime"],
        ["White Lotus", "Signature", 4, 4, 3, 1, 3, 3, 3, 3, 1, "Adventurer (purist adjacent)", "Mi Campo, Mezcal Union, pear, honey, lemon"],
        ["Bad Berry", "Signature", 4, 4, 3, 1, 3, 2, 2, 2, 1, "Sunseeker / adventurer flex", "Don Julio Reposado, Grand Marnier, blackberry"],
        ["Applewood Smoked Old Fashioned", "Signature", 6, 3, 1, 2, 3, 3, 3, 3, 1, "Purist", "Widow Jane, sugar, bitters, applewood smoke"]
    ]
};

const customCocktailSourceRows = typeof customCocktailRows !== "undefined"
    ? customCocktailRows
    : (typeof window !== "undefined" && Array.isArray(window.customCocktailRows) ? window.customCocktailRows : []);

const restaurantDrinkSets = Object.fromEntries(
    Object.entries(restaurantDrinkRows).map(([restaurantSlug, rows]) => [
        restaurantSlug,
        rows.map(createRestaurantDrink)
    ])
);

if (customCocktailSourceRows.length) {
    restaurantDrinkSets.custom = customCocktailSourceRows.map(createCustomCocktailDrink);
}

let drinks = getActiveDrinkSet();

if (typeof window !== "undefined") {
    window.drinks = drinks;
    window.defaultDrinks = defaultDrinks;
    window.restaurantDrinkSets = restaurantDrinkSets;
    window.loadSavedDrinkSetForActiveRestaurant = loadSavedDrinkSetForActiveRestaurant;
    window.setActiveDrinkSet = setActiveDrinkSet;
    window.getActiveRestaurantSlug = getRestaurantSlugFromCurrentPath;
}

function createRestaurantDrink(row) {
    const [
        name,
        type,
        strength,
        sweetness,
        sourness,
        bitterness,
        thickness,
        rarityIngredients,
        rarityCombos,
        rarity,
        masculinity,
        personas,
        ingredients
    ] = row;

    return {
        name,
        liquor: type,
        type,
        category: parsePersonaCategories(personas),
        scores: {
            strength,
            sweetness,
            sourness,
            bitterness,
            thickness,
            rarity,
            rarityIngredients,
            rarityCombos,
            masculinity: toMasculinityFlag(masculinity),
            calories: 4
        },
        description: `${type} cocktail scored for ${personas}.`,
        ingredients: ingredients || "Ingredient list not provided."
    };
}

function createCustomCocktailDrink(row) {
    const recipeIngredients = extractRecipeIngredients(row.recipe);

    return {
        name: row.name,
        liquor: row.style,
        type: row.style,
        style: row.style,
        category: parsePersonaCategories(row.persona),
        scores: {
            strength: Number(row.strength) || 4,
            sweetness: Number(row.sweetness) || 4,
            sourness: Number(row.sourness) || 4,
            bitterness: Number(row.bitterness) || 4,
            thickness: Number(row.thickness) || 4,
            rarity: Number(row.rarity) || 4,
            masculinity: Number(row.masculinity) >= 1 ? 1 : 0,
            calories: 4
        },
        description: `${row.style} custom cocktail scored for ${row.persona}.`,
        ingredients: recipeIngredients.join(", "),
        recipe: row.recipe,
        process: row.process,
        complexity: row.complexity || "Accessible",
        customIngredients: recipeIngredients
    };
}

function extractRecipeIngredients(recipe) {
    return String(recipe || "")
        .split(/\r?\n/g)
        .map(cleanRecipeIngredient)
        .filter(Boolean);
}

function cleanRecipeIngredient(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/\([^)]*\)/g, "")
        .replace(/\btop with\b/g, "")
        .replace(/\bsmall handful(?: of)?\b/g, "")
        .replace(/\bmuddled\b/g, "")
        .replace(/\bcombined\b/g, "")
        .replace(/\bto top\b/g, "")
        .replace(/\bserved alongside\b/g, "")
        .replace(/\b\d+(?:\.\d+)?\s*(?:\/\s*\d+)?\s*(?:oz|ml|g|tsp|tbsp|barspoons?|barspoon|dashes|dash|drops|drop|pinch|slices?|wedges?|cups?|cup|bottle|gallon)\b/g, "")
        .replace(/\b\d+\s*\/\s*\d+\s*(?:oz|ml|g|tsp|tbsp|barspoons?|barspoon|dashes|dash|drops|drop|pinch|slices?|wedges?|cups?|cup)?\b/g, "")
        .replace(/\b\d+(?:\.\d+)?\b/g, "")
        .replace(/[:,].*$/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function toMasculinityFlag(value) {
    if (String(value).toLowerCase() === "yes") return 1;
    if (String(value).toLowerCase() === "no") return 0;
    const numberValue = Number(value);
    if (numberValue === 1) return 1;
    if (numberValue === 0) return 0;
    return numberValue >= 5 ? 1 : 0;
}

function parsePersonaCategories(personas) {
    const validPersonas = ["Purist", "Sunseeker", "Hedonist", "Bittersweet", "Adventurer", "Harmonist"];
    const normalized = String(personas || "").toLowerCase();
    const categories = validPersonas.filter(persona => normalized.includes(persona.toLowerCase()));
    return categories.length ? categories : ["Harmonist"];
}

function getActiveDrinkSet() {
    const restaurantSlug = getRestaurantSlugFromCurrentPath();
    return restaurantDrinkSets[restaurantSlug] || defaultDrinks;
}

async function loadSavedDrinkSetForActiveRestaurant() {
    const restaurantSlug = getRestaurantSlugFromCurrentPath();
    if (!restaurantSlug) return drinks;

    try {
        const response = await fetch(`/api/menu-data?restaurant=${encodeURIComponent(restaurantSlug)}`);
        const data = await response.json();

        if (response.ok && Array.isArray(data.drinks) && data.drinks.length) {
            setActiveDrinkSet(data.drinks);
        }
    } catch (error) {
        console.warn("Could not load saved restaurant menu.", error);
    }

    return drinks;
}

function setActiveDrinkSet(nextDrinks) {
    drinks = Array.isArray(nextDrinks) ? nextDrinks : getActiveDrinkSet();

    if (typeof window !== "undefined") {
        window.drinks = drinks;
    }

    return drinks;
}

function getRestaurantSlugFromCurrentPath() {
    if (typeof window === "undefined") return "";
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const restaurantIndex = pathParts.indexOf("r");
    if (restaurantIndex !== -1) return sanitizeDrinkSetSlug(pathParts[restaurantIndex + 1]);
    if (pathParts[0] === "customer" || pathParts[0] === "consumer") return "customer";
    if (pathParts[0] === "dashboard") return normalizeDrinkSetSlug(pathParts[1]);
    if (pathParts[1] === "dashboard") return normalizeDrinkSetSlug(pathParts[0]);
    if (pathParts.length >= 1 && pathParts.length <= 2 && !isReservedDrinkSetPath(pathParts[0])) {
        return sanitizeDrinkSetSlug(pathParts[0]);
    }
    return "";
}

function normalizeDrinkSetSlug(value) {
    const slug = sanitizeDrinkSetSlug(value);
    return slug === "consumer" ? "customer" : slug;
}

function sanitizeDrinkSetSlug(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function isReservedDrinkSetPath(value) {
    return ["api", "alpha", "business", "customer", "dashboard", "landing", "shared"].includes(String(value || "").toLowerCase());
}



