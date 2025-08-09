import React from "react";
import { Phone, Users, FileText } from "lucide-react";

const QuickActions: React.FC = () => {
  return (
    <div className="bg-gray-800 mt-8 shadow-2xl border border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-6 border-b border-gray-700">
        <h3 className="text-2xl font-bold text-white">Quick Actions</h3>
      </div>
      <div className="p-6 space-y-4">
        <a
          href="https://www.cancer.org/about-us/online-help/contact-us.html#:~:text=Call%3A%201%2D800%2D227%2D2345&text=Cancer%2Drelated%20information%20and%20referrals%20to%20patient%2Drelated%20programs%20or%20resources"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-left p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-300 border border-cyan-500/20 shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 transform hover:scale-[1.02] flex items-center block cursor-pointer"
        >
          <Phone className="w-5 h-5 mr-3 text-cyan-400" />
          <span className="text-white font-medium">
            Call National Cancer Helpline
          </span>
        </a>
        <a
          href="https://www.cancer.org/support-programs-and-services.html"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-left p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 transition-all duration-300 border border-purple-500/20 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transform hover:scale-[1.02] flex items-center block cursor-pointer"
        >
          <Users className="w-5 h-5 mr-3 text-purple-400" />
          <span className="text-white font-medium">Find Support Groups</span>
        </a>
        <a
          href="https://www.fightcancer.org/sites/default/files/Health-Plan-Worksheet-Know-Your-Coverage-and-Costs.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-left p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all duration-300 border border-emerald-500/20 shadow-lg hover:shadow-xl hover:shadow-emerald-500/20 transform hover:scale-[1.02] flex items-center block cursor-pointer"
        >
          <FileText className="w-5 h-5 mr-3 text-emerald-400" />
          <span className="text-white font-medium">
            Download Cost Worksheet
          </span>
        </a>
      </div>
    </div>
  );
};

export default QuickActions;
