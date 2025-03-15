import 'package:flutter/material.dart';

class QuestionScreen extends StatefulWidget {
  @override
  _QuestionScreenState createState() => _QuestionScreenState();
}

class _QuestionScreenState extends State<QuestionScreen> {
  int? activeQuestion;

  final List<String> questions = [
    'How to connect bluetooth?',
    'What kind of things depend on hydration?',
    'How I check my hydration data?',
    'Is my personal data secure in this app?',
    'Can I set my sleep time?',
  ];

  final List<String> answers = [
    'In home page, there is a Bluetooth icon, \n - Tap on it \n - There will be a popup connect button \n - Click on it and connect',
    'Hydration target depends on your\n - Age \n - Sex \n - Weight \n - Activity level \n - Health condition \n - Weather',
    'Go to statistic page and click on the graph there you can compare your water intake in differ days then realize progress.',
    'Yes, your data is safe in this app. We only use it to analyze your required water level. We never share your data with any third parties.',
    'You can set your sleep time in general settings, which helps us restrict notifications.',
  ];

  void toggleQuestion(int questionIndex) {
    setState(() {
      activeQuestion = activeQuestion == questionIndex ? null : questionIndex;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Stack(
          children: [
            Positioned(
              top: 40,
              left: 16,
              child: IconButton(
                icon: Icon(Icons.arrow_back, size: 24, color: Colors.black),
                onPressed: () => Navigator.pop(context),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(top: 90.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: Text(
                      'FAQ',
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  SizedBox(height: 60),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Column(
                      children: List.generate(questions.length, (index) {
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            GestureDetector(
                              onTap: () => toggleQuestion(index),
                              child: Container(
                                padding: EdgeInsets.symmetric(
                                    vertical: 16, horizontal: 12),
                                decoration: BoxDecoration(
                                  color: activeQuestion == index
                                      ? Color(0xFF3AA5D3)
                                      : Color(0xFF3B3BFF),
                                  borderRadius: activeQuestion == index
                                      ? BorderRadius.vertical(
                                          top: Radius.circular(8),
                                          bottom: Radius.zero,
                                        )
                                      : BorderRadius.circular(8),
                                ),
                                child: Center(
                                  child: Text(
                                    questions[index],
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            if (activeQuestion == index)
                              Container(
                                padding: EdgeInsets.symmetric(
                                    vertical: 16, horizontal: 12),
                                decoration: BoxDecoration(
                                  color: Color(0xFF3AA5D3),
                                  borderRadius: BorderRadius.vertical(
                                    bottom: Radius.circular(8),
                                  ),
                                ),
                                child: Text(
                                  answers[index],
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 16,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            SizedBox(
                                height: 30), // Adds space between each FAQ item
                          ],
                        );
                      }),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
