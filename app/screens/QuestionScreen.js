import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QuestionScreen = ({ navigation }) => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (questionIndex) => {
    setActiveQuestion(activeQuestion === questionIndex ? null : questionIndex);
  };

  const questions = [
    'How to connect bluetooth?',
    'What kind of things depend on hydration?',
    'How I check my hydration data?',
    'Is my personal data secure in this app?',
    'Can I set my sleep time?',
  ];

  const answers = [
    'In home page, there is a Bluetooth icon. Tap on it. There will be a popup connect button. Click on it and connect.',
    'Hydration target depends on your Age, Sex, Weight, Activity level, and Health condition.',
    'Go to statistic page and click on the graph to get your data.',
    'Yes, your data is safe in this app. We only use it to analyze your required water level. We never share your data with any third parties.',
    'You can set your sleep time in general settings, which helps us restrict notifications.',
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
      </View>

      <View style={styles.content}>
        {questions.map((question, index) => (
          <View key={index} style={styles.questionContainer}>
            <TouchableOpacity
              style={[
                styles.questionButton,
                activeQuestion === index && styles.activeButton
              ]}
              onPress={() => toggleQuestion(index)}
            >
              <Text style={styles.questionText}>{question}</Text>
            </TouchableOpacity>
            {activeQuestion === index && (
              <Text style={styles.answerText}>{answers[index]}</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 16,
  },
  questionContainer: {
    marginVertical: 8,
  },
  questionButton: {
    backgroundColor: '#3B3BFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#A9F6B2',
  },
  questionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  answerText: {
    marginTop: 8,
    color: '#333',
    fontSize: 14,
    paddingHorizontal: 12,
  },
});

export default QuestionScreen;
