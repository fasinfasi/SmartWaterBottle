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
    'In home page, there is a Bluetooth icon, \n - Tap on it \n - There will be a popup connect button \n - Click on it and connect',
    'Hydration target depends on your\n - Age \n - Sex \n - Weight \n - Activity level \n - Health condition',
    'Go to statistic page and click on the graph to get your data.',
    'Yes, your data is safe in this app. We only use it to analyze your required water level. We never share your data with any third parties.',
    'You can set your sleep time in general settings, which helps us restrict notifications.',
  ];

  return (
    <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.arrow} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
      <View style={styles.headerContainer}>
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
  arrow: {
    position: 'absolute',
    left: '8%',
    top: '6%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#fff',
    top: 90,

  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 70,
    marginTop: 60,
    bottom: 20,
  },
  questionContainer: {
    marginVertical: 18,
  },
  questionButton: {
    backgroundColor: '#3B3BFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#3AA5D3',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
},
  questionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  answerText: {
    marginTop: 0,
    color: '#000',
    backgroundColor: '#3AA5D3',
    fontSize: 16,
    fontWeight: '550',
    paddingBottom: 3,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
});

export default QuestionScreen;
