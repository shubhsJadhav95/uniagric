#!/usr/bin/env python
import pandas as pd
import numpy as np
import joblib
import os
import logging
import matplotlib.pyplot as plt
from matplotlib.figure import Figure
import matplotlib
matplotlib.use('Agg')  # For non-interactive mode
import base64
from io import BytesIO
import seaborn as sns

# Set up logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Define paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(SCRIPT_DIR, 'models')
MODEL_PATH = os.path.join(MODEL_DIR, 'farm_plan_model.joblib')
ENCODER_PATH = os.path.join(MODEL_DIR, 'farm_plan_encoders.joblib')
SCALER_PATH = os.path.join(MODEL_DIR, 'farm_plan_scaler.joblib')
PLOT_DIR = os.path.join(SCRIPT_DIR, 'plots')
os.makedirs(PLOT_DIR, exist_ok=True)

def load_models():
    """Loads the trained model and preprocessors"""
    logger.info("Loading model and preprocessors")
    
    try:
        model = joblib.load(MODEL_PATH)
        label_encoders = joblib.load(ENCODER_PATH)
        scaler = joblib.load(SCALER_PATH)
        
        logger.info("Model and preprocessors loaded successfully")
        return model, label_encoders, scaler
    except Exception as e:
        logger.error("Error loading model: %s", str(e))
        raise

def get_valid_input(prompt, options=None):
    """Gets valid input from the user"""
    while True:
        value = input(prompt)
        
        if options and value.lower() not in options:
            print(f"Invalid input. Please choose from: {', '.join(options)}")
        else:
            return value.lower()

def preprocess_input(data, label_encoders, scaler):
    """Preprocesses the input data"""
    # Convert input to DataFrame
    input_df = pd.DataFrame([data])
    
    # Encode categorical variables
    for col, encoder in label_encoders.items():
        if col in input_df.columns:
            try:
                input_df[col] = encoder.transform([input_df[col].iloc[0]])
            except ValueError:
                # Handle unknown categories
                print(f"Warning: Unknown category '{input_df[col].iloc[0]}' for {col}.")
                print(f"Available categories: {encoder.classes_}")
                return None
    
    # Scale numerical features
    numerical_cols = ['area_hectares', 'yield_per_hectare']
    if all(col in input_df.columns for col in numerical_cols):
        input_df[numerical_cols] = scaler.transform(input_df[numerical_cols])
    
    return input_df

def show_probability_bar(prob):
    """Displays probability as a colored progress bar"""
    probability = prob * 100
    bar_length = 20
    filled_length = int(bar_length * probability / 100)
    
    bar = '█' * filled_length + '-' * (bar_length - filled_length)
    color = '\033[92m' if probability >= 70 else '\033[93m' if probability >= 40 else '\033[91m'
    reset = '\033[0m'
    
    print(f"\nApproval Probability: {color}{bar}{reset} {probability:.1f}%")
    print("  Low                  High")

def plot_probability(prob):
    """Creates and saves a probability plot"""
    plt.figure(figsize=(8, 4))
    
    # Create gauge chart
    plt.subplot(1, 2, 1)
    gauge = np.linspace(0, 100, 100)
    angle = np.linspace(-3*np.pi/4, 3*np.pi/4, 100)
    x = np.cos(angle)
    y = np.sin(angle)
    
    cmap = plt.cm.RdYlGn
    color_norm = plt.Normalize(0, 100)
    colors = cmap(color_norm(gauge))
    
    plt.scatter(x, y, c=colors, s=300, alpha=0.8)
    
    # Add needle
    probability = prob * 100
    needle_angle = -3*np.pi/4 + 3*np.pi/2 * (probability / 100)
    needle_x = [0, 0.8 * np.cos(needle_angle)]
    needle_y = [0, 0.8 * np.sin(needle_angle)]
    plt.plot(needle_x, needle_y, 'k-', linewidth=4)
    plt.plot([0], [0], 'ko', markersize=10)
    
    plt.text(0, -0.2, f"{probability:.1f}%", ha='center', va='center', fontsize=16, fontweight='bold')
    plt.axis('equal')
    plt.axis('off')
    
    # Create bar chart
    plt.subplot(1, 2, 2)
    sns.barplot(x=['Rejection', 'Approval'], y=[1-prob, prob], palette=['#d9534f', '#5cb85c'])
    plt.ylim(0, 1)
    plt.title('Prediction Probability')
    
    # Add percentage labels
    plt.text(0, 1-prob/2, f"{(1-prob)*100:.1f}%", ha='center', va='center', fontsize=12, fontweight='bold')
    plt.text(1, prob/2, f"{prob*100:.1f}%", ha='center', va='center', fontsize=12, fontweight='bold')
    
    plt.tight_layout()
    
    # Save the plot
    timestamp = pd.Timestamp.now().strftime("%Y%m%d_%H%M%S")
    filename = os.path.join(PLOT_DIR, f"farm_plan_prediction_{timestamp}.png")
    plt.savefig(filename)
    plt.close()
    
    logger.info(f"Probability plot saved as {filename}")
    return filename

