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
import seaborn as sns

# Set up logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Define paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(SCRIPT_DIR, 'models')
MODEL_PATH = os.path.join(MODEL_DIR, 'farmer_approval_model.joblib')
ENCODER_PATH = os.path.join(MODEL_DIR, 'farmer_label_encoders.joblib')
SCALER_PATH = os.path.join(MODEL_DIR, 'farmer_scaler.joblib')
PLOT_DIR = os.path.join(SCRIPT_DIR, 'plots')
os.makedirs(PLOT_DIR, exist_ok=True)

def load_model():
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

def get_valid_input(prompt, input_type=float, options=None):
    """Gets valid input from the user"""
    while True:
        try:
            value = input(prompt)
            
            if input_type == float or input_type == int:
                value = input_type(value)
                if value < 0:
                    print("Value must be non-negative.")
                    continue
            elif options and value.lower() not in options:
                print(f"Invalid input. Please choose from: {', '.join(options)}")
                continue
                
            return value if input_type != str else value.lower()
        except ValueError:
            print(f"Please enter a valid {input_type.__name__}.")

def preprocess_input(years_experience, land_size, previous_loans, credit_score, 
                     annual_income, crop_diversity, has_irrigation, farm_type, 
                     label_encoders, scaler):
    """Preprocesses the input data for prediction"""
    # Create DataFrame with input data
    input_data = pd.DataFrame({
        'years_experience': [years_experience],
        'land_size_hectares': [land_size],
        'previous_loans': [previous_loans],
        'credit_score': [credit_score],
        'annual_income': [annual_income],
        'crop_diversity': [crop_diversity],
        'has_irrigation': [has_irrigation],
        'farm_type': [farm_type]
    })
    
    # Encode categorical variables
    if 'farm_type' in label_encoders:
        try:
            input_data['farm_type'] = label_encoders['farm_type'].transform(input_data['farm_type'])
        except ValueError as e:
            logger.error(f"Error encoding farm_type: {e}")
            farm_types = list(label_encoders['farm_type'].classes_)
            print(f"Invalid farm type. Valid options are: {', '.join(farm_types)}")
            return None
    
    # Scale numerical features
    numerical_cols = ['years_experience', 'land_size_hectares', 'previous_loans', 
                      'credit_score', 'annual_income', 'crop_diversity']
    
    input_data[numerical_cols] = scaler.transform(input_data[numerical_cols])
    
    return input_data

def get_recommendations(prob, farmer_data):
    """Generate recommendations based on prediction probability"""
    recommendations = []
    
    if prob < 0.3:
        recommendations.append("Based on the provided information, your profile has a low approval probability.")
        
        # Specific recommendations based on data
        if farmer_data['credit_score'] < 650:
            recommendations.append("Your credit score is below the recommended threshold. Consider improving it before applying.")
        
        if farmer_data['years_experience'] < 3:
            recommendations.append("Your farming experience is limited. Consider gaining more experience or partnering with experienced farmers.")
        
        if farmer_data['has_irrigation'] == 0:
            recommendations.append("Installing irrigation systems can improve your farm's productivity and increase approval chances.")
    
    elif prob < 0.7:
        recommendations.append("Your profile has a moderate approval probability.")
        
        if farmer_data['credit_score'] < 700:
            recommendations.append("Improving your credit score could increase your approval chances.")
        
        if farmer_data['crop_diversity'] < 3:
            recommendations.append("Consider diversifying your crops to reduce risk and improve approval probability.")
        
        recommendations.append("With some improvements, your application could have a higher chance of approval.")
    
    else:
        recommendations.append("Your profile has a high approval probability.")
        recommendations.append("Your experience and farm management practices show strong potential for success.")
        
        if farmer_data['annual_income'] < 50000:
            recommendations.append("While your profile is strong, increasing farm revenue could help secure larger funding amounts.")
    
    return recommendations

