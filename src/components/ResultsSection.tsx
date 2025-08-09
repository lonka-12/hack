import React from "react";
import {
  Calculator,
  AlertCircle,
  DollarSign,
  Phone,
  Heart,
} from "lucide-react";
import type {
  TreatmentCosts,
  FinancialResources,
  CounselingServices,
} from "../types";

interface ResultsSectionProps {
  showResults: boolean;
  isLoadingData: boolean;
  treatmentCosts: TreatmentCosts;
  financialResources: FinancialResources;
  counselingServices: CounselingServices;
  selectedState: string;
  cancerType: string;
  stage: string;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  showResults,
  isLoadingData,
  treatmentCosts,
  financialResources,
  counselingServices,
  selectedState,
  cancerType,
  stage,
}) => {
  const getCurrentTreatmentCosts = () => {
    return treatmentCosts[cancerType]?.[stage] || {};
  };

  const getStateResources = () => {
    return financialResources.state || [];
  };

  const getStateCounselingServices = () => {
    return counselingServices.state || [];
  };

  if (!showResults) return null;

  return (
    <div className="mt-8 space-y-8">
      {/* Cost Estimates */}
      <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 p-8 border-b border-gray-700">
          <h3 className="text-3xl font-bold text-white flex items-center">
            <Calculator className="mr-4 text-emerald-400" />
            Estimated Treatment Costs
          </h3>
        </div>
        <div className="p-8">
          {isLoadingData ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full mb-4 animate-pulse">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-300 text-lg">
                Fetching current treatment costs...
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(getCurrentTreatmentCosts()).map(
                  ([treatment, cost]) => (
                    <div
                      key={treatment}
                      className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-6 rounded-2xl border border-emerald-500/20 shadow-lg hover:shadow-xl hover:shadow-emerald-500/20 transform hover:scale-[1.02] transition-all duration-300"
                    >
                      <h4 className="font-bold text-white text-lg capitalize mb-2">
                        {treatment}
                      </h4>
                      <p className="text-emerald-400 font-bold text-2xl">
                        {cost as string}
                      </p>
                    </div>
                  )
                )}
              </div>
              <div className="mt-8 p-6 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 hover:bg-cyan-500/15 transition-colors duration-300">
                <p className="text-cyan-300 flex items-center">
                  <AlertCircle className="inline w-5 h-5 mr-3 flex-shrink-0" />
                  Costs are current estimates for 2025 and may vary by facility,
                  location, and individual treatment plans.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Financial Aid Resources */}
      <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600/20 to-emerald-600/20 p-8 border-b border-gray-700">
          <h3 className="text-3xl font-bold text-white flex items-center">
            <DollarSign className="mr-4 text-cyan-400" />
            Financial Aid Resources
          </h3>
        </div>

        <div className="p-8 space-y-8">
          {isLoadingData ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full mb-4 animate-pulse">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-300 text-lg">
                Loading financial resources...
              </p>
            </div>
          ) : (
            <>
              {/* Federal Resources */}
              <div>
                <h4 className="text-2xl font-bold text-white mb-6">
                  National Resources
                </h4>
                <div className="grid gap-6">
                  {financialResources.federal?.map((resource, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-6 rounded-2xl border border-cyan-500/20 shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 transform hover:scale-[1.01] transition-all duration-300"
                    >
                      <h5 className="font-bold text-white text-lg mb-3">
                        {resource.name}
                      </h5>
                      <div className="flex flex-wrap items-center gap-6 text-cyan-300">
                        <span className="flex items-center">
                          <Phone className="w-5 h-5 mr-2" />
                          {resource.phone}
                        </span>
                        {resource.website && (
                          <a
                            href={resource.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 underline transition-colors duration-200"
                          >
                            {resource.website}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* State-Specific Resources */}
              {selectedState && getStateResources().length > 0 && (
                <div>
                  <h4 className="text-2xl font-bold text-white mb-6">
                    {selectedState} Resources
                  </h4>
                  <div className="grid gap-6">
                    {getStateResources().map((resource, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6 rounded-2xl border border-emerald-500/20 shadow-lg hover:shadow-xl hover:shadow-emerald-500/20 transform hover:scale-[1.01] transition-all duration-300"
                      >
                        <h5 className="font-bold text-white text-lg mb-3">
                          {resource.name}
                        </h5>
                        <span className="flex items-center text-emerald-300">
                          <Phone className="w-5 h-5 mr-2" />
                          {resource.phone}
                        </span>
                        {resource.website && (
                          <a
                            href={resource.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:text-emerald-300 underline transition-colors duration-200 block mt-2"
                          >
                            {resource.website}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Counseling Services */}
      <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-600/20 to-rose-600/20 p-8 border-b border-gray-700">
          <h3 className="text-3xl font-bold text-white flex items-center">
            <Heart className="mr-4 text-pink-400" />
            Counseling & Support Services
          </h3>
        </div>
        <div className="p-8">
          {isLoadingData ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full mb-4 animate-pulse">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-300 text-lg">
                Fetching counseling and support services...
              </p>
            </div>
          ) : (
            <>
              {/* Federal Resources */}
              {counselingServices.federal.length > 0 && (
                <div>
                  <h4 className="text-2xl font-bold text-white mb-6">
                    National Resources
                  </h4>
                  <div className="grid gap-6">
                    {counselingServices.federal.map((service, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 p-6 rounded-2xl border border-pink-500/20 shadow-lg hover:shadow-xl hover:shadow-pink-500/20 transform hover:scale-[1.01] transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="font-bold text-white text-lg">
                            {service.name}
                          </h5>
                          <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-sm font-medium">
                            {service.type}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <span className="flex items-center text-pink-300">
                            <Phone className="w-5 h-5 mr-2" />
                            {service.phone}
                          </span>
                          {service.website && (
                            <a
                              href={service.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-400 hover:text-pink-300 underline transition-colors duration-200"
                            >
                              {service.website}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* State-Specific Resources */}
              {selectedState && getStateCounselingServices().length > 0 && (
                <div>
                  <h4 className="text-2xl font-bold text-white mb-6">
                    {selectedState} Resources
                  </h4>
                  <div className="grid gap-6">
                    {getStateCounselingServices().map((service, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 p-6 rounded-2xl border border-rose-500/20 shadow-lg hover:shadow-xl hover:shadow-rose-500/20 transform hover:scale-[1.01] transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="font-bold text-white text-lg">
                            {service.name}
                          </h5>
                          <span className="bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full text-sm font-medium">
                            {service.type}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <span className="flex items-center text-rose-300">
                            <Phone className="w-5 h-5 mr-2" />
                            {service.phone}
                          </span>
                          {service.website && (
                            <a
                              href={service.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-rose-400 hover:text-rose-300 underline transition-colors duration-200 block mt-2"
                            >
                              {service.website}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
