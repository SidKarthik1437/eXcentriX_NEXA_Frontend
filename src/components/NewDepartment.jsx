import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/DataContext";
import axios from "axios";

function NewDepartment({ setDepOpen }) {
  const [newData, setNewData] = useState({});

  const { setDepartments } = useContext(DataContext);

  const handleSave = async () => {
    console.log(newData);

    const token = localStorage.getItem("token");
    await axios
      .post("http://127.0.0.1:8000/departments/", newData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        console.log("Subject Created Successfully: ", res);
      });
    await axios
      .get(`http://127.0.0.1:8000/departments/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        setDepartments(res.data);
      });

    setDepOpen(false);
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