def plot_farmer_prediction(prob, farmer_data):
    """Create visual representation of prediction with key factors"""
    plt.figure(figsize=(12, 6))
    
    # Gauge chart for probability
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
    plt.title("Approval Probability")
    plt.axis('equal')
    plt.axis('off')
    
    # Key factors chart
    plt.subplot(1, 2, 2)
    
    # Normalize factors to 0-1 scale for visualization
    # These are simplistic normalizations - in production you'd use proper scaling
    factors = {
        'Experience': min(farmer_data['years_experience'] / 20, 1),  # Assume 20 years is max
        'Credit': (farmer_data['credit_score'] - 500) / 300,  # Scale from 500-800
        'Land Size': min(farmer_data['land_size_hectares'] / 15, 1),  # Assume 15 hectares is max
        'Crop Diversity': min(farmer_data['crop_diversity'] / 6, 1),  # Assume 6 crops is max
        'Income': min(farmer_data['annual_income'] / 100000, 1)  # Assume 100k is max
    }
    
    # Create horizontal bar chart
    factor_names = list(factors.keys())
    factor_values = list(factors.values())
    colors = ['#5cb85c' if v >= 0.7 else '#f0ad4e' if v >= 0.4 else '#d9534f' for v in factor_values]
    
    y_pos = np.arange(len(factor_names))
    plt.barh(y_pos, factor_values, color=colors)
    plt.yticks(y_pos, factor_names)
    plt.xlim(0, 1)
    plt.title('Key Factors (Relative Strength)')
    
    # Add value labels
    for i, v in enumerate(factor_values):
        plt.text(v + 0.05, i, f"{v:.2f}", va='center')
    
    plt.tight_layout()
    
    # Save the plot
    timestamp = pd.Timestamp.now().strftime("%Y%m%d_%H%M%S")
    filename = os.path.join(PLOT_DIR, f"farmer_prediction_{timestamp}.png")
    plt.savefig(filename)
    plt.close()
    
    logger.info(f"Prediction visualization saved as {filename}")
    return filename

def predict_approval(model, input_data):
    """Predicts approval based on input data"""
    try:
        # Get prediction probability
        prob = model.predict_proba(input_data)[0][1]
        
        # Make prediction
        prediction = model.predict(input_data)[0]
        
        # Get recommendations
        recommendations = get_recommendations(prob, {
            'years_experience': input_data['years_experience'].iloc[0],
            'land_size_hectares': input_data['land_size_hectares'].iloc[0],
            'previous_loans': input_data['previous_loans'].iloc[0],
            'credit_score': input_data['credit_score'].iloc[0],
            'annual_income': input_data['annual_income'].iloc[0],
            'crop_diversity': input_data['crop_diversity'].iloc[0],
            'has_irrigation': input_data['has_irrigation'].iloc[0],
            'farm_type': input_data['farm_type'].iloc[0]
        })
        
        return {
            'prediction': bool(prediction),
            'probability': float(prob),
            'recommendations': recommendations
        }
    except Exception as e:
        logger.error("Error making prediction: %s", str(e))
        raise

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

def main():
    """Main function to execute the prediction process"""
    logger.info("Starting farmer approval prediction")
    
    try:
        # Load model and preprocessors
        model, label_encoders, scaler = load_model()
        
        # Get user input
        print("\n===== Farmer Loan Approval Prediction =====\n")
        
        years_experience = get_valid_input("Years of farming experience: ", float)
        land_size = get_valid_input("Land size in hectares: ", float)
        previous_loans = get_valid_input("Number of previous loans: ", int)
        credit_score = get_valid_input("Credit score (500-850): ", int)
        
        # Validate credit score range
        if credit_score < 500 or credit_score > 850:
            print("Credit score should be between 500 and 850. Using closest valid value.")
            credit_score = max(500, min(credit_score, 850))
        
        annual_income = get_valid_input("Annual income (USD): ", float)
        crop_diversity = get_valid_input("Number of different crops/products: ", int)
        
        has_irrigation_input = get_valid_input("Has irrigation system? (yes/no): ", str, ['yes', 'no'])
        has_irrigation = 1 if has_irrigation_input == 'yes' else 0
        
        # Get farm type
        farm_types = list(label_encoders['farm_type'].classes_)
        print(f"\nAvailable farm types: {', '.join(farm_types)}")
        farm_type = get_valid_input("Farm type: ", str, farm_types)
        
        # Preprocess input
        input_data = preprocess_input(
            years_experience, land_size, previous_loans, credit_score, 
            annual_income, crop_diversity, has_irrigation, farm_type,
            label_encoders, scaler
        )
        
        if input_data is None:
            print("Error processing input. Please try again with valid values.")
            return
        
        # Make prediction
        result = predict_approval(model, input_data)
        
        # Display result
        print("\n===== Prediction Result =====")
        print(f"Approval: {'Approved' if result['prediction'] else 'Rejected'}")
        
        # Show probability bar
        show_probability_bar(result['probability'])
        
        # Generate visualization
        plot_file = plot_farmer_prediction(
            result['probability'],
            {
                'years_experience': years_experience,
                'land_size_hectares': land_size,
                'previous_loans': previous_loans,
                'credit_score': credit_score,
                'annual_income': annual_income,
                'crop_diversity': crop_diversity,
                'has_irrigation': has_irrigation,
                'farm_type': farm_type
            }
        )
        
        # Show recommendations
        print("\n===== Recommendations =====")
        for i, rec in enumerate(result['recommendations'], 1):
            print(f"{i}. {rec}")
        
        print(f"\nA detailed visualization has been saved as: {plot_file}")
        
        logger.info("Farmer approval prediction completed successfully")
        
    except Exception as e:
        logger.error("Error in prediction process: %s", str(e))
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main() 