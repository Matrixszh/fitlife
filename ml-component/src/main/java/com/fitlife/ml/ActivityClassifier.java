package com.fitlife.ml;

import weka.classifiers.Classifier;
import weka.classifiers.Evaluation;
import weka.classifiers.trees.J48;
import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.NumericToNominal;

import java.io.File;
import java.util.Random;

/**
 * Activity Classifier using WEKA
 * Trains a classification model to predict activity type based on workout attributes
 */
public class ActivityClassifier {
    private Classifier classifier;
    private Instances trainingData;
    
    public ActivityClassifier() {
        this.classifier = new J48(); // Decision Tree classifier
    }
    
    /**
     * Load dataset from ARFF file
     */
    public void loadDataset(String filePath) throws Exception {
        DataSource source = new DataSource(filePath);
        trainingData = source.getDataSet();
        
        // Set the class attribute (last attribute)
        if (trainingData.classIndex() == -1) {
            trainingData.setClassIndex(trainingData.numAttributes() - 1);
        }
    }
    
    /**
     * Train the classifier
     */
    public void train() throws Exception {
        if (trainingData == null) {
            throw new IllegalStateException("Dataset must be loaded before training");
        }
        
        System.out.println("Training classifier...");
        System.out.println("Dataset size: " + trainingData.numInstances() + " instances");
        System.out.println("Number of attributes: " + trainingData.numAttributes());
        System.out.println("Class attribute: " + trainingData.classAttribute().name());
        
        classifier.buildClassifier(trainingData);
        System.out.println("Training completed!");
    }
    
    /**
     * Evaluate the classifier using cross-validation
     */
    public void evaluate(int folds) throws Exception {
        if (classifier == null || trainingData == null) {
            throw new IllegalStateException("Classifier must be trained before evaluation");
        }
        
        System.out.println("\nEvaluating classifier with " + folds + "-fold cross-validation...");
        
        Evaluation eval = new Evaluation(trainingData);
        eval.crossValidateModel(classifier, trainingData, folds, new Random(1));
        
        // Print evaluation results
        System.out.println("\n=== Evaluation Results ===");
        System.out.println("Correctly Classified Instances: " + 
            String.format("%.2f", eval.correct()) + " (" + 
            String.format("%.2f", eval.pctCorrect()) + "%)");
        System.out.println("Incorrectly Classified Instances: " + 
            String.format("%.2f", eval.incorrect()) + " (" + 
            String.format("%.2f", eval.pctIncorrect()) + "%)");
        System.out.println("\n=== Detailed Accuracy by Class ===");
        System.out.println(eval.toClassDetailsString());
        System.out.println("\n=== Confusion Matrix ===");
        System.out.println(eval.toMatrixString());
        
        // Print precision, recall, F-measure
        System.out.println("\n=== Precision, Recall, F-Measure ===");
        for (int i = 0; i < trainingData.numClasses(); i++) {
            String className = trainingData.classAttribute().value(i);
            System.out.println(className + ":");
            System.out.println("  Precision: " + String.format("%.4f", eval.precision(i)));
            System.out.println("  Recall: " + String.format("%.4f", eval.recall(i)));
            System.out.println("  F-Measure: " + String.format("%.4f", eval.fMeasure(i)));
        }
    }
    
    /**
     * Predict activity type for given attributes
     */
    public String predict(double duration, double distance, double calories) throws Exception {
        if (classifier == null || trainingData == null) {
            throw new IllegalStateException("Classifier must be trained before prediction");
        }
        
        // Create a new instance with the same structure as training data
        weka.core.Instance instance = new weka.core.DenseInstance(trainingData.numAttributes());
        instance.setDataset(trainingData);
        
        // Set attribute values (assuming order: duration, distance, calories, activityType)
        instance.setValue(0, duration);  // duration
        instance.setValue(1, distance);   // distance
        instance.setValue(2, calories);   // calories
        
        // Classify the instance
        double prediction = classifier.classifyInstance(instance);
        String predictedClass = trainingData.classAttribute().value((int) prediction);
        
        // Get prediction distribution
        double[] distribution = classifier.distributionForInstance(instance);
        double confidence = distribution[(int) prediction];
        
        System.out.println("Prediction: " + predictedClass + " (confidence: " + 
            String.format("%.2f", confidence * 100) + "%)");
        
        return predictedClass;
    }
    
    /**
     * Save the trained model
     */
    public void saveModel(String filePath) throws Exception {
        weka.core.SerializationHelper.write(filePath, classifier);
        System.out.println("Model saved to: " + filePath);
    }
    
    /**
     * Load a saved model
     */
    public void loadModel(String filePath) throws Exception {
        classifier = (Classifier) weka.core.SerializationHelper.read(filePath);
        System.out.println("Model loaded from: " + filePath);
    }
    
    public static void main(String[] args) {
        try {
            ActivityClassifier classifier = new ActivityClassifier();
            
            // Load dataset
            String datasetPath = "data/workout_activities.arff";
            if (args.length > 0) {
                datasetPath = args[0];
            }
            
            File datasetFile = new File(datasetPath);
            if (!datasetFile.exists()) {
                System.err.println("Dataset file not found: " + datasetPath);
                System.err.println("Please ensure the dataset file exists.");
                System.exit(1);
            }
            
            classifier.loadDataset(datasetPath);
            
            // Train the classifier
            classifier.train();
            
            // Evaluate the classifier
            classifier.evaluate(10);
            
            // Test predictions
            System.out.println("\n=== Test Predictions ===");
            System.out.println("\nTest 1: Duration=30, Distance=5.2, Calories=320");
            classifier.predict(30, 5.2, 320);
            
            System.out.println("\nTest 2: Duration=45, Distance=15.0, Calories=450");
            classifier.predict(45, 15.0, 450);
            
            System.out.println("\nTest 3: Duration=50, Distance=0, Calories=380");
            classifier.predict(50, 0, 380);
            
            // Save the model
            classifier.saveModel("models/activity_classifier.model");
            
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

