import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // For StatusBar
import 'sign_up.dart'; // Import the LoginScreen

class WelcomeScreen extends StatelessWidget {
  // Pass the key to the superclass (StatelessWidget)
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Change status bar style
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.light);

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF2DAFD8), Color(0xFF185D72)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Column(
          children: [
            // Top Section: Image and Title
            Padding(
              padding: const EdgeInsets.only(top: 50.0),
              child: Column(
                mainAxisSize: MainAxisSize
                    .min, // Ensures Column only takes the space it needs
                children: [
                  Image.asset(
                    'assets/water_bottle_logo_welcome_page.png',
                    width: 200,
                    height: 300,
                    fit: BoxFit
                        .contain, // Ensures no extra padding from the image
                  ),
                  Transform.translate(
                    offset:
                        Offset(0, -10), // Move the title closer to the image
                    child: Text(
                      'AquaSync',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            Spacer(), // Push content down

            // Center Section: Description moved closer to the button
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 35),
              child: Text(
                'Welcome to AquaSync! This tracks your water intake effortlessly. Track your hydration progress and see how it impacts your overall health.',
                textAlign: TextAlign.center, // Align the text to the center
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 15,
                ),
              ),
            ),

            // Bottom Section: Continue Button
            Padding(
              padding:
                  const EdgeInsets.only(bottom: 30.0), // Adjust bottom padding
              child: ElevatedButton(
                onPressed: () {
                  // Navigate to the LoginScreen when the button is pressed
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => SignUpScreen()),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white, // Button background color
                  padding: EdgeInsets.symmetric(vertical: 15, horizontal: 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                ),
                child: Text(
                  'Continue',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF007AFF), // Text color
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
