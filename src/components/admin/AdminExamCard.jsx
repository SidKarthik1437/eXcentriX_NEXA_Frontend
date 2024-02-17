import React from "react";
import { useNavigate } from "react-router-dom";
function AdminExamCard({ exam, subjects, departments }) {
  const navigate = useNavigate();

  const handleConfigure = (e) => {
    e.preventDefault();
    console.log("start", exam?.id);

    navigate(`/configure/${exam?.id}`, {
      state: {
        exam: exam,
      },
    });
  };

  // console.log(exam, subjects, departments);
  return (
    <div className="flex flex-col flex-grow min-w-min w-44 max-w-100 min-h-min h-48 max-h-80 border rounded-lg justify-self-center">
      <div className="flex h-12 items-center justify-between border-b p-2">
        <span className="text-xl font-bold px-4 border-r text-center">
          {exam?.semester}
        </span>
        <span className="flex-1 text-xl font-bold text-center ">
          {exam?.subject?.name}
        </span>
      </div>
      <div className="flex w-auto h-auto items-center justify-center border-b p-2 text-center tracking-wider flex-1 flex-wrap gap-y-2">
        <span className="text-xl w-auto font-semibold">
          {" "}
          {subjects.filter((subject) => subject?.id === exam?.subject)[0]?.name}
        </span>
        <hr className="w-full" />
        <span className="text-xs w-auto font-semibold ">
          {" "}
          {departments.filter((dept) => dept?.id === exam?.department)[0]?.name}
        </span>
      </div>
      <button
        onClick={(e) => handleConfigure(e)}
        className="flex h-12 items-center justify-center p-2 text-center tracking-wider bg-purple-700 rounded-b-lg disabled:bg-gray-400"
      >
        <span className=" text-white font-bold tracking-widest antialiased">
          Configure
        </span>
      </button>
    </div>
  );
}

export default AdminExamCard;
