import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import useFetchData from "../hooks/useFetchData";
import { DataContext } from "../context/DataContext";
import { useLocation, useParams } from "react-router-dom";

function ExamConfig({ subjects, departments }) {
  const [newData, setNewData] = useState({});
  const { tests, setTests } = useContext(DataContext);

  const examId = useParams();

  const [exam] = useState(
    tests.filter((test) => test.id === parseInt(examId.examid))[0]
  );

  const [durationParts, setDurationParts] = useState(
    exam?.duration?.split(":").map((part) => part.padStart(2, "0"))
  );

  const updateDurationString = () => {
    return durationParts.map((part) => String(part).padStart(2, "0")).join(":");
  };
  const handlePartChange = async (e, index) => {
    const newValue = parseInt(e.target.value, 10);
    // const newValue = e.target.value;
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

  // useEffect(() => {
  //   setNewData(exam);
  // }, [newData]);

  console.log(newData);

  const handleSave = async (e) => {
    console.log(newData);

    await axios
      .patch(`http://127.0.0.1:8000/exams/${exam.id}/`, newData, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res);
        const updatedExam = res.data;
        setTests((prevTests) =>
          prevTests.map((test) =>
            test.id === updatedExam.id ? updatedExam : test
          )
        );
        console.log("updated exam: ", updatedExam);
      });
  };

  // console.log("l");

  return (
    <div className="flex flex-col w-full border border-purple-300 rounded p-4 space-y-4">
      <div className="font-semibold tracking-wide text-xl ">
        Exam Configuration
      </div>
      <hr />
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 justify-start">
          <div className="flex items-center">
            <span className="font-semibold mr-2 w-36">Subject:</span>
            <select
              className="rounded p-2 flex-grow border-purple-200 shadow shadow-purple-200"
              value={exam?.subject?.id} // Set defaultValue to the subject's id
              onChange={(e) =>
                setNewData({
                  ...newData,
                  subject: { id: e.target.value },
                })
              }
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.id} - {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2 w-36">Subject Department:</span>
            <input
              type="text"
              className="rounded p-2 flex-grow border-purple-200 shadow shadow-purple-200"
              value={departments[exam?.department]?.name}
              disabled
            />
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2 w-36">Exam Department:</span>
            <select
              value={exam?.department?.name}
              onChange={(e) =>
                setNewData({
                  ...newData,
                  department: { id: e.target.value },
                })
              }
              className="rounded p-2 flex-grow border-purple-200 shadow shadow-purple-200"
            >
              {departments.map((dept) => (
                <option key={dept?.name} value={dept?.name}>
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
              value={exam?.start_time.toString().slice(0, 16)}
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
              value={exam?.end_time.toString().slice(0, 16)}
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
                    value={durationParts[index]}
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

      <div className="flex w-full justify-evenly">
        <div className="flex items-center">
          <span className="font-semibold mr-2 w-fit">Semester:</span>
          <input
            type="number"
            defaultValue={exam?.semester}
            onChange={(e) => {
              setNewData((old) => ({
                ...old,
                semester: parseInt(e.target.value),
              }));
            }}
            className="rounded p-2 flex-grow border-purple-200 shadow shadow-purple-200"
          />
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-2 w-fit">Marks Per Question:</span>
          <input
            type="number"
            defaultValue={exam.marksPerQuestion}
            onChange={(e) =>
              setNewData({
                ...newData,
                marksPerQuestion: parseInt(e.target.value),
              })
            }
            className="rounded p-2 flex-grow border-purple-200 shadow shadow-purple-200"
          />
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-2 w-fit">Passing Marks:</span>
          <input
            type="number"
            defaultValue={exam.passingMarks}
            onChange={(e) =>
              setNewData({
                ...newData,
                passingMarks: parseInt(e.target.value),
              })
            }
            className="rounded p-2 flex-grow border-purple-200 shadow shadow-purple-200"
          />
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-2 w-fit">Negative Marks:</span>
          <input
            type="number"
            defaultValue={exam.negativeMarks}
            onChange={(e) =>
              setNewData({
                ...newData,
                negativeMarks: parseInt(e.target.value),
              })
            }
            className="rounded p-2 flex-grow border-purple-200 shadow shadow-purple-200"
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <button className="bg-red-500 text-white p-1 px-2 rounded">
          Reset
        </button>
        <button
          className="bg-green-500 text-white p-1 px-2 rounded"
          onClick={(e) => handleSave(e)}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default ExamConfig;
