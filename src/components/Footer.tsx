import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="mt-16 text-center text-gray-400">
      <p className="text-lg mb-2">
        This platform provides general information and should not replace
        professional medical or financial advice.
      </p>
      <p>
        Please consider donating to the American Cancer Society Cancer Action
        Network.
      </p>
      <a
        className="text-blue-500"
        href="https://www.fightcancer.org/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Donate Now
      </a>
    </div>
  );
};

export default Footer;
