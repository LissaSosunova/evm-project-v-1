import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateTransformService {

  constructor() { }

  /**
   * Converts a local date to the zero time zone,
   * preserving the same local date components.
   * The time is set to 00.00
   */
  public dateToUtc(date: Date): number {
    const parts = this.getDateComponents(date, false);
    const utc = new Date().setUTCFullYear(parts[0], parts[1], parts[2]);
    return new Date(utc).setUTCHours(0, 0, 0, 0);
  }

  public dateToUtcWithTime(date: Date, hours: number, minutes: number, seconds: number, miliseconds: number): number {
    const parts = this.getDateComponents(date, false);
    const utc = new Date().setUTCFullYear(parts[0], parts[1], parts[2]);
    return new Date(utc).setUTCHours(hours, minutes, seconds, miliseconds);
  }

  /**
   * @return [hh, mm] in UTC
   */
  public getTime(stamp: number): number[] {
    return [
      new Date(stamp).getUTCHours(),
      new Date(stamp).getUTCMinutes()
    ];
  }

  /**
   * Returns UTC stamp from local date and time components (Garg time)
   */
  public nowUTC(): number {
    const now = new Date();
    const hour = now.getHours();
    const min = now.getMinutes();
    const sec = now.getSeconds();
    const ms = now.getMilliseconds();

    const utcDate: number = this.dateToUtc(now);
    return new Date(utcDate).setUTCHours(hour, min, sec, ms);
  }

  /**
   * @param stamp date in UTC
   * @param time [hh, mm]
   * @return UTC timestamp
   */
  public setTime(stamp: number, time: number[]): number {
    return new Date(stamp).setUTCHours(time[0], time[1], 0, 0);
  }

  public stampFromDateAndTime(utcDate: number, utcTime: number): number {

    const parts: number[] = this.getDateComponents(utcDate, true);

    const localTime = new Date(utcTime);
    parts.push(localTime.getUTCHours());
    parts.push(localTime.getUTCMinutes());
    parts.push(localTime.getUTCSeconds());

    const temp = new Date().setUTCFullYear(parts[0], parts[1], parts[2]);
    return new Date(temp).setUTCHours(parts[3], parts[4], parts[5], 0);
  }

  public startOfUTCDay(stamp: number): number {
    const parts: number[] = this.getDateComponents(stamp, true);
    return Date.UTC(parts[0], parts[1], parts[2], 0, 0, 0, 0);
  }

  /**
   * Converts a UTC timestamp to a local date,
   * preserving the same UTC date components.
   * The time is set to 00.00
   */
  public utcToDate(dateUtc: number): Date {
    const parts = this.getDateComponents(dateUtc, true);
    return new Date(parts[0], parts[1], parts[2], 0, 0, 0, 0);
  }

  private getDateComponents(source: Date | number, utcComponents: boolean): number[] {

    const date: Date = typeof source === 'number' ? new Date(source) : source;
    if (utcComponents) {
      return [
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
      ];
    }

    return [
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ];
  }
}
