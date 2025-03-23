#!/usr/bin/env python3
"""
Mixed Farming Layout Generator Script
This script generates a visualization of a mixed farming layout based on input parameters.
"""

import sys
import os
import json
import matplotlib
matplotlib.use('Agg')  # Set the backend to Agg before importing pyplot
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Circle, Polygon
import numpy as np

def generate_mixed_farming_layout(
    # Basic parameters
    crop_name,
    crop_type,
    area_acres,
    soil_type,
    state,
    # Mixed farming specific parameters
    companion_crops,
    planting_method,
    # Additional parameters
    irrigation_type="drip",
    filename=None
):
    """Generate a visual layout of mixed farming plan"""
    
    # Convert area_acres to float
    area_acres = float(area_acres)
    
    # Parse companion_crops and planting_method if they're strings
    if isinstance(companion_crops, str):
        companion_crops = json.loads(companion_crops)
    if isinstance(planting_method, str):
        planting_method = json.loads(planting_method)
    
    # Set up the figure
    fig, ax = plt.subplots(figsize=(14, 10))
    
    # Calculate dimensions from acres
    total_sqm = area_acres * 4046.86  # Convert acres to square meters
    width = np.sqrt(total_sqm * 1.5)
    height = width / 1.5
    
    # Plot the field boundary
    field = Rectangle((0, 0), width, height, fill=False, edgecolor='black', linewidth=2)
    ax.add_patch(field)
    
    # Set field dimensions as plot limits
    ax.set_xlim(-width*0.1, width*1.1)
    ax.set_ylim(-height*0.1, height*1.1)
    
    # Generate soil background
    soil_colors = {
        'Clay': '#8B4513',
        'Loam': '#A0522D',
        'Sandy': '#DAA06D',
        'Black': '#3B2F2F',
        'Red': '#8B0000',
        'Laterite': '#A52A2A'
    }
    
    # Create soil background with variations
    soil_points = np.random.rand(1000, 2)
    soil_points[:, 0] *= width
    soil_points[:, 1] *= height
    
    base_color = soil_colors.get(soil_type, '#A0522D')
    ax.scatter(soil_points[:, 0], soil_points[:, 1], color=base_color, alpha=0.3, s=50)
    
    # Determine section division based on number of companion crops
    n_companions = len(companion_crops.get('recommended_mix', []))
    
    # Assign colors to different crops
    crop_colors = {
        crop_name: 'darkgreen',  # Main crop
    }
    
    # Add colors for companion crops
    companion_crop_colors = ['forestgreen', 'mediumseagreen', 'limegreen', 'olivedrab', 'darkolivegreen']
    for i, crop in enumerate(companion_crops.get('recommended_mix', [])):
        if i < len(companion_crop_colors):
            crop_colors[crop] = companion_crop_colors[i]
    
    # Implement different layout patterns based on planting method
    recommended_method = planting_method.get('recommended', '')
    
    if 'Intercropping' in recommended_method or 'Traditional' in recommended_method:
        # Alternate row pattern for intercropping
        row_spacing = 7
        rows = int(height / row_spacing)
        
        for i in range(rows):
            y = i * row_spacing + row_spacing/2
            
            if i % 3 == 0:  # Main crop rows
                ax.axhline(y, color=crop_colors[crop_name], alpha=0.7, linestyle='-', linewidth=4)
            elif i % 3 == 1 and n_companions > 0:  # First companion
                ax.axhline(y, color=crop_colors.get(companion_crops['recommended_mix'][0], 'green'), alpha=0.7, linestyle='-', linewidth=3)
            elif i % 3 == 2 and n_companions > 1:  # Second companion
                ax.axhline(y, color=crop_colors.get(companion_crops['recommended_mix'][1], 'green'), alpha=0.7, linestyle='-', linewidth=3)
    
    elif 'Ridge' in recommended_method or 'Bed' in recommended_method:
        # Ridge and furrow or raised bed system
        bed_width = 10
        path_width = 3
        n_beds = int(width / (bed_width + path_width))
        
        for i in range(n_beds):
            x_start = i * (bed_width + path_width)
            # Bed
            rect = Rectangle((x_start, 0), bed_width, height, color=crop_colors[crop_name], alpha=0.2)
            ax.add_patch(rect)
            
            # Path/furrow
            if i < n_beds - 1:
                rect = Rectangle((x_start + bed_width, 0), path_width, height, color='lightgray', alpha=0.4)
                ax.add_patch(rect)
            
            # Add main crop in most beds
            if i % 3 != 2:
                crop_points_x = np.random.uniform(x_start + 1, x_start + bed_width - 1, int(bed_width * height / 20))
                crop_points_y = np.random.uniform(1, height - 1, int(bed_width * height / 20))
                ax.scatter(crop_points_x, crop_points_y, color=crop_colors[crop_name], s=15, alpha=0.8)
            
            # Add companion crops in some beds
            else:
                comp_idx = (i // 3) % n_companions
                if comp_idx < n_companions:
                    comp_color = crop_colors.get(companion_crops['recommended_mix'][comp_idx], 'green')
                    crop_points_x = np.random.uniform(x_start + 1, x_start + bed_width - 1, int(bed_width * height / 20))
                    crop_points_y = np.random.uniform(1, height - 1, int(bed_width * height / 20))
                    ax.scatter(crop_points_x, crop_points_y, color=comp_color, s=15, alpha=0.8)
    
    elif 'High Density' in recommended_method or 'Square' in recommended_method:
        # Section based division for different crops
        
        # Main crop section (60%)
        main_section = Rectangle((0, 0), width, height * 0.6, fill=True, alpha=0.15, color=crop_colors[crop_name])
        ax.add_patch(main_section)
        
        # Plant pattern for main crop
        grid_spacing = 8
        for x in np.arange(grid_spacing/2, width, grid_spacing):
            for y in np.arange(grid_spacing/2, height * 0.6, grid_spacing):
                circle = Circle((x, y), 2, color=crop_colors[crop_name], alpha=0.7)
                ax.add_patch(circle)
        
        # Companion crop sections (40% divided among companions)
        section_height = (height * 0.4) / max(1, n_companions)
        for i in range(n_companions):
            if i < len(companion_crops['recommended_mix']):
                comp_section = Rectangle((0, height * 0.6 + i * section_height), 
                                       width, section_height, 
                                       fill=True, alpha=0.15, 
                                       color=crop_colors.get(companion_crops['recommended_mix'][i], 'green'))
                ax.add_patch(comp_section)
                
                # Add companion crop pattern
                for x in np.arange(grid_spacing, width, grid_spacing):
                    for y in np.arange(height * 0.6 + i * section_height + grid_spacing/2, 
                                     height * 0.6 + (i+1) * section_height, grid_spacing):
                        circle = Circle((x, y), 1.5, color=crop_colors.get(companion_crops['recommended_mix'][i], 'green'), alpha=0.7)
                        ax.add_patch(circle)
    
    else:
        # Default pattern - block division
        main_width = width * 0.7
        
        # Main crop section
        main_section = Rectangle((0, 0), main_width, height, fill=True, alpha=0.15, color=crop_colors[crop_name])
        ax.add_patch(main_section)
        
        # Add main crop pattern
        crop_points_x = np.random.uniform(1, main_width - 1, int(main_width * height / 15))
        crop_points_y = np.random.uniform(1, height - 1, int(main_width * height / 15))
        ax.scatter(crop_points_x, crop_points_y, color=crop_colors[crop_name], s=20, alpha=0.8)
        
        # Companion crop sections
        if n_companions > 0:
            comp_width = (width - main_width) / n_companions
            for i in range(n_companions):
                if i < len(companion_crops['recommended_mix']):
                    comp_section = Rectangle((main_width + i * comp_width, 0), 
                                          comp_width, height, 
                                          fill=True, alpha=0.15, 
                                          color=crop_colors.get(companion_crops['recommended_mix'][i], 'green'))
                    ax.add_patch(comp_section)
                    
                    # Add companion crop pattern
                    comp_points_x = np.random.uniform(main_width + i * comp_width + 1, 
                                                   main_width + (i+1) * comp_width - 1, 
                                                   int(comp_width * height / 20))
                    comp_points_y = np.random.uniform(1, height - 1, int(comp_width * height / 20))
                    ax.scatter(comp_points_x, comp_points_y, 
                             color=crop_colors.get(companion_crops['recommended_mix'][i], 'green'), s=15, alpha=0.8)
    
    # Add irrigation system
    if irrigation_type == "drip":
        for y in np.arange(height/10, height, height/8):
            ax.axhline(y, color='blue', alpha=0.3, linestyle='--')
    elif irrigation_type == "sprinkler":
        sprinkler_radius = min(width, height) / 15
        for x in np.arange(sprinkler_radius*2, width, sprinkler_radius*4):
            for y in np.arange(sprinkler_radius*2, height, sprinkler_radius*4):
                circle = plt.Circle((x, y), sprinkler_radius, color='lightblue', alpha=0.2)
                ax.add_patch(circle)
                ax.plot(x, y, 'bo', markersize=4, alpha=0.7)
    
    # Add title and labels
    plt.title(f'Mixed Farming Layout: {crop_name} with companions in {state}', fontsize=16)
    plt.xlabel('Distance (meters)', fontsize=12)
    plt.ylabel('Distance (meters)', fontsize=12)
    
    # Create legend elements
    legend_elements = [
        plt.Line2D([0], [0], marker='o', color='w', label=f'Main Crop: {crop_name}',
                  markerfacecolor=crop_colors[crop_name], markersize=10),
        plt.Line2D([0], [0], marker='o', color='w', label=f'Soil: {soil_type}',
                  markerfacecolor=soil_colors.get(soil_type, '#A0522D'), markersize=10),
        plt.Line2D([0], [0], marker='s', color='w', label=f'Method: {recommended_method}',
                  markerfacecolor='gray', markersize=10),
    ]
    
    # Add companion crops to legend
    for i, comp in enumerate(companion_crops.get('recommended_mix', [])):
        if i < 5:  # Limit to top 5
            legend_elements.append(
                plt.Line2D([0], [0], marker='o', color='w', label=f'Companion: {comp}',
                          markerfacecolor=crop_colors.get(comp, 'green'), markersize=10)
            )
    
    # Add legend
    ax.legend(handles=legend_elements, loc='upper right', fontsize=10)
    
    # Add compass
    compass_size = min(width, height) * 0.05
    compass_x = width * 0.05
    compass_y = height * 0.05
    ax.arrow(compass_x, compass_y, 0, compass_size, head_width=compass_size*0.3, 
             head_length=compass_size*0.3, fc='black', ec='black')
    ax.text(compass_x, compass_y + compass_size*1.5, 'N', fontsize=12, ha='center')
    
    # Add scale bar
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
    if len(sys.argv) < 6:
        print("Usage: python generate_mixed_farming_layout.py crop_name crop_type area_acres soil_type state companion_crops planting_method [irrigation_type] [output_filename]")
        sys.exit(1)
    
    # Get arguments
    crop_name = sys.argv[1]
    crop_type = sys.argv[2]
    area_acres = sys.argv[3]
    soil_type = sys.argv[4]
    state = sys.argv[5]
    companion_crops = sys.argv[6]
    planting_method = sys.argv[7]
    
    # Get optional arguments or use defaults
    irrigation_type = sys.argv[8] if len(sys.argv) > 8 else "drip"
    output_filename = sys.argv[9] if len(sys.argv) > 9 else None
    
    # Generate the mixed farming layout
    success = generate_mixed_farming_layout(
        crop_name=crop_name,
        crop_type=crop_type,
        area_acres=area_acres,
        soil_type=soil_type,
        state=state,
        companion_crops=companion_crops,
        planting_method=planting_method,
        irrigation_type=irrigation_type,
        filename=output_filename
    )
    
    # Return success or failure
    if success:
        print(json.dumps({"status": "success", "filename": output_filename}))
        sys.exit(0)
    else:
        print(json.dumps({"status": "failure", "error": "Failed to generate mixed farming layout image"}))
        sys.exit(1) 