import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // For SystemChrome
import 'package:http/http.dart' as http; // For HTTP requests
import 'package:flutter_secure_storage/flutter_secure_storage.dart'; // For secure storage
import 'dart:convert'; // For JSON decoding
import 'editprofile_screen.dart'; // Import the EditProfileScreen

class ProfileScreen extends StatefulWidget {
  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _secureStorage = FlutterSecureStorage(); // Secure storage instance
  String name = '';
  String sex = '';
  String age = '';
  String weight = '';
  String activityLevel = '';
  String healthCondition = '';

  @override
  void initState() {
    super.initState();
    // Set status bar color to transparent and make sure it's visible
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ));
    fetchUserDetails();
  }

  @override
  void dispose() {
    // Reset system UI settings to default when leaving the screen
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: Colors.blue,
      statusBarIconBrightness: Brightness.dark,
    ));
    super.dispose();
  }

  Future<void> fetchUserDetails() async {
    final token = await _secureStorage.read(key: 'access_token'); // Read token
    if (token == null) {
      print('No access token found');
      return;
    }

    final url = Uri.parse(
        'http://192.168.149.8:8081/profile'); // Replace with backend URL
    try {
      print('Sending request to $url');
      print('Token: $token');

      final response = await http.get(
        url,
        headers: {'Authorization': 'Bearer $token'}, // Send token in header
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          name = data['name'] ?? ''; // Ensure name is a string
          sex = data['sex'] ?? ''; // Ensure sex is a string
          age = data['age']?.toString() ?? ''; // Convert age to string
          weight = data['weight']?.toString() ?? ''; // Convert weight to string
          activityLevel =
              data['activity_level'] ?? ''; // Ensure activity_level is a string
          healthCondition = data['health_condition'] ??
              ''; // Ensure health_condition is a string
        });
      } else {
        print(
            'Failed to fetch user details. Status code: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching user details: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
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
            // Back Icon with adjusted position to the left
            Padding(
              padding: const EdgeInsets.only(top: 45.0),
              child: Row(
                children: [
                  IconButton(
                    icon: Icon(Icons.arrow_back, color: Colors.white),
                    onPressed: () {
                      Navigator.pop(context);
                    },
                  ),
                ],
              ),
            ),
            SizedBox(height: 12), // Reduced space after back icon

            // Title
            Center(
              child: Text(
                'My Profile',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            SizedBox(height: 15), // Space after title

            // Edit Icon Button
            Align(
              alignment: Alignment.centerRight, // Aligns icon to the right
              child: IconButton(
                icon: Icon(Icons.edit,
                    color: Colors.white), // Edit icon color changed to white
                onPressed: () async {
                  final updatedProfile = await Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => EditProfileScreen(
                        name: name,
                        sex: sex,
                        age: age,
                        weight: weight,
                        activityLevel: activityLevel,
                        healthCondition: healthCondition,
                      ),
                    ),
                  );
                  if (updatedProfile != null) {
                    setState(() {
                      name = updatedProfile['name'];
                      sex = updatedProfile['sex'];
                      age = updatedProfile['age'];
                      weight = updatedProfile['weight'];
                      activityLevel = updatedProfile['activityLevel'];
                      healthCondition = updatedProfile['healthCondition'];
                    });
                  }
                },
              ),
            ),

            SizedBox(height: 15), // Space after edit icon

            // Scrollable Profile Items
            Expanded(
              child: SingleChildScrollView(
                child: Padding(
                  padding: EdgeInsets.all(25.0),
                  child: Column(
                    children: [
                      ProfileItem(label: 'Name:', value: name),
                      SizedBox(height: 33),
                      ProfileItem(label: 'Sex:', value: sex),
                      SizedBox(height: 33),
                      ProfileItem(label: 'Age:', value: age),
                      SizedBox(height: 33),
                      ProfileItem(label: 'Weight:', value: weight),
                      SizedBox(height: 33),
                      ProfileItem(label: 'Activity:', value: activityLevel),
                      SizedBox(height: 33),
                      ProfileItem(
                          label: 'Health Condition:', value: healthCondition),
                    ],
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

class ProfileItem extends StatelessWidget {
  final String label;
  final String value;

  const ProfileItem({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 20.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
          Text(
            value.isNotEmpty ? value : 'Loading...',
            style: TextStyle(color: Colors.white),
          ),
        ],
      ),
    );
  }
}
