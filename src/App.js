import { useState, useEffect, useCallback, Suspense } from "react";
import { useSwipeable } from "react-swipeable";
import helmetData from "./helmets-data-modified2.json";

import veryRoundImg from "./assets/head-shape/Baseline+2dev.png";
import roundImg from "./assets/head-shape/Baseline+1dev.png";
import intermediateImg from "./assets/head-shape/BaselineHead.png";
import ovalImg from "./assets/head-shape/Baseline-1dev.png";
import aeroImg from "./assets/head-shape/Baseline-2dev.png";
import headModelImg from "./assets/head-model.jpeg";
import topDownImg from "./assets/top-down-view.webp";
import example1 from "./assets/examplekav.png";
import exampleBotImg from "./assets/helmet-bottoms/kaskprotoneicon2-bot.jpg";

import { Model } from "./components/Helmet_giro";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Tooltip from "./components/Tooltip";
import measureImg from "./assets/measure-circumference.webp";
import shapesImg from "./assets/measure-shapes.jpg";

import Navigation from "./components/Navigation";
import HeadShapeImage from "./components/HeadShapeImage";
import HelmetFitOverlay from "./components/HelmetFitOverlay";
import HelmetVisualization from "./components/HelmetVisualization";
import HelmetItem from "./components/HelmetItem";

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
        let { fitScore, userWidGap, userLenGap, widthCalc, lengthCalc } =
          calculateFit(helmet, circumference, headShape);
        // console.log(helmet['Helmet Name'] + " len: " + lengthCalc)
        // console.log(helmet['Helmet Name'] + " circumference: " + circumference)
        // console.log(helmet['Helmet Name'] + " headShape: " + headShape)
        // console.log(helmet['Helmet Name'] + " lenGap: " + userLenGap)
        // console.log(helmet['Helmet Name'] + " widGap: " + userWidGap)
        return {
          ...helmet, // All the helmet data + new properties
          fitScore,
          userWidGap,
          userLenGap,
          widthCalc,
          lengthCalc,
        };
      });

      // If the comparator function returns a negative, a comes before b
      const kavHelmet = scoredHelmets.find(
        (helmet) => helmet["Helmet Name"] === "Portola Kaze"
      );
      scoredHelmets.sort((a, b) => a.fitScore - b.fitScore);

      // change to 3
      const topHelmets = scoredHelmets.slice(0, 3);
      // if (kavHelmet) {
      //   topHelmets.push(kavHelmet);
      // }

      // test
      // const testHelmet = scoredHelmets.find(
      //   (helmet) => helmet["Helmet Name"] === "S-Works Prevail 3"
      // );
      // if (testHelmet) {
      //   topHelmets.push(testHelmet)
      // }

      setBestHelmets(topHelmets);
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

    // console.log(helmet['Helmet Name'] + " lengthCalc: " + lengthCalc)

    return {
      fitScore,
      userWidGap,
      userLenGap,
      widthCalc,
      lengthCalc,
    };
  }

  // Update and find helmets when user changes input
  function handleCircumferenceChange(event) {
    setCircumference(Number(event.target.value) * 10);
  }

  function handleHeadShapeChange(value) {
    setHeadShape(Number(value));
  }

  const [showVisualization, setShowVisualization] = useState(
    Array(bestHelmets.length).fill(false)
  );

  const showHelmetVisualization = (index) => {
    const updatedShow = [...showVisualization];
    updatedShow[index] = !updatedShow[index];
    setShowVisualization(updatedShow);
  };

  // const swipeHandlers = bestHelmets.map((helmet, index) =>
  //   useSwipeable({
  //     onSwipedLeft: () => showHelmetVisualization(index),
  //   })
  // );

  return (
    <div className="container mx-auto p-4">
      {/* Navigation hidden on small screens, visible on medium and large screens */}
      <div className="hidden md:block lg:block">
        <Navigation
          circumference={circumference}
          headShape={headShape}
          step={step}
          goToStep={goToStep}
        />
      </div>
      {/* Step 1: Head Circumference */}
      <div
        className="min-h-screen flex flex-col justify-center items-center"
        id="step-1"
      >
        {/* Title */}
        <div className="w-full absolute top-0 left-0 pt-8 pl-16">
          {" "}
          {/** adjust this for small screen*/}
          <div className="h-2 bg-black w-3/5"></div>
          <h1 className="lg:text-6xl md:text-6xl sm:text-4xl font-bold mt-2 ml-4">
            {" "}
            {/** what is going on? */}
            The Bike Helmet Finder
          </h1>
        </div>
        <label
          htmlFor="circumference-range"
          className="block lg:text-2xl md:text-2xl sm:text-xl font-bold"
        >
          Step 1: Head Circumference (cm)
        </label>
        <div className="text-center lg:text-xl md:text-l sm: text-sm mt-2 pb-14 flex items-center justify-center">
          Adjust the slider to match your head circumference
          <div className="ml-1">
            <Tooltip image={measureImg} />
          </div>
        </div>
        <div className="w-1/3">
          <input
            type="range"
            id="circumference-range"
            name="circumference"
            min="48"
            max="68"
            step="1"
            value={circumference / 10}
            onChange={handleCircumferenceChange}
            className="w-full mt-4 h-2 bg-gray-200 appearance-none cursor-pointer"
          />
        </div>
        <div
          className="text-center text-xl mt-4"
          style={{
            visibility: circumference > 0 ? "visible" : "hidden",
            opacity: circumference > 0 ? 1 : 0,
          }}
        >
          {circumference / 10}
        </div>
        <div
          style={{
            visibility: circumference > 0 ? "visible" : "hidden",
            opacity: circumference > 0 ? 1 : 0,
          }}
        >
          <button
            onClick={() => goToStep(2)}
            className="mt-8 px-16 py-3 bg-gray-600 text-white rounded-3xl hover:bg-gray-700 focus:outline-none flex items-center"
          >
            <span className="ml-2"> Continue </span>
            <span className="material-icons-outlined cursor-pointer">
              keyboard_arrow_down
            </span>
          </button>
        </div>
      </div>
      {/* Step 2: Head Shape */}
      {circumference && (
        <>
          <div
            className="min-h-screen flex flex-col justify-center items-center"
            id="step-2"
          >
            <h1 className="block text-2xl font-bold">Step 2: Head Shape</h1>
            <div className="text-center text-xl mt-2 pb-14 flex items-center justify-center">
              Select the head shape that most closely resembles yours
              <div className="ml-1">
                <Tooltip image={shapesImg} />
              </div>
            </div>
            {/** Very Round */}
            <div className="mt-2 flex justify-around">
              <HeadShapeImage
                src={veryRoundImg}
                alt={"Very Round"}
                handleHeadShapeChange={handleHeadShapeChange}
                value={1.2}
                goToStep={goToStep}
              />
              {/** Round */}
              <HeadShapeImage
                src={roundImg}
                alt={"Round"}
                handleHeadShapeChange={handleHeadShapeChange}
                value={1.225}
                goToStep={goToStep}
              />
              {/** Intermediate */}
              <HeadShapeImage
                src={intermediateImg}
                alt={"Intermediate"}
                handleHeadShapeChange={handleHeadShapeChange}
                value={1.25}
                goToStep={goToStep}
              />
              {/** Oval */}
              <HeadShapeImage
                src={ovalImg}
                alt={"Oval"}
                handleHeadShapeChange={handleHeadShapeChange}
                value={1.275}
                goToStep={goToStep}
              />
              {/** Aero */}
              <HeadShapeImage
                src={aeroImg}
                alt={"Aero"}
                handleHeadShapeChange={handleHeadShapeChange}
                value={1.3}
                goToStep={goToStep}
              />
            </div>
          </div>
        </>
      )}
      {/* Step 3: Best Fitting Helmets */}
      {circumference && headShape && (
        <>
          <div
            className="min-h-screen flex flex-col justify-center items-center"
            id="step-3"
          >
            <h1 className="block text-2xl font-bold mb-8">
              Best Fitting Helmets
            </h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bestHelmets.map((helmet, index) => {
                return(
                <HelmetItem
                  key={index}
                  helmet={helmet}
                  index={index}
                  showVisualization={showVisualization[index]}
                  onSwipe={showHelmetVisualization}
                />
                );
                
                // return (
                // <div
                //   key={index}
                //   className="p-6 border border-gray-200 rounded-lg hover-bounce cursor-pointer"
                //   onClick={() => goToStep(4 + index)}
                // >
                // <h3 className="font-bold text-2xl pb-6">{title}</h3>
                // <div className="w-full h-48 mb-2 flex justify-center items-center">
                //   <img
                //     src={helmetImage}
                //     alt={helmet["Helmet Name"]}
                //     className="max-h-full max-w-full object-contain"
                //   />
                // </div>
                // <p className="text-xl font-semibold text-gray-500">
                //   {helmet["Helmet Brand"]}
                // </p>
                // <h4 className="font-semibold text-xl">
                //   {helmet["Helmet Name"]} ${helmet["Price"]}
                // </h4>
                // <p className="text-md text-gray-600">
                //   {helmet["Description"]}
                // </p>
                // </div>
                // );
              })}
            </div>
          </div>
          {window.innerWidth >= 768 && (
            <>
              {/** Choice 1 */}
              <div className="min-h-screen flex items-center px-8" id="step-4">
                <div className="flex flex-row w-full">
                  {/* Left Side - Helmet Bottom Image */}
                  <>
                    {bestHelmets[0] && (
                      <HelmetVisualization helmet={bestHelmets[0]} />
                    )}
                  </>
                  {/* Right Side - Helmet Details */}
                  <div className="w-1/2 pl-12">
                    {bestHelmets[0] && (
                      <div>
                        <p className="text-3xl font-semibold text-gray-500">
                          {bestHelmets[0]["Helmet Brand"]}
                        </p>
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-5xl">
                            {bestHelmets[0]["Helmet Name"]}
                          </h4>
                          <span className="text-3xl font-semibold">
                            ${bestHelmets[0]["Price"]}
                          </span>
                        </div>
                        <p className="text-xl mt-6">
                          Size: {bestHelmets[0]["Size"]}
                        </p>
                        <p className="text-xl mt-6">
                          Width Gap: {bestHelmets[0].userWidGap.toFixed(2)} mm
                        </p>
                        <p className="text-xl">
                          Length Gap: {bestHelmets[0].userLenGap.toFixed(2)} mm
                        </p>
                        <p className="text-xl">
                          VTech Rating: {bestHelmets[0]["VTech Rating"]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/** Choice 2 */}
              <div className="min-h-screen flex items-center px-8" id="step-5">
                <div className="flex flex-row w-full">
                  {/* Left Side - Helmet Bottom Image */}
                  <>
                    {bestHelmets[1] && (
                      <HelmetVisualization helmet={bestHelmets[1]} />
                    )}
                  </>
                  {/* Right Side - Helmet Details */}
                  <div className="w-1/2 pl-12">
                    {bestHelmets[1] && (
                      <div>
                        <p className="text-3xl font-semibold text-gray-500">
                          {bestHelmets[1]["Helmet Brand"]}
                        </p>
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-5xl">
                            {bestHelmets[1]["Helmet Name"]}
                          </h4>
                          <span className="text-3xl font-semibold">
                            ${bestHelmets[1]["Price"]}
                          </span>
                        </div>
                        <p className="text-xl mt-6">
                          Size: {bestHelmets[1]["Size"]}
                        </p>
                        <p className="text-xl mt-6">
                          Width Gap: {bestHelmets[1].userWidGap.toFixed(2)} mm
                        </p>
                        <p className="text-xl">
                          Length Gap: {bestHelmets[1].userLenGap.toFixed(2)} mm
                        </p>
                        <p className="text-xl">
                          VTech Rating: {bestHelmets[1]["VTech Rating"]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div
                className="min-h-screen flex flex-col justify-center items-center"
                id="step-6"
              >
                KAV is the best!
                {/* <Canvas
              className="canvas"
              style={{ width: "100%", height: "100vh" }}
            >
              <OrbitControls enableZoom={false} />
              <ambientLight intensity={0.5} />
              <directionalLight position={[-2, 5, 2]} intesity={1} />
              <Suspense fallback={null}>
                <Model />
              </Suspense>
            </Canvas> */}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

{
  /** Choice 2 */
}

{
  /* <div className="min-h-screen flex justify-center items-center">
            <div className="flex flex-row items-center justify-around w-full">
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
          </div> */
}

{
  /* <div
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
</div>; */
}
