#!/usr/bin/env python3
"""
Planting Method Suggestion Script
This script suggests optimal planting methods based on crop type, soil type, area size, and primary crop.
"""

import sys
import json

def suggest_planting_method(crop_type, soil_type, area_acres, primary_crop):
    """
    Recommend planting methods based on input parameters
    
    Args:
        crop_type (str): Type of crop (cereal, vegetable, fruit, etc.)
        soil_type (str): Type of soil (Clay, Sandy, Loam, etc.)
        area_acres (float): Area size in acres
        primary_crop (str): Main crop to be planted
        
    Returns:
        dict: Planting method recommendations
    """
    # Convert area_acres to float
    try:
        area_acres = float(area_acres)
    except ValueError:
        return {
            "status": "error",
            "message": f"Invalid area value: {area_acres}. Must be a number."
        }
    
    # Define planting methods database
    planting_methods = {
        "cereal": {
            "methods": {
                "Conventional Tilling": {
                    "description": "Traditional method with deep plowing of soil",
                    "advantages": ["Good weed control", "Disease reduction through soil exposure", "Thorough mixing of soil and residue"],
                    "disadvantages": ["Soil erosion risk", "Higher labor and fuel costs", "Reduces soil organic matter over time"]
                },
                "Zero Tillage": {
                    "description": "Direct seeding without tilling the soil",
                    "advantages": ["Saves time and fuel", "Reduces soil erosion", "Preserves soil structure and moisture"],
                    "disadvantages": ["May require more herbicide use", "Slower soil warming in spring", "Possible increased pest pressure"]
                },
                "Ridge Tillage": {
                    "description": "Planting on ridges formed during cultivation",
                    "advantages": ["Improved drainage", "Faster soil warming", "Reduced erosion compared to conventional"],
                    "disadvantages": ["Initial ridge formation cost", "Requires specialized equipment", "May limit certain field operations"]
                },
                "Strip Tillage": {
                    "description": "Tilling only in narrow strips where seeds will be planted",
                    "advantages": ["Conserves soil moisture", "Reduces erosion", "Lower fuel costs than conventional"],
                    "disadvantages": ["Requires specialized equipment", "Less effective in wet, heavy soils", "May have uneven germination"]
                }
            },
            "soil_preferences": {
                "Clay": ["Ridge Tillage", "Zero Tillage"],
                "Sandy": ["Strip Tillage", "Conventional Tilling"],
                "Loam": ["Zero Tillage", "Strip Tillage"],
                "Black": ["Zero Tillage", "Strip Tillage"],
                "Red": ["Ridge Tillage", "Zero Tillage"],
                "Laterite": ["Zero Tillage", "Strip Tillage"]
            },
            "area_factors": {
                "small": ["Strip Tillage", "Conventional Tilling"],  # < 5 acres
                "medium": ["Zero Tillage", "Ridge Tillage"],  # 5-20 acres
                "large": ["Zero Tillage", "Strip Tillage"]  # > 20 acres
            }
        },
        "vegetable": {
            "methods": {
                "Raised Bed Planting": {
                    "description": "Planting on raised soil beds for better drainage and soil temperature",
                    "advantages": ["Improved drainage", "Better root growth", "Early planting in wet conditions"],
                    "disadvantages": ["Initial setup cost", "Requires more irrigation", "May dry out quickly in hot weather"]
                },
                "Intensive Row Planting": {
                    "description": "Closely spaced rows for maximum yield per area",
                    "advantages": ["Maximizes space utilization", "Good for limited area", "Can be mechanized"],
                    "disadvantages": ["May increase disease pressure", "Higher irrigation needs", "Requires careful nutrient management"]
                },
                "Block Planting": {
                    "description": "Crops planted in blocks rather than rows for better space utilization",
                    "advantages": ["Natural pest control", "Efficient harvesting", "Less soil compaction"],
                    "disadvantages": ["More complex planning", "Harder to mechanize", "May need more manual labor"]
                },
                "Square Foot Gardening": {
                    "description": "Dividing growing area into 1-foot squares for intensive planting",
                    "advantages": ["Very efficient space use", "Easy to manage and rotate", "Good for small areas"],
                    "disadvantages": ["Labor intensive", "Not suitable for large-scale", "Higher initial setup costs"]
                }
            },
            "soil_preferences": {
                "Clay": ["Raised Bed Planting", "Square Foot Gardening"],
                "Sandy": ["Intensive Row Planting", "Block Planting"],
                "Loam": ["Intensive Row Planting", "Raised Bed Planting"],
                "Black": ["Raised Bed Planting", "Intensive Row Planting"],
                "Red": ["Raised Bed Planting", "Block Planting"],
                "Laterite": ["Raised Bed Planting", "Square Foot Gardening"]
            },
            "area_factors": {
                "small": ["Square Foot Gardening", "Raised Bed Planting"],  # < 2 acres
                "medium": ["Raised Bed Planting", "Block Planting"],  # 2-10 acres
                "large": ["Intensive Row Planting", "Block Planting"]  # > 10 acres
            }
        },
        "fruit": {
            "methods": {
                "Orchard System": {
                    "description": "Traditional widely spaced arrangement of fruit trees",
                    "advantages": ["Easy maintenance", "Long-term production", "Less competition between trees"],
                    "disadvantages": ["Inefficient land use", "Delayed full production", "Harder pest management"]
                },
                "High Density Planting": {
                    "description": "Closely spaced trees for maximum yield per area",
                    "advantages": ["Higher early yields", "Efficient land use", "Easier harvesting"],
                    "disadvantages": ["Higher initial investment", "More intensive management", "May have shorter orchard life"]
                },
                "Trellis System": {
                    "description": "Training plants on supportive structures",
                    "advantages": ["Better light penetration", "Easier harvest", "Space efficient"],
                    "disadvantages": ["High setup cost", "Ongoing maintenance", "Limited to certain fruit types"]
                },
                "Meadow Orchard": {
                    "description": "Ultra-high density system with very small trees",
                    "advantages": ["Very early production", "Extremely efficient space use", "Easier management and harvesting"],
                    "disadvantages": ["Very high initial cost", "Specialized equipment needed", "Shorter productive life"]
                }
            },
            "soil_preferences": {
                "Clay": ["Orchard System", "Trellis System"],
                "Sandy": ["High Density Planting", "Trellis System"],
                "Loam": ["High Density Planting", "Meadow Orchard"],
                "Black": ["Orchard System", "High Density Planting"],
                "Red": ["Orchard System", "Trellis System"],
                "Laterite": ["Trellis System", "Orchard System"]
            },
            "area_factors": {
                "small": ["Trellis System", "Meadow Orchard"],  # < 5 acres
                "medium": ["High Density Planting", "Trellis System"],  # 5-20 acres
                "large": ["Orchard System", "High Density Planting"]  # > 20 acres
            }
        },
        "pulse": {
            "methods": {
                "Relay Cropping": {
                    "description": "Planting the next crop before harvesting the current crop",
                    "advantages": ["Extended growing season", "Efficient resource use", "Reduced soil erosion"],
                    "disadvantages": ["Potential crop competition", "Complex management", "May require specialized equipment"]
                },
                "Intercropping": {
                    "description": "Growing two or more crops in proximity for pest control and space efficiency",
                    "advantages": ["Natural pest management", "Improved biodiversity", "Insurance against crop failure"],
                    "disadvantages": ["Complex harvesting", "Possible yield reduction", "Difficult mechanization"]
                },
                "Sequential Cropping": {
                    "description": "Growing one crop after another in sequence",
                    "advantages": ["Maximizes seasonal potential", "Balanced soil nutrient use", "Breaks pest cycles"],
                    "disadvantages": ["Tight scheduling required", "Weather dependency", "Intensive management needed"]
                },
                "Traditional Row Planting": {
                    "description": "Standard method with well-spaced rows for machinery access",
                    "advantages": ["Easy mechanization", "Simple management", "Proven method"],
                    "disadvantages": ["Less efficient space use", "May increase erosion risk", "Single crop vulnerability"]
                }
            },
            "soil_preferences": {
                "Clay": ["Traditional Row Planting", "Relay Cropping"],
                "Sandy": ["Intercropping", "Sequential Cropping"],
                "Loam": ["Intercropping", "Sequential Cropping"],
                "Black": ["Traditional Row Planting", "Sequential Cropping"],
                "Red": ["Intercropping", "Traditional Row Planting"],
                "Laterite": ["Intercropping", "Relay Cropping"]
            },
            "area_factors": {
                "small": ["Intercropping", "Relay Cropping"],  # < 5 acres
                "medium": ["Sequential Cropping", "Intercropping"],  # 5-15 acres
                "large": ["Traditional Row Planting", "Sequential Cropping"]  # > 15 acres
            }
        },
        "oilseed": {
            "methods": {
                "Broadcast Seeding": {
                    "description": "Scattering seeds uniformly across the field",
                    "advantages": ["Fast and simple", "Low labor requirement", "Good for large areas"],
                    "disadvantages": ["Uneven germination", "Seed wastage", "Difficult weed control"]
                },
                "Precision Drilling": {
                    "description": "Precise placement of seeds at optimal depth and spacing",
                    "advantages": ["Uniform plant spacing", "Efficient seed use", "Even emergence"],
                    "disadvantages": ["Requires specialized equipment", "Higher initial cost", "Slower than broadcasting"]
                },
                "Bed Planting": {
                    "description": "Planting on raised beds for better drainage and soil condition",
                    "advantages": ["Improved water management", "Better root development", "Reduced soil compaction"],
                    "disadvantages": ["Bed formation costs", "More complex irrigation", "May need specialized machinery"]
                },
                "Conservation Tillage": {
                    "description": "Minimum soil disturbance while maintaining crop residue",
                    "advantages": ["Soil moisture conservation", "Reduced erosion", "Lower fuel costs"],
                    "disadvantages": ["Potential weed challenges", "Slower soil warming", "May require more herbicides"]
                }
            },
            "soil_preferences": {
                "Clay": ["Bed Planting", "Conservation Tillage"],
                "Sandy": ["Precision Drilling", "Broadcast Seeding"],
                "Loam": ["Precision Drilling", "Conservation Tillage"],
                "Black": ["Conservation Tillage", "Precision Drilling"],
                "Red": ["Bed Planting", "Conservation Tillage"],
                "Laterite": ["Bed Planting", "Conservation Tillage"]
            },
            "area_factors": {
                "small": ["Bed Planting", "Precision Drilling"],  # < 5 acres
                "medium": ["Precision Drilling", "Conservation Tillage"],  # 5-20 acres
                "large": ["Broadcast Seeding", "Conservation Tillage"]  # > 20 acres
            }
        }
    }
    
    # Check if the crop type exists in our database
    if crop_type.lower() not in planting_methods:
        return {
            "status": "error",
            "message": f"Unknown crop type: {crop_type}. Supported types are: {', '.join(planting_methods.keys())}"
        }
    
    # Get relevant data for the crop type
    crop_data = planting_methods[crop_type.lower()]
    
    # Determine area category
    area_category = "small"
    if crop_type.lower() == "vegetable":
        if area_acres > 10:
            area_category = "large"
        elif area_acres > 2:
            area_category = "medium"
    else:  # Default categories for other crop types
        if area_acres > 20:
            area_category = "large"
        elif area_acres > 5:
            area_category = "medium"
    
    # Get soil preferences or use default if soil type not found
    soil_methods = crop_data["soil_preferences"].get(soil_type, 
                                                    crop_data["soil_preferences"].get("Loam", 
                                                                                    list(crop_data["methods"].keys())[:2]))
    
    # Get area-based methods
    area_methods = crop_data["area_factors"][area_category]
    
    # Find best method (intersection of soil and area preferences)
    best_methods = []
    for method in soil_methods:
        if method in area_methods:
            best_methods.append(method)
    
    # If no intersection, prioritize soil preferences
    if not best_methods:
        best_methods = soil_methods[:1] + area_methods[:1]
    
    # Create the result
    result = {
        "status": "success",
        "recommended": best_methods[0],
        "alternatives": best_methods[1:] if len(best_methods) > 1 else soil_methods[:1],
        "details": crop_data["methods"][best_methods[0]],
        "crop_specific_notes": get_crop_specific_notes(primary_crop, best_methods[0]),
        "area_category": area_category,
        "area_acres": area_acres
    }
    
    return result

