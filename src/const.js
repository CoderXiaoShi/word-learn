const moment = require('moment');
let toDay = moment().format('YYYYMMDD')

const practice = {
    copy: 'copy',
    practice: 'practice',
}

module.exports = {
    toDay,
    practice
}
