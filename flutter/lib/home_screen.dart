import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:geolocator/geolocator.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:math' as math;

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  double currentWaterConsumption = 2770; // Updated via backend
  double targetWaterConsumption = 3600; // Static target
  String waterPurity = 'Good'; // Placeholder
  double waterLevelPercentage = 0; // Updated via backend
  int batteryLevel = 58; // Placeholder
  Map<String, dynamic>? weatherData;
  bool loading = true;
  bool locationAvailable = true;

  late AnimationController _controller;
  late Animation<double> _waterAnimation;

  final FlutterSecureStorage _secureStorage = FlutterSecureStorage();

  @override
  void initState() {
    super.initState();
    checkLocationStatus();
    fetchWaterData();
    fetchTargetWaterIntake(); // Fetch target water intake on init
    _controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 1500),
    )..repeat();

    _waterAnimation = Tween<double>(begin: 0, end: currentWaterConsumption)
        .animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOut,
    ));
  }

  @override
  void didUpdateWidget(covariant HomeScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    _updateWaterAnimation();
  }

  void _updateWaterAnimation() {
    _waterAnimation = Tween<double>(
      begin: _waterAnimation.value,
      end: currentWaterConsumption,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOut,
    ));
  }

  Future<void> fetchWaterData() async {
    const backendUrl = 'http://192.168.149.8:8081/water-data';
    try {
      final token = await _secureStorage.read(key: 'access_token');
      if (token == null) {
        throw Exception('No access token found.');
      }

      final response = await http.get(
        Uri.parse(backendUrl),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        print('Backend response: $data'); // Debugging log
        setState(() {
          currentWaterConsumption = data['current_consumption'] ?? 0;
          waterLevelPercentage = data['water_level_percentage'] ?? 0;
        });
        _updateWaterAnimation();
        print(
            'Updated values: currentWaterConsumption=$currentWaterConsumption, waterLevelPercentage=$waterLevelPercentage');
      } else {
        throw Exception('Failed to fetch water data: ${response.statusCode}');
      }
    } catch (error) {
      print('Error fetching water data: $error');
    }
  }

  Future<void> fetchTargetWaterIntake() async {
    const backendUrl = 'http://192.168.149.8:8081//calculate-water-intake';
    try {
      final token = await _secureStorage.read(key: 'access_token');
      if (token == null) {
        throw Exception('No access token found.');
      }

      final response = await http.get(
        Uri.parse(backendUrl),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          targetWaterConsumption = data['targetWaterConsumption'] ?? 0;
        });
      } else {
        throw Exception(
            'Failed to fetch target water intake: ${response.statusCode}');
      }
    } catch (error) {
      print('Error fetching target water intake: $error');
    }
  }

  Future<void> checkLocationStatus() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      setState(() {
        locationAvailable = false;
        loading = false;
      });
      return;
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied ||
        permission == LocationPermission.deniedForever) {
      setState(() {
        locationAvailable = false;
        loading = false;
      });
      return;
    }

    fetchWeather();
  }

  Future<void> fetchWeather() async {
    Position position = await _getUserLocation();
    const apiKey = 'ad0708fea04d40c9b1c161449240109';
    final url =
        'https://api.weatherapi.com/v1/current.json?key=$apiKey&q=${position.latitude},${position.longitude}&aqi=no';

    try {
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        setState(() {
          weatherData = json.decode(response.body);
          loading = false;
        });
      } else {
        throw Exception('Failed to load weather data');
      }
    } catch (error) {
      print('Error fetching weather data: $error');
      setState(() {
        loading = false;
      });
    }
  }

  Future<Position> _getUserLocation() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw Exception('Location services are disabled');
    }
    LocationPermission permission = await Geolocator.requestPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }
    if (permission == LocationPermission.deniedForever) {
      throw Exception('Location permissions are permanently denied');
    }
    return await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high);
  }

  Widget buildProgressBar() {
    double progressValue = currentWaterConsumption / targetWaterConsumption;
    return LinearProgressIndicator(
      value: progressValue,
      color: Color(0xFF3b82f6),
      backgroundColor: Colors.grey[300],
      minHeight: 12,
    );
  }

  Color getWeatherTheme(String condition) {
    switch (condition) {
      case 'Sunny':
      case 'Clear':
        return Color(0xFFFFE680);
      case 'Cloudy':
      case 'Partly cloudy':
      case 'Overcast':
        return Color(0xFFD3D3D3);
      case 'Light rain':
      case 'Moderate rain':
      case 'Heavy rain':
      case 'Patchy rain possible':
        return Color(0xFF99AFCC);
      case 'Mist':
      case 'Fog':
        return Color(0xFFF0E68C);
      case 'Thundery outbreaks possible':
        return Color(0xFF111345);
      default:
        return Color(0xFFB9EDDC);
    }
  }

  @override
  Widget build(BuildContext context) {
    // Calculate the fill level based on current consumption vs target
    double fillPercentage = currentWaterConsumption / targetWaterConsumption;
    // Constrain percentage between 0.05 and 1.0 (5% minimum for visibility)
    fillPercentage = fillPercentage.clamp(0.05, 1.0);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Column(
            children: [
              Row(
                children: [
                  IconButton(
                    icon: Icon(Icons.bluetooth),
                    onPressed: () {
                      Navigator.pushNamed(context, '/bluetooth');
                    },
                  ),
                  Spacer(),
                  Row(
                    children: [
                      Icon(Icons.battery_std),
                      SizedBox(width: 4),
                      Text('$batteryLevel%'),
                    ],
                  ),
                ],
              ),
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      height: 200,
                      width: double.infinity,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          Container(
                            height: 200,
                            width: double.infinity,
                            decoration: BoxDecoration(
                              border: Border.all(color: Colors.green),
                            ),
                          ),
                          AnimatedBuilder(
                            animation: _controller,
                            builder: (context, child) {
                              return Align(
                                alignment: Alignment.bottomCenter,
                                child: ClipPath(
                                  clipper: WaveClipper(_controller.value),
                                  child: Container(
                                    width: double.infinity,
                                    height: 200 * fillPercentage,
                                    decoration: BoxDecoration(
                                      color: Color(0xFF4AA3D4),
                                      borderRadius: BorderRadius.vertical(
                                          bottom: Radius.circular(8)),
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                          Text(
                            '${currentWaterConsumption.toInt()}ml',
                            style: TextStyle(
                              fontSize: 45,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF082759),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text('${targetWaterConsumption.toInt()}ml',
                            style: TextStyle(fontSize: 14)),
                        SizedBox(height: 4),
                        buildProgressBar(),
                        SizedBox(height: 4),
                        Text('Daily goal', style: TextStyle(fontSize: 14)),
                      ],
                    ),
                    Container(
                      padding: EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: Color(0xFF32855B),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            children: [
                              Image.asset('assets/simplebottle.png',
                                  height: 50),
                              SizedBox(height: 8),
                              Text('500ml',
                                  style: TextStyle(
                                      color: Colors.white, fontSize: 18)),
                            ],
                          ),
                          Column(
                            children: [
                              Text('Purity',
                                  style: TextStyle(
                                      color: Colors.white, fontSize: 18)),
                              Text(waterPurity,
                                  style: TextStyle(
                                      color: Colors.white, fontSize: 18)),
                            ],
                          ),
                          Column(
                            children: [
                              Text('Level',
                                  style: TextStyle(
                                      color: Colors.white, fontSize: 18)),
                              Text('${waterLevelPercentage.toInt()}%',
                                  style: TextStyle(
                                      color: Colors.white, fontSize: 18)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: EdgeInsets.all(40),
                      decoration: BoxDecoration(
                        color: locationAvailable
                            ? (weatherData != null
                                ? getWeatherTheme(weatherData!['current']
                                    ['condition']['text'])
                                : Colors.grey)
                            : const Color.fromARGB(255, 231, 139, 64),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: loading
                          ? SpinKitCircle(color: Colors.blue, size: 50.0)
                          : locationAvailable
                              ? Column(
                                  children: [
                                    Text(
                                        '${weatherData!['current']['temp_c']}°C',
                                        style: TextStyle(
                                            fontSize: 36,
                                            fontWeight: FontWeight.bold)),
                                    SizedBox(height: 8),
                                    Text(weatherData!['current']['condition']
                                            ['text'] ??
                                        ''),
                                    SizedBox(height: 8),
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Icon(Icons.location_on,
                                            color: Colors.black),
                                        Text(weatherData!['location']['name'],
                                            style: TextStyle(fontSize: 16)),
                                      ],
                                    ),
                                  ],
                                )
                              : Column(
                                  children: [
                                    Icon(Icons.warning,
                                        color: const Color.fromARGB(
                                            255, 200, 21, 8),
                                        size: 40),
                                    SizedBox(height: 8),
                                    Text('We need location to get weather',
                                        style: TextStyle(fontSize: 16)),
                                  ],
                                ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(vertical: 16.0),
                decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border(
                      top: BorderSide(color: Color(0xFFE0E0E0), width: 1)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildTabButton(
                      icon: Icons.home_outlined,
                      onPressed: () {
                        Navigator.pushNamed(context, '/home');
                      },
                      isActive: true,
                    ),
                    _buildCustomTabButton(
                      assetPath: 'assets/bar_chart.png',
                      onPressed: () {
                        Navigator.pushNamed(context, '/graph');
                      },
                    ),
                    _buildTabButton(
                      icon: Icons.person_outline,
                      onPressed: () {
                        Navigator.pushNamed(context, '/settings');
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTabButton({
    required IconData icon,
    required void Function() onPressed,
    bool isActive = false,
  }) {
    return GestureDetector(
      onTap: onPressed,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 30, color: Colors.black),
          if (isActive)
            Container(
              margin: const EdgeInsets.only(top: 4.0),
              width: 30,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildCustomTabButton({
    required String assetPath,
    required void Function() onPressed,
    bool isActive = false,
  }) {
    return GestureDetector(
      onTap: onPressed,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset(
            assetPath,
            height: 30,
          ),
          if (isActive)
            Container(
              margin: const EdgeInsets.only(top: 4.0),
              width: 30,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}

// Custom Wave Clipper
class WaveClipper extends CustomClipper<Path> {
  final double animationValue;

  WaveClipper(this.animationValue);

  @override
  Path getClip(Size size) {
    final path = Path();
    final width = size.width;
    final height = size.height;

    path.moveTo(0, height);

    // Create a more natural wave pattern with multiple sine waves
    for (double i = 0; i < width; i++) {
      // First wave component
      double wave1 =
          math.sin((i / width * 4 * math.pi) + (animationValue * 2 * math.pi)) *
              8;
      // Second wave component (different frequency)
      double wave2 =
          math.sin((i / width * 2 * math.pi) + (animationValue * 2 * math.pi)) *
              5;

      // Combined wave effect
      double combinedWave = wave1 + wave2;

      // Add point to path (use top of container as reference)
      path.lineTo(
          i, 15 + combinedWave); // 15 is offset from top for wave visibility
    }

    // Complete the path by going to the bottom corners
    path.lineTo(width, height);
    path.lineTo(0, height);
    path.close();

    return path;
  }

  @override
  bool shouldReclip(WaveClipper oldClipper) => true;
}
