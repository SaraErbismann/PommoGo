import { Gyroscope } from "expo-sensors";
import { useEffect, useState } from "react";
import * as Notifications from 'expo-notifications';
import { Button, Dialog, PaperProvider, Portal, Text } from "react-native-paper";

export default function GyroscopeNotifications({ phase }) {
    const [isPhoneHeld, setIsPhoneHeld] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const subscription = Gyroscope.addListener((data) => { //subscribe to gyroscope
            const { x } = data;

            if (Math.abs(x) > 0.015 || Math.abs(x) < 0) { // follow x axis
                setIsPhoneHeld(true);
                if (phase === 'timer') { //if phase from props is timer, set dialog open
                    setDialogOpen(true);
                }
            } else {
                setIsPhoneHeld(false);
                setDialogOpen(false);//else set it to false
            }
        });

        Gyroscope.setUpdateInterval(1000); //slower interval for the dialog is ok

        return () => subscription.remove(); //remove subscription to gyroscope
    }, [phase]);

    const closeDialog = () => {
        setDialogOpen(false);
    };

    return (
        <Portal>
            <Dialog visible={dialogOpen} onDismiss={closeDialog}>
                <Dialog.Title>Are you on your phone?</Dialog.Title>
                <Dialog.Content>
                    <Text>
                        The timer is running and we detected movement on your phone. Use this time to concentrate on the task at hand!
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={closeDialog}>OK</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};
