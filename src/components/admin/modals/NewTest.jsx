import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { DataContext } from "../../../context/DataContext";

function NewTest({ departments, subjects, setTestOpen }) {
  const [newData, setNewData] = useState({});
  const [durationParts, setDurationParts] = useState([]);
  const { tests, setTests } = useContext(DataContext);
  // exam.duration.split(":").map((part) => part.padStart(2, "0"))
  const { user } = useContext(UserContext);

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

  const handleSave = async () => {
    newData.created_by = user.usn;
    // newData.created_by = 7;
    console.log(newData);

    const token = localStorage.getItem("token");

    await axios
      .post("http://127.0.0.1:8000/exams/", newData, {
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .catch((err) => {
        console.log(err.message, err.response.data);
      })
      .then(async (res) => {
        console.log("Test Created Successfully! ", res.data);
        await axios
          .get("http://127.0.0.1:8000/exams/", {
            headers: {
              // "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          })
          .then((res) => {
            setTests(res.data);
          });
      });
  };

  return (
    <div className="absolute flex flex-col w-5/6 h-auto border border-purple-300 bg-white rounded p-4 space-y-4 z-10 drop-shadow-2xl">
      <div className="flex font-semibold tracking-wide text-xl justify-between items-center">
        <span>New Test Configuration</span>
        <button className="text-4xl p-0" onClick={() => setTestOpen(false)}>
          &times;
        </button>
      </div>
      <hr />
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 justify-start">
          <div className="flex items-center">
            <span className="font-semibold mr-2 w-36">Subject: </span>
            <select
              className="rounded p-2 flex-grow border-purple-200 shadow shadow-purple-200"
              value={newData.subject?.id}
              onChange={(e) =>
                setNewData({
                  ...newData,
                  subject: e.target.value,
                })
              }
            >
              <option class="dropdown-item" disabled selected value="undefined">
                Select an Option
              </option>
              {subjects.map((subject, subIndex) => (
                <option key={subject?.id} value={subject?.id}>
                  {subject?.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <span className="font-semibold mr-2 w-36">Exam Department:</span>
            <select
              //   value={exam?.department?.name}
              onChange={(e) => {
                setNewData({
                  ...newData,
                  department: e.target.value,
                });
              }}
              className="rounded p-2 flex-grow border-purple-200 shadow shadow-purple-200"
            >
              <option class="dropdown-item" disabled selected value="undefined">
                Select an Option
              </option>
              {departments.map((dept) => (
                <option key={dept?.id} value={dept?.id} id={dept?.id}>
                  {dept?.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2 justify-start">
          <div className="flex items-center">
            <span className="font-semibold mr-2 w-36">Start Time:</span>
            <input
              type="datetime-local"
              //   value={exam?.start_time.toString().slice(0, 16)}
              onChange={(e) =>
                setNewData({
                  ...newData,
                  start_time: e.target.value,
                })
              }
              className="rounded p-2 flex-grow border-purple-200 shadow shadow-purple-200"
            />
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2 w-36">End Time:</span>
            <input
              type="datetime-local"
              //   value={exam?.end_time.toString().slice(0, 16)}
              onChange={(e) =>
                setNewData({
                  ...newData,
                  end_time: e.target.value,
                })
              }
              className="rounded p-2 flex-grow border-purple-200 shadow shadow-purple-200"
            />
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2 w-36">Duration:</span>
            <div className="flex flex-grow gap-x-2 ">
              {["hours", "minutes", "seconds"].map((part, index) => (
                <div key={part} className="flex flex-col items-center">
                  <input
                    type="number"
                    // value={durationParts[index]}
                    onChange={(e) => handlePartChange(e, index)}
                    className="rounded p-2 w-20 border-purple-200 shadow shadow-purple-200"
                  />
                  {part}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* First Row */}
        <div className="flex flex-col">
          <label htmlFor="semester" className="font-semibold">
            Semester:
          </label>
          <input
            id="semester"
            type="number"
            onChange={(e) => {
              setNewData((old) => ({
                ...old,
                semester: parseInt(e.target.value),
              }));
            }}
            className="rounded p-2 border-purple-200 shadow shadow-purple-200"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="passingMarks" className="font-semibold">
            Passing Marks:
          </label>
          <input
            id="passingMarks"
            type="number"
            onChange={(e) =>
              setNewData({
                ...newData,
                passingMarks: parseInt(e.target.value),
              })
            }
            className="rounded p-2 border-purple-200 shadow shadow-purple-200"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="negativeMarks" className="font-semibold">
            Negative Marks:
          </label>
          <input
            id="negativeMarks"
            type="number"
            onChange={(e) =>
              setNewData({
                ...newData,
                negativeMarks: parseInt(e.target.value),
              })
            }
            className="rounded p-2 border-purple-200 shadow shadow-purple-200"
          />
        </div>

        {/* Second Row */}
        <div className="flex flex-col">
          <label htmlFor="marksPerQuestion" className="font-semibold">
            Marks Per Question:
          </label>
          <input
            id="marksPerQuestion"
            type="number"
            onChange={(e) =>
              setNewData({
                ...newData,
                marksPerQuestion: parseInt(e.target.value),
              })
            }
            className="rounded p-2 border-purple-200 shadow shadow-purple-200"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="totalMarks" className="font-semibold">
            Total Marks:
          </label>
          <input
            id="totalMarks"
            type="number"
            onChange={(e) =>
              setNewData({
                ...newData,
                totalMarks: parseInt(e.target.value),
              })
            }
            className="rounded p-2 border-purple-200 shadow shadow-purple-200"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="totalQuestions" className="font-semibold">
            Total Questions:
          </label>
          <input
            id="totalQuestions"
            type="number"
            onChange={(e) =>
              setNewData({
                ...newData,
                totalQuestions: parseInt(e.target.value),
              })
            }
            className="rounded p-2 border-purple-200 shadow shadow-purple-200"
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
