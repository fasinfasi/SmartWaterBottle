import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';

class PermissionManager {
  static Future<bool> requestBluetoothPermissions() async {
    if (await Permission.bluetoothScan.isGranted &&
        await Permission.bluetoothConnect.isGranted &&
        await Permission.location.isGranted) {
      return true;
    }

    Map<Permission, PermissionStatus> statuses = await [
      Permission.bluetoothScan,
      Permission.bluetoothConnect,
      Permission.location,
    ].request();

    return statuses.values.every((status) => status.isGranted);
  }

  static Future<bool> arePermissionsGranted() async {
    return await Permission.bluetoothScan.isGranted &&
        await Permission.bluetoothConnect.isGranted &&
        await Permission.location.isGranted;
  }
}

class BluetoothScreen extends StatefulWidget {
  @override
  _BluetoothScreenState createState() => _BluetoothScreenState();
}

class _BluetoothScreenState extends State<BluetoothScreen> {
  final _secureStorage = FlutterSecureStorage();
  List<BluetoothDevice> devicesList = [];
  BluetoothDevice? connectedDevice;
  List<BluetoothService> services = [];

  final String backendUrl = "http://192.168.149.8:8081/update_water_status";
  final String waterVolumeUuid = "0000def1-0000-1000-8000-00805f9b34fb";
  final String waterPercentageUuid = "0000def2-0000-1000-8000-00805f9b34fb";

