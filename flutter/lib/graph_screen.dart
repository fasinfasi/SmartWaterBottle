import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

void main() => runApp(GraphScreen());

class GraphScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: StatisticsScreen(),
    );
  }
}

class StatisticsScreen extends StatefulWidget {
  @override
  _StatisticsScreenState createState() => _StatisticsScreenState();
}

class _StatisticsScreenState extends State<StatisticsScreen> {
  List<FlSpot> waterTakenData = [];
  List<String> scheduledTimes = [];
  String timeFormat = "24hr"; // Default to 24-hour format
  final ScrollController _scrollController = ScrollController();
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    fetchHydrationGraphData();
    _scrollController.addListener(() {
      setState(() {});
    });
  }

  Future<void> fetchHydrationGraphData() async {
    final storage = FlutterSecureStorage();
    final token = await storage.read(key: 'access_token');

    if (token != null) {
      final response = await http.get(
        Uri.parse('http://192.168.149.8:8081/get_hydration_graph'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final times = List<String>.from(data['times']);
        final ratings = List<String>.from(data['ratings']);
        timeFormat =
            data['time_format'] ?? "24hr"; // Get time format from backend

        final ratingMap = {
          "Missed": 0,
          "Average": 1,
          "Good": 2,
          "Excellent": 3,
          "Outstanding": 4
        };

        final chartSpots = List<FlSpot>.generate(times.length, (index) {
          return FlSpot(
              index.toDouble(), ratingMap[ratings[index]]?.toDouble() ?? 0);
        });

        setState(() {
          waterTakenData = chartSpots;
          scheduledTimes = times;
        });
      } else {
        print('Error: ${response.statusCode}');
      }
    }
  }

  String formatTime(String time) {
    List<String> parts = time.split(':');
    int hour = int.parse(parts[0]);
    int minute = int.parse(parts[1]);

    if (timeFormat == "12hr") {
      String period = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 == 0 ? 12 : hour % 12;
      return "$hour:${minute.toString().padLeft(2, '0')} $period";
    }

    return "$hour:${minute.toString().padLeft(2, '0')}"; // 24-hour format
  }

  // Handle the navigation bar tab changes
  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        body: Padding(
          padding: const EdgeInsets.only(top: 110.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Text(
                'Statistics',
                style: TextStyle(
                  fontSize: 29,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                ),
                child: const Text(
                  "Today's Data",
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
              ),
              const SizedBox(height: 20),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: SizedBox(
                  height: 250,
                  child: SingleChildScrollView(
                    controller: _scrollController,
                    scrollDirection: Axis.horizontal,
                    child: ConstrainedBox(
                      constraints: BoxConstraints(
                        maxWidth: (scheduledTimes.length + 2) *
                            60.0, // Adding extra padding space
                      ),
                      child: Stack(
                        children: [
                          LineChart(
                            LineChartData(
                              backgroundColor: Colors.white,
                              minY: 0,
                              maxY: 5,
                              maxX: waterTakenData.length.toDouble() +
                                  1, // Extend maxX by 1 for extra grid line
                              borderData: FlBorderData(
                                border: const Border(
                                  left: BorderSide(color: Colors.grey),
                                  bottom: BorderSide(color: Colors.grey),
                                ),
                              ),
                              titlesData: FlTitlesData(
                                leftTitles: AxisTitles(
                                  sideTitles: SideTitles(
                                    showTitles: true,
                                    reservedSize: 60,
                                    getTitlesWidget: (value, meta) {
                                      switch (value.toInt()) {
                                        case 1:
                                          return const Text('Average',
                                              style: TextStyle(fontSize: 10));
                                        case 2:
                                          return const Text('Good',
                                              style: TextStyle(fontSize: 10));
                                        case 3:
                                          return const Text('Excellent',
                                              style: TextStyle(fontSize: 10));
                                        case 4:
                                          return const Text('Outstanding',
                                              style: TextStyle(fontSize: 10));
                                      }
                                      return const Text('');
                                    },
                                  ),
                                ),
                                bottomTitles: AxisTitles(
                                  sideTitles: SideTitles(
                                    showTitles: true,
                                    interval:
                                        1, // Ensures every point gets a label
                                    getTitlesWidget: (value, meta) {
                                      int index = value.toInt();
                                      if (index >= 0 &&
                                          index < scheduledTimes.length) {
                                        return Padding(
                                          padding:
                                              const EdgeInsets.only(top: 8.0),
                                          child: Text(
                                            formatTime(scheduledTimes[index]),
                                            style:
                                                const TextStyle(fontSize: 12),
                                          ),
                                        );
                                      }
                                      return const Text('');
                                    },
                                  ),
                                ),
                                rightTitles: AxisTitles(
                                  sideTitles: SideTitles(showTitles: false),
                                ),
                                topTitles: AxisTitles(
                                  sideTitles: SideTitles(showTitles: false),
                                ),
                              ),
                              lineBarsData: [
                                LineChartBarData(
                                  spots: waterTakenData,
                                  isCurved: true,
                                  gradient: LinearGradient(
                                    colors: [Colors.blue, Colors.blueAccent],
                                  ),
                                  barWidth: 4,
                                  dotData: FlDotData(show: true),
                                  belowBarData: BarAreaData(show: false),
                                ),
                              ],
                              gridData: FlGridData(
                                show: true,
                                drawVerticalLine: true,
                                horizontalInterval: 1,
                                verticalInterval: 1,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 60),
              ElevatedButton(
                onPressed: () {
                  print("Navigating to /compare");
                  Navigator.pushReplacementNamed(context, '/data');
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.purple,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                ),
                child: const Text(
                  "Graph Analysis",
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
              ),
            ],
          ),
        ),
        bottomNavigationBar: Container(
          padding: const EdgeInsets.symmetric(vertical: 16.0),
          decoration: BoxDecoration(
            color: Colors.white,
            border: const Border(
              top: BorderSide(color: Color(0xFFE0E0E0), width: 1),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildTabButton(
                icon: Icons.home_outlined,
                onPressed: () {
                  Navigator.pushNamed(context, '/home');
                },
                isActive: false,
              ),
              _buildCustomTabButton(
                assetPath: 'assets/bar_chart.png',
                onPressed: () {},
              ),
              _buildTabButton(
                icon: Icons.person_outline,
                onPressed: () {
                  Navigator.pushNamed(context, '/settings');
                },
              ),
            ],
          ),
        ));
  }
}

Widget _buildTabButton({
  required IconData icon,
  required VoidCallback onPressed,
  bool isActive = false,
}) {
  return IconButton(
    icon: Icon(
      icon,
      color: isActive ? Colors.blue : Colors.grey,
    ),
    onPressed: onPressed,
  );
}

Widget _buildCustomTabButton({
  required String assetPath,
  required VoidCallback onPressed,
}) {
  return GestureDetector(
    onTap: onPressed,
    child: Image.asset(
      assetPath,
      width: 30,
      height: 30,
    ),
  );
}
