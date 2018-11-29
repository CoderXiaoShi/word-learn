require('colors')
const readline = require('readline')
const { toDay, practice } = require('../const');
const { dataStore } = require('../tools/util')

let source = {"errorCode":0,"res":[]};
source = dataStore[toDay][0];

/*
    抄一遍
    默写5遍, 错了重来
*/
class DeliberatePractice {
    constructor(words) {
        this.words = words;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '> ',
        })
    }
    reset(type = 'new') {
        this.practiceNum = 0;
        this.status = practice.copy;
        if (type === 'new') {
            this.word = this.words[0];
        } else {
            this.word = this.words[0];
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
                this.status = practice.practice
                this.showWord('translate')
            } else {
                console.log('抄错'.red)
                this.showWord()
                return
            }
        } else if (this.status === practice.practice) {
            if (line === this.word.word) {
                this.practiceNum++
                if (this.practiceNum >= 5) {
                    console.log('下一个')
                    this.reset('new')
                } else {
                    this.showWord('translate', this.practiceNum)
                }
            } else {
                console.log('错了重来')
                this.status = practice.copy
                this.practiceNum = 0
                this.reset('old')
            }
        }
    }
    run() {
        this.rl.prompt();
        let self = this;

        this.rl.on('line', (line) => {
            console.clear();
            line = line.trim();
            if (line === 'exit') {
                self.rl.close();
                return;
            }
            self.practiceIng(line);
            self.rl.prompt();
        })
        this.rl.on('close', () => {
            console.log('byebye...'.green);
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
