class DateParser {
    private readonly _weekDays = {
        'sun': 0,
        'mon': 1,
        'tue': 2,
        'wed': 3,
        'thu': 4,
        'fri': 5,
        'sat': 6
    };
    private readonly _timeUnits = {
        'yea': 'FullYear',
        'mon': 'Month',
        'day': 'Date',
        'hou': 'Hours',
        'min': 'Minutes',
        'sec': 'Seconds'
    };

    private readonly _weekDaysPattern = 'sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
        '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?';
    private readonly _timesPattern = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
        '|' + this._weekDaysPattern + ')';
    private readonly _plusMinusPattern = '(([+-]\\s?)?\\d+)\\s?' + this._timesPattern;

    private readonly _plusMinusRegExp = new RegExp(this._plusMinusPattern);
    private readonly _plusMinusGlobalRegExp = new RegExp(this._plusMinusPattern, 'g');
    private readonly _plusMinusFullRegExp = new RegExp('(' + this._plusMinusPattern + '\\s?)+');
    private readonly _lastNextRegExp = new RegExp('^(last|next)\\s(' + this._weekDaysPattern + ')$');


    public parse(dateInputFormat: string, date: Date = null) {
        if (date) {
            date = new Date(date.getTime()); // clone data
        } else {
            date = new Date();
        }
        dateInputFormat = this.removeUnnecessarySpaces(dateInputFormat);
        let matches;
        if (dateInputFormat) {
            if (dateInputFormat == 'now') {
                // nothing
            } else if (dateInputFormat == 'yesterday') {
                date.setHours(0, 0, 0, 0);
                date.setDate(date.getDate() - 1);
            } else if (dateInputFormat == 'today') {
                date.setHours(0, 0, 0, 0);
            } else if (dateInputFormat == 'tomorrow') {
                date.setHours(0, 0, 0, 0);
                date.setDate(date.getDate() + 1);
            } else if (this._plusMinusFullRegExp.test(dateInputFormat)) {
                matches = dateInputFormat.match(this._plusMinusGlobalRegExp);
                for (let i in matches) {
                    let matches2, timeValue;
                    if ((matches2 = matches[i].match(this._plusMinusRegExp)) == null || isNaN(timeValue = parseInt(matches2[1].replace(/([+-])\s/, '$1'), 10))) {
                        throw new Error(`Unknown error while parsing date input format "${dateInputFormat}"`);
                    }
                    this.processPlusMinus(date, timeValue, matches2[3]);
                }
            } else if (matches = dateInputFormat.match(this._lastNextRegExp)) {
                this.processLastNext(date, matches[1], matches[2]);
            } else {
                throw new Error(`Date input format "${dateInputFormat}" is invalid`);
            }
        }
        return date;
    }

    private removeUnnecessarySpaces(text) {
        return (text || "").replace(/^\s+|\s+$/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/[\t\r\n]/g, '')
            .toLowerCase();
    }

    private processPlusMinus(date: Date, timeValue: number, timeUnit: string) {
        let shortTimeUnit = timeUnit.substring(0, 3);
        if (this._timeUnits[shortTimeUnit] && !/^mon(day|\.)?$/.test(timeUnit)) {
            date['set' + this._timeUnits[shortTimeUnit]](date['get' + this._timeUnits[shortTimeUnit]]() + timeValue);
        } else if (shortTimeUnit === 'wee') { // week
            date.setDate(date.getDate() + timeValue * 7);
        } else {
            throw new Error("Error while processing plus/minus expression");
        }
    }

    private processLastNext(date: Date, type: string, timeUnit: string) {
        let shortTimeUnit = timeUnit.substring(0, 3);
        if (this._weekDays[shortTimeUnit] != undefined) {
            let diff = this._weekDays[shortTimeUnit] - date.getDay();
            if (diff === 0) {
                diff = 7 * (type === 'last' ? -1 : 1);
            } else if (diff > 0 && type === 'last') {
                diff -= 7
            } else if (diff < 0 && type === 'next') {
                diff += 7
            }
            date.setDate(date.getDate() + diff);
        } else {
            throw new Error("Error while processing last/next expression");
        }
    }
}