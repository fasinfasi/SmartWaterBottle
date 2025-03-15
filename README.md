# AquaSync - Smart Water Bottle with Application 💧🚰
<p>
 <img src="https://img.shields.io/badge/Flutter-02569B?logo=flutter&logoColor=white" />
 <img src="https://img.shields.io/badge/Flask-1B2C59?logo=flask&logoColor=white" />
 <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white" />
 <img src="https://img.shields.io/badge/Arduino-00979D?logo=arduino&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=white" />
 <img src="https://img.shields.io/badge/IoT-1DA1F2?logo=internet-explorer&logoColor=white" />
 <img src="https://img.shields.io/badge/Data_Analysis-yellow?logo=chart-bar&logoColor=white" />
 <img src="https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white" />
 <img src="https://img.shields.io/badge/Miro-009C8C?logo=miro&logoColor=white" />
 <img src="https://img.shields.io/badge/GIT-E44C30?logo=git&logoColor=white" />
 <img src="https://img.shields.io/badge/GitHub_Actions-563D7C?logo=github-actions&logoColor=white"/>
 </p>

 AquaSync is a smart water bottle application designed to help users stay hydrated by tracking their water intake, analyzing drinking habits, and monitoring the real-time water level in the bottle by Ultra Sonic Sensor. The application connects to the water bottle via Bluetooth by Xiao ESP32C3 microcontroller, providing data on hydration patterns(intake), water purity, and more. personal health data, such as age, weight, activity level, current weather and sleep hours to provide personalized water intake recommendations tailored to each user’s unique needs. The app also offers reminders to drink water based on these recommendations, ensuring users maintain their hydration goals.

 ## Contents
 - [Installation](#setup-)
 - [Folder Structure](#directory-structure-)
 - [Hardwares](#iot-components-of-the-water-bottle-)
 - [Usage](#usage-)
 - [Features](#features-)
 - [Contribute](#contributing-)
 - [License](#license-)

 ## Features ✨
 - **Real-Time Hydration Tracking**: Monitors water levels in the bottle and tracks drinking patterns.
 - **Daily Consumption Goals**: Set and track hydration goals with progress updates.
 - **Bluetooth Connectivity**: Connect the app to the smart bottle for live water-level readings.
 - **Health and Weather Insights**: Customize hydration recommendations based on health status, activity level, sleep time and current weather.
 - **Data Analytics**: Graphs and reports of daily, they can compare two day's water intake and get them feedback.
 - **Cloud Services:** Firebase
 - **User Feedback**: Collect user input for continuous improvement.

 ## Tech Stack 📚
 - **Frontend**: Flutter
 - **Backend**: Python Flask
 - **Database**: MongoDB
 - **Weather Integration**: WeatherAPI for live weather data

   ## Setup 👨‍💻
   **1. Clone the Repository**:
    ```
    git clone https://github.com/fasinfasi/SmartWaterBottle.git
    cd AquaSync
    ```
   **2. Install Dependencies**:
   ### For flutter
   Make sure you have Flutter installed. You can check by running:
   ```
    flutter --version
   ```
   Next, install dependencies:
   ```
    flutter pub get
   ```
   To run the app:
   ```
   flutter run
   ```
   
   ### For Python-flask
   Navigate to the Flask backend directory:
   ```
   cd backend
   python -m venv venv
   ```
   Activate the virtual environment:
   - Windows: venv\Scripts\activate
   - Mac/Linux: source venv/bin/activate

    ### Install Dependencies
    ```
    pip install -r requirements.txt
    ```
    ### Run Flask Server
    ```
    python app.py
    ```
    ### MongoDB setup
   1. Install MongoDB from MongoDb official center.
   2. Start MongoDB service:
      ```
      mongod --dbpath="C:\data\db"  # Adjust path based on OS
      ```
   4. Update your Flask environment variables to connect to the database.

  ### Node.js Notification Server Setup
  1. Install Node.js from Node.js official website.
  2. Navigate to the notification service directory:
     ```
     cd notification-server
     ```
  4. Install dependencies:
     ```
     npm install
     ```
  6. Run the server:
     ```
     node server.js
     ```
  ### Firebase Setup (Mobile Notifications)
  1. Set up Firebase at Firebase Console.
  2. Download google-services.json (for Android) or GoogleService-Info.plist (for iOS).
  3. Place them inside your Flutter app under:
     ```
     nodejs/Notification/Notification-service/aquasync-60d5f-6929bb9836df
     ```
  5. Ensure your Firebase configuration matches in the backend.
  ### Set weather api
  keep api key as confidential
  ### Set Arduino IDE
  Install Arduino from their official website.

  ### Directory Structure
  ```
AquaSync/
 ├── flutter/
 │   ├── lib/
 │   │   ├── main.dart     # File setup in app, initializing Firebase and defining all routes for navigation.
 │   │   ├── welcome_screen.dart     # Splash screen with AquaSync text, logo and start button
 │   │   ├── login_screen.dart      # Users allow to login
 │   │   ├── sign_up.dart     # New user can make an account
 │   │   ├── permission_manager.dart      # responsible for handling Bluetooth and location permissions in app.
 │   │   ├── data_analysis.dart     # Display a line chart comparing ratings of two dates
 │   │   ├── firebase_options.dart     # Provides platform-specific Firebase configuration options for app
 │   │   ├── inputname_screen.dart   # Collect name and sex of user
 │   │   ├── inputage_screen.dart     # Collect user date of birth
 │   │   ├── inputweight_screen.dart     # Collect user weight
 │   │   ├── status_screen.dart      # To gather user activity and health status
 │   │   ├── home_screen.dart       # Displays water level, bottle's charge, weather, and goal progress
 │   │   ├── bluetooth_screen.dart       # To connect mobile app with water bottle
 │   │   ├── graph_screen.dart       # To expose the graphical visualization of user's water consumptions in anytime and reports
 │   │   ├── notification_screen.dart       # To customize reminder time and notification tones
 │   │   ├── general_setting_screen.dart       # To set sleep time, user can get general guide lines and they can sign out
 │   │   ├── feedback_screen.dart    # User feed collect
 │
 │
 ├── backend/
 │   ├── app.py
 │   ├── package.json
 │   ├── package-lock.json
 │   ├── routes/
 │   │   ├── auth.py    # Handles user authentication using JWT (JSON Web Tokens) and MongoDB as the database
 │   │   ├── bluetooth   # Manages user Hydration data is securely stored, updated, and retrieved using MongoDB
 │   │   ├── DataAnalysis.py    # Processes hydration records for comparison and provide suggestion
 │   │   ├── google_auth.py    #  Handling Google authentication using OAuth2
 │   │   ├── Hydration_Calculation.py    # Database and schedules hydration reminders based on user attributes
 │   │   ├── Hydration_graph.py    # Tracking and visualizing a user's hydration habits
 │   │   ├── mongodb.py    #  Establishing a connection to a MongoDB database
 │   │   ├── run.py    # Initialize and run
 │   │   ├── Water_Intake.py  # Personalized daily water intake calculations
 │   │   ├── Weather_adjustment.py    # Handles weather-based hydration adjustments
 │
 │
 ├── nodejs/
 │   ├── Notification/
 │   │   ├── notification-service/
 │   │   |   ├── aquasync-60d5f-6929bb9836df.json    # Accessing Firebase services and authentication
 │   │   |   ├── server.js    # Node.js backend server
 │   ├── Server Automation/
 │   │   ├── index.js     # Tracking and updating user hydration records in a system
 │
 │
 ├── Arduino/
 │   ├── sketch_nov10a        # IoT components proper integrated working
```

## IoT Components of the Water Bottle ⚙
 
 The AquaSync smart water bottle utilizes a combination of IoT components to monitor and transmit data about user's water intake and bottle status. These components enable seamless integration with the AquaSync app, providing users with real-time insights and personalized hydration guidance. Below are the primary IoT components used in the bottle:
 
 - **Ultra Sonic Sensor**: Tracks the current water level in the bottle by calculating distance from sensor to water.
   
 - **Xiao ESP32C3**: Serves as the processing unit, gathering data from sensors and sent to app.
   
 - **Bluetooth Module**: Microcontroller has built-in Bluetooth module which allow connection with app.
 
 - **Battery**: For power supply to hardware components using 3.7v 300mah capacity battery.
 
 - **Resistors**: Ensures circuits protection against exceed current flow.
 
 - **Breadboard**: Act as a circuit board to the entire hardware.
 
 - **LED blub**: To indicate connection status or working condition.

## Usage 🎮
   - Home Screen: View daily hydration goals, current water level in the bottle, battery status, and real-time weather conditions.
   - Profile Screen: Update health metrics like age, weight, activity level, sleep time and health conditions for personalized hydration recommendations.
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
   - Build hand band that measure body conditions and integrate with bottle and app.
   - Implement for feature to app for overall health care to user like diet plan, fitness tracker etc
   - implementfFeature for fasting people
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
    git push origin your_branch_name
    ```
6. Open a pull request.

## License 📜
 
   This project is licensed under the MIT License - see the [License](LICENSE) file for details.

#### I would say AquaSync is a perfect hydration partner....

### Stay hydrated, stay healthy! 💧
   
