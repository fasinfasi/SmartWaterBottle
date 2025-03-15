import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class NameInputScreen extends StatefulWidget {
  @override
  _NameInputScreenState createState() => _NameInputScreenState();
}

class _NameInputScreenState extends State<NameInputScreen> {
  String name = '';
  String sex = '';
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  // Initialize Flutter Secure Storage
  final FlutterSecureStorage _secureStorage = FlutterSecureStorage();

  // Backend URL for submitting name
  final String submitNameUrl = 'http://192.168.149.8:8081/submit_name';

  // Function to submit name to the backend
  Future<void> submitToBackend() async {
    try {
      // Retrieve the JWT token from secure storage
      String? token = await _secureStorage.read(key: 'jwt_token');
      print('Retrieved token: $token');

      if (token == null) {
        _showErrorDialog('No token found. Please sign up first.');
        return;
      }

      // Send the name and sex to the backend, including the token for authorization
      final response = await http.post(
        Uri.parse(submitNameUrl),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'name': name, 'sex': sex}),
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        print('Name submitted successfully: ${responseData['message']}');
        Navigator.pushNamed(context, '/inputage');
      } else {
        final responseData = jsonDecode(response.body);
        String errorMessage = responseData['message'] ?? 'Something went wrong';
        print('Error: $errorMessage');
        _showErrorDialog(errorMessage);
      }
    } catch (e) {
      print('Error: $e');
      _showErrorDialog('Failed to connect to the server. Please try again.');
    }
  }

  // Function to show error dialogs
  void _showErrorDialog(String message) {
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

  // Handle form submission
  void handleSubmit() {
    if (_formKey.currentState?.validate() ?? false) {
      submitToBackend(); // Send data to backend
    } else {
      _showErrorDialog('Please fill in all fields.');
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
      },
      child: Scaffold(
        appBar: AppBar(
          title: null,
          automaticallyImplyLeading: false, // Remove the back arrow
          backgroundColor: Colors.white, // AppBar background color
          elevation: 0,
          foregroundColor: Colors.blue,
        ),
        backgroundColor: Colors
            .white, // Set the Scaffold background color to match the AppBar
        body: SingleChildScrollView(
          child: Center(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 50),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  SizedBox(
                    height: MediaQuery.of(context).size.height *
                        0.2, // Space before title
                    child: Center(
                      child: Text(
                        'Who are you?',
                        style: TextStyle(
                          fontSize: MediaQuery.of(context).size.width * 0.08,
                          color: Colors.blue,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(height: 60),
                  Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        TextFormField(
                          decoration: InputDecoration(
                            hintText: 'Name',
                            hintStyle: TextStyle(color: Colors.grey),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide: BorderSide(color: Colors.grey),
                            ),
                            contentPadding:
                                EdgeInsets.symmetric(horizontal: 15),
                          ),
                          onChanged: (value) {
                            setState(() {
                              name = value;
                            });
                          },
                          validator: (value) {
                            if (value?.isEmpty ?? true) {
                              return 'Please enter your name';
                            }
                            return null;
                          },
                        ),
                        SizedBox(height: 20),
                        DropdownButtonFormField<String>(
                          value: sex.isNotEmpty ? sex : null,
                          onChanged: (value) {
                            setState(() {
                              sex = value ?? '';
                            });
                          },
                          decoration: InputDecoration(
                            hintText: 'Sex',
                            hintStyle: TextStyle(color: Colors.grey),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide: BorderSide(color: Colors.grey),
                            ),
                            contentPadding:
                                EdgeInsets.symmetric(horizontal: 15),
                          ),
                          items: [
                            DropdownMenuItem(
                              child: Text('Male'),
                              value: 'male',
                            ),
                            DropdownMenuItem(
                              child: Text('Female'),
                              value: 'female',
                            ),
                          ],
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please select your sex';
                            }
                            return null;
                          },
                        ),
                        SizedBox(height: 250),
                        ElevatedButton(
                          onPressed: handleSubmit,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue,
                            padding: EdgeInsets.symmetric(
                                vertical: 15, horizontal: 80),
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
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
