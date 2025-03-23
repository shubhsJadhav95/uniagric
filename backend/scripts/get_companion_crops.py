#!/usr/bin/env python3
"""
Companion Crops Recommendation Script
This script generates companion crop recommendations based on crop, state, and soil type.
"""

import sys
import json

def get_companion_crops(crop, state, soil_type):
    """
    Generate companion crop recommendations based on:
    - Main crop type
    - Geographic state
    - Soil type
    
    Returns a dictionary with recommended crops and explanations
    """
    # Define companion crop database by main crop
    # This is a simplified database for demonstration purposes
    # In a real application, this would be stored in a database or external data source
    companion_db = {
        "rice": {
            "good_companions": ["azolla", "duckweed", "sesbania", "fish", "ducks"],
            "bad_companions": ["wheat", "maize"],
            "benefits": {
                "azolla": "Fixes nitrogen and suppresses weeds",
                "duckweed": "Provides additional organic matter",
                "sesbania": "Green manure, adds nitrogen",
                "fish": "Pest control and additional income source",
                "ducks": "Weed and pest control, additional income source"
            }
        },
        "wheat": {
            "good_companions": ["chickpea", "lentil", "coriander", "fenugreek", "mustard"],
            "bad_companions": ["rice", "oats"],
            "benefits": {
                "chickpea": "Nitrogen fixation, improves soil fertility",
                "lentil": "Nitrogen fixation, reduces disease pressure",
                "coriander": "Attracts beneficial insects, pest repellent",
                "fenugreek": "Nitrogen fixation, improves soil structure",
                "mustard": "Natural fungicide properties, pest repellent"
            }
        },
        "maize": {
            "good_companions": ["beans", "pumpkin", "cucumber", "peas", "sunflower"],
            "bad_companions": ["tomato", "rice"],
            "benefits": {
                "beans": "Nitrogen fixation, utilizes maize stalks for support",
                "pumpkin": "Ground cover, reduces weeds, soil moisture conservation",
                "cucumber": "Utilizes space efficiently, ground cover",
                "peas": "Nitrogen fixation, improves soil fertility",
                "sunflower": "Attracts pollinators, provides shade"
            }
        },
        "potato": {
            "good_companions": ["beans", "marigold", "horseradish", "cabbage", "corn"],
            "bad_companions": ["tomato", "cucumber", "sunflower"],
            "benefits": {
                "beans": "Nitrogen fixation, improves soil fertility",
                "marigold": "Repels nematodes and other soil pests",
                "horseradish": "Helps resist disease, improves potato flavor",
                "cabbage": "Different nutrient requirements, maximizes space",
                "corn": "Provides shade during hot months"
            }
        },
        "cotton": {
            "good_companions": ["cowpea", "groundnut", "sorghum", "marigold", "sunflower"],
            "bad_companions": ["okra", "hibiscus"],
            "benefits": {
                "cowpea": "Nitrogen fixation, ground cover",
                "groundnut": "Nitrogen fixation, reduced pest pressure",
                "sorghum": "Trap crop for pests, windbreak",
                "marigold": "Repels nematodes, attracts pollinators",
                "sunflower": "Attracts beneficial insects, trap crop"
            }
        },
        "tomato": {
            "good_companions": ["basil", "marigold", "onion", "garlic", "carrots"],
            "bad_companions": ["potato", "corn", "fennel"],
            "benefits": {
                "basil": "Repels pests, improves flavor, attracts pollinators",
                "marigold": "Repels nematodes, attracts beneficial insects",
                "onion": "Repels many tomato pests",
                "garlic": "Deters spider mites and other pests",
                "carrots": "Loosens soil for tomato roots, space efficiency"
            }
        },
        "onion": {
            "good_companions": ["carrot", "tomato", "lettuce", "strawberry", "chamomile"],
            "bad_companions": ["beans", "peas", "sage"],
            "benefits": {
                "carrot": "Repels onion flies, while onions repel carrot flies",
                "tomato": "Onions deter many tomato pests",
                "lettuce": "Utilizes space efficiently, different growth habits",
                "strawberry": "Onions repel pests that attack strawberries",
                "chamomile": "Improves flavor and growth of onions"
            }
        },
        "sugarcane": {
            "good_companions": ["soybean", "peanut", "sunflower", "marigold", "cowpea"],
            "bad_companions": ["potato", "sweet potato"],
            "benefits": {
                "soybean": "Nitrogen fixation, ground cover",
                "peanut": "Nitrogen fixation, reduces weed growth",
                "sunflower": "Acts as windbreak, attracts pollinators",
                "marigold": "Repels nematodes, pest control",
                "cowpea": "Nitrogen fixation, reduces erosion"
            }
        },
        "groundnut": {
            "good_companions": ["maize", "sorghum", "sunflower", "millet", "cowpea"],
            "bad_companions": ["potato", "onion"],
            "benefits": {
                "maize": "Provides support and shade, reduces evaporation",
                "sorghum": "Acts as windbreak, reduces pest pressure",
                "sunflower": "Attracts pollinators and beneficial insects",
                "millet": "Different root structures, efficient nutrient use",
                "cowpea": "Additional nitrogen fixation, increases overall yield"
            }
        }
    }
    
    # Default crop if not found
    if crop.lower() not in companion_db:
        # General recommendations for any crop not in database
        return {
            "status": "success",
            "recommended_mix": ["sunflower", "marigold", "cowpea", "beans"],
            "benefits": {
                "sunflower": "Attracts pollinators and beneficial insects",
                "marigold": "Repels soil nematodes and many insect pests",
                "cowpea": "Fixes nitrogen in soil, improves fertility",
                "beans": "Nitrogen fixation, efficient land use"
            },
            "notes": f"No specific companion data available for {crop}. These are general recommendations suitable for most crops."
        }
    
    # Get base companions
    crop_data = companion_db[crop.lower()]
    
    # Initialize result with base companions
    result = {
        "status": "success",
        "recommended_mix": crop_data["good_companions"][:4],  # Top 4 companions
        "benefits": {comp: crop_data["benefits"][comp] for comp in crop_data["good_companions"][:4]},
        "avoid": crop_data["bad_companions"],
        "notes": ""
    }
    
    # Adjust based on soil type
    soil_adjustments = {
        "Clay": {
            "preferred": ["legumes", "beans", "cowpea", "marigold", "sunflower"],
            "note": "Clay soils benefit from crops that can break up compacted soil."
        },
        "Sandy": {
            "preferred": ["cowpea", "groundnut", "sweet potato", "millet"],
            "note": "Sandy soils benefit from crops that add organic matter and prevent erosion."
        },
        "Loam": {
            "preferred": [],  # Loam is ideal for most companions
            "note": "Loam soil is ideal for most companion combinations."
        },
        "Black": {
            "preferred": ["sorghum", "millet", "sunflower", "marigold"],
            "note": "Black soils benefit from drought-resistant companion crops."
        },
        "Red": {
            "preferred": ["cowpea", "groundnut", "beans", "lentil"],
            "note": "Red soils benefit from nitrogen-fixing companion crops."
        },
        "Laterite": {
            "preferred": ["cowpea", "groundnut", "millet", "sorghum"],
            "note": "Laterite soils benefit from drought-tolerant and nitrogen-fixing companions."
        }
    }
    
    # Apply soil-specific adjustments
    if soil_type in soil_adjustments:
        soil_data = soil_adjustments[soil_type]
        result["notes"] += soil_data["note"] + " "
        
        # Prioritize soil-preferred companions if they're also good companions for the crop
        soil_preferred = [crop for crop in soil_data["preferred"] 
                          if crop in crop_data["good_companions"]]
        
        if soil_preferred:
            # Replace some recommendations with soil-preferred options
            replace_count = min(2, len(soil_preferred))  # Replace at most 2
            result["recommended_mix"] = soil_preferred[:replace_count] + result["recommended_mix"][:(4-replace_count)]
            result["benefits"] = {comp: crop_data["benefits"].get(comp, "Improves soil conditions") 
                                 for comp in result["recommended_mix"]}
    
    # Adjust based on state (regional considerations)
    # Simplified regional adjustments
    regional_adjustments = {
        "Maharashtra": ["cowpea", "groundnut", "sunflower"],
        "Punjab": ["moong", "cowpea", "sunflower"],
        "Haryana": ["moong", "cowpea", "mustard"],
        "Uttar Pradesh": ["cowpea", "moong", "mustard"],
        "Gujarat": ["cowpea", "groundnut", "castor"],
        "Rajasthan": ["moth bean", "guar", "sesame"],
        "Madhya Pradesh": ["soybean", "chickpea", "lentil"],
        "Andhra Pradesh": ["green gram", "black gram", "groundnut"],
        "Tamil Nadu": ["pulses", "groundnut", "sesame"],
        "Karnataka": ["pulses", "groundnut", "sunflower"],
        "Bihar": ["moong", "urad", "lentil"],
        "West Bengal": ["mustard", "lentil", "jute"],
        "Odisha": ["groundnut", "mustard", "sesame"],
        "Assam": ["jute", "sesame", "black gram"],
        "Kerala": ["pulses", "tubers", "spices"]
    }
    
    if state in regional_adjustments:
        regional_crops = regional_adjustments[state]
        result["notes"] += f"For {state}, consider adding {', '.join(regional_crops)} based on regional adaptability. "
    
    return result

if __name__ == "__main__":
    # Check if we have the right number of arguments
    if len(sys.argv) < 4:
        print(json.dumps({"status": "error", "message": "Usage: python get_companion_crops.py [crop] [state] [soil_type]"}))
        sys.exit(1)
    
    # Get arguments
    crop = sys.argv[1]
    state = sys.argv[2]
    soil_type = sys.argv[3]
    
    # Get companion crop recommendations
    recommendations = get_companion_crops(crop, state, soil_type)
    
    # Return as JSON
    print(json.dumps(recommendations))
    sys.exit(0) 