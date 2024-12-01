import { endOfDay, endOfMonth, endOfWeek, endOfYear, isLeapYear, startOfDay, startOfMonth, startOfWeek, startOfYear } from 'date-fns';
import { format, eachDayOfInterval, addWeeks, addMonths, addYears, getWeek, addDays } from 'date-fns';

export default function getComparisonDate(range, currentDate) {
    let startDate, endDate;
    switch (range) {
        case 'D':
            startDate = startOfDay(currentDate);
            endDate = endOfDay(currentDate);
            break;
        case 'W':
            startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
            endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
            break;
        case 'M':
            startDate = startOfMonth(currentDate);
            endDate = endOfMonth(currentDate);
            break;
        case 'Y':
            startDate = startOfYear(currentDate);
            endDate = endOfYear(currentDate);
            break;
        default:
            startDate = endDate = currentDate;
    }

    return { startDate, endDate };
}

export const groupFilteredData = (filteredData, dateRangeBtn) => {
    const groupedData = {};
    const returnData = { labels: [], datasets: [{}] };

    filteredData.map(entry => {
        const entryDate = new Date(entry.endTime);
        let label;

        switch (dateRangeBtn) {
            case 'D':
                label = `${entryDate.getHours().toString().padStart(2, '0')}:00`;
                if (parseInt(label.split(':')[0], 10) % 2 !== 0) return;
                break;

            case 'W':
                label = format(entryDate, 'EEEE');
                break;

            case 'M':
                label = `Week ${getWeek(entryDate)}`;
                break;

            case 'Y':
                label = format(entryDate, 'MMMM');
                break;

            default:
                return;
        }

        if (!groupedData[label]) {
            groupedData[label] = 0;
        }
        groupedData[label] += entry.completedTimers || 0;
        console.log('groupedData', groupedData);
    });

    const labels = Object.keys(groupedData);
    const data = labels.map(label => groupedData[label]);

    return {
        labels,
        datasets: [{ data }],
    };
};

