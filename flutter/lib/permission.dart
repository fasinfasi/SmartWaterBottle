import 'package:permission_handler/permission_handler.dart';

class PermissionManager {
  /// Request all required Bluetooth permissions.
  static Future<bool> requestBluetoothPermissions() async {
    // Check if permissions are already granted
    if (await Permission.bluetoothScan.isGranted &&
        await Permission.bluetoothConnect.isGranted &&
        await Permission.location.isGranted) {
      return true;
    }

    // Request permissions
    Map<Permission, PermissionStatus> statuses = await [
      Permission.bluetoothScan,
      Permission.bluetoothConnect,
      Permission.location,
    ].request();

    // Return true if all permissions are granted
    return statuses.values.every((status) => status.isGranted);
  }

  /// Check if all required permissions are granted.
  static Future<bool> arePermissionsGranted() async {
    return await Permission.bluetoothScan.isGranted &&
        await Permission.bluetoothConnect.isGranted &&
        await Permission.location.isGranted;
  }
}
