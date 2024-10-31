# AquaSync - Smart Water Bottle with Application 💧🚰

<p>
<img src="https://img.shields.io/badge/React_Native-20232A?logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/Flask-1B2C59?logo=flask&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Arduino-00979D?logo=arduino&logoColor=white" />
<img src="https://img.shields.io/badge/IoT-1DA1F2?logo=internet-explorer&logoColor=white" />
<img src="https://img.shields.io/badge/Data_Analysis-yellow?logo=chart-bar&logoColor=white" />
<img src="https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white" />
<img src="https://img.shields.io/badge/Miro-009C8C?logo=miro&logoColor=white" />
<img src="https://img.shields.io/badge/GIT-E44C30?logo=git&logoColor=white" />
<img src="https://img.shields.io/badge/GitHub_Actions-563D7C?logo=github-actions&logoColor=white"/>
<img src="https://img.shields.io/badge/Expo_Go-1B1F23?logo=expo&logoColor=white" />
<img src="https://img.shields.io/badge/prettier-1A2C34?logo=prettier&logoColor=white" />
</p>

AquaSync is a smart water bottle application designed to help users stay hydrated by tracking their water intake, analyzing drinking habits, and monitoring the real-time water level in the bottle. The application connects to the water bottle via Bluetooth by Xiao ESP32C3 microcontroller, providing data on hydration patterns(intake), water purity, and more. personal health data, such as age, weight, activity level, and current weather, to provide personalized water intake recommendations tailored to each user’s unique needs. The app also offers reminders to drink water based on these recommendations, ensuring users maintain their hydration goals.

