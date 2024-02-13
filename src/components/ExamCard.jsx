import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import { DataContext } from "../context/DataContext";
function ExamCard({ exam }) {
  //   console.log(new Date().toLocaleString());
  //   console.log(new Date(start_time).toLocaleString());
  const timeDifferenceInSeconds = Math.floor(
    Math.abs(new Date(exam.start_time).getTime() - new Date().getTime()) / 1000
  );

  const navigate = useNavigate();

  const { departments, subjects } = useContext(DataContext);

  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: new Date(Date.now() + timeDifferenceInSeconds * 1000),
    autoStart: true,
  });

  const Timer = () => (
    <div className="flex text-white text-2xl font-medium tracking-widest">
      <span>
        {hours >= 10 ? null : 0}
        {hours}
      </span>
      <span className="">:</span>
      <span>
        {minutes >= 10 ? null : 0}
        {minutes}
      </span>
      <span className="">:</span>
      <span>
        {seconds >= 10 ? null : 0}
        {seconds}
      </span>
    </div>
  );
  // console.log(
  //   new Date(exam.start_time).toLocaleString({ timeZone: "Asia/Kolkata" })
  // );

  const handleStart = (e) => {
    e.preventDefault();
    console.log("start", exam.id);

    navigate(`/instructions/${exam.id}`, {
      replace: true,
      state: {
        exam: exam,
      },
    });
  };

  return (
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
            <Timer />
          )}
        </span>
      </button>
    </div>
  );
}

export default ExamCard;
