import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { handleSaveCycleData } from './apiCalls';
//import SettingsContext from './settingsContext';

export default function TimerScreen() {
    //const { timerLength, shortBreak, longBreak, amount } = useContext(SettingsContext);
    const timerLength = 0.1;
    const shortBreak = 0.1;
    const longBreak = 0.1;
    const amount = 2;
    const [state, setState] = useState({
        playPauseIcon: 'pause',
        isPlay: false
    });
    const [cycleData, setCycleData] = useState({
        completedTimers: 0,
        completedShortBreaks: 0,
        startTime: null,
        endTime: null
    });
    const [timer, setTimer] = useState({
        timeLeft: timerLength * 60,
        isRunning: false,
        phase: 'timer'
    });

    useEffect(() => {
        if (timer.isRunning && timer.timeLeft > 0) {
            const timeout = setTimeout(() => {
                setTimer(prevTimer => ({
                    ...prevTimer,
                    timeLeft: prevTimer.timeLeft - 1
                }));
            }, 1000);

            return () => clearTimeout(timeout);
        } else if (timer.timeLeft === 0) {
            handleCycleCompletion();
        }
    }, [timer.isRunning, timer.timeLeft]);

    const handleCycleCompletion = () => {
        if (timer.phase === 'timer') {
            setCycleData(prevCycle => ({
                ...prevCycle,
                completedTimers: prevCycle.completedTimers + 1
            }));

            if (cycleData.completedTimers + 1 > amount) {
                setTimer(prevTimer => ({
                    ...prevTimer,
                    timeLeft: longBreak * 60,
                    isRunning: false,
                    phase: 'longBreak'
                }));
            } else {
                setTimer(prevTimer => ({
                    ...prevTimer,
                    timeLeft: shortBreak * 60,
                    isRunning: false,
                    phase: 'shortBreak'
                }));
            }
        } else if (timer.phase === 'shortBreak') {
            setCycleData(prevCycle => ({
                ...prevCycle,
                completedShortBreaks: prevCycle.completedShortBreaks + 1
            }));

            setTimer(prevTimer => ({
                ...prevTimer,
                timeLeft: timerLength * 60,
                isRunning: false,
                phase: 'timer'
            }));
        } else if (timer.phase === 'longBreak') {
            handleEndOfCycle();
        }
    };

    const handleEndOfCycle = async () => {
        const endTime = new Date().toISOString();

        const updatedCycleData = {
            ...cycleData,
            timerLength: timerLength,
            shortBreakLength: shortBreak,
            longBreakLength: longBreak,
            endTime: endTime
        };
        setCycleData(updatedCycleData);

        console.log('Cycle completed and saved:', updatedCycleData);

        await handleSaveCycleData(updatedCycleData);

        setCycleData({
            completedTimers: 0,
            completedShortBreaks: 0,
            startTime: null,
            endTime: null
        });
        setTimer({ timeLeft: timerLength * 60, isRunning: false, phase: 'timer' });
    };

    const formatTime = seconds => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handlePlayPause = () => {
        setState(prevState => ({
            ...prevState,
            isPlay: !prevState.isPlay
        }));

        if (cycleData.startTime === null) {
            setCycleData(prevCycle => ({
                ...prevCycle,
                startTime: new Date().toISOString()
            }));
        }

        setTimer(prevTimer => ({
            ...prevTimer,
            isRunning: !prevTimer.isRunning
        }));
    };

    const handleSkip = () => { //to-do: handle logic
        setTimer({
            timeLeft: 0,
            isRunning: false
        });
    };

    const handleRewind = () => { //to-do: handle logic
        setTimer({
            timeLeft: timer.phase === 'timer' ? timerLength * 60 : shortBreak * 60,
            isRunning: false,
            phase: timer.phase
        });
    };

    const getHeadertext = () => {
        if (timer.phase === 'timer') {
            return 'Timer';
        } else if (timer.phase === 'shortBreak') {
            return 'Short break';
        } else {
            return 'Long break';
        }
    };

    return (
        <View style={styles.container}>
            {
                cycleData.completedTimers === 0 && !timer.isRunning &&
                <Text style={styles.basicHeader}>New Cycle</Text>
            }
            <Text style={styles.timerText} >{getHeadertext()}</Text>
            <Text style={styles.timerText} >{formatTime(+timer.timeLeft)}</Text>
            <View style={styles.buttonContainer}>
                <IconButton
                    icon="restore"
                    mode="contained"
                    size={20}
                    disabled={timer.phase === 'longBreak'}
                    onPress={handleRewind}
                />
                <IconButton
                    icon={state.isPlay ? 'pause' : 'play'}
                    mode="contained"
                    size={20}
                    onPress={handlePlayPause}
                />
                <IconButton
                    icon="chevron-right"
                    mode="contained"
                    disabled={timer.phase === 'longBreak'}
                    size={20}
                    onPress={handleSkip}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    basicHeader: {
        fontSize: 30,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
    },
    progressBar: {
        marginBottom: 20,
        width: '80%',
        height: 10,
        backgroundColor: '#0079C2'
    },
});
