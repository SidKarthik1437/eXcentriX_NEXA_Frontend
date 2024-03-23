// ButtonsSection.jsx

import React from "react";
import Timer from "../../Timer";

const ButtonSection = ({ handleSave, handleSubmit, handleReset, handleNext, time }) => {
  return (
    <div className="flex flex-grow border-t-2 h-16 items-center px-4 justify-between bg-white">
      <div className="flex">
        <SaveButton handleSave={handleSave} />
        <NextButton handleNext={handleNext} /> {/* Use handleNext for the Next button */}
        <ResetButton handleReset={handleReset} />
      </div>
      <TimerButton handleSubmit={handleSubmit} time={time} />
    </div>
  );
};

const SaveButton = ({ handleSave }) => {
  return (
    <button
      className="bg-green-500 w-14 h-8 rounded font-semibold text-white tracking-wider mr-2"
      onClick={(e) => handleSave(e)}
    >
      Save
    </button>
  );
};

const NextButton = ({ handleNext }) => {
  return (
    <button
      className="bg-blue-500 w-14 h-8 rounded font-semibold text-white tracking-wider mr-2"
      onClick={handleNext}
    >
      Next
    </button>
  );
};

const TimerButton = ({ handleSubmit, time }) => {
  return <Timer color="black" size="4xl" time={time} onExpire={handleSubmit} />;
};

const ResetButton = ({ handleReset }) => {
  return (
    <button
      className="bg-red-500 w-14 h-8 rounded font-semibold text-white tracking-wider"
      onClick={handleReset}
    >
      Reset
    </button>
  );
};

export default ButtonSection;
