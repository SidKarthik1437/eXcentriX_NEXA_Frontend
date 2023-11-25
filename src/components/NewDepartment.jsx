import React, { useEffect, useState } from "react";

function NewDepartment({ setDepOpen }) {
  const [newData, setNewData] = useState({});
  const [durationParts, setDurationParts] = useState();
  // exam.duration.split(":").map((part) => part.padStart(2, "0"))

  const updateDurationString = () => {
    return durationParts.map((part) => String(part).padStart(2, "0")).join(":");
  };

  const handlePartChange = async (e, index) => {
    const newValue = parseInt(e.target.value, 10);
    // const newValue = e.target.value;s
    if (!isNaN(newValue)) {
      const newDurationParts = [...durationParts];
      newDurationParts[index] = newValue;
      setDurationParts(newDurationParts);
      console.log(durationParts);
      let durstr = await updateDurationString();
      setNewData({
        ...newData,
        duration: durstr,
      });
    }
  };

  useEffect(() => {
    console.log(newData);
  }, [newData]);

  const handleSave = () => {
    console.log(newData);
  };

  return (
    <div className="absolute flex flex-col w-auto h-auto border border-purple-300 bg-white rounded p-4 space-y-4 z-10 ">
      <div className="flex font-semibold tracking-wide text-xl justify-between items-center">
        <span>New Department Configuration</span>
        <button className="text-4xl p-0" onClick={() => setDepOpen(false)}>
          &times;
        </button>
      </div>
      <hr />
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-2 justify-start">
          <div className="flex items-center space-x-2">
            <span className="font-semibold mr-2 ">Department ID :</span>
            <input
              type="text"
              className="rounded flex-grow border-purple-200 shadow shadow-purple-200"
              //   value={exam?.subject.name}
              onChange={(e) =>
                setNewData({
                  ...newData,
                  id: e.target.value,
                })
              }
            />
            <span className="font-semibold mr-2">Department Name:</span>
            <input
              type="text"
              className="rounded flex-grow border-purple-200 shadow shadow-purple-200"
              //   value={exam?.subject.name}
              onChange={(e) =>
                setNewData({
                  ...newData,
                  name: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="flex w-full space-x-2"></div>
      <div className="flex w-full items-center justify-between pt-10">
        <button className="bg-red-500 text-white p-1 px-2 text-lg tracking-wider rounded">
          Reset
        </button>
        <button
          onClick={(e) => handleSave(e)}
          className="bg-green-500 text-white p-1 px-2 text-lg tracking-wider rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default NewDepartment;
