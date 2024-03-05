import { useSwipeable } from "react-swipeable";
import HelmetVisualization from "./HelmetVisualization";

function HelmetItem({ helmet, index, showVisualization, onSwipe }) {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => onSwipe(index),
  });

  let helmetImage;
  if (helmet.Image) {
    helmetImage = require(`../assets/helmets/${helmet.Image}`);
  }

  const titles = ["Adequate fit", "Better fit", "Our pick"];
  const title = titles[index] || "Option";

  return (
    <div
      key={index}
      {...swipeHandlers}
      className="swipeable-container p-6 border border-gray-200 rounded-lg hover-bounce cursor-pointer"
    >
      <h3 className="font-bold text-2xl pb-6">{title}</h3>

      {showVisualization ? (
        <div className="w-full h-48 mb-2 flex justify-center items-center">
          <HelmetVisualization helmet={helmet} />
          <div>
            <p className="text-l pl-4">Size: {helmet["Size"]}</p>
            <p className="text-l mt-6 pl-4">
              Width Gap: {helmet.userWidGap.toFixed(2)} mm
            </p>
            <p className="text-l pl-4">
              Length Gap: {helmet.userLenGap.toFixed(2)} mm
            </p>
            <p className="text-l pl-4">VTech Rating: {helmet["VTech Rating"]}</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-48 mb-2 flex justify-center items-center">
          <img
            src={helmetImage}
            alt={helmet["Helmet Name"]}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
      <p className="text-xl font-semibold text-gray-500">
        {helmet["Helmet Brand"]}
      </p>
      <h4 className="font-semibold text-xl">
        {helmet["Helmet Name"]} ${helmet["Price"]}
      </h4>
      <p className="text-md text-gray-600">{helmet["Description"]}</p>
    </div>
  );
}

export default HelmetItem;
