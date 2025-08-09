import React from "react";
import { Heart } from "lucide-react";

const Header: React.FC = () => {
  return (
    <>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-500/10 blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/10 blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-cyan-400/10 blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-2xl mb-6">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          The Cost of Cancer
        </h1>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Connect with clear treatment cost estimates, financial aid resources,
          and counseling services relevant to your state
        </p>
      </div>
    </>
  );
};

export default Header;
