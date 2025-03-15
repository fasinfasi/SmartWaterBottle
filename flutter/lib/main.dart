import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'welcome_screen.dart';
import 'login_screen.dart';
import 'sign_up.dart';
import 'auto_login.dart';
import 'password_reset.dart';
import 'home_screen.dart';
import 'setting_screen.dart';
import 'userprofile_screen.dart'; // Import the ProfileScreen
import 'editprofile_screen.dart'; // Import the EditProfileScreen
import 'general_setting_screen.dart'; // Import the GeneralSettingScreen
import 'knowmoreabout_screen.dart'; // Import the KnowMoreAboutScreen
import 'notification_screen.dart'; // Import the NotificationScreen
import 'question_screen.dart'; // Import the QuestionScreen
import 'feedback_screen.dart'; // Import the FeedbackScreen
import 'inputname_screen.dart'; // Import the InputNameScreen
import 'inputage_screen.dart'; // Import the AgeInputScreen
import 'inputweight_screen.dart'; // Import the InputWeightScreen
import 'status_screen.dart'; // Import StatusPage
import 'sleeptime_screen.dart'; // Import StatusPage
import 'bluetooth_screen.dart'; // Import the BluetoothScreen
import 'graph_screen.dart';
import 'data_analysis.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase
      .initializeApp(); // 🔥 Initialize Firebase before running the app

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AquaSync',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      initialRoute: '/', // Set initial route to WelcomeScreen
      routes: {
        '/': (context) => WelcomeScreen(),
        '/login': (context) => LoginScreen(),
        '/signup': (context) => SignUpScreen(),
        '/auto_login': (context) => const AutoLoginScreen(),
        '/password-reset': (context) => PasswordResetScreen(),
        '/home': (context) => HomeScreen(),
        '/settings': (context) => SettingScreen(),
        '/profile': (context) => ProfileScreen(), // Add the ProfileScreen route
        '/general-setting': (context) =>
            General_SettingScreen(), // Add GeneralSettingScreen route
        '/know-more-about': (context) =>
            KnowMoreAbout(), // Add KnowMoreAboutScreen route
        '/notifications': (context) =>
            NotificationScreen(), // Add NotificationScreen route
        '/questions': (context) => QuestionScreen(), // Add QuestionScreen route
        '/feedback': (context) => FeedbackScreen(), // Add FeedbackScreen route
        '/inputname': (context) =>
            NameInputScreen(), // Add InputNameScreen route
        '/inputage': (context) => AgeInputScreen(), // Add AgeInputScreen route
        '/inputweight': (context) =>
            WeightInputScreen(), // Add InputWeightScreen route
        '/status': (context) => StatusPage(), // Add the StatusPage route
        '/sleep': (context) => SleepTimeScreen(), // Add the StatusPage route
        '/bluetooth': (context) =>
            BluetoothScreen(), // Add the BluetoothScreen route
        '/graph': (context) => StatisticsScreen(),
        '/data': (context) => CompareGraphScreen(),
      },
      // Use onGenerateRoute for screens that require arguments
      onGenerateRoute: (settings) {
        if (settings.name == '/edit-profile') {
          final args = settings.arguments as Map<String, String>;
          return MaterialPageRoute(
            builder: (context) => EditProfileScreen(
              name: args['name'] ?? '',
              sex: args['sex'] ?? '', // Added sex argument
              age: args['age'] ?? '',
              weight: args['weight'] ?? '',
              activityLevel: args['activityLevel'] ?? '',
              healthCondition: args['healthCondition'] ?? '',
            ),
          );
        }
        return null; // Return null for undefined routes
      },
    );
  }
}
