import { startOfDay, startOfMonth, startOfWeek, startOfYear } from 'date-fns';

export default function getComparisonDate(range) {
    const date = new Date();
    let result;
    switch (range) {
        case 'W':
            result = startOfWeek(date, { weekStartsOn: 1 });
            break;
        case 'M':
            result = startOfMonth(date);
            break;
        case 'Y':
            result = startOfYear(date);
            break;
        default:
            result = startOfDay(date);
            break;
    }
    return result;
}