import React, { useEffect, useState } from "react";
import axios from "axios";

function NewTest({ departments, subjects, setSubOpen }) {
  const [newData, setNewData] = useState({});

  const handleSave = () => {
    console.log(newData);
    axios
      .post("http://127.0.0.1:8000/subjects/", newData, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("Subject Created Successfully: ", res);
      });
    axios
      .get(`http://127.0.0.1:8000/subjects/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        setSubjects(res.data);
      });
  };

  return (
    <div className="absolute flex flex-col w-auto h-auto border border-purple-300 bg-white rounded p-4 space-y-4 z-10 ">
      <div className="flex font-semibold tracking-wide text-xl justify-between items-center">
        <span>New Subject Configuration</span>
        <button className="text-4xl p-0" onClick={() => setSubOpen(false)}>
          &times;
        </button>
      </div>
      <hr />
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-2 justify-start">
          <div className="flex items-center space-x-2">
            <span className="font-semibold mr-2 ">Subject ID :</span>
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
            <span className="font-semibold mr-2">Subject Name:</span>
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
          <div className="flex items-center">
            <span className="font-semibold mr-2 w-36">Subject Department:</span>
            <select
              className="rounded p-2 flex-grow border-purple-200 shadow shadow-purple-200"
                defaultValue='-'
              onChange={(e) =>
                setNewData({
                  ...newData,
                  department: departments[e.target.value]["id"],
                })
              }
            >
              <option key="-" value="-" >
                -
              </option>
              {departments.map((department) => (
                <option key={department?.id} value={department?.id}>
                  {department?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex w-full space-x-2">
        <div className="flex items-center">
          <span className="font-semibold mr-2">Semester:</span>
          <input
            type="number"
            // defaultValue={exam?.semester}
            onChange={(e) =>
              setNewData({
                ...newData,
                semester: parseInt(e.target.value),
              })
            }
            className="rounded p-2 flex-grow border-purple-200 shadow shadow-purple-200"
          />
        </div>
      </div>
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

export default NewTest;
