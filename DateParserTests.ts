class DateParserTests {
    private readonly _dateParser: DateParser;
    private readonly _srcDate: Date;

    public constructor() {
        this._dateParser = new DateParser();
        this._srcDate = new Date('2017-12-25T09:22:33Z');
    }

    public run() {
        this.testSingle(null, '2017-12-25 11:22:33');
        this.testSingle('now', '2017-12-25 11:22:33');
        this.testSingle('Now', '2017-12-25 11:22:33');
        this.testSingle(' yesterday', '2017-12-24 00:00:00');
        this.testSingle('today', '2017-12-25 00:00:00');
        this.testSingle('tomorrow', '2017-12-26 00:00:00');

        this.testSingle('+1 seconds ', '2017-12-25 11:22:34');
        this.testSingle('-40 second', '2017-12-25 11:21:53');
        this.testSingle('90sec', '2017-12-25 11:24:03');

        this.testSingle('3 minutes', '2017-12-25 11:25:33');
        this.testSingle('-35minute', '2017-12-25 10:47:33');
        this.testSingle('+1440  min', '2017-12-26 11:22:33');

        this.testSingle(' +8760 hours', '2018-12-25 11:22:33');
        this.testSingle('-12 hour', '2017-12-24 23:22:33');

        this.testSingle('+30 days', '2018-01-24 11:22:33');
        this.testSingle('-25day', '2017-11-30 11:22:33');

        this.testSingle('40 weeks', '2018-10-01 11:22:33');
        this.testSingle('-1 weeks', '2017-12-18 11:22:33');

        this.testSingle(' 1months ', '2018-01-25 11:22:33');
        this.testSingle('-1 month', '2017-11-25 11:22:33');

        this.testSingle('+2 years', '2019-12-25 11:22:33');
        this.testSingle('-1  year', '2016-12-25 11:22:33');

        this.testSingle('+2years - 24 month', '2017-12-25 11:22:33');
        this.testSingle('1 second + 2min +3  hours +4day +  5weeks + 6 months +7 year', '2025-08-02 14:24:34');


        this.testSingle('last sunday', '2017-12-24 11:22:33');
        this.testSingle('last sun', '2017-12-24 11:22:33');
        this.testSingle('last monday', '2017-12-18 11:22:33');
        this.testSingle('last mon.', '2017-12-18 11:22:33');
        this.testSingle('last tuesday', '2017-12-19 11:22:33');
        this.testSingle('last tue', '2017-12-19 11:22:33');
        this.testSingle('last wednesday', '2017-12-20 11:22:33');
        this.testSingle('last wed', '2017-12-20 11:22:33');
        this.testSingle('last thursday', '2017-12-21 11:22:33');
        this.testSingle('last thu.', '2017-12-21 11:22:33');
        this.testSingle('last friday', '2017-12-22 11:22:33');
        this.testSingle('last fri', '2017-12-22 11:22:33');
        this.testSingle('last saturday', '2017-12-23 11:22:33');
        this.testSingle('last sat', '2017-12-23 11:22:33');

        this.testSingle('next sunday', '2017-12-31 11:22:33');
        this.testSingle('next sun.', '2017-12-31 11:22:33');
        this.testSingle('next monday', '2018-01-01 11:22:33');
        this.testSingle('next mon', '2018-01-01 11:22:33');
        this.testSingle('next tuesday', '2017-12-26 11:22:33');
        this.testSingle('next tue', '2017-12-26 11:22:33');
        this.testSingle('next wednesday', '2017-12-27 11:22:33');
        this.testSingle('next wed.', '2017-12-27 11:22:33');
        this.testSingle('next thursday', '2017-12-28 11:22:33');
        this.testSingle('next thu', '2017-12-28 11:22:33');
        this.testSingle('next friday', '2017-12-29 11:22:33');
        this.testSingle('next fri', '2017-12-29 11:22:33');
        this.testSingle('next saturday', '2017-12-30 11:22:33');
        this.testSingle('next sat.', '2017-12-30 11:22:33');
    }

    private testSingle(dateInputFormat: string, expectedResult: string) {
        let date = this._dateParser.parse(dateInputFormat, this._srcDate);
        let result = this.dateToStrng(date);
        if (result == expectedResult) {
            console.log("Ok " + dateInputFormat);
        } else {
            console.error(`Error ${dateInputFormat}. Got ${result} instead of ${expectedResult}`);
        }
    }

    private dateToStrng(date: Date): string {
        let month = (date.getMonth() + 1).toString();
        if (month.length == 1) {
            month = "0" + month;
        }
        let day = date.getDate().toString();
        if (day.length == 1) {
            day = "0" + day;
        }
        let hours = date.getHours().toString();
        if (hours.length == 1) {
            hours = "0" + hours;
        }
        let minutes = date.getMinutes().toString();
        if (minutes.length == 1) {
            minutes = "0" + minutes;
        }
        let seconds = date.getSeconds().toString();
        if (seconds.length == 1) {
            seconds = "0" + seconds;
        }
        return [date.getFullYear(), month, day].join('-') +
            ' ' +
            [hours, minutes, seconds].join(':');
    }

}