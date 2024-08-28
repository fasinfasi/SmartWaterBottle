import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const KnowMoreAbout = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Water Intake Guidelines</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>General Guidelines</Text>
        <Text style={styles.text}>Adult Men: About 3.7 liters (125 ounces) of water per day.</Text>
        <Text style={styles.text}>Adult Women: About 2.7 liters (91 ounces) of water per day.</Text>

        <Text style={styles.title}>Factors Affecting Water Consumption</Text>
        
        <Text style={styles.subtitle}>Age:</Text>
        <Text style={styles.text}>Children: Require less water than adults, but their needs increase with age.</Text>
        <Text style={styles.text}>1-3 years: 1.3 liters (44 ounces)</Text>
        <Text style={styles.text}>4-8 years: 1.7 liters (57 ounces)</Text>
        <Text style={styles.text}>9-13 years: 2.1 liters (71 ounces) for girls, 2.4 liters (81 ounces) for boys</Text>
        <Text style={styles.text}>14-18 years: 2.3 liters (78 ounces) for girls, 3.3 liters (112 ounces) for boys</Text>
        <Text style={styles.text}>Older Adults: May need to be more mindful of hydration due to decreased thirst sensation.</Text>

        <Text style={styles.subtitle}>Weight:</Text>
        <Text style={styles.text}>A common guideline is to drink 30-40 milliliters of water per kilogram of body weight. For example, a person weighing 70 kg should aim for 2.1-2.8 liters per day.</Text>

        <Text style={styles.subtitle}>Weather:</Text>
        <Text style={styles.text}>Hot/Humid Conditions: Increased water intake is necessary to compensate for water lost through sweat. An additional 0.5-1 liter per hour of physical activity in hot weather is recommended.</Text>
        <Text style={styles.text}>Cold Weather: Although less apparent, hydration is still crucial as the body loses water through respiration.</Text>

        <Text style={styles.subtitle}>Activity Level:</Text>
        <Text style={styles.text}>Sedentary: Follow general guidelines.</Text>
        <Text style={styles.text}>Moderately Active: Additional 0.5-1 liter per day.</Text>
        <Text style={styles.text}>Highly Active/Athletes: Water loss from sweat can be significant. An additional 1-3 liters per day, depending on the intensity and duration of the activity.</Text>

        <Text style={styles.subtitle}>Health Conditions:</Text>
        <Text style={styles.text}>Kidney Stones/UTIs: Increased water intake helps prevent recurrence.</Text>
        <Text style={styles.text}>Heart Conditions: Consult with a doctor, as excessive fluid intake can strain the heart.</Text>
        <Text style={styles.text}>Diabetes: Higher fluid needs due to increased urination.</Text>
        <Text style={styles.text}>Pregnancy/Breastfeeding: Pregnant women need about 0.3 liters more, and breastfeeding women need about 0.7 liters more per day.</Text>

        <Text style={styles.subtitle}>Diet:</Text>
        <Text style={styles.text}>High Salt/Sugar Intake: Increases water needs.</Text>
        <Text style={styles.text}>High Protein Diets: Require more water to help metabolize protein.</Text>
        <Text style={styles.text}>High Fiber Diets: Fiber absorbs water, so increased intake is necessary.</Text>

        <Text style={styles.subtitle}>Medications:</Text>
        <Text style={styles.text}>Some medications, like diuretics, increase the need for water.</Text>

        <Text style={styles.title}>Example Calculation</Text>
        <Text style={styles.text}>For a 30-year-old, moderately active woman weighing 60 kg in a hot climate:</Text>
        <Text style={styles.text}>Base requirement: 2.7 liters</Text>
        <Text style={styles.text}>Weight adjustment: (60 kg x 35 ml) = 2.1 liters (within base requirement)</Text>
        <Text style={styles.text}>Activity adjustment: +0.5 liter</Text>
        <Text style={styles.text}>Climate adjustment: +0.5 liter</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'purple',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'purple',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 15,
  },
  text: {
    fontSize: 14,
    color: 'white',
    marginBottom: 10,
  },
});

export default KnowMoreAbout;