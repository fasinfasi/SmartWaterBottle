from flask import Blueprint, current_app, jsonify, request
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from pymongo import UpdateOne

hydration_bp = Blueprint('hydration_bp', __name__)

# Fetch current water consumption from Temporary_Storage
def fetch_current_consumption(email):
    try:
        mongo = current_app.mongo
        db = mongo.db
        collection = db.Temporary_Storage

        water_status = collection.find_one({"user_id": email})
        if not water_status or not water_status.get('stable', False):
            return 0  # Default to 0 if water status is not found or not stable

        volume = water_status.get('volume', 0)
        return float(volume)
    except Exception as e:
        current_app.logger.error(f"Error fetching current consumption: {e}")
        return 0

# Calculate interval based on user attributes
def calculate_interval(age, sex, weight, activity_level, health_condition, temperature):
    try:
        interval = 30  # Default interval in minutes
        age, weight, temperature = int(age), float(weight), float(temperature)

        if age < 30:
            interval -= 5
        elif age > 60:
            interval += 5

        if sex.lower() == 'female':
            interval -= 2

        if weight > 70:
            interval -= (weight - 70) // 10

        if activity_level.lower() == 'high':
            interval = max(interval - 10, 15)
        elif activity_level.lower() == 'low':
            interval = min(interval + 10, 45)

        if health_condition in ['Kidney Stone', 'Diabetes', 'Pregnancy', 'Breast Feeding']:
            interval = max(interval - 5, 20)
        elif health_condition == 'Liver Diseases':
            interval = max(interval + 5, 25)

        if temperature > 30:
            interval = max(interval - 10, 15)
        elif temperature < 20:
            interval = min(interval + 10, 45)

        return interval
    except Exception as e:
        current_app.logger.error(f"Error calculating interval: {e}")
        return 30

# Generate hydration times based on sleep and interval
def generate_dynamic_hydration_times(sleep_from, sleep_to, interval, time_format='24'):
    try:
        hydration_times = []
        if time_format == '12':
            sleep_from = datetime.strptime(sleep_from.strip(), "%I:%M %p")
            sleep_to = datetime.strptime(sleep_to.strip(), "%I:%M %p")
        else:
            sleep_from = datetime.strptime(sleep_from.strip(), "%H:%M")
            sleep_to = datetime.strptime(sleep_to.strip(), "%H:%M")

        if sleep_to <= sleep_from:
            sleep_to += timedelta(days=1)

        current_time = sleep_to
        end_time = sleep_from + timedelta(days=1)
        while current_time < end_time:
            if not (sleep_from.time() <= current_time.time() < sleep_to.time()):
                hydration_times.append(current_time.strftime("%I:%M %p" if time_format == '12' else "%H:%M"))
            current_time += timedelta(minutes=interval)
        return hydration_times
    except Exception as e:
        current_app.logger.error(f"Error generating hydration times: {e}")
        return []

# Generate and insert hydration schedule
def insert_hydration_schedule_for_user(user):
    try:
        mongo = current_app.mongo
        db = mongo.db
        email = user.get('user_id')
        current_date = datetime.now().strftime("%Y-%m-%d")

        existing_schedule = db.Hydration_Record.find_one({"user_id": email, "current_date": current_date})
        if existing_schedule:
            return

        sleep_time = user.get('sleep_time', {})
        sleep_from = sleep_time.get('start_time')
        sleep_to = sleep_time.get('end_time')
        time_format = sleep_time.get('time_format', '24')

        if not sleep_from or not sleep_to:
            current_app.logger.error(f"Missing sleep times for user: {email}")
            return

        interval = calculate_interval(
            user.get('age'), user.get('sex'), user.get('weight'),
            user.get('activity_level'), user.get('health_condition'), 25
        )
        hydration_schedule = generate_dynamic_hydration_times(sleep_from, sleep_to, interval, time_format)

        db.Hydration_Record.update_one(
    {"user_id": email, "current_date": current_date},
    {
        "$set": {
            "records": [
                {
                    "scheduled_time": time,
                    "amount_drank": 0,
                    "rating": "Missed"
                }
                for time in hydration_schedule
            ]
        }
    },
    upsert=True
)
    except Exception as e:
        current_app.logger.error(f"Error generating hydration schedule: {e}")

# Archive old hydration records
# Archive old hydration records





