import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';
const { apiTimeZone } = environment;

@Injectable({
    providedIn: 'root'
})

export class DateConverterService {

    public minutePerMillisecond: number = 60000;

    constructor() { }

    async getDateFormat(date) {
        let tmpDate = new Date(date);
        let DateFormat = `${tmpDate.getDate()}/${tmpDate.getMonth() + 1}/${tmpDate.getFullYear()}`;
        let DateFormat2 = `${tmpDate.getMonth() + 1}/${tmpDate.getDate()}/${tmpDate.getFullYear()}`;
        let DateFormat3 = `${tmpDate.getFullYear()}-${tmpDate.getMonth() + 1}-${tmpDate.getDate()}`;
        return DateFormat3;
    }
    async getCheckedOrNot(string) {
        if (string == 'T' || string == '1')
            return true;
        return false;
    }
    async getdayNumInWeek(day, month, year) {
        var d = new Date(Date.UTC(year, month, day));
        var dayNum = d.getUTCDay() || 7;
        return dayNum;
    }
    async getWeekNumber(day, month, year) {
        var d = new Date(Date.UTC(year, month, day));
        var dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
    }
    //YYYY-MM-DD HH:mm
    async dateFormatter(date) {
        let year = parseInt(date.substr(0, 4));
        let month = parseInt(date.substr(5, 2)) - 1;
        let day = parseInt(date.substr(8, 2));
        let hour = parseInt(date.substr(11, 2));
        let minute = parseInt(date.substr(14, 2));
        let dateFormat = new Date(year, month, day, hour, minute);
        return dateFormat;
    }
    dayFormatWithTimezone(timezone) {
        let dateToDIsplay = formatDate(new Date().toLocaleString("en-US", { timeZone: timezone }), "yyyy-MM-dd HH:mm", 'en-US');
        return this.dateFormatter(dateToDIsplay).then(res => {
            return res;
        })
    }
    getDiffTime(date) {
        let backendDateStr = new Date().toLocaleString("en-US", { timeZone: apiTimeZone });
        let backendDate = new Date(backendDateStr);
        let offset = new Date().getTimezoneOffset();
        let diff = (offset - backendDate.getTimezoneOffset()) * this.minutePerMillisecond;
        let localDate = Math.abs((date).getTime() - diff);
        return localDate;
    }
}