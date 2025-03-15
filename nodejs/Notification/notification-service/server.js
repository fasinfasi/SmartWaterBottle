require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
const express = require("express");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
const cron = require("node-cron");
const path = require("path");

const app = express();
app.use(express.json()); // Enable JSON body parsing
const PORT = process.env.PORT || 8081;

// 🔹 MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// 🔹 Firebase Admin SDK
const serviceAccountPath = process.env.FIREBASE_CREDENTIALS_PATH || "./firebase-adminsdk.json";
admin.initializeApp({
  credential: admin.credential.cert(require(path.resolve(serviceAccountPath)))
});

// 🔹 Define Hydration Record Schema
const hydrationSchema = new mongoose.Schema({
  user_id: String,
  current_date: String,
  records: [{ scheduled_time: String, amount_drank: Number, rating: String }]
}, { collection: "Hydration_Record" });

const HydrationRecord = mongoose.model("HydrationRecord", hydrationSchema);

// 🔹 Fetch User's FCM Token
// 🔹 Fetch User's FCM Token by user_id instead of email
async function getUserFCMToken(userId) {
  try {
    const user = await mongoose.connection.db.collection("Users").findOne({ user_id: userId });
    return user ? user.fcm_token : null;
  } catch (err) {
    console.error(`❌ Error fetching FCM token for ${userId}:`, err);
    return null;
  }
}

// 🔹 Update FCM Token API (Ensures it updates by user_id instead of email)
app.post("/update-fcm-token", async (req, res) => {
  const { user_id, fcm_token } = req.body;
  if (!user_id || !fcm_token) return res.status(400).json({ error: "Missing user_id or fcm_token" });

  try {
    const db = mongoose.connection.db;
    await db.collection("Users").updateOne(
      { user_id }, // Ensure it's using user_id
      { $set: { fcm_token } },
      { upsert: true }
    );

    res.json({ message: "✅ FCM Token updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err });
  }
});
// 🔹 Send Push Notification
async function sendPushNotification(userId, time) {
  try {
    const token = await getUserFCMToken(userId);
    if (!token) return console.warn(`⚠️ No FCM token found for ${userId}`);

    await admin.messaging().send({
      notification: {
        title: "Hydration Reminder 💧",
        body: `It's time to drink water! Your scheduled time: ${time}`
      },
      token
    });
    console.log(`✅ Notification sent to ${userId} at ${time}`);
  } catch (err) {
    console.error(`❌ Failed to send notification to ${userId}:`, err);
  }
}

// 🔹 Schedule Notifications for Missed Hydration
async function scheduleNotifications() {
  try {
    const now = new Date();
    const todayDate = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    // Fetch hydration records for today
    const users = await HydrationRecord.find({ current_date: todayDate });

    users.forEach(user => {
      user.records.forEach(record => {
        const { scheduled_time, rating } = record;

        if (rating === "Missed" && typeof scheduled_time === "string" && scheduled_time.includes(":")) {
          const timeParts = scheduled_time.split(":").map(Number);
          if (timeParts.length === 2) {
            const [hours, minutes] = timeParts;
            const notificationTime = new Date();
            notificationTime.setHours(hours, minutes, 0, 0); // Set exact time

            // Check if the scheduled time is in the future
            if (notificationTime > now) {
              const cronExpression = `${minutes} ${hours} * * *`;

              cron.schedule(cronExpression, () => {
                sendPushNotification(user.user_id, scheduled_time);
              });

              console.log(`🔔 Scheduled notification for ${user.user_id} at ${scheduled_time}`);
            }
          } else {
            console.warn(`⚠️ Invalid scheduled_time format for ${user.user_id}: ${scheduled_time}`);
          }
        }
      });
    });
  } catch (err) {
    console.error("❌ Error scheduling notifications:", err);
  }
}


// 🔹 ENDPOINTS
// Health Check
app.get("/", (req, res) => res.send("🚀 Server is running!"));

// Update FCM Token
app.post("/update-fcm-token", async (req, res) => {
  const { user_id, fcm_token } = req.body;
  if (!user_id || !fcm_token) return res.status(400).json({ error: "Missing user_id or fcm_token" });

  try {
    const db = mongoose.connection.db;
    await db.collection("Users").updateOne(
      { email: user_id },
      { $set: { fcm_token } },
      { upsert: true }
    );

    res.json({ message: "✅ FCM Token updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err });
  }
});


// Validate JWT (Placeholder, expand as needed)
app.post("/log", (req, res) => res.json({ message: "JWT Validation Not Implemented Yet" }));

// Fetch Hydration Records
app.get("/hydration-records/:userId", async (req, res) => {
  try {
    const records = await HydrationRecord.find({ user_id: req.params.userId });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err });
  }
});

// Add Hydration Record
app.post("/add-hydration-record", async (req, res) => {
  try {
    const record = new HydrationRecord(req.body);
    await record.save();
    res.json({ message: "Hydration record added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err });
  }
});

// 🔹 Start Server and Schedule Notifications
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  scheduleNotifications();
});