  @override
  void initState() {
    super.initState();
    FlutterBluePlus.adapterState.listen((state) {
      if (state != BluetoothAdapterState.on) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('Please turn on Bluetooth to use this feature.'),
          action: SnackBarAction(
            label: 'Enable',
            onPressed: () => checkBluetoothState(),
          ),
        ));
      }
    });
    checkBluetoothState();
  }

  void checkBluetoothState() async {
    final state = await FlutterBluePlus.adapterState.first;
    if (state != BluetoothAdapterState.on) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Please enable Bluetooth.'),
        action: SnackBarAction(
          label: 'Enable',
          onPressed: () async {
            await FlutterBluePlus.turnOn();
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
              content: Text('Bluetooth has been enabled.'),
            ));
          },
        ),
      ));
    } else {
      requestPermissionsAndScan();
    }
  }

  void requestPermissionsAndScan() async {
    bool permissionsGranted =
        await PermissionManager.requestBluetoothPermissions();
    if (permissionsGranted) {
      startScanAndConnect();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Bluetooth permissions are required to proceed.'),
      ));
    }
  }

  void startScanAndConnect() {
    FlutterBluePlus.startScan(timeout: Duration(seconds: 5));
    FlutterBluePlus.scanResults.listen((results) async {
      for (ScanResult r in results) {
        if (r.device.platformName == "AQUASYNC" ||
            r.device.remoteId.toString() == "54:32:04:87:9F:EA") {
          FlutterBluePlus.stopScan();
          connectToDevice(r.device);
          return;
        }
      }
    }).onError((error) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Error scanning for devices: $error'),
      ));
    });
  }

  void connectToDevice(BluetoothDevice device) async {
    try {
      await device.connect();
      setState(() {
        connectedDevice = device;
      });
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content:
            Text('Connected to ${device.platformName} (${device.remoteId})'),
      ));
      discoverServices(device);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Failed to connect: $e'),
      ));
    }
  }

  Future<void> discoverServices(BluetoothDevice device) async {
    try {
      List<BluetoothService> discoveredServices =
          await device.discoverServices();
      setState(() {
        services = discoveredServices;
      });

      for (BluetoothService service in discoveredServices) {
        for (BluetoothCharacteristic characteristic
            in service.characteristics) {
          print('Discovered Characteristic: ${characteristic.uuid}');

          if (characteristic.uuid.toString() == "def1") {
            await characteristic.setNotifyValue(true);
            characteristic.lastValueStream.listen((value) {
              String waterVolume = utf8.decode(value);
              print('Water Volume (Notification): $waterVolume');
              updateWaterStatusToBackend1(waterVolume);
            });
          }

          if (characteristic.uuid.toString() == "def2") {
            await characteristic.setNotifyValue(true);
            characteristic.lastValueStream.listen((value) {
              String waterPercentage = utf8.decode(value);
              print('Water Percentage (Notification): $waterPercentage');
              updateWaterStatusToBackend2(waterPercentage);
            });
          }
        }
      }
    } catch (e) {
      print('Error discovering services: $e');
    }
  }

  Future<String?> refreshToken() async {
    try {
      String? refreshToken = await _secureStorage.read(key: "refresh_token");
      if (refreshToken == null) {
        print("No refresh token found. Please log in again.");
        return null;
      }

      final response = await http.post(
        Uri.parse(
            'http:// 192.168.242.41:8081/refresh_token'), // Replace with your refresh token endpoint
        headers: {
          "Content-Type": "application/json",
        },
        body: json.encode({
          "refresh_token": refreshToken,
        }),
      );

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        String newAccessToken = responseData['access_token'];
        await _secureStorage.write(key: "access_token", value: newAccessToken);
        return newAccessToken;
      } else {
        print("Failed to refresh token.");
        return null;
      }
    } catch (e) {
      print("Error refreshing token: $e");
      return null;
    }
  }

  Future<void> updateWaterStatusToBackend1(String waterVolume) async {
    try {
      String? accessToken = await _secureStorage.read(key: "access_token");
      if (accessToken == null) {
        print("No access token found. Please log in again.");
        return;
      }

      final response = await http.post(
        Uri.parse(backendUrl),
        headers: {
          "Authorization": "Bearer $accessToken",
          "Content-Type": "application/json",
        },
        body: json.encode({
          "volume": waterVolume,
        }),
      );

      if (response.statusCode == 401) {
        accessToken = await refreshToken();
        if (accessToken != null) {
          await http.post(
            Uri.parse(backendUrl),
            headers: {
              "Authorization": "Bearer $accessToken",
              "Content-Type": "application/json",
            },
            body: json.encode({
              "volume": waterVolume,
            }),
          );
        }
      } else if (response.statusCode == 200) {
        print("Successfully updated water status.");
      }
    } catch (e) {
      print("Error updating water status: $e");
    }
  }

  Future<void> updateWaterStatusToBackend2(String waterPercentage) async {
    try {
      String? accessToken = await _secureStorage.read(key: "access_token");
      if (accessToken == null) {
        print("No access token found. Please log in again.");
        return;
      }

      final response = await http.post(
        Uri.parse(backendUrl),
        headers: {
          "Authorization": "Bearer $accessToken",
          "Content-Type": "application/json",
        },
        body: json.encode({
          "percentage": waterPercentage,
        }),
      );

      if (response.statusCode == 401) {
        accessToken = await refreshToken();
        if (accessToken != null) {
          await http.post(
            Uri.parse(backendUrl),
            headers: {
              "Authorization": "Bearer $accessToken",
              "Content-Type": "application/json",
            },
            body: json.encode({
              "percentage": waterPercentage,
            }),
          );
        }
      } else if (response.statusCode == 200) {
        print("Successfully updated water status.");
      }
    } catch (e) {
      print("Error updating water status: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF5F5F5),
      body: Stack(
        children: [
          Positioned(
            top: 38,
            left: 12,
            child: IconButton(
              icon: Icon(Icons.arrow_back, color: Colors.black, size: 24),
              onPressed: () {
                Navigator.pop(context);
              },
            ),
          ),
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.only(top: 85.0),
                child: Text(
                  connectedDevice != null
                      ? 'Connected to ${connectedDevice!.platformName}'
                      : 'Bluetooth searching...',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              SizedBox(height: 5),
              Text(
                connectedDevice != null
                    ? 'Device is ready!'
                    : 'Keep bottle close to your device',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18),
              ),
              SizedBox(height: 85),
              Stack(
                alignment: Alignment.center,
                children: [
                  Ring(delay: 0),
                  Ring(delay: 1000),
                  Ring(delay: 2000),
                  Ring(delay: 3000),
                  Image.asset(
                    'assets/BottleIconBluetooth.png',
                    width: MediaQuery.of(context).size.width * 0.6,
                    height: MediaQuery.of(context).size.width * 0.6,
                    fit: BoxFit.contain,
                  ),
                ],
              ),
              SizedBox(height: 20),
              Text(
                'Bluetooth Devices',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              Expanded(
                child: ListView.builder(
                  itemCount: devicesList.length,
                  itemBuilder: (context, index) {
                    BluetoothDevice device = devicesList[index];
                    return ListTile(
                      title: Text(device.platformName.isNotEmpty
                          ? device.platformName
                          : 'Unknown Device'),
                      subtitle: Text(device.remoteId.toString()),
                      onTap: () => connectToDevice(device),
                    );
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class Ring extends StatefulWidget {
  final int delay;

  Ring({required this.delay});

  @override
  _RingState createState() => _RingState();
}

class _RingState extends State<Ring> with TickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 4),
      vsync: this,
    );

    _scaleAnimation = Tween<double>(begin: 0, end: 5).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));

    _opacityAnimation = Tween<double>(begin: 0.8, end: 0)
        .animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));

    Future.delayed(Duration(milliseconds: widget.delay), () {
      _controller.repeat(reverse: true);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Opacity(
          opacity: _opacityAnimation.value,
          child: Transform.scale(
            scale: _scaleAnimation.value,
            child: Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: Color(0xFF05239C),
                  width: 10,
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
