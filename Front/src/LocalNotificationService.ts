import PushNotification, { PushNotificationObject } from 'react-native-push-notification';
import { Platform } from 'react-native';

interface NotificationData {
  [key: string]: any;
}

interface NotificationOptions {
  playSound?: boolean;
  soundName?: string;
  largeIcon?: string;
  smallIcon?: string;
  vibrate?: boolean;
  vibration?: number;
  priority?: 'high' | 'low';
  importance?: 'high' | 'low' | 'default';
  alertAction?: string;
  category?: string;
}

interface CustomPushNotificationObject extends PushNotificationObject {
  title: string;
  message: string;
}

interface NotificationWithInteraction extends Omit<PushNotificationObject, 'message'> {
  data?: NotificationData;
  userInteraction?: boolean; // Add this line
}

class LocalNotificationService {
  configure = (onOpenNotification: (data: NotificationData) => void) => {
    PushNotification.configure({
      onRegister: (token: { os: string; token: string; }) => {
        console.log('[LocalNotificationService] onRegister : localtoken', token);
      },
      onNotification: (notification: NotificationWithInteraction) => {
        console.log('[LocalNotificationService] onNotification ', notification);
        
        if (notification?.data) {
          if (notification.userInteraction) {
            onOpenNotification(notification.data);
          }
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  unRegister = () => {
    PushNotification.unregister();
  };

  showNotification = (id: string, title: string, message: string, data: NotificationData = {}, options: NotificationOptions = {}) => {
    const notification: CustomPushNotificationObject = {
      ...this.buildAndroidNotification(id, title, message, data, options),
      title: title || '',
      message: message || '',
    };

    PushNotification.localNotification(notification);
  };

  buildAndroidNotification = (id: string, title: string, message: string, data: NotificationData = {}, options: NotificationOptions = {}) => {
    return {
      id: id,
      largeIcon: options.largeIcon || 'ic_launcher',
      smallIcon: options.smallIcon || 'ic_notification',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || 'high',
      importance: options.importance || 'high',
      data: data,
      message: message || '',
    };
  };

  cancelAllLocalNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  removeDeliveredNotificationByID = (notificationId: string) => {
    console.log('[LocalNotificationService] removeDeliveredNotificationByID:', notificationId);
    PushNotification.cancelLocalNotifications({ id: `${notificationId}` });
  };
}

export const localNotificationService = new LocalNotificationService();
