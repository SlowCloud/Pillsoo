import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

interface NotificationData {
  [key: string]: any; // 동적 속성에 대한 타입 정의
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

class LocalNotificationService {
  configure = (onOpenNotification: (data: NotificationData) => void) => {
    PushNotification.configure({
      onRegister: (token: string) => {
        console.log('[LocalNotificationService] onRegister : localtoken', token);
      },
      onNotification: (notification: any) => {
        console.log('[LocalNotificationService] onNotification ', notification);
        if (!notification?.data) {
          return;
        }
        notification.userInteraction = true;
        onOpenNotification(
          Platform.OS === 'ios' ? notification.data.item : notification.data,
        );

        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
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
    PushNotification.localNotification({
      ...this.buildAndroidNotification(id, title, message, data, options),
      ...this.buildIOSNotification(id, title, message, data, options),
      title: title || '',
      message: message || '',
      playSound: options.playSound || false,
      soundName: options.soundName || 'default',
      userInteraction: false,
    });
  };

  buildAndroidNotification = (id: string, title: string, message: string, data: NotificationData = {}, options: NotificationOptions = {}) => {
    return {
      id: id,
      authCancel: true,
      largeIcon: options.largeIcon || 'ic_launcher',
      smallIcon: options.smallIcon || 'ic_notification',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || 'high',
      importance: options.importance || 'high',
      data: data,
    };
  };

  buildIOSNotification = (id: string, title: string, message: string, data: NotificationData = {}, options: NotificationOptions = {}) => {
    return {
      alertAction: options.alertAction || 'view',
      category: options.category || '',
      userInfo: {
        id: id,
        item: data,
      },
    };
  };

  cancelAllLocalNotifications = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };

  removeDeliveredNotificationByID = (notificationId: string) => {
    console.log('[LocalNotificationService] removeDeliveredNotificationByID:', notificationId);
    PushNotification.cancelLocalNotifications({ id: `${notificationId}` });
  };
}

export const localNotificationService = new LocalNotificationService();
