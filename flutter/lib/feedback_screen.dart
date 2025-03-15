import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';

class FeedbackScreen extends StatefulWidget {
  @override
  _FeedbackScreenState createState() => _FeedbackScreenState();
}

class _FeedbackScreenState extends State<FeedbackScreen> {
  final FocusNode _focusNodeBugs = FocusNode();
  final FocusNode _focusNodeSuggestions = FocusNode();
  TextEditingController _encounteredBugsController = TextEditingController();
  TextEditingController _additionalSuggestionsController =
      TextEditingController();

  // Secure Storage
  final FlutterSecureStorage _secureStorage = FlutterSecureStorage();

  Map<String, String?> formData = {
    'navigationEase': null,
    'reminderHelpfulness': null,
    'bluetoothPerformance': null,
    'waterLevelAccuracy': null,
    'hydrationUsefulness': null,
    'recommendationFit': null,
    'overallExperience': null,
    'encounteredBugs': '',
    'additionalSuggestions': '',
  };

  void handleInputChange(String field, String? value) {
    setState(() {
      formData[field] = value?.trim();
    });
  }

  Future<void> handleSubmit() async {
    // Show dialog if form is incomplete
    if (formData.values.any((field) => field == null || field.isEmpty)) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Incomplete Form'),
          content: Text('Please fill out all fields before submitting.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('OK'),
            ),
          ],
        ),
      );
      return;
    }

    // Show loading dialog
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        content: Row(
          children: [
            CircularProgressIndicator(),
            SizedBox(width: 20),
            Text("Submitting Feedback..."),
          ],
        ),
      ),
    );

    try {
      // Retrieve JWT token from secure storage
      String? token = await _secureStorage.read(key: 'access_token');
      if (token == null) {
        Navigator.pop(context); // Close loading dialog if token is null
        _showErrorDialog("Authentication required");
        return;
      }

      // Prepare the data
      Map<String, String?> data = {...formData};
      data['userToken'] = token;

      // Send feedback to backend
      final response = await http.post(
        Uri.parse(
            'http://192.168.149.8:8081/feedbacks'), // Replace with actual backend URL
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token', // Use the token for authorization
        },
        body: json.encode({
          'navigationEase': formData['navigationEase'],
          'reminderHelpfulness': formData['reminderHelpfulness'],
          'bluetoothPerformance': formData['bluetoothPerformance'],
          'waterLevelAccuracy': formData['waterLevelAccuracy'],
          'hydrationUsefulness': formData['hydrationUsefulness'],
          'recommendationFit': formData['recommendationFit'],
          'overallExperience': formData['overallExperience'],
          'encounteredBugs': _encounteredBugsController.text,
          'additionalSuggestions': _additionalSuggestionsController.text,
        }),
      );

      if (response.statusCode == 200) {
        Navigator.pop(context); // Close loading dialog
        _showSuccessDialog();
      } else {
        Navigator.pop(context); // Close loading dialog
        _showErrorDialog("Failed to submit feedback. Please try again.");
      }
    } catch (e) {
      Navigator.pop(context); // Close loading dialog
      _showErrorDialog("An error occurred. Please try again.");
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Feedback Submitted'),
        content: Text('Thank you for your feedback!'),
        actions: [
          TextButton(
            onPressed: () {
              setState(() {
                formData = {
                  'navigationEase': null,
                  'reminderHelpfulness': null,
                  'bluetoothPerformance': null,
                  'waterLevelAccuracy': null,
                  'hydrationUsefulness': null,
                  'recommendationFit': null,
                  'overallExperience': null,
                  'encounteredBugs': '',
                  'additionalSuggestions': '',
                };
                _encounteredBugsController.clear();
                _additionalSuggestionsController.clear();
              });
              Navigator.pop(context);
              _focusNodeBugs.unfocus();
              _focusNodeSuggestions.unfocus();
            },
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Error'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _encounteredBugsController.dispose();
    _additionalSuggestionsController.dispose();
    _focusNodeBugs.dispose();
    _focusNodeSuggestions.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue[900],
      appBar: AppBar(
        backgroundColor: Colors.blue[900],
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: EdgeInsets.only(top: 20),
              child: Center(
                child: Text(
                  'Feedback',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            SizedBox(height: 40),
            _buildQuestion(
                '1. Was the app easy to navigate and use?', 'navigationEase'),
            _buildQuestion(
                '2. How helpful do you find the drink water reminders?',
                'reminderHelpfulness'),
            _buildQuestion('3. How well does the Bluetooth connectivity work?',
                'bluetoothPerformance'),
            _buildQuestion(
                '4. How accurate do you find the water level sensing feature?',
                'waterLevelAccuracy'),
            _buildQuestion(
                '5. How useful is the hydration analysis feature for you?',
                'hydrationUsefulness'),
            _buildQuestion(
                '6. How well do the hydration recommendations fit your needs?',
                'recommendationFit'),
            _buildQuestion(
                '7. How would you rate your overall experience with the app?',
                'overallExperience'),
            SizedBox(height: 20),
            _buildTextField(
                '8. Did you encounter any bugs or crashes while using the app?',
                'encounteredBugs',
                _encounteredBugsController,
                _focusNodeBugs),
            _buildTextField(
                '9. Any additional suggestions for improvement?',
                'additionalSuggestions',
                _additionalSuggestionsController,
                _focusNodeSuggestions),
            SizedBox(height: 20),
            Center(
              child: ElevatedButton(
                onPressed: handleSubmit,
                child: Text(
                  'Submit',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(vertical: 20, horizontal: 40),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(5)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuestion(String questionText, String fieldName) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(questionText,
              style: TextStyle(color: Colors.white, fontSize: 16)),
          Column(
            children: [
              _buildRadioOption(fieldName, 'Very Easy'),
              _buildRadioOption(fieldName, 'Easy'),
              _buildRadioOption(fieldName, 'Neutral'),
              _buildRadioOption(fieldName, 'Difficult'),
              _buildRadioOption(fieldName, 'Very Difficult'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRadioOption(String fieldName, String label) {
    return RadioListTile<String>(
      title: Text(label, style: TextStyle(color: Colors.white)),
      value: label,
      groupValue: formData[fieldName],
      onChanged: (value) {
        handleInputChange(fieldName, value);
      },
      activeColor: Colors.yellow,
    );
  }

  Widget _buildTextField(String label, String fieldName,
      TextEditingController controller, FocusNode focusNode) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(color: Colors.white, fontSize: 16)),
          TextField(
            focusNode: focusNode,
            controller: controller,
            onChanged: (value) => handleInputChange(fieldName, value),
            maxLines: 4,
            decoration: InputDecoration(
              hintText: 'Type here...',
              hintStyle: TextStyle(color: Colors.grey),
              filled: true,
              fillColor: Colors.white,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(5),
                borderSide: BorderSide.none,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

void main() {
  runApp(MaterialApp(
    home: FeedbackScreen(),
  ));
}
