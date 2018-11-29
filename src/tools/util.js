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
            return `
${item.word.green}
${item.phonetic}:${item.translate}
`
        }).join('')
    )
}

module.exports = {
  dataStore,
  showAllWord
}
