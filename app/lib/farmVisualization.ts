// Farm visualization API client functions
// Interfaces for farm visualization parameters

export interface FarmLayoutParams {
  crop_name: string;
  crop_type: string;
  area_acres: number;
  soil_type: string;
  state: string;
  land_shape?: "rectangle" | "irregular";
  land_ratio?: number;
  slope?: "flat" | "gentle" | "moderate" | "steep";
  water_sources?: Array<[string, number, number, number]>; // [type, x, y, size]
  irrigation_type?: "drip" | "sprinkler" | "flood" | "none";
  planting_density?: "low" | "medium" | "high";
  existing_structures?: Array<[string, number, number, number, number]>; // [type, x, y, width, height]
  road_access?: "north" | "south" | "east" | "west";
  equipment_size?: "small" | "medium" | "large";
  include_windbreaks?: boolean;
}

export interface MixedFarmingParams extends FarmLayoutParams {
  companion_crops: {
    recommended_mix: string[];
    crop_companions?: string[];
    state_specific?: string[];
    soil_specific?: string[];
  };
  planting_method: {
    recommended: string;
    general_method?: string;
    specific_method?: string;
    farm_size?: string;
  };
}

/**
 * Generate a farm layout visualization
 * @param params Farm layout parameters
 * @returns Promise with the image URL
 */
export async function generateFarmLayout(params: FarmLayoutParams): Promise<string> {
  try {
    const response = await fetch('/api/farm-visualization/layout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate farm layout: ${response.statusText}`);
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error("Error generating farm layout:", error);
    throw error;
  }
}

/**
 * Generate a mixed farming layout visualization
 * @param params Mixed farming parameters
 * @returns Promise with the image URL
 */
export async function generateMixedFarmingLayout(params: MixedFarmingParams): Promise<string> {
  try {
    const response = await fetch('/api/farm-visualization/mixed-layout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate mixed farm layout: ${response.statusText}`);
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error("Error generating mixed farm layout:", error);
    throw error;
  }
}

/**
 * Get companion crop recommendations for mixed farming
 * @param crop Primary crop name
 * @param state State/region 
 * @param soilType Soil type
 * @returns Promise with companion crop recommendations
 */
export async function getCompanionCrops(
  crop: string,
  state: string,
  soilType: string
): Promise<{
  recommended_mix: string[];
  crop_companions: string[];
  state_specific: string[];
  soil_specific: string[];
}> {
  try {
    const response = await fetch(`/api/farm-visualization/companion-crops?crop=${encodeURIComponent(crop)}&state=${encodeURIComponent(state)}&soilType=${encodeURIComponent(soilType)}`);

    if (!response.ok) {
      throw new Error(`Failed to get companion crops: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting companion crops:", error);
    throw error;
  }
}

/**
 * Get planting method recommendations
 * @param cropType Crop type category
 * @param soilType Soil type
 * @param areaAcres Farm area in acres
 * @param primaryCrop Primary crop name
 * @returns Promise with planting method recommendations
 */
export async function getPlantingMethod(
  cropType: string,
  soilType: string,
  areaAcres: number,
  primaryCrop: string
): Promise<{
  recommended: string;
  general_method: string;
  specific_method: string;
  farm_size: string;
}> {
  try {
    const response = await fetch(`/api/farm-visualization/planting-method?cropType=${encodeURIComponent(cropType)}&soilType=${encodeURIComponent(soilType)}&areaAcres=${areaAcres}&primaryCrop=${encodeURIComponent(primaryCrop)}`);

    if (!response.ok) {
      throw new Error(`Failed to get planting method: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting planting method:", error);
    throw error;
  }
} 