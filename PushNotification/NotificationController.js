import { StyleSheet, Platform } from 'react-native';
import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import BackgroundService from 'react-native-background-actions';

const NotificationController = () => {
  const options = {
    taskName: 'Example',
    taskTitle: 'Example Task Title',
    taskDesc: 'Example Task Description',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane',
    parameters: {
      delay: 1000,
    },
  };

  const sleep = time => new Promise(resolve => setTimeout(resolve, time));

  const onDisplayNotification = async (data) => {
    await notifee.requestPermission({ sound: true });

    const channelId = await notifee.createChannel({
      id: 'default1',
      name: 'Default Channel-1',
      sound: 'default',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: Platform.OS === 'android'
        ? `<p style="color: #2A3A91;"><b>${data?.notification?.title}</b></p>`
        : `${data?.notification?.title}`,
      body: data?.notification?.body,
      android: {
        channelId,
        sound: 'default',
        color: '#2A3A91',
      },
      ios: {
        categoryId: 'action',
        sound: 'default',
      },
    });
  };

  const onBackgroundNotification = async (data) => {
    if (data?.notification?.title) {
      await notifee.requestPermission({ sound: true });

      const channelId = await notifee.createChannel({
        id: 'default2',
        name: 'Default Channel-2',
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        title: Platform.OS === 'android'
          ? `<p style="color: #2A3A91;"><b>${data?.notification?.title}</b></p> &#128576`
          : `${data?.notification?.title}`,
        subtitle: Platform.OS === 'android' ? '&#129395;' : undefined,
        body: data?.notification?.body,
        android: {
          channelId,
          sound: 'default',
          color: '#2A3A91',
        },
        ios: {
          sound: 'default',
        },
      });
    }
  };

  const veryIntensiveTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background message received:', remoteMessage);
      await onBackgroundNotification(remoteMessage);
    });

    while (BackgroundService.isRunning()) {
      await sleep(delay);
    }
  };

  useEffect(() => {
    const start = async () => {
      await BackgroundService.start(veryIntensiveTask, options);

      const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
        console.log('Foreground notification received:', remoteMessage);
        await onDisplayNotification(remoteMessage);
      });

      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification opened from background:', remoteMessage);
      });

      messaging().getInitialNotification().then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage);
        }
      });

      return () => {
        if (typeof unsubscribeOnMessage === 'function') {
          unsubscribeOnMessage();
        }
      };
    };

    start();
  }, []);

  return null;
};

export default NotificationController;

const styles = StyleSheet.create({});
