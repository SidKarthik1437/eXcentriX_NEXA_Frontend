import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import { DataContext } from "../../context/DataContext";
import Timer from "../Timer";
import { examServices } from "../../api/services";
import { ToastContainer, toast } from "react-toastify";
function ExamCard({ exam }) {
  //   console.log(new Date().toLocaleString());
  //   console.log(new Date(start_time).toLocaleString());
  const timeDifferenceInSeconds = Math.floor(
    Math.abs(new Date(exam.start_time).getTime() - new Date().getTime()) / 1000
  );

  const navigate = useNavigate();

  const { departments, subjects } = useContext(DataContext);

  const time = new Date(Date.now() + timeDifferenceInSeconds * 1000);

  const handleStart = (e) => {
    e.preventDefault();
    console.log("start", exam.id);
    examServices.startExamSession(exam?.id).then((res) => {
      console.log(res);
      toast(res.detial);
      if (res.data.status !== 0) {
        navigate(`/instructions/${exam.id}`, {
          replace: true,
          state: {
            exam: exam,
          },
        });
      } else {
        toast("This exam has ended");
      }
    });
  };

  console.log(exam);

  return (
    // <ToastContainer>
    <div className="flex flex-col flex-grow min-w-min w-44 max-w-100 min-h-min h-44 max-h-80 border rounded-lg">
      <div className="flex  h-12 items-center justify-center border-b p-2">
        <span className="text-xl font-bold">{exam.subject.id}</span>
      </div>
      <div className="flex w-auto h-auto items-center justify-center border-b p-2 text-center tracking-wider flex-1 flex-wrap">
        <span className="text-xl w-auto font-semibold">
          {" "}
          {exam.subject.name}
        </span>
      </div>
      <button
        onClick={(e) => handleStart(e)}
        className="flex h-12 items-center justify-center p-2 text-center tracking-wider bg-purple-700 rounded-b-lg disabled:bg-gray-400"
        disabled={
          new Date().toLocaleString() >=
          new Date(exam.start_time).toLocaleString()
            ? false
            : true
        }
      >
        <span className=" text-white font-bold tracking-widest antialiased">
          {new Date().toLocaleString() >=
          new Date(exam.start_time).toLocaleString() ? (
            "START"
          ) : (
            <Timer color="white" size="2xl" time={time} />
          )}
        </span>
      </button>
      <ToastContainer />
    </div>
  );
}

export default ExamCard;