## Contents
- [Installation](#setup-)
- [Folder Structure](#directory-structure-)
- [Usage](#usage-)
- [Features](#features-)
- [Contribute](#contributing-)
- [License](#license-)


## Features ✨

- **Real-Time Hydration Tracking**: Monitors water levels in the bottle and tracks drinking patterns.
- **Daily Consumption Goals**: Set and track hydration goals with progress updates.
- **Bluetooth Connectivity**: Connect the app to the smart bottle for live water-level readings.
- **Health and Weather Insights**: Customize hydration recommendations based on health status, activity level, and current weather.
- **Data Analytics**: Graphs and reports of daily, weekly, and monthly water intake.
- **User Feedback**: Collect user input for continuous improvement.

## Tech Stack 📚

- **Frontend**: React Native with Expo
- **Backend**: Python Flask
- **Database**: MongoDB
- **Bluetooth**: Integrated Bluetooth API for bottle connection
- **Data Visualization**: `@shopify/react-native-skia` for custom animations and graphs
- **Weather Integration**: WeatherAPI for live weather data

## Setup 👨‍💻

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/fasinfasi/SmartWaterBottle.git
   cd AquaSync
   
2. **Install Dependencies**:
   ```
   npm install
   ```
   
3. **Set Up Environment Variables**:
   - Create a .env file in the project root and add your configuration keys:
   ```
   WEATHER_API_KEY=https://api.weatherapi.com/v1/current.json?key=ad0708fea04d40c9b1c161449240109&q
   MONGODB_URI=mongodb://localhost:27017/SWB
   ```

4. Run the App
   - For Android:
      ```
      npm start
      ```
      Open Expo Go on your Android device and scan the QR code.
     
   - For iOS (requires Mac):
     ```
     npm start
     ```
     Open Expo Go on your iOS device and scan the QR code.

5. Run the Backend Server
   - Navigate to the backend directory and start the Flask server:
     ```
     python app.py
     ```

## Directory Structure 🛰
  ```
  AquaSync/
├── app/
│   ├── screens/
│   │   ├── WelcomScreen.js     # Splash screen with AquaSync text, logo and start button
│   │   ├── LoginScreen.js      # Users allow to login
│   │   ├── SignupScreen.js     # New user can make an account
│   │   ├── PasswordResetScreen.js      # For reset password those forgotten persons
│   │   ├── InputNameScreen.js   # Collect name and sex of user
│   │   └── InputAgeScreen.js     # Collect user date of birth
│   │   ├── InputWeightScreen.js     # Collect user weight
│   │   ├── ActivityScreen.js      # To gather user activity and health status
│   │   ├── HomeScreen.js       # Displays water level, bottle's charge, weather, and goal progress
│   │   ├── BluetoothScreen.js       # To connect mobile app with water bottle
│   │   ├── GraphScreen.js       # To expose the graphical visualization of user's water consumptions in anytime and reports
│   │   ├── SettingScreen.js       # To get applications setting allows customisation
│   │   ├── ProfileScreen.js       # User profile details
│   │   ├── NotificationScreen.js       # To customize reminder time and notification tones
│   │   ├── GeneralSettingScreen.js       # To set sleep time, user can get general guide lines and they can sign out
│   │   ├── QuestionScreen.js       # Get FAQ
│   │   ├── FeedbackScreen.js       # User can tell their own experience
│   ├── assets/
|   |   ├── # There some assets kept
├── backend/
│   ├── app.py                   # Flask server setup
│   └── models/
│       └── UserModel.py         # MongoDB user schema
└── README.md
```

## IoT Components in the Smart Water Bottle

The AquaSync smart water bottle utilizes a combination of IoT components to monitor and transmit data about the water level, purity, and bottle status. These components enable seamless integration with the AquaSync app, providing users with real-time insights and personalized hydration guidance. Below are the primary IoT components used in the bottle:

- **Water Level Sensor(copper strips)**: Tracks the current water level in the bottle by using capacitance principle.
  
- **Xiao ESP32C3**: Serves as the processing unit, gathering data from sensors and sent to app.
  
- **Bluetooth Module**: Microcontroller has built-in Bluetooth module which allow connection with app.

- **Battery**: For power supply to hardware components using 3.7v 300mah capacity battery.

- **Resistors**: Ensures circuits protection against exceed current flow.

- **Breadboard**: Act as a circuit board to the entire hardware.

- **LED blub**: To indicate connection status or working condition.

## Screenshots/videos 📸
  [Watch on LinkedIn]([https://www.linkedin.com/in/fasinfasi/](https://www.linkedin.com/posts/activity-7245414621409353728-xAmo?utm_source=share&utm_medium=member_desktop))

## Usage 🎮
  - Home Screen: View daily hydration goals, current water level in the bottle, battery status, and real-time weather conditions.
  - Profile Screen: Update health metrics like age, weight, activity level, and health conditions for personalized hydration recommendations.
  - Personalized Hydration Suggestions: Receive customized water intake goals based on personal data such as activity level, weight, and weather.
  - Drink Reminders: Get timely notifications to drink water throughout the day based on your personalized hydration needs.
  - Graph Analytics: Track historical water intake data with daily, weekly, and monthly views to observe hydration trends over time.
  - Hydration Progress Bar: Monitor how close you are to reaching your daily hydration goal with a dynamic progress bar.
  - Bluetooth Bottle Connection: Seamlessly connect with the smart bottle to receive live updates on water level and bottle status.
  - Real-Time Water Level Updates: View real-time water levels in the bottle, allowing users to see their progress instantly.
  - Weather-Based Hydration Adjustments: AquaSync adjusts daily hydration goals according to current weather conditions, with suggestions on extra hydration during hot weather.
  - User Feedback and Suggestions: Users can provide feedback directly in the app to improve AquaSync's features and functionality.

## Future Plan 🔮
  - Integrate AI recommendations for personalized hydration advice.
  - Implement for feature to app for overall health care to user like diet plan, fitness tracker etc
  - Make community and they can connect with together
  - Latest health research summary about health physical as well as mental as like news

## Contributing 👬

1. Fork the repository.
   
2. Create your branch
   
   ```
   git checkout -b feature-name
   ```
3. Commit your changes:

   ```
   git commit -m "Add new feature"
   ```
4. Push to your branch:
5. 
   ```
   git commit -m "Add new feature"
   ```
6. Open a pull request.

## License 📜

  This project is licensed under the MIT License - see the [LICENSE](License) file for details.

#### This project is not completed yet, I'm in a developing stage. I hope this will get full structure soon 🤗

### Stay hydrated, stay healthy! 💧
