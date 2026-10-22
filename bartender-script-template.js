const bartenderScriptSamples = [
  { preferences: { sweetness: 1, sourness: 1, bitterness: 1, strength: 2, thickness: 2, rarity: 1 }, script: "I want something light and easy. Nothing sweet, nothing bitter, just crisp and refreshing I can sip all night." },
  { preferences: { sweetness: 7, sourness: 2, bitterness: 2, strength: 2, thickness: 6, rarity: 1 }, script: "I have a sweet tooth and I want something rich and creamy, more dessert than drink, and I don't wanna taste the alcohol." },
  { preferences: { sweetness: 2, sourness: 6, bitterness: 1, strength: 4, thickness: 2, rarity: 2 }, script: "Make me something tart and bone-dry. heavy on the citrus, barely any sugar." },
  { preferences: { sweetness: 1, sourness: 2, bitterness: 7, strength: 6, thickness: 3, rarity: 3 }, script: "Give me the most bitter and spirit forward thing you make." },
  { preferences: { sweetness: 4, sourness: 4, bitterness: 4, strength: 4, thickness: 4, rarity: 4 }, script: "I like a well-balanced drink — a little sweet, a little sour, moderately strong, where no flavor profile takes over." },
  { preferences: { sweetness: 6, sourness: 5, bitterness: 1, strength: 3, thickness: 5, rarity: 2 }, script: "Something sweet and tart, ideally with a nice foam on top." },
  { preferences: { sweetness: 1, sourness: 3, bitterness: 6, strength: 7, thickness: 2, rarity: 6 }, script: "I want the strongest, driest, most bitter cocktail you have." },
  { preferences: { sweetness: 3, sourness: 6, bitterness: 5, strength: 5, thickness: 3, rarity: 7 }, script: "Surprise me with something obscure and herbal — tart with some bitterness." },
  { preferences: { sweetness: 7, sourness: 1, bitterness: 1, strength: 1, thickness: 7, rarity: 3 }, script: "I want dessert in a glass. Thick, creamy, very sweet, and barely alcoholic." },
  { preferences: { sweetness: 2, sourness: 5, bitterness: 2, strength: 3, thickness: 1, rarity: 1 }, script: "Something and fizzy and citrusy and refreshing — a classic, low ABV spritz would be ideal." },
  { preferences: { sweetness: 5, sourness: 4, bitterness: 6, strength: 4, thickness: 3, rarity: 5 }, script: "I love something fruity, sour, bitter — something that is bold and unexpected." },
  { preferences: { sweetness: 1, sourness: 1, bitterness: 3, strength: 7, thickness: 3, rarity: 2 }, script: "I like an intense, spirit forward cocktail with a touch of bitterness if possible." },
  { preferences: { sweetness: 6, sourness: 2, bitterness: 2, strength: 6, thickness: 4, rarity: 6 }, script: "Something rich, sweet, and strong and ideally, unique and unexpected." },
  { preferences: { sweetness: 3, sourness: 7, bitterness: 3, strength: 3, thickness: 2, rarity: 4 }, script: "As sour as you can make it — I want my mouth to pucker!" },
  { preferences: { sweetness: 2, sourness: 3, bitterness: 7, strength: 5, thickness: 2, rarity: 5 }, script: "Bitter and strong is my thing, and I'm not afraid of some funk or unexpected flavors." },
  { preferences: { sweetness: 7, sourness: 5, bitterness: 3, strength: 2, thickness: 5, rarity: 7 }, script: "I'm looking for something sweet and tart and unusual, with a silky texture or foam." },
  { preferences: { sweetness: 4, sourness: 2, bitterness: 2, strength: 6, thickness: 6, rarity: 1 }, script: "I'll take somehing smooth and creamy — and ideally, strong and boozy." },
  { preferences: { sweetness: 5, sourness: 6, bitterness: 4, strength: 5, thickness: 4, rarity: 3 }, script: "I like a proper sour — plenty of citrus, some sweetness, and ideally, a nice foam!" },
  { preferences: { sweetness: 1, sourness: 4, bitterness: 5, strength: 3, thickness: 1, rarity: 4 }, script: "A bitter, low ABV spritz is perfect, and I'm not afraid of unique or unfamiliar flavors if possible." },
  { preferences: { sweetness: 6, sourness: 3, bitterness: 1, strength: 7, thickness: 5, rarity: 2 }, script: "Tropical and sweet, and don't hold back on the booze." },
  { preferences: { sweetness: 3, sourness: 5, bitterness: 6, strength: 6, thickness: 2, rarity: 6 }, script: "Bartender's choice, as long as it's obscure and not too sweet." },
  { preferences: { sweetness: 5, sourness: 4, bitterness: 2, strength: 2, thickness: 7, rarity: 1 }, script: "Something creamy and/or frothy with a bit of sweetness and citrus, and light on the alcohol." },
  { preferences: { sweetness: 2, sourness: 2, bitterness: 4, strength: 7, thickness: 4, rarity: 7 }, script: "Give me something rare and boozy — dry, a touch bitter, and complex." },
  { preferences: { sweetness: 7, sourness: 7, bitterness: 1, strength: 4, thickness: 3, rarity: 4 }, script: "I want a sour: sweet, refreshing, tropical - summer in a glass!" },
  { preferences: { sweetness: 4, sourness: 3, bitterness: 7, strength: 7, thickness: 6, rarity: 5 }, script: "I'll take the biggest, boldest, most unexpected thing thing on your menu. Bitter, bold, high-proof." }
];


if (typeof module !== "undefined" && module.exports) {
  module.exports = bartenderScriptSamples;
}

