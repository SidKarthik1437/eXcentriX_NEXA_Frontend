import React from "react";
import { Link } from "react-router-dom";
import { useTimer } from "react-timer-hook";
function ExamCard({ exam }) {
  //   console.log(new Date().toLocaleString());
  //   console.log(new Date(start_time).toLocaleString());
  //   console.log(
  //     Math.abs(new Date(start_time).getTime() - new Date().getTime()) / 60000
  //   );

  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: new Date(exam.start_time),
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

  return (
    <div className="flex flex-col flex-grow min-w-min w-44 max-w-100 min-h-min h-44 max-h-80 border rounded-lg">
      <div className="flex  h-12 items-center justify-center border-b p-2">
        <span className="text-xl font-bold">{exam.id}</span>
      </div>
      <div className="flex w-auto h-auto items-center justify-center border-b p-2 text-center tracking-wider flex-1 flex-wrap">
        <span className="text-xl w-auto font-semibold">
          {" "}
          {exam.subject.name}
        </span>
      </div>
      <Link
        // to={{
        //   pathname: `/instructions/${exam.id}`,
        //   state: {
        //     exam: exam,
        //   },
        //       }}
        to={`/instructions/${exam.id}`}
        state={exam}
        className="flex  h-12 items-center justify-center p-2 text-center tracking-wider bg-purple-700 rounded-b-lg disabled:bg-gray-400"
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
      </Link>
    </div>
  );
}

export default ExamCard;
