import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class General_SettingScreen extends StatefulWidget {
  const General_SettingScreen({super.key});

  @override
  _SettingScreenState createState() => _SettingScreenState();
}

class _SettingScreenState extends State<General_SettingScreen> {
  bool is24HrFormat = false;
  TimeOfDay startTime = TimeOfDay(hour: 22, minute: 30);
  TimeOfDay endTime = TimeOfDay(hour: 6, minute: 30);

  final FlutterSecureStorage _secureStorage = FlutterSecureStorage();

  String get24HrFormattedTime(TimeOfDay time) {
    return '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}';
  }

  String getFormattedStartTime() {
    if (is24HrFormat) {
      return get24HrFormattedTime(startTime);
    } else {
      return startTime.format(context);
    }
  }

  String getFormattedEndTime() {
    if (is24HrFormat) {
      return get24HrFormattedTime(endTime);
    } else {
      return endTime.format(context);
    }
  }

  Future<void> _selectTime(BuildContext context, bool isStartTime) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: isStartTime ? startTime : endTime,
    );

    if (picked != null && picked != (isStartTime ? startTime : endTime)) {
      setState(() {
        if (isStartTime) {
          startTime = picked;
        } else {
          endTime = picked;
        }
      });
    }
  }

  Future<void> _loadSettings() async {
    String? token = await _secureStorage.read(key: 'access_token');

    if (token != null) {
      try {
        final response = await http.get(
          Uri.parse('http://192.168.149.8:8081/setting/sleep-time'),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
        );

        if (response.statusCode == 200) {
          final data = json.decode(response.body);
          print("Response Data: $data");

          if (data.containsKey('start_time') && data.containsKey('end_time')) {
            setState(() {
              startTime = _parseTime(data['start_time']);
              endTime = _parseTime(data['end_time']);
            });
          } else {
            print("start_time or end_time are missing from the response.");
          }
        } else {
          print("Failed to load sleep time: ${response.body}");
        }
      } catch (e) {
        print("Error loading sleep time: $e");
      }
    }

    try {
      final response = await http.get(
        Uri.parse('http://192.168.149.8:8081/setting/time-format'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          is24HrFormat = data['time_format'] == '24hr';
        });
      } else {
        print("Failed to load time format: ${response.body}");
      }
    } catch (e) {
      print("Error loading time format: $e");
    }
  }

  TimeOfDay _parseTime(String time) {
    final parts = time.split(':');
    return TimeOfDay(hour: int.parse(parts[0]), minute: int.parse(parts[1]));
  }

  Future<void> _saveSettings() async {
    String? token = await _secureStorage.read(key: 'access_token');

    if (token != null) {
      try {
        final response = await http.post(
          Uri.parse('http://192.168.149.8:8081/setting/sleep-time'),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
          body: json.encode({
            'start_time': get24HrFormattedTime(startTime),
            'end_time': get24HrFormattedTime(endTime),
          }),
        );

        if (response.statusCode == 200) {
          print("Sleep time updated successfully");
        } else {
          print("Failed to update sleep time: ${response.body}");
        }
      } catch (e) {
        print("Error updating sleep time: $e");
      }
    }
  }

  Future<void> _saveTimeFormat() async {
    String? token = await _secureStorage.read(key: 'access_token');

    if (token != null) {
      try {
        final response = await http.post(
          Uri.parse('http://192.168.149.8:8081/setting/time-format'),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
          body: json.encode({
            'timeFormat': is24HrFormat ? '24hr' : '12hr',
          }),
        );

        if (response.statusCode == 200) {
          print("Time format updated successfully");
        } else {
          print("Failed to update time format: ${response.body}");
        }
      } catch (e) {
        print("Error updating time format: $e");
      }
    }
  }

  Future<void> _deleteAllData() async {
    String? token = await _secureStorage.read(key: 'access_token');

    if (token != null) {
      try {
        final response = await http.delete(
          Uri.parse('http://192.168.149.8:8081/setting/delete-all-data'),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
        );

        if (response.statusCode == 200) {
          print("All data deleted successfully");
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('All data has been deleted.')),
          );
        } else {
          print("Failed to delete data: ${response.body}");
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to delete data.')),
          );
        }
      } catch (e) {
        print("Error deleting data: $e");
      }
    }
  }

  Future<void> _signOut() async {
    await _secureStorage.delete(key: 'access_token');
    Navigator.pushReplacementNamed(context, '/');
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('You have signed out.')),
    );
  }

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    double screenHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        title: const Text(
          'General Setting',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF2DAFD8),
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color(0xFF2DAFD8),
              Color(0xFF185D72),
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: screenWidth * 0.05),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 16),
                const Text(
                  'Sleep Time:',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 35),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    GestureDetector(
                      onTap: () => _selectTime(context, true),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Start Time:',
                              style:
                                  TextStyle(fontSize: 18, color: Colors.black)),
                          const SizedBox(height: 5),
                          Container(
                            width: screenWidth *
                                0.4, // Adjust width based on screen size
                            height: screenHeight *
                                0.06, // Adjust height based on screen size
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 8),
                            decoration: BoxDecoration(
                              color: const Color.fromARGB(255, 0, 110, 201),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Center(
                              child: Text(
                                getFormattedStartTime(),
                                style: const TextStyle(
                                    fontSize: 18, color: Colors.white),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    GestureDetector(
                      onTap: () => _selectTime(context, false),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('End Time:',
                              style:
                                  TextStyle(fontSize: 18, color: Colors.black)),
                          const SizedBox(height: 5),
                          Container(
                            width: screenWidth *
                                0.4, // Adjust width based on screen size
                            height: screenHeight *
                                0.06, // Adjust height based on screen size
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 8),
                            decoration: BoxDecoration(
                              color: Color.fromARGB(255, 0, 110, 201),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Center(
                              child: Text(
                                getFormattedEndTime(),
                                style: const TextStyle(
                                    fontSize: 18, color: Colors.white),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 70),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          is24HrFormat = false;
                        });
                        _saveTimeFormat();
                      },
                      child: const Text('12hr'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: is24HrFormat
                            ? Colors.grey
                            : const Color.fromARGB(255, 190, 237, 136),
                        foregroundColor: const Color.fromARGB(255, 26, 21, 179),
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          is24HrFormat = true;
                        });
                        _saveTimeFormat();
                      },
                      child: const Text('24hr'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: is24HrFormat
                            ? const Color.fromARGB(255, 190, 237, 136)
                            : Colors.grey,
                        foregroundColor: const Color.fromARGB(255, 26, 21, 179),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 80),
                Center(
                  child: Column(
                    children: [
                      ElevatedButton(
                        onPressed: () {
                          Navigator.pushNamed(context, '/know-more-about');
                        },
                        child: const Text('Know more about hydration'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          foregroundColor: Colors.white,
                          minimumSize: const Size(200, 50),
                        ),
                      ),
                      const SizedBox(height: 83),
                      ElevatedButton(
                        onPressed:
                            _saveSettings, // Call the method to save settings
                        child: const Text('Save Settings'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          foregroundColor: Colors.white,
                          minimumSize: const Size(200, 50),
                        ),
                      ),
                      const SizedBox(height: 50),
                      ElevatedButton(
                        onPressed: _deleteAllData,
                        child: const Text('Delete All Data'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                          foregroundColor: Colors.white,
                          minimumSize: const Size(200, 50),
                        ),
                      ),
                      const SizedBox(height: 50),
                      ElevatedButton(
                        onPressed: _signOut,
                        child: const Text('Sign Out'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                          foregroundColor: Colors.white,
                          minimumSize: const Size(200, 50),
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
    );
  }
}
