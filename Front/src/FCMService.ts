import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

type OnRegisterCallback = (token: string) => void;
type OnNotificationCallback = (notification: any) => void;
type OnOpenNotificationCallback = (notification: any) => void;

class FCMService {
  private messageListener: (() => void) | null = null;

  register = (onRegister: OnRegisterCallback, onNotification: OnNotificationCallback, onOpenNotification: OnOpenNotificationCallback) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(onRegister, onNotification, onOpenNotification);
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = (onRegister: OnRegisterCallback) => {
    messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          this.getToken(onRegister);
        } else {
          this.requestPermission(onRegister);
        }
      })
      .catch((error) => {
        console.log('[FCMService] Permission rejected ', error);
      });
  };

  getToken = (onRegister: OnRegisterCallback) => {
    messaging()
      .getToken()
      .then((fcmToken) => {
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
          console.log('[FCMService] User does not have a device token');
        }
      })
      .catch((error) => {
        console.log('[FCMService] getToken rejected', error);
      });
  };

  requestPermission = (onRegister: OnRegisterCallback) => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch((error) => {
        console.log('[FCMService] Request Permission rejected', error);
      });
  };

  deleteToken = () => {
    console.log('[FCMService] deleteToken');
    messaging()
      .deleteToken()
      .catch((error) => {
        console.log('[FCMService] Delete token error', error);
      });
  };

  createNotificationListeners = (
    onRegister: OnRegisterCallback,
    onNotification: OnNotificationCallback,
    onOpenNotification: OnOpenNotificationCallback,
  ) => {
    // When the app is opened from a background state
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        '[FCMService] onNotificationOpenApp Notification caused app to open from background',
        remoteMessage,
      );
      if (remoteMessage) {
        const notification = remoteMessage.notification;
        onOpenNotification(notification);
      } else {
        console.log('background notification error');
      }
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log(
          '[FCMService] getInitialNotification caused app to open from quit state : fcmremoteMessage :',
          remoteMessage,
        );

        if (remoteMessage) {
          const notification = remoteMessage.notification;
          onOpenNotification(notification);
        } else {
          console.log('quit state notification error');
        }
      });

    // While the app is running and currently in focus
    this.messageListener = messaging().onMessage(async (remoteMessage) => {
      console.log('[FCMService] A new FCM message arrived', remoteMessage);
      if (remoteMessage) {
        let notification = null;
        if (Platform.OS === 'ios') {
          notification = remoteMessage.data.notification;
        } else {
          notification = remoteMessage.notification;
        }
        onNotification(notification);
      }
    });

    // Triggered when a new token is generated
    messaging().onTokenRefresh((fcmToken) => {
      console.log('[FCMService] New token refresh :', fcmToken);
      onRegister(fcmToken);
    });
  };

  unRegister = () => {
    if (this.messageListener) {
      this.messageListener();
    }
  };
}

export const fcmService = new FCMService();
