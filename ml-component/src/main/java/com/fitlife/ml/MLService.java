package com.fitlife.ml;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import weka.classifiers.Classifier;
import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;
import weka.core.SerializationHelper;

import java.io.File;

/**
 * ML Service for REST API integration
 * Provides methods to load model and make predictions
 */
public class MLService {
    private Classifier classifier;
    private Instances dataStructure;
    private static MLService instance;
    private Gson gson;
    
    private MLService() {
        this.gson = new Gson();
    }
    
    public static MLService getInstance() {
        if (instance == null) {
            instance = new MLService();
        }
        return instance;
    }
    
    /**
     * Initialize the service by loading the trained model
     */
    public void initialize(String modelPath, String datasetPath) throws Exception {
        // Load model
        File modelFile = new File(modelPath);
        if (!modelFile.exists()) {
            throw new Exception("Model file not found: " + modelPath);
        }
        
        classifier = (Classifier) SerializationHelper.read(modelPath);
        
        // Load dataset structure (needed for creating prediction instances)
        DataSource source = new DataSource(datasetPath);
        dataStructure = source.getDataSet();
        if (dataStructure.classIndex() == -1) {
            dataStructure.setClassIndex(dataStructure.numAttributes() - 1);
        }
        
        System.out.println("ML Service initialized successfully");
    }
    
    /**
     * Predict activity type from JSON input
     */
    public String predict(String jsonInput) throws Exception {
        if (classifier == null || dataStructure == null) {
            throw new IllegalStateException("ML Service not initialized");
        }
        
        JsonObject json = JsonParser.parseString(jsonInput).getAsJsonObject();
        
        double duration = json.get("duration").getAsDouble();
        double distance = json.has("distance") ? json.get("distance").getAsDouble() : 0.0;
        double calories = json.get("calories").getAsDouble();
        
        return predict(duration, distance, calories);
    }
    
    /**
     * Predict activity type from individual parameters
     */
    public String predict(double duration, double distance, double calories) throws Exception {
        if (classifier == null || dataStructure == null) {
            throw new IllegalStateException("ML Service not initialized");
        }
        
        // Create instance
        weka.core.Instance instance = new weka.core.Instance(dataStructure.numAttributes());
        instance.setDataset(dataStructure);
        
        instance.setValue(0, duration);
        instance.setValue(1, distance);
        instance.setValue(2, calories);
        
        // Classify
        double prediction = classifier.classifyInstance(instance);
        String predictedClass = dataStructure.classAttribute().value((int) prediction);
        
        return predictedClass;
    }
    
    /**
     * Get prediction with confidence
     */
    public PredictionResult predictWithConfidence(double duration, double distance, double calories) 
            throws Exception {
        if (classifier == null || dataStructure == null) {
            throw new IllegalStateException("ML Service not initialized");
        }
        
        weka.core.Instance instance = new weka.core.Instance(dataStructure.numAttributes());
        instance.setDataset(dataStructure);
        
        instance.setValue(0, duration);
        instance.setValue(1, distance);
        instance.setValue(2, calories);
        
        double prediction = classifier.classifyInstance(instance);
        double[] distribution = classifier.distributionForInstance(instance);
        double confidence = distribution[(int) prediction];
        
        String predictedClass = dataStructure.classAttribute().value((int) prediction);
        
        return new PredictionResult(predictedClass, confidence);
    }
    
    /**
     * Prediction result class
     */
    public static class PredictionResult {
        private String activityType;
        private double confidence;
        
        public PredictionResult(String activityType, double confidence) {
            this.activityType = activityType;
            this.confidence = confidence;
        }
        
        public String getActivityType() {
            return activityType;
        }
        
        public double getConfidence() {
            return confidence;
        }
        
        public String toJson() {
            JsonObject json = new JsonObject();
            json.addProperty("predictedActivity", activityType);
            json.addProperty("confidence", confidence);
            return json.toString();
        }
    }
}

