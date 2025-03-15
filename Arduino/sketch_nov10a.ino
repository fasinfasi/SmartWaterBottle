#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// Define the BLE service and characteristic UUIDs for water volume and percentage
#define SERVICE_UUID      "0000abcd-0000-1000-8000-00805f9b34fb"  // Custom UUID for Water Bottle Service
#define WATER_VOLUME_UUID "0000def1-0000-1000-8000-00805f9b34fb"  // Custom UUID for Water Volume Characteristic
#define WATER_PERCENTAGE_UUID "0000def2-0000-1000-8000-00805f9b34fb"  // Custom UUID for Water Percentage Characteristic

#define TRIG_PIN 2           // GPIO pin for TRIG
#define ECHO_PIN 3           // GPIO pin for ECHO
#define LED_PIN 4            // GPIO pin for the LED
#define BOTTLE_HEIGHT 17.08  // Height of the water bottle in cm
#define BOTTLE_RADIUS 3.25   // Radius of the bottle in cm
#define EMPTY_DISTANCE 23.05 // Distance for empty bottle in cm
#define FULL_DISTANCE 5.93   // Distance for full bottle in cm

BLECharacteristic *waterVolumeCharacteristic;
BLECharacteristic *waterPercentageCharacteristic;
bool deviceConnected = false; // Track Bluetooth connection state

// Callback class to monitor BLE connection status
class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer *pServer) {
    deviceConnected = true;
    Serial.println("BLE Connected");
  }

  void onDisconnect(BLEServer *pServer) {
    deviceConnected = false;
    Serial.println("BLE Disconnected");
    pServer->startAdvertising(); // Restart advertising
  }
};

void setup() {
  Serial.begin(115200);       // Initialize Serial Communication
  pinMode(TRIG_PIN, OUTPUT);  // Set TRIG_PIN as OUTPUT
  pinMode(ECHO_PIN, INPUT);   // Set ECHO_PIN as INPUT
  pinMode(LED_PIN, OUTPUT);   // Set LED_PIN as OUTPUT
  Serial.println("Water Volume Monitoring System");

  // Initialize BLE
  BLEDevice::init("AquaSync");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks()); // Set connection callbacks
  
  // Create service for water monitoring
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create water volume characteristic with proper properties
  waterVolumeCharacteristic = pService->createCharacteristic(WATER_VOLUME_UUID, 
      BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
  waterVolumeCharacteristic->addDescriptor(new BLE2902());  // Enable notifications

  // Create water percentage characteristic with proper properties
  waterPercentageCharacteristic = pService->createCharacteristic(WATER_PERCENTAGE_UUID, 
      BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
  waterPercentageCharacteristic->addDescriptor(new BLE2902());  // Enable notifications

  // Start the service
  pService->start();
  Serial.println("Service and characteristics are set up");

  // Start advertising
  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);  // Add the service UUID to the advertisement
  pAdvertising->start();
  Serial.println("Advertising started");
}

void loop() {
  // Handle LED behavior based on connection state
  if (deviceConnected) {
    digitalWrite(LED_PIN, HIGH); // LED on steadily
  } else {
    // Blink LED slowly when disconnected
    digitalWrite(LED_PIN, HIGH);
    delay(500);
    digitalWrite(LED_PIN, LOW);
    delay(500);
  }

  // Measure distance and calculate water volume and percentage
  float distance = measureDistance();
  if (distance < 0 || distance > EMPTY_DISTANCE) {
    Serial.println("Water Bottle is Empty or Sensor Error");
    waterVolumeCharacteristic->setValue("Warning: Empty or Sensor Error");
    waterPercentageCharacteristic->setValue("Warning: Empty or Sensor Error");
    if (deviceConnected) {
      waterVolumeCharacteristic->notify();  // Notify the app for water volume
      waterPercentageCharacteristic->notify();  // Notify the app for water percentage
    }
  } else if (distance < FULL_DISTANCE) {
    Serial.println("Water Overload or Bottle Cap is Open.");
    waterVolumeCharacteristic->setValue("Warning: Overload or Cap Open");
    waterPercentageCharacteristic->setValue("Warning: Overload or Cap Open");
    if (deviceConnected) {
      waterVolumeCharacteristic->notify();  // Notify the app for water volume
      waterPercentageCharacteristic->notify();  // Notify the app for water percentage
    }
  } else {
    // Bottle has water, calculate the water volume and percentage
    float waterVolume = calculateWaterVolume(distance);
    float percentage = ((EMPTY_DISTANCE - distance) / (EMPTY_DISTANCE - FULL_DISTANCE)) * 100;

    // Display the calculated water volume and percentage
    Serial.print("Water Volume: ");
    Serial.print(waterVolume);
    Serial.println(" ml");

    Serial.print("Water Percentage: ");
    Serial.print(percentage);
    Serial.println(" %");

    // Update BLE characteristics with the calculated data
    String volumeData = "Volume: " + String(waterVolume) + " mL";
    String percentageData = String(percentage, 1) + "%";
    
    waterVolumeCharacteristic->setValue(volumeData);
    waterPercentageCharacteristic->setValue(percentageData);

    // Notify connected clients with the updated data
    if (deviceConnected) {
      waterVolumeCharacteristic->notify();
      waterPercentageCharacteristic->notify();
    }
  }

  delay(1000); // Wait 1 second before the next reading
}

// Function to measure distance using the ultrasonic sensor
float measureDistance() {
  // Trigger the ultrasonic pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(100);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Measure the duration of the echo pulse
  long duration = pulseIn(ECHO_PIN, HIGH, 30000); // Timeout after 30ms
  if (duration == 0) return -1; // Return -1 if no pulse is detected

  // Calculate the distance in cm (duration * speed of sound / 2)
  return (duration * 0.034) / 2;
}

// Function to calculate water volume (in mL) based on the measured distance
float calculateWaterVolume(float distance) {
  if (distance >= EMPTY_DISTANCE) {
    return 0; // Bottle is empty
  }

  // If the bottle is full, we return the full volume
  if (distance <= FULL_DISTANCE) {
    return PI * BOTTLE_RADIUS * BOTTLE_RADIUS * BOTTLE_HEIGHT; // Full volume in mL
  }

  // Calculate the water level
  float waterLevel = BOTTLE_HEIGHT - distance;
  if (waterLevel <= 0) return 0; // No water in the bottle

  // Calculate the full volume of the bottle (volume of a cylinder)
  float fullVolume = PI * BOTTLE_RADIUS * BOTTLE_RADIUS * BOTTLE_HEIGHT; // Volume in cubic cm

  // Proportional volume based on current water level
  float currentVolume = (waterLevel / BOTTLE_HEIGHT) * fullVolume; // Volume in mL

  return currentVolume;
}
