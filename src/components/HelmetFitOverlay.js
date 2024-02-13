const HelmetFitOverlay = ({ widthGap, lengthGap, imageSrc, helmetName }) => {
  // Convert the gaps to a percentage of the image size for scaling
  // You may need to adjust the calculation based on the actual image size
  const widthPercentage = Math.max(0, 100 - widthGap * 10); // Example conversion
  const lengthPercentage = Math.max(0, 100 - lengthGap * 10); // Example conversion

  const ellipseStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: `${widthPercentage}%`,
    height: `${lengthPercentage}%`,
    backgroundColor: 'rgba(0, 0, 0,)',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
  };

  return (
    <div style={{ position: "relative" }}>
      <img
        src={imageSrc}
        alt={helmetName}
        style={{ display: "block", width: "100%", height: "auto" }}
      />
      <div style={ellipseStyle} />
    </div>
  );
};

export default HelmetFitOverlay