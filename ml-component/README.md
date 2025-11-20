# FitLife ML Component

Machine Learning component for activity classification using WEKA.

## Prerequisites

- Java 11 or higher
- Maven 3.6+

## Setup

1. **Prepare Dataset**
   - Create `data/workout_activities.arff` file
   - See `data/README.md` for format requirements
   - Ensure at least 50-100 rows with balanced activity types

2. **Build Project**
   ```bash
   mvn clean compile
   ```

3. **Train Model**
   ```bash
   mvn exec:java -Dexec.mainClass="com.fitlife.ml.ActivityClassifier" -Dexec.args="data/workout_activities.arff"
   ```
   This will:
   - Load the dataset
   - Train a J48 decision tree classifier
   - Evaluate with 10-fold cross-validation
   - Save the model to `models/activity_classifier.model`

4. **Start ML Server**
   ```bash
   mvn exec:java -Dexec.mainClass="com.fitlife.ml.MLServer" -Dexec.args="models/activity_classifier.model data/workout_activities.arff"
   ```
   Server runs on `http://localhost:8080`

## Classes

- **ActivityClassifier**: Main class for training and evaluating the model
- **MLService**: Service layer for making predictions
- **MLServer**: REST API server for HTTP predictions

## API Usage

### Health Check
```bash
curl http://localhost:8080/health
```

### Predict Activity
```bash
curl -X POST http://localhost:8080/api/predict \
  -H "Content-Type: application/json" \
  -d '{"duration": 30, "distance": 5.2, "calories": 320}'
```

Response:
```json
{
  "predictedActivity": "Running",
  "confidence": 0.85
}
```

## Model Evaluation

The classifier uses:
- **Algorithm**: J48 (C4.5 Decision Tree)
- **Evaluation**: 10-fold cross-validation
- **Metrics**: Accuracy, Precision, Recall, F-Measure, Confusion Matrix

## Notes

- Ensure the dataset file exists before training
- The model file will be created in `models/` directory
- Both model and dataset paths are required for the server

