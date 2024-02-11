const Navigation = ({ circumference, headShape, step, goToStep }) => {
  return (
    <div className="fixed right-10 top-1/2 transform -translate-y-1/2">
      <div className="flex flex-col items-center">
        {/** Circle 1 */}
        <div
          className="w-16 h-16 bg-white border-4 border-gray-600 flex items-center justify-center rounded-full cursor-pointer"
          onClick={() => goToStep(1)}
        >
          1
        </div>
        {/** Line 1 */}
        <div
          className={`w-1 h-20 ${step >= 2 ? "bg-gray-600" : "bg-gray-300"}`}
        ></div>
        {/** Circle 2 */}
        <div
          className={`w-16 h-16 bg-white border-4 ${
            step >= 2 ? "border-gray-600" : "border-gray-300"
          } flex items-center justify-center rounded-full cursor-pointer ${
            circumference ? "" : "cursor-not-allowed"
          }`}
          onClick={() => circumference && goToStep(2)}
        >
          2
        </div>
        {/** Line 2 */}
        <div
          className={`w-1 h-20 ${step >= 3 ? "bg-gray-600" : "bg-gray-300"}`}
        ></div>
        {/** Circle 3 */}
        <div
          className={`w-16 h-16 bg-white border-4 ${
            step >= 3 ? "border-gray-600" : "border-gray-300"
          } flex items-center justify-center rounded-full cursor-pointer ${
            circumference && headShape ? "" : "cursor-not-allowed"
          }`}
          onClick={() => circumference && headShape && goToStep(3)}
        >
          3
        </div>
      </div>
    </div>
  );
};

export default Navigation;
