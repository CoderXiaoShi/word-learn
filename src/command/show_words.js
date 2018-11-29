const { dataStore, showAllWord } = require('../tools/util');
const { toDay } = require('../const');

if (dataStore[toDay]) {
  let words = dataStore[toDay][0].res
  showAllWord(words)
} else {
  console.log('请先执行 word -r'.red)
}
