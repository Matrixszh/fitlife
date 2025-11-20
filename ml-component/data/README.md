# Dataset Instructions

To use the ML component, you need to create a dataset file `workout_activities.arff` in this directory.

## Dataset Format

The dataset should be in ARFF (Attribute-Relation File Format) format with the following structure:

```
@relation workout_activities

@attribute duration numeric
@attribute distance numeric
@attribute calories numeric
@attribute activityType {Running,Cycling,Walking,Gym_Workout}

@data
30,5.2,320,Running
45,15.0,450,Cycling
60,4.0,200,Walking
50,0,380,Gym_Workout
...
```

## Requirements

- At least 50-100 rows of data
- Balanced representation of all activity types:
  - Running
  - Cycling
  - Walking
  - Gym_Workout

## Sample Data Guidelines

- **Running**: Duration 15-60 mins, Distance 2-10 km, Calories 150-600
- **Cycling**: Duration 20-90 mins, Distance 5-30 km, Calories 200-800
- **Walking**: Duration 20-90 mins, Distance 2-8 km, Calories 100-400
- **Gym_Workout**: Duration 30-120 mins, Distance 0, Calories 200-600

You can generate this dataset using:
- Python with Faker library
- Excel
- Manual entry
- AI tools

## Training the Model

Once you have the dataset, run:

```bash
cd ml-component
mvn compile exec:java -Dexec.mainClass="com.fitlife.ml.ActivityClassifier" -Dexec.args="data/workout_activities.arff"
```

This will train the model and save it to `models/activity_classifier.model`.

