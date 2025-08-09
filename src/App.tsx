import React, { useState } from "react";
import type {
  TreatmentCosts,
  FinancialResources,
  CounselingServices,
} from "./types";
import Header from "./components/Header";
import EmergencyResources from "./components/EmergencyResources";
import TreatmentForm from "./components/TreatmentForm";
import ResultsSection from "./components/ResultsSection";
import ChatAssistant from "./components/ChatAssistant";
import QuickActions from "./components/QuickActions";
import Footer from "./components/Footer";
import {
  fetchTreatmentCosts,
  fetchFinancialResources,
  fetchCounselingServices,
} from "./utils/api";

const CancerTreatmentApp: React.FC = () => {
  const [selectedState, setSelectedState] = useState("");
  const [cancerType, setCancerType] = useState("");
  const [stage, setStage] = useState("");
  const [insuranceType, setInsuranceType] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // State for AI-generated data
  const [treatmentCosts, setTreatmentCosts] = useState<TreatmentCosts>({});
  const [financialResources, setFinancialResources] =
    useState<FinancialResources>({
      federal: [],
      state: [],
    });
  const [counselingServices, setCounselingServices] =
    useState<CounselingServices>({
      federal: [],
      state: [],
    });

  const handleSearch = async () => {
    if (selectedState && cancerType && stage && insuranceType) {
      setIsLoadingData(true);
      setShowResults(true);

      // Fetch treatment costs, financial resources, and counseling services simultaneously
      const [costs, resources, counseling] = await Promise.all([
        fetchTreatmentCosts(cancerType, stage),
        fetchFinancialResources(selectedState),
        fetchCounselingServices(selectedState),
      ]);

      // Create the proper structure for TreatmentCosts
      const newTreatmentCosts: TreatmentCosts = {
        [cancerType]: {
          [stage]: costs,
        },
      };

      setTreatmentCosts(newTreatmentCosts);
      setFinancialResources(resources);
      setCounselingServices(counseling);
      setIsLoadingData(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative container mx-auto px-6 py-12">
        <Header />
        <EmergencyResources />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form and Results */}
          <div className="lg:col-span-2">
            <TreatmentForm
              selectedState={selectedState}
              cancerType={cancerType}
              stage={stage}
              insuranceType={insuranceType}
              onStateChange={setSelectedState}
              onCancerTypeChange={setCancerType}
              onStageChange={setStage}
              onInsuranceTypeChange={setInsuranceType}
              onSearch={handleSearch}
              isLoadingData={isLoadingData}
            />

            <ResultsSection
              showResults={showResults}
              isLoadingData={isLoadingData}
              treatmentCosts={treatmentCosts}
              financialResources={financialResources}
              counselingServices={counselingServices}
              selectedState={selectedState}
              cancerType={cancerType}
              stage={stage}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ChatAssistant
              selectedState={selectedState}
              cancerType={cancerType}
              stage={stage}
              insuranceType={insuranceType}
            />
            <QuickActions />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default CancerTreatmentApp;
