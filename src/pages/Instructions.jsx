"use client";

import { usePageVisibility } from "../hooks/getVisState";
import { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import StudentDetails from "../components/StudentDetails";
import screenfull from "screenfull";

export default function Instructions() {
  const visibilityState = usePageVisibility();
  const { user, setUser } = useContext(UserContext);
  console.log(user?.name);

  const navigate = useNavigate();
  const location = useLocation();
  let exam = location.state;

  useEffect(() => {
    if (!user) {
      setUser(JSON.parse(localStorage.getItem("user")));
      console.log(user?.name);
    }
  }, []);

  const [accepted, setAccepted] = useState(false);

  const goFullScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  };

  const Setup = () => {
    return (
      <div className="w-1/3 h-auto border-2 border-gray-600 rounded-lg relative self-center z-10 place-self-center top-1/3">
        <div className="px-4 py-2 text-2xl font-bold tracking-wider border-b-2">
          Attention!
        </div>
        <div className="flex flex-col p-2 tracking-wide gap-y-2">
          <span>You are about to enter the exam portal.</span>
          <span>
            Please note that any attempt to change the tab or window during the
            test may result in automatic termination and submission of your
            exam.
          </span>
          <span>
            Stay focused and ensure that you complete the exam within the
            allocated time. Good luck!
          </span>
        </div>
        <div className="flex justify-end p-2 border-t-2 gap-x-2">
          <button className="py-2 px-4 text-center bg-red-600 text-lg text-white rounded font-semibold tracking-widest">
            Exit
          </button>
          <button
            className="py-2 px-4 text-center bg-blue-600 text-lg text-white rounded font-semibold tracking-widest"
            onClick={() => {
              setAccepted(true);
              goFullScreen();
            }}
          >
            Enter
          </button>
        </div>
      </div>
    );
  };

  return (
    <main
      className={`flex relative h-screen w-full flex-col bg-white text-black `}
    >
      {!accepted && <Setup />}
      {accepted && (
        <div>
          <div className="px-4 py-2 text-4xl font-bold tracking-widest border-b-2">
            PREFACE
          </div>
          <div className="flex w-full justify-start ">
            <section className="flex flex-col w-1/5 h-full  gap-y-4 p-4">
              {/* Student & Exam Details */}
              <StudentDetails user={user} />
            </section>
            <section className="flex flex-col w-full h-full p-4 items-start justify-start">
              <div className="text-2xl font-bold tracking-wider">
                INSTRUCTIONS
              </div>
            </section>
          </div>
          <div className="flex justify-end p-2 border-t-2 gap-x-2">
            <Link
              to={`/exam/${exam.id}`}
              state={exam}
              className="py-2 px-4 text-center bg-blue-600 text-lg text-white rounded font-semibold tracking-widest"
              // onClick={() => {
              //   navigate("/exam");
              // }}
            >
              Enter
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
