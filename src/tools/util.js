const fs = require('fs');
const path = require('path');

let dataStore = {}

let dataStorePath = path.resolve(__dirname, '../../data.json');
if (fs.existsSync(dataStorePath)) {
    let data = fs.readFileSync(
        dataStorePath,
        'utf-8'
    );
    dataStore = JSON.parse(data)
} else {
    fs.writeFileSync(dataStorePath, '{}')
}

const showAllWord = (arr) => {
    console.log(
        arr.map(item => {
            return `\n${item.word.green}\n${item.phonetic}:${item.translate}\n`
        }).join('')
    )
}

module.exports = {
  dataStore,
  showAllWord
}
