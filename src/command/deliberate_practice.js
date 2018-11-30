require('colors')
const readline = require('readline')
const { toDay, practice } = require('../const');
const { dataStore, showAllWord } = require('../tools/util');
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
        this.rl.setPrompt('>')
        if (type === 'new') {
            this.word = this.randomWord(this.word.word);
        }
        this.showWord();
        return this;
    }
    showWord(type = 'all', str) {
        if (type === 'all') {
            console.log('抄一遍,默写5遍'.green)
            showAllWord([this.word])
        } else if (type === 'translate') {
            console.log(`默写5遍: ${str ? `${str}次` : ''}`.green)
            showAllWord([{
                ...this.word,
                word: '--'
            }])
        }
    }
    practiceIng(line) {
        if (this.status === practice.copy) {
            console.clear();
            if (line === this.word.word) {
                this.status = practice.practice;
                this.showWord('translate');
                this.behavior.correct++;
                this.recordWordPracticeResult(line)
                this.rl.setPrompt(`${this.practiceNum+1}>`)
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
                    console.clear();
                    this.rl.setPrompt('>')
                    console.log('很好, 下一个'.black.bgYellow);
                    this.reset('new');
                } else {
                    console.clear();
                    this.showWord('translate');
                    for (let i = 0; i < this.practiceNum; i++) {
                        console.log(`${i+1}>${line.replace(/\w/ig,'*')}`)
                    }
                    this.rl.setPrompt(`${this.practiceNum+1}>`)
                }
            } else {
                console.clear()
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
            line = line.trim();
            if (line === '-exit') {
                self.rl.close();
                return;
            }
            self.practiceIng(line);
            self.rl.prompt();
        })
        this.rl.on('close', () => {
            console.clear()
            console.log('本场表现...'.green);
            cliTable.push(
                [
                    '错误',
                    '正确'
                ],
                [
                    `${self.behavior.error}`.red,
                    `${self.behavior.correct}`.green
                ],
                ['--', '--'],
            )
            Object.keys(self.behavior.wordMap).map(key => {
                let num = self.behavior.wordMap[key]
                cliTable.push([key, `${num}次`.yellow])
            })
            console.log(cliTable.toString())
            process.exit(0);
        })
    }
}

if (source.res.length > 0) {
    new DeliberatePractice(source.res).reset().run();
} else {
    console.log('没有单词?, 先执行: word -r'.red);
    process.exit(-1)
}
