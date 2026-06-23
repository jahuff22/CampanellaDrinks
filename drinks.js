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
        liquor: "Tequila",
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
        description: "A bright tequila sour with lime and orange liqueur, usually served with a salted rim.",
        ingredients: "Tequila, lime juice, orange liqueur, simple syrup or agave, salt rim."
    },
    {
        name: "Old Fashioned",
        liquor: "Whiskey",
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
        description: "A spirit-forward whiskey cocktail lightly sweetened and seasoned with bitters.",
        ingredients: "Bourbon or rye whiskey, sugar cube or simple syrup, Angostura bitters, orange peel."
    },
    {
        name: "Mojito",
        liquor: "White rum",
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
        description: "A refreshing Cuban highball built around rum, mint, lime, sugar, and soda.",
        ingredients: "White rum, lime juice, mint leaves, sugar or simple syrup, soda water."
    },
    {
        name: "Gin & Tonic",
        liquor: "Gin",
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
        description: "A crisp, simple highball that pairs botanical gin with bitter, bubbly tonic water.",
        ingredients: "Gin, tonic water, lime wedge."
    },
    {
        name: "Whiskey Sour",
        liquor: "Whiskey",
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
        description: "A classic sour balancing whiskey with lemon and sugar, often given a silky texture with egg white.",
        ingredients: "Bourbon or rye whiskey, lemon juice, simple syrup, optional egg white, bitters."
    },
    {
        name: "Sidecar",
        liquor: "Cognac",
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
        description: "A tart, elegant brandy sour made with cognac, orange liqueur, and lemon.",
        ingredients: "Cognac, orange liqueur, lemon juice, optional sugar rim."
    },
    {
        name: "Piña Colada",
        liquor: "Rum",
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
        description: "A creamy tropical rum drink built around pineapple and coconut.",
        ingredients: "White rum, pineapple juice, cream of coconut, lime juice."
    },
    {
        name: "White Sangria",
        liquor: "White wine",
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
        description: "A fruit-forward wine punch made with white wine, citrus, fruit, and a touch of sweetness.",
        ingredients: "White wine, brandy or orange liqueur, citrus fruit, seasonal fruit, sugar or simple syrup, soda water."
    },
    {
        name: "Red Sangria",
        liquor: "Red wine",
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
        description: "A Spanish-style wine punch with red wine, fruit, citrus, and a little spirit or sweetness.",
        ingredients: "Red wine, brandy or orange liqueur, orange, lemon, apple or berries, sugar or simple syrup, soda water."
    },
    {
        name: "Martini",
        liquor: "Gin",
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
        description: "A dry, spirit-forward cocktail of gin and vermouth, served chilled and usually garnished with olive or lemon.",
        ingredients: "Gin, dry vermouth, orange bitters if desired, olive or lemon twist."
    },
    {
        name: "Bloody Mary",
        liquor: "Vodka",
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
        description: "A savory brunch cocktail mixing vodka with tomato, citrus, spice, and umami seasonings.",
        ingredients: "Vodka, tomato juice, lemon juice, Worcestershire sauce, hot sauce, horseradish, celery salt, black pepper."
    },
    {
        name: "Negroni",
        liquor: "Gin",
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
        description: "A bittersweet Italian aperitif cocktail made in equal parts gin, Campari, and sweet vermouth.",
        ingredients: "Gin, Campari, sweet vermouth, orange peel."
    },
    {
        name: "Americano",
        liquor: "Campari",
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
        description: "A light, bitter aperitivo that lengthens Campari and sweet vermouth with soda water.",
        ingredients: "Campari, sweet vermouth, soda water, orange slice."
    },
    {
        name: "Aperol Spritz",
        liquor: "Aperol",
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
        description: "A low-ABV Italian spritz with bright orange bitterness, sparkling wine, and soda.",
        ingredients: "Aperol, prosecco, soda water, orange slice."
    },
    {
        name: "Last Word",
        liquor: "Gin",
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
        description: "A sharp, herbal, equal-parts cocktail balancing gin, Chartreuse, maraschino, and lime.",
        ingredients: "Gin, green Chartreuse, maraschino liqueur, lime juice."
    },
    {
        name: "Manhattan",
        liquor: "Whiskey",
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
        description: "A classic whiskey cocktail with sweet vermouth and bitters, stirred and served up.",
        ingredients: "Rye or bourbon whiskey, sweet vermouth, Angostura bitters, cherry."
    },
    {
        name: "Sazerac",
        liquor: "Rye whiskey",
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
        description: "A New Orleans classic combining rye, sugar, bitters, and an absinthe-rinsed glass.",
        ingredients: "Rye whiskey, sugar cube or simple syrup, Peychaud's bitters, absinthe rinse, lemon peel."
    },
    {
        name: "Mint Julep",
        liquor: "Bourbon",
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
        description: "A cold, minty bourbon drink traditionally served over crushed ice.",
        ingredients: "Bourbon, mint leaves, simple syrup or sugar, crushed ice."
    },
    {
        name: "Daiquiri",
        liquor: "White rum",
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
        description: "A clean rum sour made with lime and sugar, served shaken and chilled.",
        ingredients: "White rum, lime juice, simple syrup."
    },
    {
        name: "Coffee Flip",
        liquor: "Brandy",
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
        description: "A rich flip-style dessert cocktail using coffee flavor, spirit, sweetness, and whole egg.",
        ingredients: "Brandy, coffee liqueur or strong coffee syrup, simple syrup, whole egg, grated nutmeg."
    },
    {
        name: "Ramos Gin Fizz",
        liquor: "Gin",
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
        description: "A famous New Orleans fizz with gin, citrus, cream, egg white, orange flower water, and soda.",
        ingredients: "Gin, lemon juice, lime juice, simple syrup, cream, egg white, orange flower water, soda water."
    },
    {
        name: "Brandy Alexander",
        liquor: "Brandy",
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
        description: "A creamy dessert cocktail combining brandy, creme de cacao, and cream.",
        ingredients: "Brandy or cognac, dark creme de cacao, cream, grated nutmeg."
    },
    {
        name: "Espresso Martini",
        liquor: "Vodka",
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
        description: "A modern classic that shakes vodka, coffee liqueur, and espresso into a foamy cocktail.",
        ingredients: "Vodka, coffee liqueur, fresh espresso, simple syrup."
    },
    {
        name: "Irish Coffee",
        liquor: "Irish whiskey",
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
        description: "A warm coffee cocktail sweetened with sugar and topped with lightly whipped cream.",
        ingredients: "Irish whiskey, hot coffee, brown sugar or simple syrup, lightly whipped cream."
    },
    {
        name: "Tom Collins",
        liquor: "Gin",
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
        description: "A tall gin sour lengthened with soda water for a crisp, fizzy finish.",
        ingredients: "Gin, lemon juice, simple syrup, soda water, lemon wheel, cherry."
    },
    {
        name: "French 75",
        liquor: "Gin",
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
        description: "A sparkling gin sour topped with Champagne or dry sparkling wine.",
        ingredients: "Gin, lemon juice, simple syrup, Champagne or sparkling wine, lemon twist."
    },
    {
        name: "Mimosa",
        liquor: "Sparkling wine",
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
        description: "A simple brunch cocktail of sparkling wine and orange juice.",
        ingredients: "Sparkling wine, orange juice."
    },
    {
        name: "Moscow Mule",
        liquor: "Vodka",
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
        description: "A spicy, fizzy vodka highball with ginger beer and lime.",
        ingredients: "Vodka, ginger beer, lime juice, lime wedge."
    },
    {
        name: "Paloma",
        liquor: "Tequila",
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
        description: "A refreshing tequila highball with grapefruit, lime, and a lightly salty edge.",
        ingredients: "Tequila, grapefruit soda or grapefruit juice, lime juice, salt."
    },
    {
        name: "Dark 'n' Stormy",
        liquor: "Dark rum",
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
        description: "A bold rum highball pairing dark rum with spicy ginger beer and lime.",
        ingredients: "Dark rum, ginger beer, lime juice or lime wedge."
    },
    {
        name: "Mai Tai",
        liquor: "Rum",
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
        description: "A classic tiki cocktail mixing rum with lime, orange liqueur, and almond orgeat.",
        ingredients: "Aged rum, lime juice, orange curaçao, orgeat, simple syrup, mint."
    },
    {
        name: "Zombie",
        liquor: "Rum",
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
        description: "A strong tiki drink layering multiple rums with citrus, spice, and tropical sweetness.",
        ingredients: "Light rum, dark rum, overproof rum, lime juice, grapefruit juice, cinnamon syrup, falernum, grenadine, bitters, absinthe."
    },
    {
        name: "Aviation",
        liquor: "Gin",
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
        description: "A floral gin sour with maraschino, lemon, and violet liqueur.",
        ingredients: "Gin, maraschino liqueur, lemon juice, creme de violette."
    },
    {
        name: "Corpse Reviver #2",
        liquor: "Gin",
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
        description: "A tart and aromatic equal-parts gin cocktail with citrus, orange liqueur, aromatized wine, and absinthe.",
        ingredients: "Gin, Cointreau, Lillet Blanc or Cocchi Americano, lemon juice, absinthe rinse."
    },
    {
        name: "Vodka Soda",
        liquor: "Vodka",
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
        description: "A dry, clean vodka highball with soda water and citrus.",
        ingredients: "Vodka, soda water, lime wedge."
    },
    {
        name: "Bamboo",
        liquor: "Sherry",
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
        description: "A low-ABV classic that combines sherry, dry vermouth, and bitters.",
        ingredients: "Dry sherry, dry vermouth, orange bitters, Angostura bitters, lemon twist."
    },
    {
        name: "Cocoa Puff",
        liquor: "BESPOKE",
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
        description: "BESPOKE",
        ingredients: "BESPOKE"
    },
    {
        name: "Lemon Meringue Pie",
        liquor: "BESPOKE",
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
        description: "BESPOKE",
        ingredients: "BESPOKE"
    },
    {
        name: "Purple",
        liquor: "BESPOKE",
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
        description: "BESPOKE",
        ingredients: "BESPOKE"
    },
    {
        name: "The Conference",
        liquor: "BESPOKE",
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
        description: "BESPOKE",
        ingredients: "BESPOKE"
    },
    {
        name: "Creamy Tiki",
        liquor: "BESPOKE",
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
        description: "BESPOKE",
        ingredients: "BESPOKE"
    },
    {
        name: "Rum Flip",
        liquor: "BESPOKE",
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
        description: "BESPOKE",
        ingredients: "BESPOKE"
    },
    {
        name: "Cinnamon Girl",
        liquor: "BESPOKE",
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
        description: "BESPOKE",
        ingredients: "BESPOKE"
    },
    {
        name: "Cucumber Thai",
        liquor: "BESPOKE",
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
        description: "BESPOKE",
        ingredients: "BESPOKE"
    },
    {
        name: "Le CouCou",
        liquor: "BESPOKE",
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
        description: "BESPOKE",
        ingredients: "BESPOKE"
    },
    {
        name: "Mezcal Margarita",
        liquor: "BESPOKE",
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
        description: "BESPOKE",
        ingredients: "BESPOKE"
    }
];