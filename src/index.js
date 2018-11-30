require('colors');
require('./tools/util');
const program = require('commander');
const existsSync = require('fs').existsSync;
const resolve = require('path').resolve
const { version } = require('../package.json')

program.version(version)
  .option('-r, --refresh', '更换单词列表: 重新从服务端拉去单词')
  .option('-d, --pineapple', '开始练习: 抄一遍,默写5遍')
  .option('-l, --words', '打印单词列表')
  .parse(process.argv);

let [todo = ''] = program.args;

if (program.pineapple) {
  todo = 'deliberate_practice'
} else if (program.refresh) {
  todo = 'refresh'
} else if (program.words) {
  todo = 'show_words'
}

if (existsSync(resolve(__dirname, `command/${todo}.js`))) {
  require(`./command/${todo}.js`)
} else {
  console.log(`
    未知命令
  `.red);
  process.exit(-1);
}
