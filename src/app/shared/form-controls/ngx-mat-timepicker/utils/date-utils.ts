import * as moment_ from 'moment';
import { Moment } from 'moment';
const moment = moment_;

export const LIMIT_TIMES = {
    minHour: 0,
    maxHour: 23,
    minMinute: 0,
    maxMinute: 59
}

export const DEFAULT_STEP = 1;
export const DEFAULT_HOUR_PLACEHOLDER = '';
export const DEFAULT_MINUTE_PLACEHOLDER = '';
export const DEFAULT_SECOND_PLACEHOLDER = '';

export const PATTERN_INPUT_HOUR = /^(2[0-3]|[0-1][0-9]|[0-9])$/;
export const PATTERN_INPUT_MINUTE = /^([0-5][0-9]|[0-9])$/;

export function formatTwoDigitTimeValue(val: number) {
    const txt = val.toString();
    return txt.length > 1 ? txt : `0${txt}`;
}

/** Get time in format hh:mm:ss */
export function formatTime(value: Date | Moment): string {
    const hour: number = getHour(value);
    const minute: number = getMinute(value);

    const hourStr = formatTwoDigitTimeValue(hour);
    const minuteStr = formatTwoDigitTimeValue(minute);
    return `${hourStr}:${minuteStr}`;
}

/**
 * Same time
 * @param a
 * @param b
 */
export function sameTime(a: any, b: any): boolean {
    if (a == null || b == null) return true;
    if (a instanceof Date) {
        return a.getHours() === b.getHours()
            && a.getMinutes() === b.getMinutes()
            && a.getSeconds() === b.getSeconds();
    } else if (moment.isMoment(a)) {
        return a.hour() === b.hour()
            && a.minute() === b.minute();
    }
    return true;
}

export function createMissingDateImplError(provider: string) {
    return Error(
        `MatDatepicker: No provider found for ${provider}. You must import one of the following ` +
        `modules at your application root: MatNativeDateModule, MatMomentDateModule, or provide a ` +
        `custom implementation.`);
}

export function setHour(model: Date | Moment, val: number): void {
    if (model instanceof Date) {
        model.setHours(val);
    } else if (moment.isMoment(model)) {
        model.hour(val);
    }
}

export function setMinute(model: Date | Moment, val: number): void {
    if (model instanceof Date) {
        model.setMinutes(val);
    } else if (moment.isMoment(model)) {
        model.minute(val);
    }
}

export function getHour(model: Date | Moment): number {
    if (model instanceof Date) {
        return model.getHours();
    } else if (moment.isMoment(model)) {
        return model.hour();
    }
    return null;
}

export function getMinute(model: Date | Moment): number {
    if (model instanceof Date) {
        return model.getMinutes();
    } else if (moment.isMoment(model)) {
        return model.minute();
    }
    return null;
}
