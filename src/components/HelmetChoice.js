import React from "react";
import HelmetVisualization from "./HelmetVisualization";

const HelmetChoice = ({ helmet, onPurchase, index }) => (
  <div className={`flex items-center px-8 mb-4`} id={`step-${index + 4}`}>
    <div className="flex flex-row w-full">
      {/* Left Side - Helmet Bottom Image */}
      <div className="relative w-1/3">
        <HelmetVisualization helmet={helmet} />
      </div>
      {/* Right Side - Helmet Details */}
      <div className="w-1/2 pl-12">
        <div>
          <p className="text-3xl font-semibold text-gray-500">
            {helmet["Helmet Brand"]}
          </p>
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-5xl">{helmet["Helmet Name"]}</h4>
            <span className="text-3xl font-semibold">${helmet["Price"]}</span>
          </div>
          <p className="text-xl mt-6">Size: {helmet["Size"]}</p>
          <p className="text-xl mt-6">
            Width Gap: {helmet.userWidGap.toFixed(2)} mm
          </p>
          <p className="text-xl">
            Length Gap: {helmet.userLenGap.toFixed(2)} mm
          </p>
          <p className="text-xl">VTech Rating: {helmet["VTech Rating"]}</p>
          <button
            className="mt-6 px-16 py-3 bg-gray-600 text-white rounded-2xl hover:bg-gray-700 focus:outline-none flex items-center"
            onClick={() => onPurchase(helmet["Purchase URL"])}
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default HelmetChoice;