def get_crop_specific_notes(crop, method):
    """Get specific notes for particular crops with particular methods"""
    
    # Define specific advice for common crop-method combinations
    crop_method_notes = {
        "rice": {
            "Zero Tillage": "For rice, zero tillage works best with good water management and proper weed control.",
            "Ridge Tillage": "Ridge tillage in rice helps with water drainage in heavy rainfall areas.",
            "Conventional Tilling": "Pudding the soil helps control weeds and creates ideal anaerobic conditions for rice."
        },
        "wheat": {
            "Zero Tillage": "Zero tillage wheat after rice has shown excellent results in many regions.",
            "Strip Tillage": "Strip tillage allows faster warming of soil which benefits wheat germination."
        },
        "maize": {
            "Ridge Tillage": "Ridge tillage for maize provides good drainage and helps prevent waterlogging.",
            "Strip Tillage": "Strip tillage in maize conserves moisture while allowing precision fertilizer placement."
        },
        "potato": {
            "Raised Bed Planting": "Raised beds provide excellent drainage and soil warming for potato cultivation.",
            "Ridge Tillage": "Ridge tillage makes harvesting easier and reduces greening of potato tubers."
        },
        "tomato": {
            "Raised Bed Planting": "Raised beds help prevent soil-borne diseases in tomatoes by improving drainage.",
            "Trellis System": "Trellising tomatoes increases airflow, reducing disease and making harvesting easier."
        },
        "mango": {
            "High Density Planting": "High density mango orchards can use dwarf varieties for easier management.",
            "Orchard System": "Traditional orchard systems for mangoes should consider adequate spacing for air circulation."
        },
        "banana": {
            "High Density Planting": "High density banana plantations require excellent nutrient management.",
            "Trellis System": "Support systems for bananas help prevent toppling during fruiting and storms."
        },
        "groundnut": {
            "Conservation Tillage": "Conservation tillage helps retain moisture which is beneficial for groundnut development.",
            "Bed Planting": "Raised beds improve drainage which reduces pod rot in groundnut."
        },
        "soybean": {
            "Zero Tillage": "Zero till soybean preserves soil moisture and reduces erosion risks.",
            "Relay Cropping": "Soybean works well in relay cropping systems following wheat or rice."
        },
        "mustard": {
            "Precision Drilling": "Precision drilling ensures optimal plant population for mustard.",
            "Conservation Tillage": "Mustard responds well to conservation tillage with adequate residue management."
        }
    }
    
    # Return specific notes if available, otherwise a generic note
    if crop.lower() in crop_method_notes and method in crop_method_notes[crop.lower()]:
        return crop_method_notes[crop.lower()][method]
    else:
        return f"This method is generally suitable for {crop}, but optimize based on local conditions and available resources."

if __name__ == "__main__":
    # Check if we have the right number of arguments
    if len(sys.argv) < 5:
        print(json.dumps({
            "status": "error", 
            "message": "Usage: python suggest_planting_method.py [crop_type] [soil_type] [area_acres] [primary_crop]"
        }))
        sys.exit(1)
    
    # Get arguments
    crop_type = sys.argv[1]
    soil_type = sys.argv[2]
    area_acres = sys.argv[3]
    primary_crop = sys.argv[4]
    
    # Get planting method recommendations
    recommendations = suggest_planting_method(crop_type, soil_type, area_acres, primary_crop)
    
    # Return as JSON
    print(json.dumps(recommendations))
    sys.exit(0) 