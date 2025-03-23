const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface FarmerRegistrationData {
  personal_info: {
    full_name: string;
    email: string;
    phone_number: string;
    id_type: string;
    id_number: string;
  };
  farm_details: {
    farm_name: string;
    farm_type: string;
    ownership_type: string;
    farm_location: string;
    land_size: number;
    years_operation: number;
    main_crops: string;
    farm_description: string;
  };
  financial_info: {
    funding_required: number;
    funding_purpose: string;
  };
}

export const registerFarmer = async (data: FarmerRegistrationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/farmer/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering farmer:', error);
    throw error;
  }
};

export const uploadFarmerDocument = async (farmerId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/farmer/upload-document?farmer_id=${farmerId}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Document upload failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

export const getFarmerDetails = async (farmerId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/farmer/${farmerId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch farmer details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching farmer details:', error);
    throw error;
  }
}; 