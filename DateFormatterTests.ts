class DateFormatterTests {
    private readonly _srcDate: Date;
    private readonly _dateFormatter: DateFormatter;

    public constructor() {
        this._srcDate = new Date('2017-12-25T09:22:33Z');
        this._dateFormatter = new DateFormatter(this._srcDate);
    }

    public run() {
        this.testSingle("digitalDate", null, null, '25.12.2017');
        this.testSingle("digitalDate", null, 'now', '25.12.2017');
        this.testSingle("digitalDate", null, 'Now', '25.12.2017');
        this.testSingle("digitalDate", null, ' yesterday', '24.12.2017');
        this.testSingle("digitalDate", null, 'today', '25.12.2017');
        this.testSingle("digitalDate", null, 'tomorrow', '26.12.2017');

        this.testSingle("digitalDate", null, '+1 seconds ', '25.12.2017');
        this.testSingle("digitalDate", null, '-40 second', '25.12.2017');
        this.testSingle("digitalDate", null, '90sec', '25.12.2017');

        this.testSingle("digitalDate", null, '3 minutes', '25.12.2017');
        this.testSingle("date", "и", '-35minute', '25 декабрь 2017');
        this.testSingle("date", "р+", '+1440  min', '26 декабрей 2017');

        this.testSingle("date", "д", ' +8760 hours', '25 декабрю 2018');
        this.testSingle("date", "в+", '-12 hour', '24 декабри 2017');

        this.testSingle("date", "т", '+30 days', '24 январём 2018');
        this.testSingle("date", "п+", '-25day', '30 о ноябрях 2017');

        this.testSingle("date", "и", '40 weeks', '01 октябрь 2018');
        this.testSingle("date", "р+", '-1 weeks', '18 декабрей 2017');

        this.testSingle("date", "д", ' 1months ', '25 январю 2018');
        this.testSingle("date", "в+", '-1 month', '25 ноябри 2017');

        this.testSingle("shortDate", "т", '+2 years', '25 декабрём');
        this.testSingle("shortDate", "п+", '-1  year', '25 о декабрях');

        this.testSingle("shortDate", "и", '+2years - 24 month', '25 декабрь');
        this.testSingle("shortDate", "р+", '1 second + 2min +3  hours +4day +  5weeks + 6 months +7 year', '02 августов');


        this.testSingle("shortDate", "д", 'last sunday', '24 декабрю');
        this.testSingle("shortDate", "в+", 'last sun', '24 декабри');
        this.testSingle("shortDate", "т", 'last monday', '18 декабрём');
        this.testSingle("shortDate", "п+", 'last mon.', '18 о декабрях');
        this.testSingle("shortDate", "и", 'last tuesday', '19 декабрь');
        this.testSingle("shortDate", "р+", 'last tue', '19 декабрей');
        this.testSingle("month", "д", 'last wednesday', 'декабрю');
        this.testSingle("month", "в+", 'last wed', 'декабри');
        this.testSingle("month", "т", 'last thursday', 'декабрём');
        this.testSingle("month", "п+", 'last thu.', 'декабрях');
        this.testSingle("month", "и", 'last friday', 'декабрь');
        this.testSingle("month", "р+", 'last fri', 'декабрей');
        this.testSingle("month", "д", 'last saturday', 'декабрю');
        this.testSingle("month", "в+", 'last sat', 'декабри');

        this.testSingle("month", "т", 'next sunday', 'декабрём');
        this.testSingle("month", "п+", 'next sun.', 'декабрях');
        this.testSingle("weekDay", "и", 'next monday', 'понедельник');
        this.testSingle("weekDay", "р+", 'next mon', 'понедельников');
        this.testSingle("weekDay", "д", 'next tuesday', 'вторнику');
        this.testSingle("weekDay", "в+", 'next tue', 'вторники');
        this.testSingle("weekDay", "т", 'next wednesday', 'средой');
        this.testSingle("weekDay", "п+", 'next wed.', 'средах');
        this.testSingle("weekDay", "и", 'next thursday', 'четверг');
        this.testSingle("weekDay", "р+", 'next thu', 'четвергов');
        this.testSingle("weekDay", "д", 'next friday', 'пятнице');
        this.testSingle("weekDay", "в+", 'next fri', 'пятницы');
        this.testSingle("weekDay", "т", 'next saturday', 'субботой');
        this.testSingle("weekDay", "п+", 'next sat.', 'субботах');
    }

    private testSingle(methodName: string, linguisticInfo: string, dateInputFormat: string, expectedResult: string) {
        let result;
        if (methodName == "digitalDate") {
            result = this._dateFormatter[methodName].call(this._dateFormatter, dateInputFormat);
        } else {
            result = this._dateFormatter[methodName].call(this._dateFormatter, linguisticInfo, dateInputFormat);
        }
        if (result == expectedResult) {
            console.log("Ok " + dateInputFormat);
        } else {
            console.error(`Error ${linguisticInfo} ${dateInputFormat}. Got ${result} instead of ${expectedResult}`);
        }
    }
}