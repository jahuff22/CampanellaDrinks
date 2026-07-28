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
        name: "Amaretto Sour",
        liquor: "Amaretto",
        category: ["Sunseeker", "Hedonist"],
        scores: { strength: 3, sweetness: 4, sourness: 4, bitterness: 1, thickness: 2, rarity: 2, masculinity: 2, calories: 5 },
        description: "A nutty, sweet-tart sour built around amaretto, citrus, and a soft shaken texture.",
        ingredients: "Amaretto, lemon juice, simple syrup, optional bourbon, optional egg white."
    },
    {
        name: "Americano",
        liquor: "Campari",
        category: ["Bittersweet"],
        scores: { strength: 1, sweetness: 3, sourness: 1, bitterness: 5, thickness: 2, rarity: 2, masculinity: 6, calories: 2 },
        description: "A light, bitter aperitivo lengthening Campari and sweet vermouth with soda water.",
        ingredients: "Campari, sweet vermouth, soda water, orange slice."
    },
    {
        name: "Aperol Spritz",
        liquor: "Aperol",
        category: ["Bittersweet", "Sunseeker", "Harmonist"],
        scores: { strength: 2, sweetness: 4, sourness: 1, bitterness: 2, thickness: 1, rarity: 1, masculinity: 3, calories: 3 },
        description: "A bright, sparkling low-ABV spritz with orange bittersweetness.",
        ingredients: "Aperol, prosecco, soda water, orange slice."
    },
    {
        name: "Aviation",
        liquor: "Gin",
        category: ["Sunseeker", "Purist", "Harmonist"],
        scores: { strength: 5, sweetness: 3, sourness: 4, bitterness: 1, thickness: 2, rarity: 6, masculinity: 3, calories: 4 },
        description: "A floral gin sour with maraschino, lemon, and violet liqueur.",
        ingredients: "Gin, maraschino liqueur, lemon juice, creme de violette."
    },
    {
        name: "Bee's Knees",
        liquor: "Gin",
        category: ["Sunseeker", "Harmonist"],
        scores: { strength: 4, sweetness: 4, sourness: 4, bitterness: 1, thickness: 2, rarity: 3, masculinity: 3, calories: 4 },
        description: "A honeyed gin sour that is bright, simple, and lightly floral.",
        ingredients: "Gin, lemon juice, honey syrup."
    },
    {
        name: "Boulevardier",
        liquor: "Whiskey",
        category: ["Purist", "Bittersweet"],
        scores: { strength: 6, sweetness: 3, sourness: 1, bitterness: 6, thickness: 3, rarity: 3, masculinity: 7, calories: 4 },
        description: "A whiskey-based Negroni variation with deep bittersweet richness.",
        ingredients: "Bourbon or rye whiskey, Campari, sweet vermouth, orange peel."
    },
    {
        name: "Bramble",
        liquor: "Gin",
        category: ["Sunseeker"],
        scores: { strength: 4, sweetness: 4, sourness: 4, bitterness: 1, thickness: 2, rarity: 3, masculinity: 3, calories: 4 },
        description: "A blackberry gin sour with crushed ice and a fruity finish.",
        ingredients: "Gin, lemon juice, simple syrup, blackberry liqueur."
    },
    {
        name: "Brandy Alexander",
        liquor: "Brandy",
        category: ["Hedonist"],
        scores: { strength: 3, sweetness: 6, sourness: 1, bitterness: 1, thickness: 7, rarity: 2, masculinity: 2, calories: 7 },
        description: "A creamy dessert cocktail combining brandy, creme de cacao, and cream.",
        ingredients: "Brandy or cognac, dark creme de cacao, cream, grated nutmeg."
    },
    {
        name: "Caipirinha",
        liquor: "Cachaca",
        category: ["Sunseeker"],
        scores: { strength: 3, sweetness: 3, sourness: 4, bitterness: 1, thickness: 2, rarity: 3, masculinity: 5, calories: 4 },
        description: "A Brazilian lime cocktail made by muddling citrus and sugar with cachaca.",
        ingredients: "Cachaca, lime wedges, sugar."
    },
    {
        name: "Clover Club",
        liquor: "Gin",
        category: ["Sunseeker", "Harmonist"],
        scores: { strength: 4, sweetness: 4, sourness: 4, bitterness: 1, thickness: 3, rarity: 3, masculinity: 2, calories: 4 },
        description: "A silky raspberry gin sour with a soft foam.",
        ingredients: "Gin, lemon juice, raspberry syrup or grenadine, egg white."
    },
    {
        name: "Corpse Reviver #2",
        liquor: "Gin",
        category: ["Sunseeker"],
        scores: { strength: 4, sweetness: 4, sourness: 5, bitterness: 1, thickness: 3, rarity: 4, masculinity: 3, calories: 4 },
        description: "A tart equal-parts gin cocktail with citrus, orange liqueur, aromatized wine, and absinthe.",
        ingredients: "Gin, Cointreau, Lillet Blanc or Cocchi Americano, lemon juice, absinthe rinse."
    },
    {
        name: "Cosmopolitan",
        liquor: "Vodka",
        category: ["Sunseeker"],
        scores: { strength: 3, sweetness: 3, sourness: 3, bitterness: 1, thickness: 2, rarity: 1, masculinity: 2, calories: 4 },
        description: "A pink vodka-citrus cocktail with cranberry and orange liqueur.",
        ingredients: "Vodka, cranberry juice, Cointreau, lime juice."
    },
    {
        name: "Daiquiri",
        liquor: "White rum",
        category: ["Sunseeker"],
        scores: { strength: 3, sweetness: 3, sourness: 4, bitterness: 1, thickness: 2, rarity: 1, masculinity: 3, calories: 3 },
        description: "A clean rum sour made with lime and sugar, served shaken and chilled.",
        ingredients: "White rum, lime juice, simple syrup."
    },
    {
        name: "Dark 'n' Stormy",
        liquor: "Dark rum",
        category: ["Sunseeker"],
        scores: { strength: 2, sweetness: 3, sourness: 2, bitterness: 1, thickness: 2, rarity: 2, masculinity: 6, calories: 4 },
        description: "A bold rum highball pairing dark rum with spicy ginger beer and lime.",
        ingredients: "Dark rum, ginger beer, lime juice or lime wedge."
    },
    {
        name: "Espresso Martini",
        liquor: "Vodka",
        category: ["Harmonist", "Bittersweet", "Hedonist"],
        scores: { strength: 3, sweetness: 5, sourness: 1, bitterness: 2, thickness: 4, rarity: 1, masculinity: 3, calories: 5 },
        description: "A modern classic shaking vodka, coffee liqueur, and espresso into a foamy cocktail.",
        ingredients: "Vodka, coffee liqueur, fresh espresso, simple syrup."
    },
    {
        name: "French 75",
        liquor: "Gin",
        category: ["Sunseeker"],
        scores: { strength: 3, sweetness: 3, sourness: 3, bitterness: 1, thickness: 2, rarity: 2, masculinity: 2, calories: 4 },
        description: "A sparkling gin sour topped with Champagne or dry sparkling wine.",
        ingredients: "Gin, lemon juice, simple syrup, Champagne or sparkling wine, lemon twist."
    },
    {
        name: "French Martini",
        liquor: "Vodka",
        category: ["Sunseeker", "Hedonist"],
        scores: { strength: 3, sweetness: 5, sourness: 2, bitterness: 1, thickness: 2, rarity: 2, masculinity: 2, calories: 5 },
        description: "A fruity vodka cocktail with raspberry liqueur and pineapple.",
        ingredients: "Vodka, raspberry liqueur, pineapple juice."
    },
    {
        name: "Gibson",
        liquor: "Gin",
        category: ["Purist"],
        scores: { strength: 7, sweetness: 1, sourness: 1, bitterness: 1, thickness: 2, rarity: 3, masculinity: 6, calories: 2 },
        description: "A dry martini variation garnished with a cocktail onion.",
        ingredients: "Gin, dry vermouth, cocktail onion."
    },
    {
        name: "Gimlet",
        liquor: "Gin",
        category: ["Purist", "Sunseeker"],
        scores: { strength: 5, sweetness: 2, sourness: 4, bitterness: 1, thickness: 2, rarity: 3, masculinity: 5, calories: 3 },
        description: "A compact gin-and-lime sour that can be bracing and dry.",
        ingredients: "Gin, lime juice, simple syrup or lime cordial."
    },
    {
        name: "Gold Rush",
        liquor: "Whiskey",
        category: ["Sunseeker", "Purist"],
        scores: { strength: 4, sweetness: 4, sourness: 4, bitterness: 1, thickness: 3, rarity: 3, masculinity: 5, calories: 4 },
        description: "A bourbon sour sweetened with honey syrup.",
        ingredients: "Bourbon, lemon juice, honey syrup."
    },
    {
        name: "Grasshopper",
        liquor: "Creme de menthe",
        category: ["Hedonist"],
        scores: { strength: 2, sweetness: 6, sourness: 1, bitterness: 1, thickness: 6, rarity: 3, masculinity: 2, calories: 7 },
        description: "A mint-chocolate cream cocktail with a dessert-like profile.",
        ingredients: "Green creme de menthe, white creme de cacao, cream."
    },
    {
        name: "Last Word",
        liquor: "Gin",
        category: ["Sunseeker", "Adventurer"],
        scores: { strength: 5, sweetness: 4, sourness: 5, bitterness: 2, thickness: 4, rarity: 6, masculinity: 3, calories: 4 },
        description: "A sharp, herbal, equal-parts cocktail balancing gin, Chartreuse, maraschino, and lime.",
        ingredients: "Gin, green Chartreuse, maraschino liqueur, lime juice."
    },
    {
        name: "Lemon Drop",
        liquor: "Vodka",
        category: ["Sunseeker"],
        scores: { strength: 3, sweetness: 4, sourness: 4, bitterness: 1, thickness: 2, rarity: 2, masculinity: 2, calories: 4 },
        description: "A bright vodka sour with lemon and a sugared rim.",
        ingredients: "Vodka, lemon juice, orange liqueur or simple syrup, sugar rim."
    },
    {
        name: "Mai Tai",
        liquor: "Rum",
        category: ["Sunseeker", "Adventurer"],
        scores: { strength: 4, sweetness: 5, sourness: 4, bitterness: 1, thickness: 3, rarity: 4, masculinity: 4, calories: 5 },
        description: "A classic tiki cocktail mixing rum with lime, orange liqueur, and almond orgeat.",
        ingredients: "Aged rum, lime juice, orange curacao, orgeat, simple syrup, mint."
    },
    {
        name: "Jungle Bird",
        liquor: "Rum",
        category: ["Adventurer", "Bittersweet"],
        scores: { strength: 4, sweetness: 4, sourness: 3, bitterness: 4, thickness: 3, rarity: 4, masculinity: 4, calories: 5 },
        description: "A tropical rum drink sharpened with Campari bitterness.",
        ingredients: "Dark rum, Campari, pineapple juice, lime juice, simple syrup."
    },
    {
        name: "Mezcal Negroni",
        liquor: "Mezcal",
        category: ["Bittersweet", "Adventurer"],
        scores: { strength: 5, sweetness: 3, sourness: 1, bitterness: 7, thickness: 3, rarity: 4, masculinity: 7, calories: 3 },
        description: "A smoky mezcal variation on the classic Negroni.",
        ingredients: "Mezcal, Campari, sweet vermouth, orange peel."
    },
    {
        name: "Mint Julep",
        liquor: "Bourbon",
        category: ["Purist"],
        scores: { strength: 7, sweetness: 3, sourness: 1, bitterness: 1, thickness: 3, rarity: 1, masculinity: 6, calories: 4 },
        description: "A cold bourbon drink served over crushed ice with mint and sugar.",
        ingredients: "Bourbon, mint leaves, simple syrup or sugar, crushed ice."
    },
    {
        name: "Mojito",
        liquor: "White rum",
        category: ["Sunseeker"],
        scores: { strength: 3, sweetness: 4, sourness: 3, bitterness: 1, thickness: 2, rarity: 1, masculinity: 6, calories: 4 },
        description: "A refreshing Cuban highball built around rum, mint, lime, sugar, and soda.",
        ingredients: "White rum, lime juice, mint leaves, sugar or simple syrup, soda water."
    },
    {
        name: "Moscow Mule",
        liquor: "Vodka",
        category: ["Sunseeker"],
        scores: { strength: 2, sweetness: 3, sourness: 2, bitterness: 1, thickness: 2, rarity: 1, masculinity: 5, calories: 4 },
        description: "A spicy, fizzy vodka highball with ginger beer and lime.",
        ingredients: "Vodka, ginger beer, lime juice, lime wedge."
    },
    {
        name: "Naked and Famous",
        liquor: "Mezcal",
        category: ["Adventurer"],
        scores: { strength: 4, sweetness: 3, sourness: 4, bitterness: 3, thickness: 2, rarity: 6, masculinity: 4, calories: 4 },
        description: "A smoky, herbal equal-parts mezcal cocktail with citrus and bittersweet liqueur.",
        ingredients: "Mezcal, Aperol, yellow Chartreuse, lime juice."
    },
    {
        name: "Negroni",
        liquor: "Gin",
        category: ["Bittersweet", "Purist"],
        scores: { strength: 5, sweetness: 3, sourness: 1, bitterness: 7, thickness: 3, rarity: 1, masculinity: 7, calories: 3 },
        description: "A bittersweet Italian aperitif cocktail made in equal parts gin, Campari, and sweet vermouth.",
        ingredients: "Gin, Campari, sweet vermouth, orange peel."
    },
    {
        name: "Old Fashioned",
        liquor: "Whiskey",
        category: ["Purist"],
        scores: { strength: 6, sweetness: 3, sourness: 1, bitterness: 2, thickness: 3, rarity: 1, masculinity: 7, calories: 3 },
        description: "A spirit-forward whiskey cocktail lightly sweetened and seasoned with bitters.",
        ingredients: "Bourbon or rye whiskey, sugar cube or simple syrup, Angostura bitters, orange peel."
    },
    {
        name: "Painkiller",
        liquor: "Rum",
        category: ["Hedonist"],
        scores: { strength: 3, sweetness: 6, sourness: 2, bitterness: 1, thickness: 5, rarity: 3, masculinity: 3, calories: 7 },
        description: "A rich tropical rum drink with pineapple, orange, coconut, and nutmeg.",
        ingredients: "Dark rum, pineapple juice, orange juice, cream of coconut, nutmeg."
    },
    {
        name: "Paloma",
        liquor: "Tequila",
        category: ["Sunseeker"],
        scores: { strength: 2, sweetness: 3, sourness: 4, bitterness: 2, thickness: 2, rarity: 2, masculinity: 3, calories: 4 },
        description: "A refreshing tequila highball with grapefruit, lime, and a lightly salty edge.",
        ingredients: "Tequila, grapefruit soda or grapefruit juice, lime juice, salt."
    },
    {
        name: "Paper Plane",
        liquor: "Bourbon",
        category: ["Bittersweet", "Adventurer"],
        scores: { strength: 4, sweetness: 3, sourness: 4, bitterness: 4, thickness: 2, rarity: 4, masculinity: 4, calories: 4 },
        description: "A modern equal-parts bourbon cocktail with citrus and bittersweet amaro.",
        ingredients: "Bourbon, Aperol, Amaro Nonino, lemon juice."
    },
    {
        name: "Penicillin",
        liquor: "Scotch",
        category: ["Adventurer", "Purist"],
        scores: { strength: 4, sweetness: 4, sourness: 4, bitterness: 3, thickness: 4, rarity: 7, masculinity: 6, calories: 5 },
        description: "A smoky Scotch sour with honey, ginger, and lemon.",
        ingredients: "Blended Scotch, peated Scotch, lemon juice, honey-ginger syrup."
    },
    {
        name: "Pisco Sour",
        liquor: "Pisco",
        category: ["Sunseeker", "Harmonist"],
        scores: { strength: 3, sweetness: 3, sourness: 4, bitterness: 1, thickness: 3, rarity: 3, masculinity: 3, calories: 4 },
        description: "A frothy grape brandy sour with citrus and bitters.",
        ingredients: "Pisco, lime or lemon juice, simple syrup, egg white, bitters."
    },
    {
        name: "Ranch Water",
        liquor: "Tequila",
        category: ["Harmonist", "Sunseeker"],
        scores: { strength: 2, sweetness: 1, sourness: 3, bitterness: 1, thickness: 1, rarity: 2, masculinity: 4, calories: 2 },
        description: "A dry tequila highball with lime and sparkling mineral water.",
        ingredients: "Tequila, lime juice, sparkling mineral water."
    },
    {
        name: "Sazerac",
        liquor: "Rye whiskey",
        category: ["Purist", "Bittersweet"],
        scores: { strength: 7, sweetness: 2, sourness: 1, bitterness: 3, thickness: 3, rarity: 4, masculinity: 7, calories: 3 },
        description: "A New Orleans classic combining rye, sugar, bitters, and an absinthe-rinsed glass.",
        ingredients: "Rye whiskey, sugar cube or simple syrup, Peychaud's bitters, absinthe rinse, lemon peel."
    },
    {
        name: "Sidecar",
        liquor: "Cognac",
        category: ["Sunseeker", "Purist"],
        scores: { strength: 5, sweetness: 3, sourness: 4, bitterness: 1, thickness: 2, rarity: 3, masculinity: 6, calories: 4 },
        description: "A tart, elegant brandy sour made with cognac, orange liqueur, and lemon.",
        ingredients: "Cognac, orange liqueur, lemon juice, optional sugar rim."
    },
    {
        name: "Tom Collins",
        liquor: "Gin",
        category: ["Sunseeker", "Harmonist"],
        scores: { strength: 2, sweetness: 3, sourness: 4, bitterness: 1, thickness: 2, rarity: 2, masculinity: 4, calories: 4 },
        description: "A tall gin sour lengthened with soda water for a crisp, fizzy finish.",
        ingredients: "Gin, lemon juice, simple syrup, soda water, lemon wheel, cherry."
    },
    {
        name: "Gin Fizz",
        liquor: "Gin",
        category: ["Sunseeker", "Harmonist"],
        scores: { strength: 3, sweetness: 3, sourness: 4, bitterness: 1, thickness: 2, rarity: 3, masculinity: 3, calories: 4 },
        description: "A lively gin sour shaken and topped with soda water.",
        ingredients: "Gin, lemon juice, simple syrup, soda water."
    },
    {
        name: "Vieux Carre",
        liquor: "Rye whiskey",
        category: ["Purist", "Bittersweet"],
        scores: { strength: 6, sweetness: 3, sourness: 1, bitterness: 2, thickness: 3, rarity: 4, masculinity: 7, calories: 4 },
        description: "A rich New Orleans stirred drink with rye, cognac, vermouth, Benedictine, and bitters.",
        ingredients: "Rye whiskey, cognac, sweet vermouth, Benedictine, Peychaud's bitters, Angostura bitters."
    },
    {
        name: "Whiskey Sour",
        liquor: "Whiskey",
        category: ["Sunseeker"],
        scores: { strength: 3, sweetness: 3, sourness: 4, bitterness: 1, thickness: 4, rarity: 1, masculinity: 5, calories: 4 },
        description: "A classic sour balancing whiskey with lemon and sugar, often given a silky texture with egg white.",
        ingredients: "Bourbon or rye whiskey, lemon juice, simple syrup, optional egg white, bitters."
    },
    {
        name: "White Russian",
        liquor: "Vodka",
        category: ["Hedonist"],
        scores: { strength: 4, sweetness: 5, sourness: 1, bitterness: 2, thickness: 6, rarity: 1, masculinity: 4, calories: 7 },
        description: "A creamy vodka and coffee liqueur drink with dessert-like richness.",
        ingredients: "Vodka, coffee liqueur, cream."
    }
];
