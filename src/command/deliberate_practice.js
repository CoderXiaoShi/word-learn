require('colors')
const readline = require('readline')
const { toDay, practice } = require('../const');
const { dataStore } = require('../tools/util');
const Table = require('cli-table')

const cliTable = new Table()

let source = {"errorCode":0,"res":[]};
if (dataStore && dataStore[toDay] && dataStore[toDay][0]) {
    source = dataStore[toDay][0];
}

/*
    抄一遍
    默写5遍, 错了重来
    离开时打印用户行为
*/
class DeliberatePractice {
    constructor(words) {
        this.words = words;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '> ',
        })
        this.word = {};
        this.practiceNum = 0;
        this.status = practice.copy;
        this.behavior = {
            correct: 0,
            error: 0,
            wordMap: {}
        }
    }
    recordWordPracticeResult(word) {
        if (this.behavior.wordMap[word]) {
            this.behavior.wordMap[word]++;
        } else {
            this.behavior.wordMap[word] = 1;
        }
    }
    randomWord(ignoreWord) {
        let newWords = this.words.reduce((res, word) => {
            if (word.word !== ignoreWord) {
                res.push(word)
            }
            return res
        }, [])
        return newWords[Math.floor(Math.random() * newWords.length)]
    }
    reset(type = 'new') {
        this.practiceNum = 0;
        this.status = practice.copy;
        if (type === 'new') {
            this.word = this.randomWord(this.word.word);
        }
        this.showWord();
        return this;
    }
    showWord(type = 'all', str) {
        if (type === 'all') {
            console.log(`抄一遍,默写5遍\n${this.word.word}:${this.word.translate}${str ? `\n${str}` : ''}`.green)
        } else if (type === 'translate') {
            console.log(`默写5遍\n${this.word.phonetic}:${this.word.translate}${str ? `\n${str}` : ''}`.green)
        }
    }
    practiceIng(line) {
        if (this.status === practice.copy) {
            if (line === this.word.word) {
                this.status = practice.practice;
                this.showWord('translate');
                this.behavior.correct++;
                this.recordWordPracticeResult(line)
            } else {
                console.log('抄错'.red)
                this.behavior.error++;
                this.showWord();
                return
            }
        } else if (this.status === practice.practice) {
            if (line === this.word.word) {
                this.practiceNum++;
                this.behavior.correct++;
                this.recordWordPracticeResult(line)
                if (this.practiceNum >= 5) {
                    console.log('很好, 下一个'.black.bgYellow);
                    this.reset('new');
                } else {
                    this.showWord('translate', this.practiceNum);
                }
            } else {
                console.log('错了重来'.red);
                this.behavior.error++;
                this.reset('old');
            }
        }
    }
    run() {
        this.rl.prompt();
        let self = this;

        this.rl.on('line', (line) => {
            console.clear();
            line = line.trim();
            if (line === '-exit') {
                self.rl.close();
                return;
            }
            self.practiceIng(line);
            self.rl.prompt();
        })
        this.rl.on('close', () => {
            console.log('beybey...'.green);
            cliTable.push(
                ['正确','错误'],
                [
                    `${self.behavior.correct}`.green,
                    `${self.behavior.error}`.red
                ],
                ['--', '--'],
            )
        Object.keys(self.behavior.wordMap).map(key => {
            let num = self.behavior.wordMap[key]
            cliTable.push([key, `${num}次`.yellow])
        })
            // 用户行为
            // 正确次数
            // 错误次数
            // 各个单词的练习次数(输入正确的)
            console.log(cliTable.toString())
            process.exit(0);
        })
    }
}

if (source.res.length > 0) {
    new DeliberatePractice(source.res).reset().run();
} else {
    console.log('没有单词?, 先执行: word refresh'.red);
    process.exit(-1)
}
