import { useState, useEffect, useCallback } from "react";
import helmetData from "./helmets-data-modified2.json";

import veryVeryRoundImg from "./assets/head-shape/Baseline+3dev.png";
import veryRoundImg from "./assets/head-shape/Baseline+2dev.png";
import roundImg from "./assets/head-shape/Baseline+1dev.png";
import intermediateImg from "./assets/head-shape/BaselineHead.png";
import ovalImg from "./assets/head-shape/Baseline-1dev.png";
import aeroImg from "./assets/head-shape/Baseline-2dev.png";
import veryAeroImg from "./assets/head-shape/Baseline-3dev..png";
import measureImg from "./assets/SideHeadShot(1).png";

import Navigation from "./components/Navigation";
import HelmetVisualization from "./components/HelmetVisualization";
import HelmetItem from "./components/HelmetItem";

export default function HelmetFinder() {
  const [circumference, setCircumference] = useState("");
  const [headShape, setHeadShape] = useState(1.25);
  const [bestHelmets, setBestHelmets] = useState([]);
  const [step, setStep] = useState(1);

  const [measureImgSize, setMeasureImgSize] = useState(1);

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
      kavHelmet.userLenGap = 0;
      kavHelmet.userWidGap = 0;

      scoredHelmets.sort((a, b) => a.fitScore - b.fitScore);

      // change to 2
      const topHelmets = scoredHelmets.slice(0, 2);
      if (kavHelmet) {
        topHelmets.push(kavHelmet);
      }

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
    setMeasureImgSize(1 + (event.target.value - 48) / 200);
  }

  const headShapeImages = {
    1.175: {
      image: veryVeryRoundImg,
      description: "Very Round",
    },
    1.2: {
      image: veryRoundImg,
      description: "Rounder",
    },
    1.225: {
      image: roundImg,
      description: "Round",
    },
    1.25: {
      image: intermediateImg,
      description: "Intermediate",
    },
    1.275: {
      image: ovalImg,
      description: "Oval",
    },
    1.3: {
      image: aeroImg,
      description: "Aero",
    },
    1.325: {
      image: veryAeroImg,
      description: "Very Aero",
    },
  };

  function handleHeadShapeChange(event) {
    setHeadShape(Number(event.target.value));
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
    <div className="container mx-auto p-2">
      {/* Navigation hidden on small screens, visible on medium and large screens */}
      <div className="hidden lg:block">
        <Navigation
          circumference={circumference}
          headShape={headShape}
          step={step}
          goToStep={goToStep}
        />
      </div>
      {/* Step 1: Head Circumference */}
      <div
        className="min-h-screen flex flex-col justify-center items-center lg:flex-row lg:items-center"
        id="step-1"
      >
        {/* Title */}
        <div className="w-full absolute top-0 left-0 pt-4 sm:pt-6 pl-4 pr-4 sm:pl-16">
          <div className="bg-black h-1 sm:h-2 w-full lg:w-4/5 xl:w-3/5"></div>
          <h1 className="text-3xl sm:text-6xl font-bold mt-2 ml-2">
            The Bike Helmet Finder
          </h1>
        </div>
        <div className="hidden lg:block lg:w-2/5">
          <img
            src={measureImg}
            alt="Measurement Guide"
            style={{ transform: `scale(${measureImgSize})` }}
          />
        </div>
        <div className="flex flex-col justify-center items-center lg:flex-grow lg:mr-36">
          <label
            htmlFor="circumference-range"
            className="block text-xl sm:text-3xl font-bold pl-4 pr-4"
          >
            Step 1: Head Circumference
          </label>
          <div className="text-center text-l sm:text-xl pl-4 pr-4 mt-2 pb-4 sm:pb-6 flex items-center justify-center">
            Adjust the slider to match your head circumference (cm)
          </div>
          <div className="lg:hidden relative w-1/2 sm:w-1/4">
            <img
              src={measureImg}
              alt="Measurement Guide"
              style={{ transform: `scale(${measureImgSize})` }}
            />
          </div>
          <div className="pt-4 w-2/3 sm:w-2/5 lg:w-2/3">
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
            {circumference / 10} cm
          </div>
          <div
            style={{
              visibility: circumference > 0 ? "visible" : "hidden",
              opacity: circumference > 0 ? 1 : 0,
            }}
          >
            <button
              onClick={() => goToStep(2)}
              className="mt-6 px-16 py-3 bg-gray-600 text-white rounded-3xl hover:bg-gray-700 focus:outline-none flex items-center"
            >
              <span className="ml-2"> Continue </span>
              <span className="material-icons-outlined cursor-pointer">
                keyboard_arrow_down
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* Step 2: Head Shape */}
      {circumference && (
        <>
          <div
            className="min-h-screen flex flex-col justify-center items-center"
            id="step-2"
          >
            <label
              htmlFor="shape-range"
              className="block text-xl sm:text-3xl font-bold pl-4 pr-4"
            >
              Step 2: Head Shape
            </label>
            <div className="text-center text-l sm:text-xl pl-4 pr-4 mt-2 pb-4 sm:pb-6 flex items-center justify-center">
              Adjust the slider to match your head shape
            </div>
            <div className="flex justify-center w-1/2 sm:w-1/3">
              <img
                src={headShapeImages[headShape].image}
                alt="Selected Head Shape"
              />
            </div>
            <div className="w-2/3 sm:w-2/5 lg:w-1/3">
              <input
                type="range"
                id="shape-range"
                name="shape"
                min="1.175"
                max="1.325"
                step=".025"
                value={headShape}
                onChange={handleHeadShapeChange}
                className="w-full mt-4 h-2 bg-gray-200 appearance-none cursor-pointer"
              />
            </div>
            <div className="text center text-xl mt-4">
              {headShapeImages[headShape].description}
            </div>
            <div>
              <button
                onClick={() => goToStep(3)}
                className="mt-6 px-16 py-3 bg-gray-600 text-white rounded-3xl hover:bg-gray-700 focus:outline-none flex items-center"
              >
                <span className="ml-2"> Continue </span>
                <span className="material-icons-outlined cursor-pointer">
                  keyboard_arrow_down
                </span>
              </button>
            </div>
            {/* * Very Round
            <div className="mt-2 flex justify-around">
              <HeadShapeImage
                src={veryRoundImg}
                alt={"Very Round"}
                handleHeadShapeChange={handleHeadShapeChange}
                value={1.2}
                goToStep={goToStep}
              />
              * Round
              <HeadShapeImage
                src={roundImg}
                alt={"Round"}
                handleHeadShapeChange={handleHeadShapeChange}
                value={1.225}
                goToStep={goToStep}
              />
              * Intermediate
              <HeadShapeImage
                src={intermediateImg}
                alt={"Intermediate"}
                handleHeadShapeChange={handleHeadShapeChange}
                value={1.25}
                goToStep={goToStep}
              />
              * Oval
              <HeadShapeImage
                src={ovalImg}
                alt={"Oval"}
                handleHeadShapeChange={handleHeadShapeChange}
                value={1.275}
                goToStep={goToStep}
              />
              * Aero
              <HeadShapeImage
                src={aeroImg}
                alt={"Aero"}
                handleHeadShapeChange={handleHeadShapeChange}
                value={1.3}
                goToStep={goToStep}
              />
            </div> */}
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
            <h1 className="block text-xl sm:text-3xl font-bold pl-4 pr-4 lg:pb-8">
              Best Fitting Helmets
            </h1>
            <h2 className="lg:hidden text-center text-l sm:text-xl pl-4 pr-4 mt-2 pb-4 sm:pb-6 flex items-center justify-center">
              Swipe to see more.
            </h2>
            <div className="grid sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bestHelmets.map((helmet, index) => {
                return (
                  <HelmetItem
                    key={index}
                    helmet={helmet}
                    index={index}
                    showVisualization={showVisualization[index]}
                    onSwipe={showHelmetVisualization}
                  />
                );
              })}
            </div>
          </div>
          {window.innerWidth >= 768 && (
            <>
              {/** Choice 1 */}
              <div className="flex items-center px-8" id="step-4">
                <div className="flex flex-row w-full">
                  {/* Left Side - Helmet Bottom Image */}
                  <div className="relative w-1/3">
                    {bestHelmets[0] && (
                      <HelmetVisualization helmet={bestHelmets[0]} />
                    )}
                  </div>
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
              <div className="flex items-center px-8 pt-2" id="step-5">
                <div className="flex flex-row w-full">
                  {/* Left Side - Helmet Bottom Image */}
                  <div className="relative w-1/3">
                    {bestHelmets[1] && (
                      <HelmetVisualization helmet={bestHelmets[1]} />
                    )}
                  </div>
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
              {/** Choice 3 */}
              <div className="flex items-center px-8 pt-2" id="step-6">
                <div className="flex flex-row w-full">
                  {/* Left Side - Helmet Bottom Image */}
                  <div className="relative w-1/3">
                    {bestHelmets[2] && (
                      <HelmetVisualization helmet={bestHelmets[2]} />
                    )}
                  </div>
                  {/* Right Side - Helmet Details */}
                  <div className="w-1/2 pl-12">
                    {bestHelmets[2] && (
                      <div>
                        <p className="text-3xl font-semibold text-gray-500">
                          {bestHelmets[2]["Helmet Brand"]}
                        </p>
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-5xl">
                            {bestHelmets[2]["Helmet Name"]}
                          </h4>
                          <span className="text-3xl font-semibold">
                            ${bestHelmets[2]["Price"]}
                          </span>
                        </div>
                        <p className="text-xl mt-6">
                          Size: {bestHelmets[2]["Size"]}
                        </p>
                        <p className="text-xl mt-6">
                          Width Gap: {bestHelmets[2].userWidGap.toFixed(2)} mm
                        </p>
                        <p className="text-xl">
                          Length Gap: {bestHelmets[2].userLenGap.toFixed(2)} mm
                        </p>
                        <p className="text-xl">
                          VTech Rating: {bestHelmets[2]["VTech Rating"]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
