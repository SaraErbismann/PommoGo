import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { IconButton, PaperProvider } from 'react-native-paper';
import { handleSaveCycleData } from './apiCalls';
import SettingsContext from './settingsContext';
import GyroscopeNotifications from './gyroscope';

export default function TimerScreen() {
    const { timerSettings } = useContext(SettingsContext);
    const { timerLength, shortBreak, longBreak, amount } = timerSettings;
    const [state, setState] = useState({
        playPauseIcon: 'pause',
        isPlay: false //used for getting icon for play/pause iconbutton
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

    const handleSkip = () => {
        if (timer.phase === 'timer') {
            setTimer({
                timeLeft: shortBreak * 60,
                isRunning: false,
                phase: 'shortBreak'
            });
        } else if (timer.phase === 'shortBreak') {
            setTimer({
                timeLeft: timerLength * 60,
                isRunning: false,
                phase: 'timer'
            });
        } else if (timer.phase === 'longBreak') {
            alert('Skipping is not allowed during the long break!');
        }
    };

    const handleRewind = () => {
        setTimer({
            timeLeft: timer.phase === 'timer' ? timerLength * 60 : timer.phase === 'shortBreak' ? shortBreak * 60 : longBreak * 60,
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

    const renderGif = () => {
        return (
            <Image
                source={require('./assets/blob-1-opacity-65.gif')}
                style={styles.gif}
            />
        );
    };

    return (
        <PaperProvider>
            <View style={styles.container}>
                <View style={styles.overlayContainer}>
                    <Text style={styles.headerText} >{getHeadertext()}</Text>
                    <Text style={styles.timerText} >{formatTime(+timer.timeLeft)}</Text>
                </View>

                {renderGif()}
                {
                    cycleData.completedTimers === 0 && !timer.isRunning &&
                    <Text style={styles.basicHeader}>New Cycle</Text>
                }
                <View style={styles.buttonContainer}>
                    <IconButton
                        icon="restore"
                        mode="contained"
                        size={20}
                        disabled={timer.phase === 'longBreak'}
                        onPress={handleRewind}
                        iconColor='#FFFFFF'
                        containerColor='#33658A'
                    />
                    <IconButton
                        icon={state.isPlay ? 'pause' : 'play'}
                        mode="contained"
                        size={20}
                        onPress={handlePlayPause}
                        iconColor='#FFFFFF'
                        containerColor='#33658A'
                    />
                    <IconButton
                        icon="chevron-right"
                        mode="contained"
                        disabled={timer.phase === 'longBreak'}
                        size={20}
                        onPress={handleSkip}
                        iconColor='#FFFFFF'
                        containerColor='#33658A'
                    />
                </View>
            </View>
            <GyroscopeNotifications phase={timer.phase} />
        </PaperProvider>
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
        marginBottom: 50,
        flexShrink: 1,
        color: '#86BBD8'
    },
    headerText: {
        fontSize: 48,
        fontWeight: 'bold',
        marginTop: 50,
        color: '#86BBD8'
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
    gif: {
        width: 350,
        height: 350,
        marginBottom: 20,
    },
    overlayContainer: {
        position: 'absolute',
        top: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    }
});
