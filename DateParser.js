var DateParser = /** @class */ (function () {
    function DateParser() {
        this._weekDays = {
            'sun': 0,
            'mon': 1,
            'tue': 2,
            'wed': 3,
            'thu': 4,
            'fri': 5,
            'sat': 6
        };
        this._timeUnits = {
            'yea': 'FullYear',
            'mon': 'Month',
            'day': 'Date',
            'hou': 'Hours',
            'min': 'Minutes',
            'sec': 'Seconds'
        };
        this._weekDaysPattern = 'sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
            '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?';
        this._timesPattern = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
            '|' + this._weekDaysPattern + ')';
        this._plusMinusPattern = '(([+-]\\s?)?\\d+)\\s?' + this._timesPattern;
        this._plusMinusRegExp = new RegExp(this._plusMinusPattern);
        this._plusMinusGlobalRegExp = new RegExp(this._plusMinusPattern, 'g');
        this._plusMinusFullRegExp = new RegExp('(' + this._plusMinusPattern + '\\s?)+');
        this._lastNextRegExp = new RegExp('^(last|next)\\s(' + this._weekDaysPattern + ')$');
    }
    DateParser.prototype.parse = function (dateInputFormat, date) {
        if (date === void 0) { date = null; }
        if (date) {
            date = new Date(date.getTime()); // clone data
        }
        else {
            date = new Date();
        }
        dateInputFormat = this.removeUnnecessarySpaces(dateInputFormat);
        var matches;
        if (dateInputFormat) {
            if (dateInputFormat == 'now') {
                // nothing
            }
            else if (dateInputFormat == 'yesterday') {
                date.setHours(0, 0, 0, 0);
                date.setDate(date.getDate() - 1);
            }
            else if (dateInputFormat == 'today') {
                date.setHours(0, 0, 0, 0);
            }
            else if (dateInputFormat == 'tomorrow') {
                date.setHours(0, 0, 0, 0);
                date.setDate(date.getDate() + 1);
            }
            else if (this._plusMinusFullRegExp.test(dateInputFormat)) {
                matches = dateInputFormat.match(this._plusMinusGlobalRegExp);
                for (var i in matches) {
                    var matches2 = void 0, timeValue = void 0;
                    if ((matches2 = matches[i].match(this._plusMinusRegExp)) == null || isNaN(timeValue = parseInt(matches2[1].replace(/([+-])\s/, '$1'), 10))) {
                        throw new Error("Unknown error while parsing date input format \"" + dateInputFormat + "\"");
                    }
                    this.processPlusMinus(date, timeValue, matches2[3]);
                }
            }
            else if (matches = dateInputFormat.match(this._lastNextRegExp)) {
                this.processLastNext(date, matches[1], matches[2]);
            }
            else {
                throw new Error("Date input format \"" + dateInputFormat + "\" is invalid");
            }
        }
        return date;
    };
    DateParser.prototype.removeUnnecessarySpaces = function (text) {
        return (text || "").replace(/^\s+|\s+$/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/[\t\r\n]/g, '')
            .toLowerCase();
    };
    DateParser.prototype.processPlusMinus = function (date, timeValue, timeUnit) {
        var shortTimeUnit = timeUnit.substring(0, 3);
        if (this._timeUnits[shortTimeUnit] && !/^mon(day|\.)?$/.test(timeUnit)) {
            date['set' + this._timeUnits[shortTimeUnit]](date['get' + this._timeUnits[shortTimeUnit]]() + timeValue);
        }
        else if (shortTimeUnit === 'wee') { // week
            date.setDate(date.getDate() + timeValue * 7);
        }
        else {
            throw new Error("Error while processing plus/minus expression");
        }
    };
    DateParser.prototype.processLastNext = function (date, type, timeUnit) {
        var shortTimeUnit = timeUnit.substring(0, 3);
        if (this._weekDays[shortTimeUnit] != undefined) {
            var diff = this._weekDays[shortTimeUnit] - date.getDay();
            if (diff === 0) {
                diff = 7 * (type === 'last' ? -1 : 1);
            }
            else if (diff > 0 && type === 'last') {
                diff -= 7;
            }
            else if (diff < 0 && type === 'next') {
                diff += 7;
            }
            date.setDate(date.getDate() + diff);
        }
        else {
            throw new Error("Error while processing last/next expression");
        }
    };
    return DateParser;
}());
