const HelmetVisualization = ({ helmet }) => {
  const aspectRatio =
    Number(helmet["Image Height"]) / Number(helmet["Image Width"]);
  const viewBox = `0 0 100 ${100 * aspectRatio}`;

  const ellipseWidth =
    (helmet.widthCalc / Number(helmet["Width Exterior"])) * 100;
  const ellipseHeight =
    (helmet.lengthCalc / Number(helmet["Length Exterior"])) * 100;
  
  return (
    <>
      <img
        src={require(`../assets/helmet-bottoms/${helmet.Bottom}`)}
        alt={`${helmet["Helmet Name"]} Bottom`}
        className="max-h-full max-w-full object-contain"
      />
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        viewBox={viewBox}
      >
        <ellipse
          cx="50"
          cy={`${50 * aspectRatio}`}
          rx={`${ellipseWidth / 2}%`}
          ry={`${ellipseHeight / 2}%`}
          fill="rgba(135, 206, 235, 0.5)"
          fillOpacity="0.7"
          stroke="rgba(135, 206, 235, 0.5)"
        />
        <text
          x="50%"
          y="50%" // Adjust based on aspect ratio
          fill="rgba(0, 0, 0, 1)"
          fontSize="8" // Adjust the font size as needed
          textAnchor="middle" // Centers the text horizontally
          alignmentBaseline="middle" // Centers the text vertically
          style={{ fontWeight: 'bold', userSelect: 'none' }} // Prevent text selection and bold the font
        >
          YOUR HEAD HERE
        </text>
      </svg>
    </>
  );
};

export default HelmetVisualization;
