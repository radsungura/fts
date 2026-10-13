import { Injectable } from '@angular/core';
import { DateInput } from '../../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class Functions {

  dateFormate(input: DateInput): string {
    let date: Date;
    
    if (input instanceof Date) {
        date = input;
    } else if (typeof input === 'string') {
        if (/^\d{10}$/.test(input)) {
            date = new Date(parseInt(input) * 1000);
        } else if (/^\d{13}$/.test(input)) {
            date = new Date(parseInt(input));
        } else {
            date = new Date(input);
        }
    } else if (typeof input === 'number') {
        if (input < 10000000000) {
            date = new Date(input * 1000);
        } else {
            date = new Date(input);
        }
    } else if (Array.isArray(input)) {
        date = new Date(...input);
    } else if (typeof input === 'object' && input !== null) {
        if ('year' in input) {
            date = new Date(
                input.year,
                (input.month || 1) - 1,
                input.day || 1,
                input.hours || input.hour || 0,
                input.minutes || input.minute || 0,
                input.seconds || input.second || 0
            );
        } else {
            date = new Date(input as any);
        }
    } else {
        throw new Error('Invalid date input type');
    }
    
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
}
