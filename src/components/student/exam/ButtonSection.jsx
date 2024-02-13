import React from "react";
import Timer from "../../Timer";

const ButtonsSection = ({ handleSave, handleSubmit, handleReset, time }) => {
  return (
    <div className="flex border-t-2 h-16 items-center px-4 justify-between">
      <SaveButton handleSave={handleSave} />
      <TimerButton handleSubmit={handleSubmit} time={time} />
      <ResetButton handleReset={handleReset} />
    </div>
  );
};

const SaveButton = ({ handleSave }) => {
  return (
    <div>
      <button
        className="bg-green-500 w-14 h-8 rounded font-semibold text-white tracking-wider"
        onClick={(e) => handleSave(e)}
      >
        Save
      </button>
    </div>
  );
};

const TimerButton = ({ handleSubmit, time }) => {
  return <Timer color="black" size="4xl" time={time} onExpire={handleSubmit} />;
};

const ResetButton = ({ handleReset }) => {
  return (
    <div>
      <button
        className="bg-red-500 w-14 h-8 rounded font-semibold text-white tracking-wider"
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  );
};

export default ButtonsSection;
