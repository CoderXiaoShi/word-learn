const fs = require('fs');
const path = require('path');
const { toDay } = require('../const')
const request = require('../tools/request');
const { showAllWord } = require('../tools/util')

let dataStorePath = path.resolve(__dirname, '../../data.json')

;(async () => {
  let wordMap = {}
  // 拿到旧的本地数据
  if (fs.existsSync(dataStorePath)) {
    wordMap = fs.readFileSync(dataStorePath);
    wordMap = JSON.parse(wordMap);
  } else {
    fs.writeFileSync(dataStorePath, '{}');
  }

  // 拿到新的数据，然后合并
  try {
    let result = await request.get('/word/word-random')
    showAllWord(result.res)
    if (wordMap[toDay]) {
      wordMap[toDay].unshift(result)
    } else {
      wordMap[toDay] = [result]
    }
    // 把新的结果写入本地
    fs.writeFileSync(
      path.resolve(__dirname, '../../data.json'),
      JSON.stringify(wordMap, null, '\t'),
      'utf-8'
    )
    console.log('refresh ok'.green);
  } catch (error) {
    console.log(error)
    console.log('refresh fail'.red);
  }
})();
