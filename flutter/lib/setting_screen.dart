import 'package:flutter/material.dart';

class SettingScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        body: Column(
          children: [
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildButton(
                      icon: Icons.face,
                      color: Colors.yellow,
                      text: 'My Profile',
                      onPressed: () {
                        Navigator.pushNamed(context, '/profile');
                      },
                    ),
                    _buildButton(
                      icon: Icons.notifications,
                      color: Colors.orange,
                      text: 'Notification',
                      onPressed: () {
                        Navigator.pushNamed(context, '/notifications');
                      },
                    ),
                    _buildButton(
                      icon: Icons.settings,
                      color: Colors.black,
                      text: 'General Setting',
                      onPressed: () {
                        Navigator.pushNamed(context, '/general-setting');
                      },
                    ),
                    _buildButton(
                      icon: Icons.help_outline,
                      color: Colors.purple,
                      text: 'FAQ',
                      onPressed: () {
                        Navigator.pushNamed(context, '/questions');
                      },
                    ),
                    _buildButton(
                      icon: Icons.comment,
                      color: Colors.orange,
                      text: 'Feedback',
                      onPressed: () {
                        Navigator.pushNamed(context, '/feedback');
                      },
                    ),
                  ],
                ),
              ),
            ),
            _buildBottomTabBar(context),
          ],
        ),
      ),
    );
  }

  Widget _buildButton({
    required IconData icon,
    required Color color,
    required String text,
    required void Function() onPressed,
  }) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 15.0, horizontal: 20.0),
        decoration: BoxDecoration(
          color: Color(0xFF007BFF),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          children: [
            Icon(icon, size: 24, color: color),
            Expanded(
              child: Center(
                child: Text(
                  text,
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomTabBar(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16.0),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFE0E0E0), width: 1)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildTabButton(
            icon: Icons.home_outlined,
            onPressed: () {
              Navigator.pushNamed(context, '/home'); // Navigate to home_screen
            },
          ),
          _buildTabButton(
            icon: Icons.bar_chart_outlined,
            onPressed: () {
              Navigator.pushNamed(context, '/graph');
            },
          ),
          _buildTabButton(
            icon: Icons.person_outline,
            onPressed: () {
              Navigator.pushNamed(context, '/settings');
            },
            isActive: true,
          ),
        ],
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
              margin: const EdgeInsets.only(top: 4.0), // Correct margin
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
}
