import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isPasswordVisible = false;
  String? _emailError;
  String? _passwordError;
  final _storage = FlutterSecureStorage();

  @override
  void initState() {
    super.initState();
    _checkAutoLogin();
  }

  void _checkAutoLogin() async {
    final accessToken = await _storage.read(key: 'access_token');
    if (accessToken != null) {
      final isValid = await _validateToken(accessToken);
      if (isValid) {
        Navigator.pushReplacementNamed(context, '/home');
      } else {
        await _refreshToken();
      }
    }
  }

  Future<bool> _validateToken(String token) async {
    try {
      final response = await http.get(
        Uri.parse('http://192.168.149.8:8081/log'), // Token validation endpoint
        headers: {'Authorization': 'Bearer $token'},
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  Future<void> _refreshToken() async {
    final refreshToken = await _storage.read(key: 'refresh_token');
    if (refreshToken != null) {
      try {
        final response = await http.post(
          Uri.parse(
              'http://192.168.149.8:8081/refresh-token'), // Refresh token endpoint
          headers: {'Content-Type': 'application/json'},
          body: json.encode({'refresh_token': refreshToken}),
        );

        if (response.statusCode == 200) {
          final data = json.decode(response.body);
          final newAccessToken = data['access_token'];
          final newRefreshToken = data['refresh_token'];

          await _storage.write(key: 'access_token', value: newAccessToken);
          if (newRefreshToken != null) {
            await _storage.write(key: 'refresh_token', value: newRefreshToken);
          }
          Navigator.pushReplacementNamed(context, '/home');
        } else {
          await _storage.delete(key: 'access_token');
          await _storage.delete(key: 'refresh_token');
        }
      } catch (e) {
        await _storage.delete(key: 'access_token');
        await _storage.delete(key: 'refresh_token');
      }
    }
  }

  void _validateAndLogin() async {
    final email = _emailController.text;
    final password = _passwordController.text;

    setState(() {
      _emailError = null;
      _passwordError = null;
    });

    if (email.isEmpty) {
      setState(() => _emailError = 'Email is required');
    } else if (!RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(email)) {
      setState(() => _emailError = 'Please enter a valid email address');
    }

    if (password.isEmpty) {
      setState(() => _passwordError = 'Password is required');
    } else if (password.length < 8) {
      setState(() => _passwordError = 'Password must be at least 8 characters');
    }

    if (_emailError == null && _passwordError == null) {
      try {
        final response = await http.post(
          Uri.parse('http://192.168.149.8:8081/log'), // Login endpoint
          headers: {'Content-Type': 'application/json'},
          body: json.encode({'email': email, 'password': password}),
        );

        if (response.statusCode == 200) {
          final data = json.decode(response.body);
          final accessToken = data['access_token'];
          final refreshToken = data['refresh_token'];

          await _storage.write(key: 'access_token', value: accessToken);
          if (refreshToken != null) {
            await _storage.write(key: 'refresh_token', value: refreshToken);
          }

          Navigator.pushReplacementNamed(context, '/home');
        } else if (response.statusCode == 401) {
          _showErrorDialog('Login Failed', 'Invalid email or password');
        } else {
          final errorResponse = json.decode(response.body);
          final message =
              errorResponse['message'] ?? 'An unexpected error occurred';
          _showErrorDialog('Error', message);
        }
      } catch (e) {
        _showErrorDialog('Login Error',
            'Unable to connect to the server. Please try again.');
      }
    }
  }

  void _showErrorDialog(String title, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        child: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF238cad), Color(0xFF134757)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const Text(
                    'AquaSync',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 36,
                      fontWeight: FontWeight.bold,
                      fontFamily: 'Roboto',
                    ),
                  ),
                  const SizedBox(height: 50),
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE8E7E6),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.25),
                          blurRadius: 10,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        const Text(
                          'Login',
                          style: TextStyle(
                            fontSize: 29,
                            fontWeight: FontWeight.bold,
                            color: Color.fromARGB(221, 26, 24, 24),
                          ),
                        ),
                        const SizedBox(height: 20),
                        TextField(
                          controller: _emailController,
                          keyboardType: TextInputType.emailAddress,
                          decoration: InputDecoration(
                            labelText: 'Email',
                            labelStyle: const TextStyle(color: Colors.grey),
                            errorText: _emailError,
                            filled: true,
                            fillColor: const Color(0xFFF0F0F0),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide: BorderSide.none,
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),
                        TextField(
                          controller: _passwordController,
                          obscureText: !_isPasswordVisible,
                          decoration: InputDecoration(
                            labelText: 'Password',
                            labelStyle: const TextStyle(color: Colors.grey),
                            errorText: _passwordError,
                            filled: true,
                            fillColor: const Color(0xFFF0F0F0),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide: BorderSide.none,
                            ),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _isPasswordVisible
                                    ? Icons.visibility_off
                                    : Icons.visibility,
                              ),
                              onPressed: () {
                                setState(() {
                                  _isPasswordVisible = !_isPasswordVisible;
                                });
                              },
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Align(
                          alignment: Alignment.centerRight,
                          child: TextButton(
                            onPressed: () {
                              Navigator.pushNamed(context, '/password-reset');
                            },
                            child: const Text(
                              'Forgot Password?',
                              style: TextStyle(color: Colors.blueGrey),
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            minimumSize: const Size(200, 50),
                          ),
                          onPressed: _validateAndLogin,
                          child: const Text(
                            'Login',
                            style: TextStyle(fontSize: 16),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
