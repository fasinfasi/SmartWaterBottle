import 'package:flutter/material.dart';

class KnowMoreAbout extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.purple,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          "Water Intake Guidelines",
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
      ),
      body: Container(
        color: Colors.purple,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildSectionTitle("General Guidelines"),
              _buildText(
                  "Adult Men: About 3.7 liters (125 ounces) of water per day."),
              _buildText(
                  "Adult Women: About 2.7 liters (91 ounces) of water per day."),
              _buildSectionTitle("Factors Affecting Water Consumption"),
              _buildSubtitle("Age:"),
              _buildText(
                  "Children: Require less water than adults, but their needs increase with age."),
              _buildText("1-3 years: 1.3 liters (44 ounces)"),
              _buildText("4-8 years: 1.7 liters (57 ounces)"),
              _buildText(
                  "9-13 years: 2.1 liters (71 ounces) for girls, 2.4 liters (81 ounces) for boys"),
              _buildText(
                  "14-18 years: 2.3 liters (78 ounces) for girls, 3.3 liters (112 ounces) for boys"),
              _buildText(
                  "Older Adults: May need to be more mindful of hydration due to decreased thirst sensation."),
              _buildSubtitle("Weight:"),
              _buildText(
                  "A common guideline is to drink 30-40 milliliters of water per kilogram of body weight. For example, a person weighing 70 kg should aim for 2.1-2.8 liters per day."),
              _buildSubtitle("Weather:"),
              _buildText(
                  "Hot/Humid Conditions: Increased water intake is necessary to compensate for water lost through sweat. An additional 0.5-1 liter per hour of physical activity in hot weather is recommended."),
              _buildText(
                  "Cold Weather: Although less apparent, hydration is still crucial as the body loses water through respiration."),
              _buildSubtitle("Activity Level:"),
              _buildText("Sedentary: Follow general guidelines."),
              _buildText("Moderately Active: Additional 0.5-1 liter per day."),
              _buildText(
                  "Highly Active/Athletes: Water loss from sweat can be significant. An additional 1-3 liters per day, depending on the intensity and duration of the activity."),
              _buildSubtitle("Health Conditions:"),
              _buildText(
                  "Kidney Stones/UTIs: Increased water intake helps prevent recurrence."),
              _buildText(
                  "Heart Conditions: Consult with a doctor, as excessive fluid intake can strain the heart."),
              _buildText(
                  "Diabetes: Higher fluid needs due to increased urination."),
              _buildText(
                  "Pregnancy/Breastfeeding: Pregnant women need about 0.3 liters more, and breastfeeding women need about 0.7 liters more per day."),
              _buildSubtitle("Diet:"),
              _buildText("High Salt/Sugar Intake: Increases water needs."),
              _buildText(
                  "High Protein Diets: Require more water to help metabolize protein."),
              _buildText(
                  "High Fiber Diets: Fiber absorbs water, so increased intake is necessary."),
              _buildSubtitle("Medications:"),
              _buildText(
                  "Some medications, like diuretics, increase the need for water."),
              _buildSectionTitle("Example Calculation"),
              _buildText(
                  "For a 30-year-old, moderately active woman weighing 60 kg in a hot climate:"),
              _buildText("Base requirement: 2.7 liters"),
              _buildText(
                  "Weight adjustment: (60 kg x 35 ml) = 2.1 liters (within base requirement)"),
              _buildText("Activity adjustment: +0.5 liter"),
              _buildText("Climate adjustment: +0.5 liter"),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String text) {
    return Padding(
      padding: const EdgeInsets.only(top: 20.0, bottom: 10.0),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
    );
  }

  Widget _buildSubtitle(String text) {
    return Padding(
      padding: const EdgeInsets.only(top: 15.0),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
    );
  }

  Widget _buildText(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10.0),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 14,
          color: Colors.white,
        ),
      ),
    );
  }
}

void main() {
  runApp(MaterialApp(
    home: KnowMoreAbout(),
    theme: ThemeData.dark(),
  ));
}
