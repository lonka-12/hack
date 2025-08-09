import React, { useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  Phone,
  DollarSign,
  Heart,
  Building,
} from "lucide-react";
import { EMERGENCY_RESOURCES } from "../constants";

const EmergencyResources: React.FC = () => {
  const [showEmergencyDropdown, setShowEmergencyDropdown] = useState(false);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Phone":
        return Phone;
      case "DollarSign":
        return DollarSign;
      case "Heart":
        return Heart;
      case "Building":
        return Building;
      default:
        return Phone;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "red":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          hover: "hover:bg-red-500/15",
          text: "text-red-400",
          title: "text-red-300",
          phone: "text-red-200",
        };
      case "orange":
        return {
          bg: "bg-orange-500/10",
          border: "border-orange-500/20",
          hover: "hover:bg-orange-500/15",
          text: "text-orange-400",
          title: "text-orange-300",
          phone: "text-orange-200",
        };
      case "yellow":
        return {
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
          hover: "hover:bg-yellow-500/15",
          text: "text-yellow-400",
          title: "text-yellow-300",
          phone: "text-yellow-200",
        };
      case "purple":
        return {
          bg: "bg-purple-500/10",
          border: "border-purple-500/20",
          hover: "hover:bg-purple-500/15",
          text: "text-purple-400",
          title: "text-purple-300",
          phone: "text-purple-200",
        };
      default:
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          hover: "hover:bg-red-500/15",
          text: "text-red-400",
          title: "text-red-300",
          phone: "text-red-200",
        };
    }
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setShowEmergencyDropdown(!showEmergencyDropdown)}
        className="w-full bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/30 p-4 shadow-2xl hover:from-red-900/40 hover:to-orange-900/40 transition-all duration-300 flex items-center justify-between"
      >
        <div className="flex items-center">
          <AlertCircle className="mr-3 text-red-400" />
          <div className="text-left">
            <h3 className="text-xl font-bold text-red-300">
              Emergency Financial Resources
            </h3>
            <p className="text-red-200 text-sm">
              Click for immediate financial assistance options
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-6 h-6 text-red-400 transform transition-transform duration-300 ${
            showEmergencyDropdown ? "rotate-180" : ""
          }`}
        />
      </button>

      {showEmergencyDropdown && (
        <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-l border-r border-b border-red-500/30 p-6 shadow-xl transition-all duration-300">
          <p className="text-red-200 mb-6 text-lg">
            If you're facing immediate financial hardship affecting your cancer
            treatment:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {EMERGENCY_RESOURCES.map((resource, index) => {
              const IconComponent = getIconComponent(resource.icon);
              const colorClasses = getColorClasses(resource.color);

              return (
                <div
                  key={index}
                  className={`${colorClasses.bg} p-4 border ${colorClasses.border} ${colorClasses.hover} transition-colors duration-300`}
                >
                  <div className="flex items-center mb-2">
                    <IconComponent
                      className={`w-5 h-5 mr-2 ${colorClasses.text}`}
                    />
                    <strong className={colorClasses.title}>
                      {resource.title}
                    </strong>
                  </div>
                  <p className={`${colorClasses.phone} text-xl font-bold`}>
                    {resource.phone}
                  </p>
                  <p className={`${colorClasses.phone} text-sm`}>
                    {resource.description}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-6 p-4 bg-red-900/30 border border-red-500/40">
            <p className="text-red-200 font-medium">
              <AlertCircle className="inline w-4 h-4 mr-2" />
              These resources provide urgent financial assistance for cancer
              patients facing immediate hardship. Don't wait - reach out for
              help today.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyResources;
