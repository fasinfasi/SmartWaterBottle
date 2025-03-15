import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:fl_chart/fl_chart.dart';

class CompareGraphScreen extends StatefulWidget {
  @override
  _CompareGraphScreenState createState() => _CompareGraphScreenState();
}

class _CompareGraphScreenState extends State<CompareGraphScreen> {
  DateTime? _startDate;
  DateTime? _endDate;
  List<FlSpot> _startDateData = [];
  List<FlSpot> _endDateData = [];
  String _feedback = '';

  final _storage = const FlutterSecureStorage();
  final String backendUrl = 'http://192.168.149.8:8081'; // Your backend URL

  // Example of sleep times (should come from the backend or user profile)
  String sleepFrom = '22:00'; // Example sleep from time
  String sleepTo = '04:00'; // Example sleep to time

  DateTime _sleepFromTime = DateTime.parse('2025-02-01 22:00:00');
  DateTime _sleepToTime = DateTime.parse('2025-02-01 04:00:00');

  // Fetch comparison data for the selected dates
  Future<void> _fetchDataForDates() async {
    if (_startDate == null || _endDate == null) return;

    String? token = await _storage.read(key: 'access_token');
    if (token == null) {
      print('No token found. User must log in.');
      return;
    }

    final response = await http.post(
      Uri.parse('$backendUrl/fetch_ratings'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'date1': _startDate!.toIso8601String().split('T')[0],
        'date2': _endDate!.toIso8601String().split('T')[0],
        'scheduled_time_date1': [
          '08:00',
          '12:00'
        ], // Example data, replace with dynamic values
        'ratings_date1': [4, 3], // Example data, replace with dynamic values
        'scheduled_time_date2': [
          '09:00',
          '01:00'
        ], // Example data, replace with dynamic values
        'ratings_date2': [5, 2], // Example data, replace with dynamic values
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        _startDateData = _convertToFlSpots(
            data['scheduled_time_date1'], data['ratings_date1']);
        _endDateData = _convertToFlSpots(
            data['scheduled_time_date2'], data['ratings_date2']);
        _fetchAnalyzeData(); // After fetching data, request analysis (feedback)
      });
    } else {
      print('Error fetching data: ${response.body}');
    }
  }

  // Fetch feedback for the selected dates
  Future<void> _fetchAnalyzeData() async {
    if (_startDate == null || _endDate == null) return;

    String? token = await _storage.read(key: 'access_token');
    if (token == null) {
      print('No token found. User must log in.');
      return;
    }

    final response = await http.post(
      Uri.parse('$backendUrl/analyze'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'date1': _startDate!.toIso8601String().split('T')[0],
        'date2': _endDate!.toIso8601String().split('T')[0],
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        _feedback = data['feedback']; // Assuming the backend returns feedback
      });
    } else {
      print('Error fetching analyze data: ${response.body}');
    }
  }

  // Convert response data to FlSpot (using both scheduled time and rating)
  List<FlSpot> _convertToFlSpots(List<dynamic> xValues, List<dynamic> yValues) {
    return List.generate(xValues.length, (index) {
      double x = _convertScheduledTimeToMinutes(xValues[index]);
      double y =
          yValues.isNotEmpty ? double.parse(yValues[index].toString()) : 0;
      return FlSpot(x, y);
    });
  }

  // Convert scheduled time to minutes from the start of sleep period
  double _convertScheduledTimeToMinutes(String scheduledTime) {
    final timeParts = scheduledTime.split(':');
    final hours = int.parse(timeParts[0]);
    final minutes = int.parse(timeParts[1]);
    final timeOfDay = DateTime(0, 1, 1, hours, minutes);
    final startOfSleep =
        DateTime(0, 1, 1, _sleepFromTime.hour, _sleepFromTime.minute);

    return timeOfDay.difference(startOfSleep).inMinutes.toDouble();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Padding(
        padding: const EdgeInsets.only(top: 60.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Add a back arrow button here
            Padding(
              padding: const EdgeInsets.only(left: 5.0),
              child: Align(
                alignment: Alignment.topLeft,
                child: IconButton(
                  icon: Icon(Icons.arrow_back),
                  onPressed: () {
                    Navigator.pushReplacementNamed(
                        context, '/graph'); // Navigate to /graph screen
                  },
                ),
              ),
            ),
            const SizedBox(height: 50),
            const Text(
              'Data Analysis',
              style: TextStyle(
                  fontSize: 29,
                  fontWeight: FontWeight.bold,
                  color: Colors.black),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildDateButton(context, true),
                const SizedBox(width: 10),
                _buildDateButton(context, false),
              ],
            ),
            const SizedBox(height: 20),
            _buildGraphContainer(),
            const SizedBox(height: 10),
            _buildLegend(),
            const SizedBox(height: 20),
            _buildFeedback(),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildFeedback() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text('Feedback: $_feedback', style: const TextStyle(fontSize: 16)),
      ],
    );
  }

  // Date picker buttons for selecting dates
  Widget _buildDateButton(BuildContext context, bool isStartDate) {
    return ElevatedButton(
      onPressed: () async {
        final pickedDate = await showDatePicker(
          context: context,
          initialDate: isStartDate
              ? _startDate ?? DateTime.now()
              : _endDate ?? DateTime.now(),
          firstDate: DateTime(2020),
          lastDate: DateTime.now(),
        );
        if (pickedDate != null) {
          setState(() {
            if (isStartDate) {
              _startDate = pickedDate;
            } else {
              _endDate = pickedDate;
            }
            _fetchDataForDates();
          });
        }
      },
      child: Text(isStartDate ? 'Select Date 1' : 'Select Date 2'),
    );
  }

  Widget _buildGraphContainer() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: SizedBox(
        height: 250,
        child: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 600),
            child: LineChart(
              LineChartData(
                minY: 0,
                maxY: 5,
                borderData: FlBorderData(
                  border: const Border(
                    left: BorderSide(color: Colors.grey),
                    bottom: BorderSide(color: Colors.grey),
                  ),
                ),
                titlesData: _buildGraphTitles(),
                lineBarsData: [
                  LineChartBarData(
                    spots: _startDateData,
                    isCurved: true,
                    gradient: const LinearGradient(
                        colors: [Colors.blue, Colors.blueAccent]),
                    barWidth: 4,
                    dotData:
                        const FlDotData(show: false), // No points on the graph
                  ),
                  LineChartBarData(
                    spots: _endDateData,
                    isCurved: true,
                    gradient: const LinearGradient(
                        colors: [Colors.orange, Colors.orangeAccent]),
                    barWidth: 4,
                    dotData:
                        const FlDotData(show: false), // No points on the graph
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  FlTitlesData _buildGraphTitles() {
    return FlTitlesData(
      topTitles: AxisTitles(
          sideTitles: SideTitles(showTitles: false)), // Remove top label
      rightTitles: AxisTitles(
          sideTitles: SideTitles(
        showTitles: true,
        reservedSize: 50,
      )), // Remove right label
      leftTitles: AxisTitles(
        sideTitles: SideTitles(
          showTitles: true,
          reservedSize: 50,
          getTitlesWidget: (value, meta) {
            switch (value.toInt()) {
              case 1:
                return const Text('Average');
              case 2:
                return const Text('Good');
              case 3:
                return const Text('Excellent');
              case 4:
                return const Text('Outstanding');
              default:
                return const Text('');
            }
          },
        ),
      ),
      bottomTitles: AxisTitles(
        sideTitles: SideTitles(showTitles: false), // Remove bottom label
      ),
    );
  }

  Widget _buildLegend() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        _buildLegendItem(Colors.blue, 'Date 1'),
        const SizedBox(width: 10),
        _buildLegendItem(Colors.orange, 'Date 2'),
      ],
    );
  }

  Widget _buildLegendItem(Color color, String text) {
    return Row(
      children: [
        Container(
          width: 16,
          height: 16,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        const SizedBox(width: 8),
        Text(text, style: const TextStyle(fontSize: 14)),
      ],
    );
  }
}
