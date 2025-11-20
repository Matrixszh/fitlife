"""
Generate workout_activities.arff dataset for WEKA
This script generates balanced workout data for activity classification
"""

import random
from datetime import datetime, timedelta

def generate_running_data(count=25):
    """Generate Running workout data"""
    data = []
    for _ in range(count):
        duration = random.randint(15, 60)  # 15-60 minutes
        distance = round(random.uniform(2.0, 10.0), 1)  # 2-10 km
        # Calories: roughly 60-100 calories per km for running
        calories = int(distance * random.uniform(60, 100))
        data.append((duration, distance, calories, "Running"))
    return data

def generate_cycling_data(count=25):
    """Generate Cycling workout data"""
    data = []
    for _ in range(count):
        duration = random.randint(20, 90)  # 20-90 minutes
        distance = round(random.uniform(5.0, 30.0), 1)  # 5-30 km
        # Calories: roughly 20-40 calories per km for cycling
        calories = int(distance * random.uniform(20, 40))
        data.append((duration, distance, calories, "Cycling"))
    return data

def generate_walking_data(count=25):
    """Generate Walking workout data"""
    data = []
    for _ in range(count):
        duration = random.randint(20, 90)  # 20-90 minutes
        distance = round(random.uniform(2.0, 8.0), 1)  # 2-8 km
        # Calories: roughly 30-50 calories per km for walking
        calories = int(distance * random.uniform(30, 50))
        data.append((duration, distance, calories, "Walking"))
    return data

def generate_gym_workout_data(count=25):
    """Generate Gym Workout data"""
    data = []
    for _ in range(count):
        duration = random.randint(30, 120)  # 30-120 minutes
        distance = 0.0  # No distance for gym workouts
        # Calories: 200-600 for gym workouts based on duration and intensity
        calories = int(duration * random.uniform(5, 8))
        data.append((duration, distance, calories, "Gym_Workout"))
    return data

def generate_arff_file(filename="workout_activities.arff", total_rows=100):
    """Generate ARFF file with workout data"""
    
    # Calculate rows per activity type
    rows_per_type = total_rows // 4
    remaining = total_rows % 4
    
    # Generate data for each activity type
    all_data = []
    all_data.extend(generate_running_data(rows_per_type + (1 if remaining > 0 else 0)))
    all_data.extend(generate_cycling_data(rows_per_type + (1 if remaining > 1 else 0)))
    all_data.extend(generate_walking_data(rows_per_type + (1 if remaining > 2 else 0)))
    all_data.extend(generate_gym_workout_data(rows_per_type))
    
    # Shuffle the data
    random.shuffle(all_data)
    
    # Write ARFF file
    with open(filename, 'w') as f:
        # Write header
        f.write("@relation workout_activities\n\n")
        f.write("@attribute duration numeric\n")
        f.write("@attribute distance numeric\n")
        f.write("@attribute calories numeric\n")
        f.write("@attribute activityType {Running,Cycling,Walking,Gym_Workout}\n\n")
        f.write("@data\n")
        
        # Write data
        for duration, distance, calories, activity_type in all_data:
            f.write(f"{duration},{distance},{calories},{activity_type}\n")
    
    print(f"✓ Generated {filename} with {len(all_data)} rows")
    print(f"  - Running: {sum(1 for d in all_data if d[3] == 'Running')} rows")
    print(f"  - Cycling: {sum(1 for d in all_data if d[3] == 'Cycling')} rows")
    print(f"  - Walking: {sum(1 for d in all_data if d[3] == 'Walking')} rows")
    print(f"  - Gym_Workout: {sum(1 for d in all_data if d[3] == 'Gym_Workout')} rows")

if __name__ == "__main__":
    import sys
    
    # Set random seed for reproducibility
    random.seed(42)
    
    # Get number of rows from command line or use default
    num_rows = 100
    if len(sys.argv) > 1:
        try:
            num_rows = int(sys.argv[1])
            if num_rows < 50:
                print("Warning: Minimum 50 rows recommended for good model performance")
        except ValueError:
            print("Invalid number of rows. Using default: 100")
    
    generate_arff_file("workout_activities.arff", num_rows)
    print("\nDataset generated successfully!")
    print("You can now train the ML model using:")
    print("  mvn exec:java -Dexec.mainClass=\"com.fitlife.ml.ActivityClassifier\" -Dexec.args=\"data/workout_activities.arff\"")

