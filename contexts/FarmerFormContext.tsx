'use client';

import React, { createContext, useContext, useState } from 'react';

interface FarmerFormData {
  personal_info: {
    full_name: string;
    email: string;
    phone: string;
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
    monthly_returns: number;
    repayment_time: string;
    funding_description: string;
  };
}

interface FarmerFormContextType {
  formData: FarmerFormData;
  updateFormData: (section: keyof FarmerFormData, data: any) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isValid: (section: string) => boolean;
}

const defaultFormData: FarmerFormData = {
  personal_info: {
    full_name: '',
    email: '',
    phone: '',
    id_type: '',
    id_number: '',
  },
  farm_details: {
    farm_name: '',
    farm_type: '',
    ownership_type: '',
    farm_location: '',
    land_size: 0,
    years_operation: 0,
    main_crops: '',
    farm_description: '',
  },
  financial_info: {
    funding_required: 0,
    funding_purpose: '',
    monthly_returns: 0,
    repayment_time: '',
    funding_description: '',
  },
};

const FarmerFormContext = createContext<FarmerFormContextType | undefined>(undefined);

export function FarmerFormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<FarmerFormData>(defaultFormData);
  const [currentTab, setCurrentTab] = useState('personal');

  const updateFormData = (section: keyof FarmerFormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  const isValid = (section: string) => {
    switch (section) {
      case 'personal':
        const { full_name, email, phone, id_type, id_number } = formData.personal_info;
        return !!(full_name && email && phone && id_type && id_number);
      case 'farm':
        const { farm_name, farm_type, ownership_type, farm_location, land_size } = formData.farm_details;
        return !!(farm_name && farm_type && ownership_type && farm_location && land_size);
      case 'financial':
        const { funding_required, funding_purpose, monthly_returns, repayment_time, funding_description } = formData.financial_info;
        return !!(funding_required && funding_purpose && monthly_returns && repayment_time && funding_description);
      default:
        return false;
    }
  };

  return (
    <FarmerFormContext.Provider
      value={{
        formData,
        updateFormData,
        currentTab,
        setCurrentTab,
        isValid,
      }}
    >
      {children}
    </FarmerFormContext.Provider>
  );
}

export function useFarmerForm() {
  const context = useContext(FarmerFormContext);
  if (context === undefined) {
    throw new Error('useFarmerForm must be used within a FarmerFormProvider');
  }
  return context;
} 