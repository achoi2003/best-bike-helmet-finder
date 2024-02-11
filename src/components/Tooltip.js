import React, { useState } from "react";

const Tooltip = ({ image }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div>
      <span
        className="material-icons-outlined"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        help
      </span>
      {showTooltip && (
        <div className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-2">
          <img
            src={image}
            alt="Measurement Instructions"
            className="w-screen max-w-lg"
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
