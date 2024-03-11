const HelmetVisualization = ({ helmet }) => {
  const aspectRatio =
    Number(helmet["Image Height"]) / Number(helmet["Image Width"]);
  const viewBox = `0 0 100 ${100 * aspectRatio}`;

  const ellipseWidth =
    (helmet.widthCalc / Number(helmet["Width Exterior"])) * 100;
  const ellipseHeight =
    (helmet.lengthCalc / Number(helmet["Length Exterior"])) * 100;

  const centerX = 50; // Since viewBox width is 100, center is at 50
  const centerY = 50 * aspectRatio; // Adjusted for aspect ratio

  const lineXStart = centerX - ellipseWidth / 2;
  const lineXEnd = centerX + ellipseWidth / 2;
  const lineYStart = centerY - ellipseHeight / 2;
  const lineYEnd = centerY + ellipseHeight / 2;

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
        {/* Horizontal Line */}
        {/* <line
          x1={`${lineXStart}%`}
          y1={centerY}
          x2={`${lineXEnd}%`}
          y2={centerY}
          stroke="yellow"
          strokeDasharray="4"
          markerStart="url(#arrow)"
          markerEnd="url(#arrow)"
        /> */}
        {/* Vertical Line */}
        {/* <line
          x1={centerX}
          y1={`${lineYStart}%`}
          x2={centerX}
          y2={`${lineYEnd}%`}
          stroke="yellow"
          strokeDasharray="4"
          markerStart="url(#arrow)"
          markerEnd="url(#arrow)"
        /> */}
        {/* Arrow markers */}
        {/* <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="0"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="yellow" />
          </marker>
        </defs> */}
      </svg>
    </>
  );
};

export default HelmetVisualization;
