const HelmetVisualization = ({ helmet }) => {
    const ellipseWidth = (helmet.widthCalc / helmet["Width Exterior"]) * 100; 
    const ellipseHeight = (helmet.lengthCalc / helmet["Length Exterior"]) * 100; 

    return (
      <div className="relative w-1/2">
        <img
          src={require(`../assets/helmet-bottoms/${helmet.Bottom}`)}
          alt={`${helmet["Helmet Name"]} Bottom`}
          className="max-h-full max-w-full object-contain"
        />
        <svg
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          viewBox="0 0 100 100"
        >
          <ellipse
            cx="50"
            cy="50"
            rx={`${ellipseWidth / 2}%`}
            ry={`${ellipseHeight / 2}%`}
            fill="rgba(135, 206, 235, 0.5)" 
            fillOpacity="0.7"
          />
        </svg>
      </div>
    );
  }

export default HelmetVisualization