// Required modules
const mongoose = require('mongoose');
const moment = require('moment');
require('dotenv').config();  // Load .env file

// MongoDB connection using .env variable
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Schemas
const temporaryStorageSchema = new mongoose.Schema({
    user_id: String,
    type: String,
    percentage: String,
    stable: Boolean,
    volume: String,
}, { collection: 'Temporary_Storage' });

const hydrationRecordSchema = new mongoose.Schema({
    user_id: String,
    current_date: String,
    records: [
        {
            scheduled_time: String,
            amount_drank: Number,
            rating: String,
        },
    ],
}, { collection: 'Hydration_Record' });

const hydrationRecordArchiveSchema = new mongoose.Schema({
    user_id: String,
    current_date: String,
    records: [
        {
            scheduled_time: String,
            drank: Number,
        },
    ],
}, { collection: 'Hydration_Record_Archive' });

const TemporaryStorage = mongoose.model('Temporary_Storage', temporaryStorageSchema);
const HydrationRecord = mongoose.model('Hydration_Record', hydrationRecordSchema);
const HydrationRecordArchive = mongoose.model('Hydration_Record_Archive', hydrationRecordArchiveSchema);

// Rating logic based on time difference and amount drank
const getRating = (timeDiff, amountDrank) => {
    if (amountDrank < 80) return 'Missed';
    if (timeDiff <= 5) return 'Outstanding';
    if (timeDiff <= 10) return 'Excellent';
    if (timeDiff <= 20) return 'Good';
    if (timeDiff <= 30) return 'Average';
    return 'Missed';
};

// Core function to update hydration records for all users
async function updateHydrationRecords() {
    try {
        const tempDataList = await TemporaryStorage.find({ type: 'water_status' });

        if (!tempDataList.length) {
            console.log('No data found in Temporary_Storage');
            return;
        }

        for (const tempData of tempDataList) {
            const userId = tempData.user_id;

            if (tempData.stable !== true) {
                console.log(`Data is not stable yet for ${userId}, waiting...`);
                continue;  // Skip to the next user if data is not stable
            }

            const currentVolume = parseFloat(tempData.volume);
            const currentTime = moment();
            const hydrationData = await HydrationRecord.findOne({
                user_id: userId,
                current_date: moment().format('YYYY-MM-DD'),
            });

            if (!hydrationData) {
                console.log(`No data found in Hydration_Record for ${userId}`);
                continue;
            }

            let previousVolume = 0;  // Initialize previousVolume for each user
            let archiveRecords = [];

            for (let i = 0; i < hydrationData.records.length; i++) {
                const record = hydrationData.records[i];
                const nextRecord = hydrationData.records[i + 1];
                const scheduledTime = moment(record.scheduled_time, 'HH:mm');
                const nextScheduledTime = nextRecord ? moment(nextRecord.scheduled_time, 'HH:mm') : null;

                if (
                    currentTime.isSameOrAfter(scheduledTime) &&
                    (nextScheduledTime ? currentTime.isBefore(nextScheduledTime) : true) &&
                    record.amount_drank === 0
                ) {
                    const timeDiff = Math.abs(currentTime.diff(scheduledTime, 'minutes'));

                    // Modified consumedVolume calculation
                    let consumedVolume;
                    if (previousVolume === 0 && currentVolume > 0) {
                        consumedVolume = currentVolume;  // Directly take currentVolume if previous is 0
                    } else {
                        consumedVolume = currentVolume - previousVolume;  // Subtract if previousVolume is not 0
                    }

                    if (consumedVolume > 0) {
                        record.amount_drank = consumedVolume;
                        record.rating = getRating(timeDiff, consumedVolume);
                        console.log(`Updated record for ${record.scheduled_time} (${userId}) - Drank: ${consumedVolume} ml, Rating: ${record.rating}`);

                        // Store difference in Hydration_Record_Archive
                        archiveRecords.push({
                            scheduled_time: record.scheduled_time,
                            drank: consumedVolume,
                        });

                        // Update previousVolume only after processing
                        previousVolume = currentVolume;
                    } else {
                        console.log(`No new water consumed at ${record.scheduled_time} for ${userId}`);
                    }
                }
            }

            await hydrationData.save();

            // Save to Hydration_Record_Archive if there are records to save
            if (archiveRecords.length > 0) {
                await HydrationRecordArchive.updateOne(
                    { user_id: userId, current_date: moment().format('YYYY-MM-DD') },
                    { $push: { records: { $each: archiveRecords } } },
                    { upsert: true }
                );
                console.log(`Hydration_Record_Archive updated successfully for ${userId}.`);
            }

            console.log(`Hydration records updated successfully for ${userId}.`);
        }
    } catch (error) {
        console.error('Error updating hydration records:', error);
    }
}

// Run the update function every 60 seconds
setInterval(updateHydrationRecords, 60000);

// Keep the server running
setInterval(() => {
    console.log('Server is running...');
}, 8082);
