import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DataTable, IconButton, PaperProvider, SegmentedButtons } from 'react-native-paper';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from './firebaseConfig';
import getComparisonDate, { getLabelsBetweenDates, groupFilteredData, handleDataGrouping } from './helpers';
import { addDays, addMonths, addWeeks, addYears, compareAsc, format, getWeek, subDays, subMonths, subWeeks, subYears } from 'date-fns';
import StatisticsChart from './statisticsChart';

const StatisticsScreen = () => {
    const database = getDatabase(app);
    const [dbData, setDbData] = useState([]);
    const [dateRangeBtn, setDateRangeBtn] = useState('D');
    const [statisticsData, setStatisticsData] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date());
    const [chartData, setChartData] = useState({});
    const [filteredData, setFilteredData] = useState([]);

    const handleDateRange = () => {
        const range = dateRangeBtn;
        return getComparisonDate(range, currentDate);
    };

    const handleDateFiltering = () => {
        const { startDate, endDate } = handleDateRange();
        const filtered = dbData?.filter(entry => {
            const entryDate = new Date(entry.endTime);
            return compareAsc(entryDate, startDate) >= 0 && compareAsc(entryDate, endDate) <= 0;
        });

        setFilteredData(filtered);

        if (filtered.length > 0) {
            const reducedData = filtered.reduce(
                (acc, entry) => {
                    const { completedTimers, completedShortBreaks, longBreakLength, shortBreakLength, timerLength } = entry;
                    const timerLengthSec = timerLength * 60;
                    const shortBreakLengthSec = shortBreakLength * 60;
                    const longBreakLengthSec = longBreakLength * 60;

                    acc.completedTimers += completedTimers || 0;
                    acc.completedBreaks += completedShortBreaks || 0;

                    acc.timeSpentTimer += (completedTimers || 0) * timerLengthSec;
                    acc.timeSpentOnBreak += (completedShortBreaks || 0) * shortBreakLengthSec;

                    acc.completedBreaks += 1; //account for 1 long break per cycle
                    acc.timeSpentOnBreak += longBreakLengthSec;

                    return acc;
                },
                {
                    completedTimers: 0,
                    completedBreaks: 0,
                    timeSpentTimer: 0,
                    timeSpentOnBreak: 0,
                }
            );

            return reducedData;
        }
        return {};
    };

    const handleChevronClick = (direction) => {
        setCurrentDate((prevDate) => {
            switch (dateRangeBtn) {
                case 'D':
                    return direction === 'left' ? subDays(prevDate, 1) : addDays(prevDate, 1);
                case 'W':
                    return direction === 'left' ? subWeeks(prevDate, 1) : addWeeks(prevDate, 1);
                case 'M':
                    return direction === 'left' ? subMonths(prevDate, 1) : addMonths(prevDate, 1);
                case 'Y':
                    return direction === 'left' ? subYears(prevDate, 1) : addYears(prevDate, 1);
                default:
                    return prevDate;
            }
        });
    };

    useEffect(() => {
        const dataRef = ref(database, 'cycleData/');
        onValue(dataRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setDbData(Object.values(data));
            } else {
                setDbData([]);
            }
        })
    }, []);

    useEffect(() => {
        setCurrentDate(new Date());
    }, [dateRangeBtn]);

    useEffect(() => {
        if (dbData.length > 0) {
            const statsData = handleDateFiltering();
            setStatisticsData(statsData);
        }
    }, [currentDate, dbData, dateRangeBtn]);

    useEffect(() => {
        if (filteredData.length > 0) {
            const formattedData = groupFilteredData(filteredData, dateRangeBtn);
            setChartData(formattedData);
        } else {
            setChartData(null);
        }
    }, [filteredData, dateRangeBtn]);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}min`;
        } else if (minutes > 0) {
            return `${minutes}min ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    };

    const formatDate = () => {
        switch (dateRangeBtn) {
            case 'D':
                return format(currentDate, 'dd.MM.yyyy');
            case 'W':
                return ` Week ${getWeek(currentDate, 'dd.MM.yyyy')}`;
            case 'M':
                return format(currentDate, 'MMMM yyyy');
            case 'Y':
                return format(currentDate, 'yyyy');
            default:
                return '';
        }
    };

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.title} >Statistics Page</Text>
                <SegmentedButtons
                    value={dateRangeBtn}
                    onValueChange={setDateRangeBtn}
                    buttons={[
                        {
                            value: 'D',
                            label: 'D',
                            style: dateRangeBtn === 'D' ? styles.selectedButton : styles.unselectedButton,
                            labelStyle: dateRangeBtn === 'D' ? styles.selectedText : styles.unselectedText,
                        },
                        {
                            value: 'W',
                            label: 'W',
                            style: dateRangeBtn === 'W' ? styles.selectedButton : styles.unselectedButton,
                            labelStyle: dateRangeBtn === 'W' ? styles.selectedText : styles.unselectedText,
                        },
                        {
                            value: 'M',
                            label: 'M',
                            style: dateRangeBtn === 'M' ? styles.selectedButton : styles.unselectedButton,
                            labelStyle: dateRangeBtn === 'M' ? styles.selectedText : styles.unselectedText,
                        },
                        {
                            value: 'Y',
                            label: 'Y',
                            style: dateRangeBtn === 'Y' ? styles.selectedButton : styles.unselectedButton,
                            labelStyle: dateRangeBtn === 'Y' ? styles.selectedText : styles.unselectedText,
                        }
                    ]}
                    style={styles.segmentedButtons}
                    density='small'
                    theme={{ colors: { primary: '#33658A' } }}
                />
                <View style={styles.dateSelector}>
                    <IconButton
                        icon="chevron-left"
                        size={24}
                        onPress={() => handleChevronClick('left')}
                    />
                    <Text style={styles.dateText}>{formatDate()}</Text>
                    <IconButton
                        icon="chevron-right"
                        size={24}
                        onPress={() => handleChevronClick('right')}
                    />
                </View>
                <View style={styles.chartPlaceholder}>
                    {
                        chartData && Object.keys(chartData).length > 0 ?
                            <StatisticsChart data={chartData} />
                            :
                            <Text style={styles.chartText}>No chart data available</Text>
                    }
                </View>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Category</DataTable.Title>
                        <DataTable.Title numeric>Count</DataTable.Title>
                        <DataTable.Title numeric>Time Spent</DataTable.Title>
                    </DataTable.Header>
                    {
                        statisticsData && Object.keys(statisticsData).length > 0 ?
                            <>
                                <DataTable.Row>
                                    <DataTable.Cell>Focus Sessions</DataTable.Cell>
                                    <DataTable.Cell numeric>{statisticsData.completedTimers}</DataTable.Cell>
                                    <DataTable.Cell numeric>{formatTime(statisticsData.timeSpentTimer)}</DataTable.Cell>
                                </DataTable.Row>
                                <DataTable.Row>
                                    <DataTable.Cell>Total breaks</DataTable.Cell>
                                    <DataTable.Cell numeric>{statisticsData.completedBreaks}</DataTable.Cell>
                                    <DataTable.Cell numeric>{formatTime(statisticsData.timeSpentOnBreak)}</DataTable.Cell>
                                </DataTable.Row>
                            </>
                            :
                            <Text style={styles.noDataText}>No statistics datat available for given date selection</Text>
                    }
                </DataTable>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 50,
        flexShrink: 1,
    },
    segmentedButtons: {
        marginBottom: 20,
        alignSelf: 'center',
    },
    chartPlaceholder: {
        height: 250,
        backgroundColor: '#33658A',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        overflow: 'hidden',
        borderRadius: 10,
    },
    chartText: {
        fontSize: 16,
        color: '#ffffff',
    },
    noDataText: {
        fontSize: 16,
        color: '#666666',
        marginTop: 20
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    selectedButton: {
        backgroundColor: '#33658A',
        borderColor: '#33658A',
    },
    unselectedButton: {
        backgroundColor: '#f0f0f0',
        borderColor: '#cccccc',
    },
    selectedText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    unselectedText: {
        color: '#000000',
    },
});

export default StatisticsScreen;