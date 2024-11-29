import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DataTable, PaperProvider, SegmentedButtons } from 'react-native-paper';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from './firebaseConfig';
import getComparisonDate from './helpers';
import { compareAsc, parseISO } from 'date-fns';

const StatisticsScreen = () => {
    const database = getDatabase(app);
    const [dbData, setDbData] = useState([]);
    const [dateRangeBtn, setDateRangeBtn] = useState('D');
    const [statisticsData, setStatisticsData] = useState({});

    const handleDateRange = () => {
        const range = dateRangeBtn;
        return getComparisonDate(range);
    };

    const handleDateFiltering = () => {
        const comparisonDate = handleDateRange();
        const filteredData = dbData?.filter(entry => {
            const entryDate = new Date(entry.endTime);
            return compareAsc(entryDate, new Date(comparisonDate)) >= 0;
        });

        if (filteredData.length > 0) {
            const reducedData = filteredData.reduce(
                (acc, entry) => {
                    const { completedTimers, completedShortBreaks, longBreakLength, shortBreakLength, timerLength } = entry;
                    const timerLengthSec = timerLength * 60;
                    const shortBreakLengthSec = shortBreakLength * 60;
                    const longBreakLengthSec = longBreakLength * 60;

                    acc.completedTimers += completedTimers || 0;
                    acc.completedBreaks += completedShortBreaks || 0;

                    acc.timeSpentTimer += (completedTimers || 0) * timerLengthSec;
                    acc.timeSpentOnBreak += (completedShortBreaks || 0) * shortBreakLengthSec;

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
            console.log('reduced data after reduce', reducedData);
            return reducedData;
        }
        return {};
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
        if (dbData.length > 0) {
            const statistics = handleDateFiltering();
            setStatisticsData(statistics);
        }
    }, [dateRangeBtn, dbData]);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}min`;
        } else if (minutes > 0) {
            return `${minutes}min`;
        } else {
            return `${seconds}s`;
        }
    };

    console.log('stats data', statisticsData);

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.title} >Statistics Page</Text>
                <SegmentedButtons
                    value={dateRangeBtn}
                    onValueChange={setDateRangeBtn}
                    buttons={[
                        { value: 'D', label: 'D' },
                        { value: 'W', label: 'W' },
                        { value: 'M', label: 'M' },
                        { value: 'Y', label: 'Y' }
                    ]}
                    style={styles.segmentedButtons}
                    density='small'
                />
                <View style={styles.chartPlaceholder}>
                    <Text style={styles.chartText}>Bar Chart Placeholder</Text>
                </View>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Category</DataTable.Title>
                        <DataTable.Title numeric>Count</DataTable.Title>
                        <DataTable.Title numeric>Time Spent</DataTable.Title>
                    </DataTable.Header>
                    {
                        Object.keys(statisticsData).length > 0 ?
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
    },
    segmentedButtons: {
        marginBottom: 20,
        alignSelf: 'center',
    },
    chartPlaceholder: {
        height: 200,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    chartText: {
        fontSize: 16,
        color: '#666666',
    },
    noDataText: {
        fontSize: 16,
        color: '#666666',
        marginTop: 20
    },
});

export default StatisticsScreen;