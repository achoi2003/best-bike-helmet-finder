import { useState, useEffect, useCallback, Suspense } from "react";
import helmetData from "./helmets-data2.json";

import veryRoundImg from "./assets/head-shape/very-round-head.png";
import roundImg from "./assets/head-shape/round-head.png";
import intermediateImg from "./assets/head-shape/intermediate-head.png";
import ovalImg from "./assets/head-shape/oval-head.png";
import aeroImg from "./assets/head-shape/aero-head.png";
import headModelImg from "./assets/head-model.jpeg";
import helmetBotImg from "./assets/helmet-bottom.png";

import { Model } from "./components/Helmet_giro";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

export default function HelmetFinder() {
  const [circumference, setCircumference] = useState("");
  const [headShape, setHeadShape] = useState("");
  const [bestHelmets, setBestHelmets] = useState([]);
  const [step, setStep] = useState(1);

  const goToStep = (targetStep) => {
    setStep(targetStep);

    setTimeout(() => {
      const element = document.getElementById(`step-${targetStep}`);
      if (element) {
        window.scrollTo({
          top: element.offsetTop,
          behavior: "smooth",
        });
      }
    }, 0); // short delay to allow the DOM to update
  };

  const findBestHelmets = useCallback(() => {
    // For each helmet in helmetData...
    if (circumference && headShape) {
      let scoredHelmets = helmetData.map((helmet) => {
        let { fitScore, userWidGap, userLenGap } = calculateFit(
          helmet,
          circumference,
          headShape
        );
        // console.log(helmet['Helmet Name'] + " circumference: " + circumference)
        // console.log(helmet['Helmet Name'] + " headShape: " + headShape)
        // console.log(helmet['Helmet Name'] + " lenGap: " + userLenGap)
        // console.log(helmet['Helmet Name'] + " widGap: " + userWidGap)
        return {
          ...helmet, // All the helmet data + new properties
          fitScore,
          userWidGap,
          userLenGap,
        };
      });

      // If the comparator function returns a negative, a comes before b
      scoredHelmets.sort((a, b) => a.fitScore - b.fitScore);
      setBestHelmets(scoredHelmets.slice(0, 3));
    }
  }, [circumference, headShape]);

  useEffect(() => {
    findBestHelmets();
  }, [circumference, headShape, findBestHelmets]);

  function calculateFit(helmet, userCircumference, userHeadShape) {
    let widthCalc =
      Math.sqrt(
        (2 * Math.pow(userCircumference / 6.28, 2)) /
          (1 + Math.pow(userHeadShape, 2))
      ) * 2;
    let lengthCalc = widthCalc * userHeadShape;

    let userWidGap = Number(helmet["Width Interior"]) - widthCalc;
    let userLenGap = Number(helmet["Length Interior"]) - lengthCalc;

    // console.log("Length Interior: " + helmet['Length Interior'])
    // console.log("Width Interior: " + helmet['Width Interior'])
    // console.log(helmet['Helmet Name'] + " userCircumference: " + userCircumference)
    // console.log(helmet['Helmet Name'] + " userHeadShape: " + userHeadShape)
    // console.log(helmet['Helmet Name'] + " userLenGap: " + userLenGap)
    // console.log(helmet['Helmet Name'] + " userWidGap: " + userWidGap)

    // Helmets that don't fit are assigned a high unfit score of 999
    let fitScore =
      userLenGap < 0 || userWidGap < 0
        ? 999
        : Math.sqrt(Math.pow(userWidGap, 2) + Math.pow(userLenGap, 2));

    return {
      fitScore,
      userWidGap,
      userLenGap,
    };
  }

  // Update and find helmets when user changes input
  function handleCircumferenceChange(event) {
    setCircumference(Number(event.target.value) * 10);
  }

  function handleHeadShapeChange(value) {
    setHeadShape(Number(value));
  }

  return (
    <div className="container mx-auto p-4">
      {/* Step 1: Head Circumference */}
      <div
        className="min-h-screen flex flex-col justify-center items-center"
        id="step-1"
      >
        <label
          htmlFor="circumference-range"
          className="block text-xl font-bold text-gray-700"
        >
          Step 1: Head Circumference (cm)
        </label>
        <div>
          <input
            type="range"
            id="circumference-range"
            name="circumference"
            min="48"
            max="68"
            step="1"
            value={circumference / 10}
            onChange={handleCircumferenceChange}
            className="w-full mt-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="text-center mt-2">
          {circumference
            ? circumference / 10
            : "Adjust the slider to match your head circumference"}
        </div>
        {circumference > 0 && (
          <button
            onClick={() => goToStep(2)}
            className="mt-4 px-10 py-3 border-2 border-gray-600 text-gray-700 hover:bg-gray-200 focus:outline-none flex items-center justify-center"
          >
            <span> Continue </span>
            <span className="material-icons-outlined cursor-pointer">
              keyboard_arrow_down
            </span>
          </button>
        )}
      </div>
      {/* Step 2: Head Shape */}
      {step >= 2 && (
        <>
          <div
            className="min-h-screen flex flex-col justify-center items-center"
            id="step-2"
          >
            <h3 className="block text-xl font-bold text-gray-700">
              Step 2: Head Shape
            </h3>
            <div className="mt-2 flex justify-around">
              <div className="flex flex-col items-center">
                <img
                  src={veryRoundImg}
                  alt="Very Round"
                  onClick={() => handleHeadShapeChange(1.2)}
                  className="cursor-pointer object-cover"
                />
                <p className={`${headShape === 1.2 ? "text-blue-600" : ""}`}>
                  Very Round
                </p>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src={roundImg}
                  alt="Round"
                  onClick={() => handleHeadShapeChange(1.225)}
                  className="cursor-pointer object-cover"
                />
                <p className={`${headShape === 1.225 ? "text-blue-600" : ""}`}>
                  Round
                </p>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src={intermediateImg}
                  alt="Intermediate"
                  onClick={() => handleHeadShapeChange(1.25)}
                  className="cursor-pointer object-cover"
                />
                <p className={`${headShape === 1.25 ? "text-blue-600" : ""}`}>
                  Intemediate
                </p>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src={ovalImg}
                  alt="Oval"
                  onClick={() => handleHeadShapeChange(1.275)}
                  className="cursor-pointer object-cover"
                />
                <p className={`${headShape === 1.275 ? "text-blue-600" : ""}`}>
                  Oval
                </p>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src={aeroImg}
                  alt="Aero"
                  onClick={() => handleHeadShapeChange(1.3)}
                  className="cursor-pointer object-cover"
                />
                <p className={`${headShape === 1.3 ? "text-blue-600" : ""}`}>
                  Aero
                </p>
              </div>
            </div>
            {headShape > 0 && (
              <button
                onClick={() => goToStep(3)}
                className="mt-4 px-10 py-3 border-2 border-gray-600 text-gray-700 hover:bg-gray-200 focus:outline-none flex items-center justify-center"
              >
                <span> Continue </span>
                <span className="material-icons-outlined cursor-pointer">
                  keyboard_arrow_down
                </span>
              </button>
            )}
          </div>
        </>
      )}
      {/* Step 3: Best Fitting Helmets */}
      {step >= 3 && (
        <div
          className="min-h-screen flex flex-col justify-center items-center"
          id="step-3"
        >
          <h2 className="text-2xl font-bold mb-4">Best Fitting Helmets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bestHelmets.map((helmet, index) => {
              const helmetImage = require(`./assets/helmets/${helmet.Image}`);
              const targetStep = 4 + index;

              console.log(`./assets/helmets/${helmet.Image}`);
              return (
                <div
                  key={index}
                  className="helmet-info p-4 border border-gray-200 rounded-lg"
                >
                  <h3 className="font-semibold text-lg mb-2">
                    {helmet["Helmet Name"]}
                  </h3>
                  {/* <p className="text-sm text-gray-600">
                    VTech Rating: {helmet["VTech Rating"]}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: ${helmet["Retail Price"]}
                  </p>
                  <p className="text-sm text-gray-600">
                    Width Gap: {helmet.userWidGap.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Length Gap: {helmet.userLenGap.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Fit Score: {helmet.fitScore.toFixed(2)}
                  </p> */}
                  <img src={helmetImage} alt={helmet["Helmet Name"]} />
                  <button
                    onClick={() => goToStep(targetStep)}
                    className="mt-4 px-10 py-3 border-2 border-gray-600 text-gray-700 hover:bg-gray-200 focus:outline-none flex items-center justify-center"
                  >
                    <span> See More </span>
                    <span className="material-icons-outlined cursor-pointer">
                      keyboard_arrow_down
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Step 4: Best Fitting Helmet #1 */}
      {step >= 4 && (
        <div
          className="min-h-screen flex justify-center items-center"
          id="step-4"
        >
          <div className="flex flex-row items-center justify-around w-full">
            {/* Left Side - Overlay Images */}
            <div className="relative w-1/2 h-auto">
              <img
                src={headModelImg}
                alt="Head Model"
                className="w-full h-auto"
              />
              <img
                src={require(`./assets/helmets/${bestHelmets[0].Image}`)}
                alt={bestHelmets[0]["Helmet Name"]}
                className="absolute top-0 left-0 w-full h-auto opacity-50"
              />
            </div>

            {/* Right Side - Helmet Bottom Image */}
            <div className="w-2/3 h-auto flex justify-center items-center relative">
              <img
                src={helmetBotImg}
                alt="Helmet Bottom"
                className="w-1/2 h-auto"
              />
              <div
                className="absolute top-0 left-0 w-full h-full flex justify-center items-center transition-opacity duration-100"
                style={{
                  backgroundColor: "rgba(173, 216, 230, 0.5)",
                  borderRadius: "50%",
                  width: "40%",
                  height: "80%",
                  transform: "translate(-50%, -50%)",
                  top: "50%",
                  left: "50%",
                }}
              >
                {/* Hover effect */}
                <div
                  className="absolute w-full h-full bg-blue-100 opacity-0 hover:opacity-100 transition-opacity duration-100"
                  style={{
                    borderRadius: "50%",
                  }}
                >
                  <div>
                    <p className="text-sm text-gray-600">
                      Width Gap: {bestHelmets[0].userWidGap.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Length Gap: {bestHelmets[0].userLenGap.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Fit Score: {bestHelmets[0].fitScore.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Step 5: Best Fitting Helmet #2 */}
      {step >= 4 && (
        <div
          className="min-h-screen flex justify-center items-center"
          id="step-5"
        >
          <div className="flex flex-row items-center justify-around w-full">
            {/* Left Side - Overlay Images */}
            <div className="relative w-1/2 h-auto">
              <img
                src={headModelImg}
                alt="Head Model"
                className="w-full h-auto"
              />
              <img
                src={require(`./assets/helmets/${bestHelmets[1].Image}`)}
                alt={bestHelmets[1]["Helmet Name"]}
                className="absolute top-0 left-0 w-full h-auto opacity-50"
              />
            </div>
            {/* Right Side - Helmet Bottom Image */}
            <div className="w-2/3 h-auto flex justify-center items-center relative">
              <img
                src={helmetBotImg}
                alt="Helmet Bottom"
                className="w-1/2 h-auto"
              />
              <div
                className="absolute top-0 left-0 w-full h-full flex justify-center items-center transition-opacity duration-100"
                style={{
                  backgroundColor: "rgba(173, 216, 230, 0.5)",
                  borderRadius: "50%",
                  width: "40%",
                  height: "80%",
                  transform: "translate(-50%, -50%)",
                  top: "50%",
                  left: "50%",
                }}
              >
                {/* Hover effect */}
                <div
                  className="absolute w-full h-full bg-blue-100 opacity-0 hover:opacity-100 transition-opacity duration-100"
                  style={{
                    borderRadius: "50%",
                  }}
                >
                  <div>
                    <p className="text-sm text-gray-600">
                      Width Gap: {bestHelmets[1].userWidGap.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Length Gap: {bestHelmets[1].userLenGap.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Fit Score: {bestHelmets[1].fitScore.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Step 6: Best Fitting Helmet #3 */}
      {step >= 4 && (
        <div
          className="min-h-screen flex flex-col justify-center items-center"
          id="step-6"
        >
          <Canvas className="canvas" style={{ width: "100%", height: "100vh" }}>
            <OrbitControls enableZoom={false} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[-2, 5, 2]} intesity={1} />
            <Suspense fallback={null}>
              <Model />
            </Suspense>
          </Canvas>
        </div>
      )}
    </div>
  );
}

//   <div>
//   <h2 className="text-2xl font-bold mb-4">Helmet Fit Visualization</h2>
//   <div className="grid grid-cols-1 gap-4">
//     {bestHelmets.map((helmet, index) => {
//       const helmetImage = require(`./assets/helmets/${helmet.Image}`);
//       return (
//         <div
//           key={index}
//           className="p-4 border border-gray-200 rounded-lg"
//         >
//           <h3 className="font-semibold text-lg mb-2">
//             {helmet["Helmet Name"]}
//           </h3>
//           <div className="relative">
//             <img
//               src={headModelImg}
//               alt="Head Model"
//               className="w-full h-auto"
//             />
//             <img
//               src={helmetImage}
//               alt={helmet["Helmet Name"]}
//               className="absolute top-[-360px] left-0 w-full h-auto opacity-50"
//             />
//           </div>
//         </div>
//       );
//     })}
//   </div>
// </div>
