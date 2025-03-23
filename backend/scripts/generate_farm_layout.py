#!/usr/bin/env python3
"""
Farm Layout Generator Script
This script generates a visualization of a farm layout based on input parameters.
"""

import sys
import os
import json
import matplotlib
matplotlib.use('Agg')  # Set the backend to Agg before importing pyplot
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Circle, Polygon
import numpy as np

def generate_farm_layout(
    # Basic parameters
    crop_name,
    crop_type,
    area_acres,
    soil_type,
    state,
    
    # Advanced parameters
    land_shape="rectangle",  # rectangle, irregular
    land_ratio=1.5,  # width/height ratio
    slope="flat",  # flat, gentle, moderate, steep
    irrigation_type="drip",  # drip, sprinkler, flood, none
    planting_density="medium",  # low, medium, high
    road_access="north",  # north, south, east, west
    equipment_size="medium",  # small, medium, large
    include_windbreaks=False,
    
    # Output
    filename=None
):
    """Generate and visualize farm layout based on parameters"""
    
    # Convert area_acres to float
    area_acres = float(area_acres)
    land_ratio = float(land_ratio)
    include_windbreaks = include_windbreaks.lower() == 'true'
    
    # Set up the figure
    fig, ax = plt.subplots(figsize=(12, 8))
    
    # Calculate dimensions from acres
    total_sqm = area_acres * 4046.86  # Convert acres to square meters
    
    if land_shape == "rectangle":
        # Calculate width and height based on ratio
        width = np.sqrt(total_sqm * land_ratio)
        height = width / land_ratio
        
        # Plot the field boundary
        field = Rectangle((0, 0), width, height, fill=False, edgecolor='black', linewidth=2)
        ax.add_patch(field)
        
        # Set field dimensions as plot limits
        ax.set_xlim(-width*0.1, width*1.1)
        ax.set_ylim(-height*0.1, height*1.1)
    
    # Generate soil background based on soil type
    soil_colors = {
        'Clay': '#8B4513',
        'Loam': '#A0522D',
        'Sandy': '#DAA06D',
        'Black': '#3B2F2F',
        'Red': '#8B0000',
        'Laterite': '#A52A2A'
    }
    
    # Create soil background with variations
    if land_shape == "rectangle":
        soil_points = np.random.rand(1000, 2)
        soil_points[:, 0] *= width
        soil_points[:, 1] *= height
        
        base_color = soil_colors.get(soil_type, '#A0522D')
        ax.scatter(soil_points[:, 0], soil_points[:, 1], color=base_color, alpha=0.3, s=50)
    
    # Add crop planting pattern
    if crop_type in ['Cereal', 'Grain', 'Pulse']:
        # Row crops
        row_spacing = {'low': 1.0, 'medium': 0.75, 'high': 0.5}[planting_density]
        rows = int(height / row_spacing)
        
        for i in range(rows):
            y = i * row_spacing + row_spacing/2
            ax.axhline(y, color='green', alpha=0.5, linestyle='-', linewidth=3)
    
    elif crop_type in ['Vegetable', 'Fruit']:
        # Grid pattern
        grid_spacing_x = {'low': 2.0, 'medium': 1.5, 'high': 1.0}[planting_density]
        grid_spacing_y = {'low': 2.0, 'medium': 1.5, 'high': 1.0}[planting_density]
        
        # Create grid for plants
        for x in np.arange(grid_spacing_x/2, width, grid_spacing_x):
            for y in np.arange(grid_spacing_y/2, height, grid_spacing_y):
                circle = Circle((x, y), 0.3, color='green', alpha=0.7)
                ax.add_patch(circle)
    
    elif crop_type in ['Spice', 'Cash', 'Beverage', 'Fiber', 'Millet', 'Nut', 'Oilseed']:
        # Scattered pattern
        num_plants = int(total_sqm / 10)  # Arbitrary number based on area
        points_x = np.random.uniform(0, width, num_plants)
        points_y = np.random.uniform(0, height, num_plants)
        
        ax.scatter(points_x, points_y, color='green', s=30, alpha=0.7)
    
    # Add water sources - simplified for the API version
    # We'll add a few water sources based on irrigation type
    if irrigation_type in ["drip", "sprinkler"]:
        # Add a water source (well) at the corner
        circle = Circle((width * 0.05, height * 0.05), min(width, height) * 0.03, color='blue', alpha=0.7)
        ax.add_patch(circle)
    elif irrigation_type == "flood":
        # Add a pond
        ellipse = Polygon([
            (width * 0.1, height * 0.5),
            (width * 0.15, height * 0.6),
            (width * 0.2, height * 0.5),
            (width * 0.15, height * 0.4),
        ], closed=True, color='blue', alpha=0.6)
        ax.add_patch(ellipse)
    
    # Add irrigation system
    if irrigation_type == "drip":
        # Draw drip lines
        for y in np.arange(height/10, height, height/5):
            ax.axhline(y, color='blue', alpha=0.4, linestyle='--')
    elif irrigation_type == "sprinkler":
        # Draw sprinklers
        sprinkler_radius = min(width, height) / 10
        sprinkler_positions = []
        
        for x in np.arange(sprinkler_radius*2, width, sprinkler_radius*4):
            for y in np.arange(sprinkler_radius*2, height, sprinkler_radius*4):
                circle = plt.Circle((x, y), sprinkler_radius, color='lightblue', alpha=0.3)
                ax.add_patch(circle)
                ax.plot(x, y, 'bo', markersize=5)
                sprinkler_positions.append((x, y))
    elif irrigation_type == "flood":
        # Draw flood irrigation channels
        channel_width = min(width, height) / 30
        for x in np.arange(width/10, width, width/4):
            rect = Rectangle((x - channel_width/2, 0), channel_width, height, color='lightblue', alpha=0.3)
            ax.add_patch(rect)
    
    # Add road access
    road_width = min(width, height) / 15
    if road_access == "north":
        rect = Rectangle((width/2 - road_width/2, height), road_width, height*0.1, color='gray')
        ax.add_patch(rect)
    elif road_access == "south":
        rect = Rectangle((width/2 - road_width/2, -height*0.1), road_width, height*0.1, color='gray')
        ax.add_patch(rect)
    elif road_access == "east":
        rect = Rectangle((width, height/2 - road_width/2), width*0.1, road_width, color='gray')
        ax.add_patch(rect)
    elif road_access == "west":
        rect = Rectangle((-width*0.1, height/2 - road_width/2), width*0.1, road_width, color='gray')
        ax.add_patch(rect)
    
    # Add windbreaks if requested
    if include_windbreaks:
        tree_spacing = min(width, height) / 10
        tree_radius = min(width, height) / 30
        
        # Top windbreak
        for x in np.arange(tree_radius, width, tree_spacing):
            circle = Circle((x, height + tree_radius), tree_radius, color='darkgreen', alpha=0.7)
            ax.add_patch(circle)
        
        # Right windbreak
        for y in np.arange(tree_radius, height, tree_spacing):
            circle = Circle((width + tree_radius, y), tree_radius, color='darkgreen', alpha=0.7)
            ax.add_patch(circle)
    
    # Add title and labels
    plt.title(f'Farm Layout: {crop_name} in {state} ({area_acres} acres)', fontsize=16)
    plt.xlabel('Distance (meters)', fontsize=12)
    plt.ylabel('Distance (meters)', fontsize=12)
    
    # Add legend with key information
    legend_elements = [
        plt.Line2D([0], [0], color='black', lw=2, label=f'Farm Boundary: {area_acres:.1f} acres'),
        plt.Line2D([0], [0], marker='o', color='w', label=f'Soil Type: {soil_type}',
                  markerfacecolor=soil_colors.get(soil_type, '#A0522D'), markersize=10),
        plt.Line2D([0], [0], color='green', lw=2, label=f'Crop: {crop_name}'),
    ]
    
    if irrigation_type != "none":
        if irrigation_type == "drip":
            legend_elements.append(plt.Line2D([0], [0], color='blue', linestyle='--', lw=2, label='Drip Irrigation'))
        elif irrigation_type == "sprinkler":
            legend_elements.append(plt.Line2D([0], [0], marker='o', color='w', label='Sprinkler System',
                          markerfacecolor='lightblue', markersize=10))
        elif irrigation_type == "flood":
            legend_elements.append(plt.Line2D([0], [0], color='blue', lw=2, label='Flood Irrigation'))
    
    ax.legend(handles=legend_elements, loc='upper right', fontsize=10)
    
    # Add compass
    compass_size = min(width, height) * 0.05
    compass_x = width * 0.05
    compass_y = height * 0.05
    
    # North arrow
    ax.arrow(compass_x, compass_y, 0, compass_size, head_width=compass_size*0.3, 
             head_length=compass_size*0.3, fc='black', ec='black')
    ax.text(compass_x, compass_y + compass_size*1.5, 'N', fontsize=12, ha='center')
    
    # Add scale bar (100m)
    scale_width = 100  # meters
    scale_x = width * 0.8
    scale_y = height * 0.05
    ax.plot([scale_x, scale_x + scale_width], [scale_y, scale_y], 'k-', lw=2)
    ax.text(scale_x + scale_width/2, scale_y*0.8, '100 m', ha='center')
    
    plt.grid(alpha=0.3)
    plt.tight_layout()
    
    if filename:
        # Ensure the directory exists
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        plt.savefig(filename, dpi=300, bbox_inches='tight')
        return True
    else:
        plt.show()
        return False

