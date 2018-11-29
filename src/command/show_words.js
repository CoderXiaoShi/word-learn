const { dataStore } = require('../tools/util');
const { toDay } = require('../const');

let words = dataStore[toDay][0].res

for (const w of words) {
  const { word, translate, phonetic } = w
  console.log(`${word}:${phonetic}:${translate}`)
}