def get_recommendation(prob, data):
    """Provides recommendations based on prediction probability"""
    recommendations = []
    
    if prob < 0.3:
        recommendations.append("Your farm plan has a low approval probability.")
        
        # Provide specific recommendations based on data
        if data['yield_per_hectare'] < 3:
            recommendations.append("Consider crops with higher yield potential for your land area.")
        
        if data['crop_type'] == 'cotton' and data['climate'] == 'arid':
            recommendations.append("Cotton in arid regions often requires extensive irrigation. Consider alternative crops or improved irrigation systems.")
        
        recommendations.append("Review your farm plan and consider consulting with an agricultural extension officer.")
    
    elif prob < 0.7:
        recommendations.append("Your farm plan has a moderate approval probability.")
        
        if data['soil_type'] == 'sandy' and data['yield_per_hectare'] < 5:
            recommendations.append("Sandy soils often require additional fertility management. Consider soil amendments or alternative crops.")
        
        recommendations.append("With some improvements, your plan could have a higher chance of approval.")
    
    else:
        recommendations.append("Your farm plan has a high approval probability.")
        recommendations.append("Continue with your current approach, which shows strong potential for success.")
    
    return recommendations

def predict_approval(model, input_data):
    """Predicts approval based on input data"""
    try:
        # Get prediction probability
        prob = model.predict_proba(input_data)[0][1]
        
        # Convert input data back to unprocessed form for recommendations
        # This is a simplified version; in a real app you'd reverse the preprocessing
        original_data = {
            'crop_type': input_data.columns[0],  # Simplified
            'soil_type': input_data.columns[1],  # Simplified
            'climate': input_data.columns[2],    # Simplified
            'area_hectares': input_data.iloc[0, 3],
            'yield_per_hectare': input_data.iloc[0, 4]
        }
        
        # Make prediction
        prediction = model.predict(input_data)[0]
        
        return {
            'prediction': bool(prediction),
            'probability': float(prob),
            'recommendations': get_recommendation(prob, original_data)
        }
    except Exception as e:
        logger.error("Error making prediction: %s", str(e))
        raise

def main():
    """Main function to execute the prediction process"""
    logger.info("Starting farm plan prediction")
    
    try:
        # Load model and preprocessors
        model, label_encoders, scaler = load_models()
        
        # Get user input
        print("\n===== Farm Plan Approval Prediction =====\n")
        
        # Define options for categorical variables
        crop_options = list(label_encoders['crop_type'].classes_)
        soil_options = list(label_encoders['soil_type'].classes_)
        climate_options = list(label_encoders['climate'].classes_)
        
        print(f"Available crop types: {', '.join(crop_options)}")
        crop_type = get_valid_input("Enter crop type: ", crop_options)
        
        print(f"\nAvailable soil types: {', '.join(soil_options)}")
        soil_type = get_valid_input("Enter soil type: ", soil_options)
        
        print(f"\nAvailable climate types: {', '.join(climate_options)}")
        climate = get_valid_input("Enter climate type: ", climate_options)
        
        # Get numerical inputs
        while True:
            try:
                area_hectares = float(input("\nEnter area in hectares: "))
                if area_hectares <= 0:
                    print("Area must be greater than 0.")
                    continue
                break
            except ValueError:
                print("Please enter a valid number.")
        
        while True:
            try:
                yield_per_hectare = float(input("Enter expected yield per hectare: "))
                if yield_per_hectare <= 0:
                    print("Yield must be greater than 0.")
                    continue
                break
            except ValueError:
                print("Please enter a valid number.")
        
        # Prepare input data
        input_data = {
            'crop_type': crop_type,
            'soil_type': soil_type,
            'climate': climate,
            'area_hectares': area_hectares,
            'yield_per_hectare': yield_per_hectare
        }
        
        # Preprocess input
        processed_input = preprocess_input(input_data, label_encoders, scaler)
        
        if processed_input is None:
            print("Error processing input. Please try again with valid values.")
            return
        
        # Make prediction
        result = predict_approval(model, processed_input)
        
        # Display result
        print("\n===== Prediction Result =====")
        print(f"Approval: {'Approved' if result['prediction'] else 'Rejected'}")
        
        # Show probability
        show_probability_bar(result['probability'])
        
        # Plot probability
        plot_file = plot_probability(result['probability'])
        
        # Show recommendations
        print("\n===== Recommendations =====")
        for i, rec in enumerate(result['recommendations'], 1):
            print(f"{i}. {rec}")
        
        print(f"\nA detailed visualization has been saved as: {plot_file}")
        
        logger.info("Farm plan prediction completed successfully")
        
    except Exception as e:
        logger.error("Error in prediction process: %s", str(e))
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main() 