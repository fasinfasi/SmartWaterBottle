import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class WeightInputScreen extends StatefulWidget {
  @override
  _WeightInputScreenState createState() => _WeightInputScreenState();
}

class _WeightInputScreenState extends State<WeightInputScreen> {
  int selectedWeight = 60; // Default weight
  List<int> weightOptions = List.generate(
      200, (index) => index + 30); // Weight options from 30 to 229

  final storage = FlutterSecureStorage(); // Secure storage instance

  Future<void> _validateAndProceed() async {
    print('Selected weight: $selectedWeight');

    // Retrieve JWT token from Flutter Secure Storage
    String? token = await storage.read(key: 'jwt_token');
    if (token == null) {
      print("Token not found. Please log in again.");
      // Handle token missing (perhaps navigate to login)
      return;
    }

    // Call the Flask backend with the selected weight
    final response = await http.post(
      Uri.parse('http://192.168.149.8:8081/submit_weight'), // Your backend URL
      headers: {
        'Authorization':
            'Bearer $token', // Pass JWT token in Authorization header
        'Content-Type': 'application/json',
      },
      body: json.encode({'weight': selectedWeight}),
    );

    if (response.statusCode == 200) {
      // Handle success
      print('Weight submitted successfully');
      Navigator.pushNamed(
          context, '/status'); // Example: navigate to the next screen
    } else {
      // Handle error
      print('Failed to submit weight: ${response.body}');
      // Show error message to the user
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          // Custom back button
          Padding(
            padding: const EdgeInsets.only(top: 30.0, left: 10.0),
            child: Align(
              alignment: Alignment.topLeft,
              child: IconButton(
                icon: Icon(Icons.arrow_back, color: Colors.black),
                onPressed: () => Navigator.pop(context),
              ),
            ),
          ),
          // Title
          Padding(
            padding: const EdgeInsets.only(top: 60.0, bottom: 10.0),
            child: Text(
              'What is your weight?',
              style: TextStyle(
                fontSize: 28,
                color: Colors.blue,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
          ),

          // Weight Picker
          Expanded(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildPicker(weightOptions, (index) {
                  setState(() {
                    selectedWeight = weightOptions[index];
                  });
                }, weightOptions.indexOf(selectedWeight)),
              ],
            ),
          ),

          // Continue Button
          Padding(
            padding: const EdgeInsets.only(bottom: 50.0),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                padding: EdgeInsets.symmetric(vertical: 15, horizontal: 80),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(25),
                ),
              ),
              onPressed: _validateAndProceed,
              child: Text(
                'Continue',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPicker(List<dynamic> items, Function(int) onSelectedItemChanged,
      int initialItem) {
    return SizedBox(
      width: 120,
      height: 135,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Highlight lines for the selected item
          Container(
            height: 45,
            decoration: BoxDecoration(
              border: Border(
                top: BorderSide(color: Colors.blue, width: 2.0),
                bottom: BorderSide(color: Colors.blue, width: 2.0),
              ),
            ),
          ),
          // ListWheelScrollView to show weight options
          ListWheelScrollView.useDelegate(
            itemExtent: 45,
            diameterRatio: 1.5,
            physics: FixedExtentScrollPhysics(),
            onSelectedItemChanged: onSelectedItemChanged,
            controller: FixedExtentScrollController(initialItem: initialItem),
            childDelegate: ListWheelChildBuilderDelegate(
              builder: (context, index) {
                return Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '${items[index]}', // Show weight value
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                    ],
                  ),
                );
              },
              childCount: items.length,
            ),
          ),
        ],
      ),
    );
  }
}
