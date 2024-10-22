import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton, ProgressBar } from 'react-native-paper';

export default function TimerScreen() {
    const [state, setState] = useState({
        playPauseIcon: 'pause',
        isPlay: false
    });
    const initialTime = 5; //180 is 3 min
    const [timer, setTimer] = useState({
        timeLeft: initialTime,
        isRunning: false,
    });

    useEffect(() => {
        if (timer.isRunning && timer.timeLeft > 0) {
            const timeout = setTimeout(() => {
                setTimer(prevTimer => ({
                    ...prevTimer,
                    timeLeft: +prevTimer.timeLeft - 1
                }));
            }, 1000);

            return () => clearTimeout(timeout);
        } else if (timer.timeLeft === 0) {
            setTimer(prevTimer => ({
                ...prevTimer,
                isRunning: false
            }));
        }
    }, [timer.isRunning, timer.timeLeft]);

    const formatTime = seconds => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handlePlayPause = () => {
        setState({
            ...state,
            isPlay: !state.isPlay
        });
        setTimer({ ...timer, isRunning: !timer.isRunning });
    };

    const handleSkip = () => {
        setTimer({
            timeLeft: 0,
            isRunning: false
        });
    };

    const handleRewind = () => {
        setTimer({
            timeLeft: initialTime,
            isRunning: false
        });
    };

    console.log('state', state);
    console.log('timer', timer);

    const progress = timer.timeLeft / initialTime;

    return (
        <View style={styles.container}>
            <Text style={styles.timerText} >Timer page</Text>
            <Text style={styles.timerText} >{formatTime(+timer.timeLeft)}</Text>
            <ProgressBar progress={progress} color='#F7634D' style={styles.progressBar} visible='true' />
            <View style={styles.buttonContainer}>
                <IconButton
                    icon="restore"
                    mode="contained"
                    size={20}
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
