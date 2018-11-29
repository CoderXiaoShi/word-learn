const { dataStore } = require('../tools/util');
const { toDay } = require('../const');

if (dataStore[toDay]) {
  let words = dataStore[toDay][0].res
  console.log(
    words.map(item => {
      return `${item.word.green}: ${item.translate}`
    }).join(' | ')
  )
} else {
  console.log('请先执行 word -r'.red)
}
