import React from "react";

const HeadShapeImage = ({
  src,
  alt,
  handleHeadShapeChange,
  value,
  goToStep,
}) => {
  return (
    <div className="flex flex-col items-center">
      <img
        src={src}
        alt={alt}
        onClick={() => {
          handleHeadShapeChange(value);
          goToStep(3);
        }}
        className="cursor-pointer object-cover hover:opacity-75 transition-opacity duration-300"
      />
      <p>{alt}</p>
    </div>
  );
};

export default HeadShapeImage;
