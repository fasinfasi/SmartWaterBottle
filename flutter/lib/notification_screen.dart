import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/material.dart';

class NotificationScreen extends StatefulWidget {
  @override
  _NotificationServiceState createState() => _NotificationServiceState();
}

class _NotificationServiceState extends State<NotificationScreen> {
  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();
  final FlutterSecureStorage _secureStorage = FlutterSecureStorage();

  bool _isNotificationsOn = true; // Default: ON
  String? _fcmToken;

  @override
  void initState() {
    super.initState();
    _loadNotificationPreference();
    _initializeNotifications();
    _getFCMToken();
  }

  // 🔹 Load saved notification preference
  Future<void> _loadNotificationPreference() async {
    try {
      String? status = await _secureStorage.read(key: 'notifications_enabled');
      setState(() {
        _isNotificationsOn = status == 'true';
      });

      if (_isNotificationsOn) {
        _subscribeToFCM();
      } else {
        _unsubscribeFromFCM();
      }
    } catch (e) {
      print("❌ Error loading notification preference: $e");
    }
  }

  // 🔹 Initialize Firebase & Local Notifications
  Future<void> _initializeNotifications() async {
    try {
      NotificationSettings notifSettings =
          await _firebaseMessaging.requestPermission();
      if (notifSettings.authorizationStatus == AuthorizationStatus.authorized) {
        print("✅ Notifications enabled");
        FirebaseMessaging.onMessage.listen((RemoteMessage message) {
          _showLocalNotification(message.notification);
        });
      }

      const AndroidInitializationSettings androidSettings =
          AndroidInitializationSettings('@mipmap/ic_launcher');
      const InitializationSettings initSettings =
          InitializationSettings(android: androidSettings);
      await _localNotifications.initialize(initSettings);
    } catch (e) {
      print("❌ Error initializing notifications: $e");
    }
  }

  // 🔹 Get FCM Token
  Future<void> _getFCMToken() async {
    try {
      String? token = await _firebaseMessaging.getToken();
      print("🔹 FCM Token: $token");
      setState(() {
        _fcmToken = token;
      });
    } catch (e) {
      print("❌ Error getting FCM Token: $e");
    }
  }

  // 🔹 Show Local Notification
  void _showLocalNotification(RemoteNotification? notification) {
    if (notification == null) return;

    const AndroidNotificationDetails androidDetails =
        AndroidNotificationDetails(
      "channel_id",
      "channel_name",
      importance: Importance.high,
    );

    const NotificationDetails platformDetails =
        NotificationDetails(android: androidDetails);

    _localNotifications.show(
        0, notification.title, notification.body, platformDetails);
  }

  // 🔹 Subscribe/Unsubscribe from FCM
  Future<void> _subscribeToFCM() async {
    try {
      await _firebaseMessaging.subscribeToTopic("hydration_alerts");
      await _secureStorage.write(key: 'notifications_enabled', value: 'true');
      print("✅ Subscribed to FCM topic");
    } catch (e) {
      print("❌ Error subscribing to FCM: $e");
    }
  }

  Future<void> _unsubscribeFromFCM() async {
    try {
      await _firebaseMessaging.unsubscribeFromTopic("hydration_alerts");
      await _secureStorage.write(key: 'notifications_enabled', value: 'false');
      print("✅ Unsubscribed from FCM topic");
    } catch (e) {
      print("❌ Error unsubscribing from FCM: $e");
    }
  }

  // 🔹 Toggle Notification Button
  void _toggleNotifications(bool value) {
    setState(() {
      _isNotificationsOn = value;
    });

    if (value) {
      _subscribeToFCM();
    } else {
      _unsubscribeFromFCM();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Notifications")),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SwitchListTile(
              title: Text("Enable Notifications"),
              value: _isNotificationsOn,
              onChanged: _toggleNotifications,
            ),
            if (_fcmToken != null)
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: SelectableText("FCM Token: $_fcmToken"),
              ),
          ],
        ),
      ),
    );
  }
}
