# Testing the ML Server

## Step 1: Start the ML Server

Navigate to the ml-component directory and run:

```bash
cd ml-component
mvn exec:java "-Dexec.mainClass=com.fitlife.ml.MLServer" "-Dexec.args=models/activity_classifier.model data/workout_activities.arff"
```

You should see:
```
ML Server started on http://localhost:8080
Endpoints:
  GET  /health - Health check
  POST /api/predict - Predict activity type
```

## Step 2: Test the Server

### Option 1: Test Health Endpoint (Browser)

Open your browser and go to:
```
http://localhost:8080/health
```

You should see:
```json
{
  "status": "ok",
  "service": "FitLife ML Service"
}
```

### Option 2: Test Health Endpoint (PowerShell)

```powershell
Invoke-WebRequest -Uri "http://localhost:8080/health" -Method GET
```

Or using curl (if available):
```bash
curl http://localhost:8080/health
```

### Option 3: Test Prediction Endpoint (PowerShell)

```powershell
$body = @{
    duration = 30
    distance = 5.2
    calories = 320
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/predict" -Method POST -Body $body -ContentType "application/json"
```

### Option 4: Test Prediction Endpoint (curl)

```bash
curl -X POST http://localhost:8080/api/predict \
  -H "Content-Type: application/json" \
  -d "{\"duration\": 30, \"distance\": 5.2, \"calories\": 320}"
```

Expected response:
```json
{
  "predictedActivity": "Running",
  "confidence": 0.85
}
```

## Step 3: Check if Server is Running

### Check if port 8080 is in use:

**PowerShell:**
```powershell
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
```

**Command Prompt:**
```cmd
netstat -ano | findstr :8080
```

If you see output, the port is in use (server might be running).

## Troubleshooting

### Server won't start:
- Make sure the model file exists: `models/activity_classifier.model`
- Make sure the dataset exists: `data/workout_activities.arff`
- Check for Java errors in the console

### Connection refused:
- Server is not running - start it first
- Check if another application is using port 8080
- Try a different port by modifying MLServer.java

### 404 Not Found:
- Check the endpoint URL is correct
- Make sure you're using the right HTTP method (GET for /health, POST for /api/predict)