# Initialize hydration schedules for all users
def initialize_hydration_scheduler():
    try:
        mongo = current_app.mongo
        db = mongo.db
        users = db.Client_Details.find()
        for user in users:
            insert_hydration_schedule_for_user(user)
    except Exception as e:
        current_app.logger.error(f"Error initializing hydration schedules: {e}")

# Calculate hydration ratings and update hydration records

def archive_old_records():
    try:
        current_app.logger.info("Archiving old records...")
        mongo = current_app.mongo
        db = mongo.db
        today_date = datetime.now().strftime("%Y-%m-%d")
        
        # Fetch records that are NOT from today
        old_records = list(db.Hydration_Record.find({"current_date": {"$ne": today_date}}))

        if not old_records:
            current_app.logger.info("No records to archive.")
            return

        # ✅ Print fetched records for debugging
        current_app.logger.info(f"Found {len(old_records)} records for archiving.")
        
        # Process and store old records in Hydration_Record_Archive
        for record in old_records:
            user_id = record.get("user_id")
            current_date = record.get("current_date")
            records = record.get("records", [])

            # Add detailed logging for insertion
            current_app.logger.info(f"Inserting records for user: {user_id}, date: {current_date}")
            
            # Insert data into Hydration_Record_Archive
            db.Hydration_Record_Archive.insert_one({
                "user_id": user_id,
                "current_date": current_date,
                "records": records
            })
            current_app.logger.info(f"Data inserted for user: {user_id}, date: {current_date}")
            
        # Optionally: Delete the old records from Hydration_Record
        old_record_ids = [record["_id"] for record in old_records]
        db.Hydration_Record.delete_many({"_id": {"$in": old_record_ids}})
        current_app.logger.info(f"Deleted {len(old_records)} old records.")

    except Exception as e:
        current_app.logger.error(f"Error archiving records: {e}")


# Function to update hydration records
def update_hydration_record(email, hydration_schedule, consumption_data):
    """
    Updates the Hydration_Record collection based on the hydration schedule and consumption data.

    :param email: The user's email (user_id).
    :param hydration_schedule: List of scheduled times with expected hydration.
    :param consumption_data: Water consumed at different times.
    """
    try:
        mongo = current_app.mongo
        db = mongo.db
        current_date = datetime.now().strftime("%Y-%m-%d")

        # Prepare updates for each scheduled time
        updates = []
        for schedule in hydration_schedule:
            scheduled_time = schedule["time"]
            amount_drank = consumption_data.get(scheduled_time, 0)  # Default to 0 if no data
            rating = "Missed" if amount_drank == 0 else calculate_rating(scheduled_time, datetime.now(), amount_drank)

            # Create an update operation for the scheduled time
            updates.append(
                UpdateOne(
                    {"user_id": email, "current_date": current_date, "schedule.time": scheduled_time},
                    {
                        "$set": {
                            "schedule.$.amount_drank": amount_drank,
                            "schedule.$.rating": rating,
                        }
                    },
                    upsert=True
                )
            )

        # Execute all updates in bulk
        db.Hydration_Record.bulk_write(updates)
        return True

    except Exception as e:
        current_app.logger.error(f"Error updating hydration record: {e}")
        return False


def calculate_rating(scheduled_time, actual_time, amount_drank, threshold=80):
    """
    Calculates a hydration rating based on the scheduled time, actual time, and amount drank.

    :param scheduled_time: The scheduled hydration time.
    :param actual_time: The actual time when the hydration was measured.
    :param amount_drank: The amount of water consumed.
    :param threshold: The minimum amount of water required to consider it as "consumed" (default: 80 ml).
    :return: A rating based on hydration.
    """
    try:
        # If the amount drank is less than the threshold, it's considered "Missed"
        if amount_drank < threshold:
            return "Missed"

        # Calculate the time difference between the scheduled and actual times
        time_diff = (datetime.strptime(actual_time, "%H:%M") - datetime.strptime(scheduled_time, "%H:%M")).seconds / 60

        # Rating based on time difference
        if time_diff <= 5:
            return "Outstanding"
        elif time_diff <= 10:
            return "Excellent"
        elif time_diff <= 20:
            return "Good"
        elif time_diff <= 30:
            return "Average"
        else:
            return "Missed"  # If it's more than 30 minutes late

    except Exception as e:
        current_app.logger.error(f"Error calculating rating: {e}")
        return "Unknown"


# Scheduler setup
scheduler = BackgroundScheduler()

scheduler.add_job(initialize_hydration_scheduler, 'interval', minutes=1)
scheduler.add_job(archive_old_records, 'interval', minutes=1)
scheduler.start()
