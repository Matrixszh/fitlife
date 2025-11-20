package com.fitlife.ml;

import static spark.Spark.*;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/**
 * REST API Server for ML predictions
 * Run this server to provide ML prediction endpoints
 */
public class MLServer {
    private static final int PORT = 8080;
    private static MLService mlService;
    private static Gson gson = new Gson();
    
    public static void main(String[] args) {
        try {
            // Initialize ML Service
            mlService = MLService.getInstance();
            
            // Load model and dataset
            String modelPath = "models/activity_classifier.model";
            String datasetPath = "data/workout_activities.arff";
            
            if (args.length >= 2) {
                modelPath = args[0];
                datasetPath = args[1];
            }
            
            mlService.initialize(modelPath, datasetPath);
            
            // Configure Spark
            port(PORT);
            enableCORS();
            
            // Health check endpoint
            get("/health", (req, res) -> {
                res.type("application/json");
                JsonObject response = new JsonObject();
                response.addProperty("status", "ok");
                response.addProperty("service", "FitLife ML Service");
                return response.toString();
            });
            
            // Prediction endpoint
            post("/api/predict", (req, res) -> {
                res.type("application/json");
                try {
                    String body = req.body();
                    MLService.PredictionResult result = mlService.predictWithConfidence(
                        getDoubleFromJson(body, "duration"),
                        getDoubleFromJson(body, "distance", 0.0),
                        getDoubleFromJson(body, "calories")
                    );
                    return result.toJson();
                } catch (Exception e) {
                    res.status(400);
                    JsonObject error = new JsonObject();
                    error.addProperty("error", e.getMessage());
                    return error.toString();
                }
            });
            
            System.out.println("ML Server started on http://localhost:" + PORT);
            System.out.println("Endpoints:");
            System.out.println("  GET  /health - Health check");
            System.out.println("  POST /api/predict - Predict activity type");
            
        } catch (Exception e) {
            System.err.println("Failed to start ML Server: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
    
    private static double getDoubleFromJson(String json, String key) {
        return getDoubleFromJson(json, key, null);
    }
    
    private static double getDoubleFromJson(String json, String key, Double defaultValue) {
        JsonObject obj = JsonParser.parseString(json).getAsJsonObject();
        if (obj.has(key) && !obj.get(key).isJsonNull()) {
            return obj.get(key).getAsDouble();
        }
        if (defaultValue != null) {
            return defaultValue;
        }
        throw new IllegalArgumentException("Missing required field: " + key);
    }
    
    private static void enableCORS() {
        options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }
            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }
            return "OK";
        });
        
        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
        });
    }
}