if __name__ == "__main__":
    # Check if we have the right number of arguments
    if len(sys.argv) < 9:
        print("Usage: python generate_farm_layout.py crop_name crop_type area_acres soil_type state [land_shape] [land_ratio] [slope] [irrigation_type] [planting_density] [road_access] [equipment_size] [include_windbreaks] [output_filename]")
        sys.exit(1)
    
    # Get arguments
    crop_name = sys.argv[1]
    crop_type = sys.argv[2]
    area_acres = sys.argv[3]
    soil_type = sys.argv[4]
    state = sys.argv[5]
    
    # Get optional arguments or use defaults
    land_shape = sys.argv[6] if len(sys.argv) > 6 else "rectangle"
    land_ratio = sys.argv[7] if len(sys.argv) > 7 else "1.5"
    slope = sys.argv[8] if len(sys.argv) > 8 else "flat"
    irrigation_type = sys.argv[9] if len(sys.argv) > 9 else "drip"
    planting_density = sys.argv[10] if len(sys.argv) > 10 else "medium"
    road_access = sys.argv[11] if len(sys.argv) > 11 else "north"
    equipment_size = sys.argv[12] if len(sys.argv) > 12 else "medium"
    include_windbreaks = sys.argv[13] if len(sys.argv) > 13 else "false"
    output_filename = sys.argv[14] if len(sys.argv) > 14 else None
    
    # Generate the farm layout
    success = generate_farm_layout(
        crop_name=crop_name,
        crop_type=crop_type,
        area_acres=area_acres,
        soil_type=soil_type,
        state=state,
        land_shape=land_shape,
        land_ratio=land_ratio,
        slope=slope,
        irrigation_type=irrigation_type,
        planting_density=planting_density,
        road_access=road_access,
        equipment_size=equipment_size,
        include_windbreaks=include_windbreaks,
        filename=output_filename
    )
    
    # Return success or failure
    if success:
        print(json.dumps({"status": "success", "filename": output_filename}))
        sys.exit(0)
    else:
        print(json.dumps({"status": "failure", "error": "Failed to generate farm layout image"}))
        sys.exit(1) 