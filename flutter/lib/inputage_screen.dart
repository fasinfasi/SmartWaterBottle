import 'dart:convert'; // For jsonEncode
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http; // Add this import for HTTP requests
import 'package:flutter_secure_storage/flutter_secure_storage.dart'; // Import Flutter Secure Storage

class AgeInputScreen extends StatefulWidget {
  @override
  _AgeInputScreenState createState() => _AgeInputScreenState();
}

class _AgeInputScreenState extends State<AgeInputScreen> {
  int selectedDay = 12;
  int selectedMonth = 6;
  int selectedYear = 2004;

  List<int> dayOptions = List.generate(31, (index) => index + 1);
  List<String> monthOptions = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  List<int> yearOptions =
      List.generate(120, (index) => DateTime.now().year - index);

  // Create an instance of FlutterSecureStorage
  final FlutterSecureStorage _storage = FlutterSecureStorage();

  void _validateAndProceed() async {
    int daysInMonth = _getDaysInMonth(selectedYear, selectedMonth + 1);

    if (selectedDay > daysInMonth) {
      print(
          "Invalid date selected: $selectedDay ${monthOptions[selectedMonth]} $selectedYear");
    } else {
      print(
          'Valid Date of Birth: $selectedDay ${monthOptions[selectedMonth]} $selectedYear');

      // Call the backend API to update the DOB
      await _updateDOB(selectedDay, selectedMonth + 1, selectedYear);
    }
  }

  Future<void> _updateDOB(int day, int month, int year) async {
    final String url =
        'http://192.168.149.8:8081/update_dob'; // Replace with your actual backend URL

    // Retrieve the JWT token from secure storage
    final String? jwtToken = await _storage.read(
        key:
            'jwt_token'); // Replace 'jwt_token' with the key used to store the token

    if (jwtToken == null) {
      print('Error: No JWT token found');
      return; // Handle the case where the token is not found
    }

    final response = await http.post(
      Uri.parse(url),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $jwtToken',
      },
      body: jsonEncode({
        'day': day,
        'month': month,
        'year': year,
      }),
    );

    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      print('Success: ${responseData["message"]}');
      Navigator.pushNamed(context, '/inputweight');
    } else {
      final responseData = jsonDecode(response.body);
      print('Error: ${responseData["error"]}');
    }
  }

  int _getDaysInMonth(int year, int month) {
    if (month == 2) {
      return (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) ? 29 : 28;
    }
    if ([4, 6, 9, 11].contains(month)) {
      return 30;
    }
    return 31;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
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
          Padding(
            padding: const EdgeInsets.only(top: 60.0, bottom: 10.0),
            child: Text(
              'When were you born?',
              style: TextStyle(
                fontSize: 28,
                color: Colors.blue,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          Expanded(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildPicker(dayOptions, (index) {
                  setState(() {
                    selectedDay = dayOptions[index];
                  });
                }, dayOptions.indexOf(selectedDay)),
                _buildPicker(monthOptions, (index) {
                  setState(() {
                    selectedMonth = index;
                  });
                }, selectedMonth),
                _buildPicker(yearOptions, (index) {
                  setState(() {
                    selectedYear = yearOptions[index];
                  });
                }, yearOptions.indexOf(selectedYear)),
              ],
            ),
          ),
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
      width: 100,
      height: 135,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Container(
            height: 45,
            decoration: BoxDecoration(
              border: Border(
                top: BorderSide(color: Colors.blue, width: 2.0),
                bottom: BorderSide(color: Colors.blue, width: 2.0),
              ),
            ),
          ),
          ListWheelScrollView.useDelegate(
            itemExtent: 45,
            diameterRatio: 1.5,
            physics: FixedExtentScrollPhysics(),
            onSelectedItemChanged: onSelectedItemChanged,
            controller: FixedExtentScrollController(initialItem: initialItem),
            childDelegate: ListWheelChildBuilderDelegate(
              builder: (context, index) {
                return Center(
                  child: Text(
                    '${items[index]}',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
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
