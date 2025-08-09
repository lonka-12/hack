import React, { useEffect } from "react";
import { MapPin, ChevronDown, Search, FileText } from "lucide-react";
import {
  STATES,
  CANCER_TYPES,
  CANCER_STAGES,
  INSURANCE_TYPES,
} from "../constants";
import { useTreatmentFormAutoSave } from "../hooks/useTreatmentFormAutoSave";

interface TreatmentFormProps {
  selectedState: string;
  cancerType: string;
  stage: string;
  insuranceType: string;
  onStateChange: (state: string) => void;
  onCancerTypeChange: (type: string) => void;
  onStageChange: (stage: string) => void;
  onInsuranceTypeChange: (type: string) => void;
  onSearch: () => void;
  isLoadingData: boolean;
}

const TreatmentForm: React.FC<TreatmentFormProps> = ({
  selectedState,
  cancerType,
  stage,
  insuranceType,
  onStateChange,
  onCancerTypeChange,
  onStageChange,
  onInsuranceTypeChange,
  onSearch,
  isLoadingData,
}) => {
  const { autoSave, loadSavedData } = useTreatmentFormAutoSave();

  // Load saved data on component mount
  useEffect(() => {
    const savedData = loadSavedData();
    if (savedData.selectedState && !selectedState) {
      onStateChange(savedData.selectedState);
    }
    if (savedData.cancerType && !cancerType) {
      onCancerTypeChange(savedData.cancerType);
    }
    if (savedData.stage && !stage) {
      onStageChange(savedData.stage);
    }
    if (savedData.insuranceType && !insuranceType) {
      onInsuranceTypeChange(savedData.insuranceType);
    }
  }, []);

  // Auto-save whenever form data changes
  useEffect(() => {
    if (selectedState || cancerType || stage || insuranceType) {
      autoSave({
        selectedState,
        cancerType,
        stage,
        insuranceType,
      });
    }
  }, [selectedState, cancerType, stage, insuranceType, autoSave]);

  return (
    <div className="bg-gray-800 shadow-2xl border border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-600/20 to-emerald-600/20 p-8 border-b border-gray-700">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <FileText className="mr-4 text-cyan-400" />
          Treatment Information
        </h2>
        <p className="text-gray-300 mt-2">
          Enter your details to find personalized resources
        </p>
      </div>

      <div className="p-8 space-y-8">
        {/* State Selection */}
        <div className="bg-gray-800 p-6 border border-gray-600 shadow-lg hover:shadow-xl hover:shadow-cyan-500/10 transform hover:scale-[1.01] transition-all duration-300">
          <label className="block text-lg font-semibold text-white mb-4">
            <MapPin className="inline w-6 h-6 mr-3 text-cyan-400" />
            Select Your State
          </label>
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => onStateChange(e.target.value)}
              className="w-full p-4 text-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none text-white shadow-inner hover:bg-gray-600 transition-colors duration-200"
            >
              <option value="" className="bg-gray-700">
                Choose your state...
              </option>
              {STATES.map((state) => (
                <option key={state} value={state} className="bg-gray-700">
                  {state}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-4 w-6 h-6 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Cancer Type */}
        <div className="bg-gray-800 p-6 border border-gray-600 shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 transform hover:scale-[1.01] transition-all duration-300">
          <label className="block text-lg font-semibold text-white mb-4">
            Cancer Type
          </label>
          <div className="relative">
            <select
              value={cancerType}
              onChange={(e) => onCancerTypeChange(e.target.value)}
              className="w-full p-4 text-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none text-white shadow-inner hover:bg-gray-600 transition-colors duration-200"
            >
              <option value="" className="bg-gray-700">
                Select cancer type...
              </option>
              {CANCER_TYPES.map((type) => (
                <option key={type} value={type} className="bg-gray-700">
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-4 w-6 h-6 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Cancer Stage */}
        <div className="bg-gray-800 p-6 border border-gray-600 shadow-lg hover:shadow-xl hover:shadow-cyan-500/10 transform hover:scale-[1.01] transition-all duration-300">
          <label className="block text-lg font-semibold text-white mb-4">
            Cancer Stage
          </label>
          <div className="relative">
            <select
              value={stage}
              onChange={(e) => onStageChange(e.target.value)}
              className="w-full p-4 text-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none text-white shadow-inner hover:bg-gray-600 transition-colors duration-200"
            >
              <option value="" className="bg-gray-700">
                Select stage...
              </option>
              {CANCER_STAGES.map((stageOption) => (
                <option
                  key={stageOption}
                  value={stageOption}
                  className="bg-gray-700"
                >
                  {stageOption}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-4 w-6 h-6 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Insurance Type */}
        <div className="bg-gray-800 p-6 border border-gray-600 shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 transform hover:scale-[1.01] transition-all duration-300">
          <label className="block text-lg font-semibold text-white mb-4">
            Insurance Coverage
          </label>
          <div className="relative">
            <select
              value={insuranceType}
              onChange={(e) => onInsuranceTypeChange(e.target.value)}
              className="w-full p-4 text-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none text-white shadow-inner hover:bg-gray-600 transition-colors duration-200"
            >
              <option value="" className="bg-gray-700">
                Select insurance type...
              </option>
              {INSURANCE_TYPES.map((type) => (
                <option key={type} value={type} className="bg-gray-700">
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-4 w-6 h-6 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={onSearch}
          disabled={!selectedState || !cancerType || !stage || !insuranceType}
          className="w-full bg-gradient-to-r from-cyan-600 to-emerald-600 text-white py-5 px-8 font-bold text-lg hover:from-cyan-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl transform hover:scale-[1.02] hover:shadow-cyan-500/25 disabled:hover:scale-100 flex items-center justify-center"
        >
          <Search className="mr-3 w-6 h-6" />
          {isLoadingData ? "Loading Resources..." : "Find Treatment Resources"}
        </button>
      </div>
    </div>
  );
};

export default TreatmentForm;
