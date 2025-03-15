import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

class EditProfileScreen extends StatefulWidget {
  final String name;
  final String sex;
  final String age;
  final String weight;
  final String activityLevel;
  final String healthCondition;

  EditProfileScreen({
    required this.name,
    required this.sex,
    required this.age,
    required this.weight,
    required this.activityLevel,
    required this.healthCondition,
  });

  @override
  _EditProfileScreenState createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  late TextEditingController nameController;
  late String selectedSex;
  late String selectedAge;
  late String selectedWeight;
  late String selectedActivityLevel;
  late String selectedHealthCondition;

  final storage = const FlutterSecureStorage();

  final List<String> sexOptions = ['male', 'female', 'Other'];
  final List<String> ageOptions =
      List.generate(83, (index) => (18 + index).toString());
  final List<String> weightOptions =
      List.generate(73, (index) => (30 + index).toString());
  final List<String> activityLevels = ['Low', 'Moderate', 'High'];
  final List<String> healthConditions = [
    'None',
    'Kidney stone',
    'Liver disease',
    'Diabetes',
    'Pregnancy',
    'Breastfeeding'
  ];

  @override
  void initState() {
    super.initState();
    nameController = TextEditingController(text: widget.name);
    selectedSex = widget.sex;
    selectedAge = widget.age;
    selectedWeight = widget.weight;
    selectedActivityLevel = widget.activityLevel;
    selectedHealthCondition = widget.healthCondition;
  }

  @override
  void dispose() {
    nameController.dispose();
    super.dispose();
  }

  Future<void> handleSubmit() async {
    final accessToken = await storage.read(key: 'access_token');
    if (accessToken == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Authentication error. Please log in again.')),
      );
      return;
    }

    final url = Uri.parse('http://192.168.149.8:8081/edit_profile');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
      body: jsonEncode({
        'name': nameController.text,
        'sex': selectedSex,
        'age': selectedAge,
        'weight': selectedWeight,
        'activityLevel': selectedActivityLevel,
        'healthCondition': selectedHealthCondition,
      }),
    );

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Profile updated successfully!')),
      );
      Navigator.pushNamed(context, '/settings');
    } else if (response.statusCode == 400) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please fill out all fields')),
      );
    } else if (response.statusCode == 404) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('User not found')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to update profile. Please try again.')),
      );
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
        child: SingleChildScrollView(
          padding: EdgeInsets.all(35.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Align(
                alignment: Alignment.topLeft,
                child: IconButton(
                  icon: Icon(Icons.arrow_back, color: Colors.white),
                  onPressed: () => Navigator.pop(context),
                ),
              ),
              SizedBox(height: 30),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Edit Profile',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              SizedBox(height: 25),
              buildTextField(label: 'Name', controller: nameController),
              SizedBox(height: 25),
              buildDropdown(
                label: 'Sex',
                value: selectedSex,
                items: sexOptions,
                onChanged: (value) => setState(() => selectedSex = value!),
              ),
              SizedBox(height: 25),
              buildDropdown(
                label: 'Age',
                value: selectedAge,
                items: ageOptions,
                onChanged: (value) => setState(() => selectedAge = value!),
              ),
              SizedBox(height: 25),
              buildDropdown(
                label: 'Weight',
                value: selectedWeight,
                items: weightOptions,
                onChanged: (value) => setState(() => selectedWeight = value!),
              ),
              SizedBox(height: 25),
              buildDropdown(
                label: 'Activity Level',
                value: selectedActivityLevel,
                items: activityLevels,
                onChanged: (value) =>
                    setState(() => selectedActivityLevel = value!),
              ),
              SizedBox(height: 25),
              buildDropdown(
                label: 'Health Condition',
                value: selectedHealthCondition,
                items: healthConditions,
                onChanged: (value) =>
                    setState(() => selectedHealthCondition = value!),
              ),
              SizedBox(height: 200),
              ElevatedButton(
                onPressed: handleSubmit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(vertical: 16),
                ),
                child: SizedBox(
                  width: double.infinity,
                  child: Center(
                    child: Text(
                      'Save',
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget buildTextField({
    required String label,
    required TextEditingController controller,
  }) {
    return TextField(
      controller: controller,
      style: TextStyle(color: Colors.white),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: Colors.white),
        filled: true,
        fillColor: Colors.transparent,
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.black),
          borderRadius: BorderRadius.circular(8),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.black, width: 2.0),
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }

  Widget buildDropdown({
    required String label,
    required String value,
    required List<String> items,
    required ValueChanged<String?> onChanged,
  }) {
    return DropdownButtonFormField<String>(
      value: value,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: Colors.white),
        filled: true,
        fillColor: Colors.transparent,
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.black),
          borderRadius: BorderRadius.circular(8),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.black, width: 2.0),
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      items: items.map<DropdownMenuItem<String>>((String value) {
        return DropdownMenuItem<String>(
          value: value,
          child: Text(value, style: TextStyle(color: Colors.black)),
        );
      }).toList(),
      onChanged: onChanged,
    );
  }
}
