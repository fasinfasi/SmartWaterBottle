import 'package:permission_handler/permission_handler.dart';

class PermissionManager {
  // Check if Bluetooth and location permissions are granted
  static Future<bool> arePermissionsGranted() async {
    PermissionStatus bluetoothStatus = await Permission.bluetoothScan.status;
    PermissionStatus locationStatus = await Permission.locationWhenInUse.status;

    return bluetoothStatus.isGranted && locationStatus.isGranted;
  }

  // Request Bluetooth and location permissions
  static Future<bool> requestBluetoothPermissions() async {
    PermissionStatus bluetoothStatus = await Permission.bluetoothScan.request();
    PermissionStatus locationStatus =
        await Permission.locationWhenInUse.request();

    return bluetoothStatus.isGranted && locationStatus.isGranted;
  }

  // Request Bluetooth permission only (for Android 12+)
  static Future<bool> requestBluetoothPermissionOnly() async {
    PermissionStatus bluetoothStatus = await Permission.bluetoothScan.request();
    return bluetoothStatus.isGranted;
  }

  // Request Location permission only
  static Future<bool> requestLocationPermissionOnly() async {
    PermissionStatus locationStatus =
        await Permission.locationWhenInUse.request();
    return locationStatus.isGranted;
  }
}
