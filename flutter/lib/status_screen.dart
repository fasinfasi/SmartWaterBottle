import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class StatusPage extends StatefulWidget {
  @override
  _StatusPageState createState() => _StatusPageState();
}

class _StatusPageState extends State<StatusPage> {
  String activityLevel = '';
  String healthCondition = '';
  final storage = FlutterSecureStorage(); // Secure storage instance

  void handleContinue() async {
    if (activityLevel.isEmpty || healthCondition.isEmpty) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Incomplete Information'),
          content:
              Text('Please select both Activity Level and Health Condition.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('OK'),
            ),
          ],
        ),
      );
      return;
    }

    // Print the selected values in the terminal
    print('Selected Activity Level: $activityLevel');
    print('Selected Health Condition: $healthCondition');

    // Save selected status values in Secure Storage
    await storage.write(key: 'activityLevel', value: activityLevel);
    await storage.write(key: 'healthCondition', value: healthCondition);

    // Send data to backend
    await submitStatusToBackend();

    // Navigate to the home screen after successful submission
    Navigator.pushNamed(context, '/sleep'); // Navigate to the Home screen
  }

  Future<void> submitStatusToBackend() async {
    try {
      String? token = await storage.read(
          key: 'jwt_token'); // Get the JWT token from secure storage
      if (token == null) {
        throw Exception('Token not found');
      }

      var url = Uri.parse(
          'http://192.168.149.8:8081/status'); // Replace with your backend URL
      var response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token', // Pass the JWT token in the header
        },
        body: json.encode({
          'activityLevel': activityLevel,
          'healthCondition': healthCondition,
        }),
      );

      if (response.statusCode == 200) {
        print('Status submitted successfully');
      } else {
        print('Failed to submit status: ${response.statusCode}');
        showErrorDialog('Failed to submit status');
      }
    } catch (e) {
      print('Error: $e');
      showErrorDialog('An error occurred while submitting the status');
    }
  }

  void showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Error'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isSmallDevice = MediaQuery.of(context).size.width < 360;

    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,
          leading: IconButton(
            icon: Icon(Icons.arrow_back, color: Colors.black),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ),
        backgroundColor: Colors.white,
        body: SafeArea(
          child: SingleChildScrollView(
            child: Center(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    SizedBox(
                      height: MediaQuery.of(context).size.height * 0.2,
                      child: LayoutBuilder(
                        builder: (context, constraints) {
                          double maxWidth = constraints.maxWidth;
                          double fontSize = maxWidth * 0.07;

                          if (fontSize < 24) fontSize = 24;

                          return Center(
                            child: Text(
                              'What is your current status?',
                              style: TextStyle(
                                fontSize: fontSize,
                                color: Colors.blue,
                                fontWeight: FontWeight.bold,
                                overflow: TextOverflow.ellipsis,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          );
                        },
                      ),
                    ),
                    SizedBox(height: 50),
                    DropdownButtonFormField<String>(
                      value: activityLevel.isNotEmpty ? activityLevel : null,
                      onChanged: (value) {
                        setState(() {
                          activityLevel = value ?? '';
                        });
                      },
                      decoration: InputDecoration(
                        hintText: 'Activity Level',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide: BorderSide(color: Colors.grey),
                        ),
                        contentPadding: EdgeInsets.symmetric(horizontal: 15),
                      ),
                      items: [
                        DropdownMenuItem(
                            child: Text('Activity Level'), value: ''),
                        DropdownMenuItem(child: Text('Low'), value: 'Low'),
                        DropdownMenuItem(
                            child: Text('Moderate'), value: 'Moderate'),
                        DropdownMenuItem(child: Text('High'), value: 'High'),
                      ],
                    ),
                    SizedBox(height: 20),
                    DropdownButtonFormField<String>(
                      value:
                          healthCondition.isNotEmpty ? healthCondition : null,
                      onChanged: (value) {
                        setState(() {
                          healthCondition = value ?? '';
                        });
                      },
                      decoration: InputDecoration(
                        hintText: 'Health Condition',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide: BorderSide(color: Colors.grey),
                        ),
                        contentPadding: EdgeInsets.symmetric(horizontal: 15),
                      ),
                      items: [
                        DropdownMenuItem(
                            child: Text('Health Condition'), value: ''),
                        DropdownMenuItem(
                            child: Text('No Concerns'), value: 'None'),
                        DropdownMenuItem(
                            child: Text('Kidney Stones'),
                            value: 'Kidney Stones'),
                        DropdownMenuItem(
                            child: Text('Liver Diseases'),
                            value: 'Liver Disease'),
                        DropdownMenuItem(
                            child: Text('Diabetes'), value: 'Diabetes'),
                        DropdownMenuItem(
                            child: Text('Pregnancy'), value: 'Pregnancy'),
                        DropdownMenuItem(
                            child: Text('Breastfeeding'),
                            value: 'Breastfeeding'),
                      ],
                    ),
                    SizedBox(height: 260),
                    ElevatedButton(
                      onPressed: handleContinue,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        padding:
                            EdgeInsets.symmetric(vertical: 15, horizontal: 80),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(25),
                        ),
                      ),
                      child: Text(
                        'Continue',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

void main() => runApp(MaterialApp(
      home: StatusPage(),
      routes: {
        '/sleep': (context) =>
            Scaffold(body: Center(child: Text('Sleep Screen Placeholder'))),
      },
    ));
