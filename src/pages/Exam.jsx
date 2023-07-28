"use client";
import { usePageVisibility } from "../hooks/getVisState";
import { useState, useEffect, useRef } from "react";
import screenfull from "screenfull";
import { Link, useNavigate } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import { questions } from "../misc/questions";

const time = new Date();
time.setSeconds(time.getSeconds() + 3);

export default function Home() {
  const visibilityState = usePageVisibility();

  const navigate = useNavigate();
  const [warn, setWarn] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);
  const [selectedOptions, setSelectedOptions] = useState({});

  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: time,
    autoStart: true,
    onExpire: () => {
      handleSubmit();
    },
  });

  const handleOptionChange = (question, option) => {
    if (question.type === "one") {
      setSelectedOptions((prevState) => ({
        ...prevState,
        [question.question]: [option],
      }));
    } else {
      setSelectedOptions((prevState) => ({
        ...prevState,
        [question.question]: prevState[question.question]
          ? prevState[question.question].includes(option)
            ? prevState[question.question].filter((o) => o !== option)
            : [...prevState[question.question], option]
          : [option],
      }));
    }
  };

  const handleSubmit = () => {
    console.log("Submitted!");
    navigate("/submission", {
      replace: true,
    });
  };

  useEffect(() => {
    console.log(warnings);
    console.log(warn);
    if (warnings >= 2) {
      handleSubmit();
    }
  }, [warnings]);

  useEffect(() => {
    if (visibilityState === "hidden") {
      console.log("User has left the page");
      setWarn(true);
      setWarnings(warnings + 1);
    }
  }, [visibilityState]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = (e) => {
    console.log("NOOO IDEA");
    e.returnValue = "";
  };

  const goFullScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.request();
      setWarn(false);
    }
  };

  const ReSetup = () => {
    return (
      <div className="w-1/3 h-auto border-2 border-gray-600 rounded-lg relative self-center z-10 place-self-center top-1/3">
        <div className="px-4 py-2 text-2xl font-bold tracking-wider border-b-2">
          Warning!
        </div>
        <div className="flex flex-col p-2 tracking-wide gap-y-2">
          <span>You are about to "Exit" the portal.</span>
          <span>
            NOTE: YOU HAVE ATTEMPTED TO EXIT THE EXAM PORTAL. DO NOT EXIT OR
            SWITCH TABS OR WINDOWS DURING THE EXAM.
            <span>NEXT ATTEMPT WILL RESULT IN AUTOMATIC SUBMISSION.</span>
          </span>
        </div>
        <div className="flex justify-end p-2 border-t-2 gap-x-2">
          <button
            className="py-2 px-4 text-center bg-blue-600 text-lg text-white rounded font-semibold tracking-widest"
            onClick={() => {
              goFullScreen();
              setWarn(false);
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  };

  const exitHandler = () => {
    if (
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      console.log("Fullscreen Exited!");
      if (warnings < 2) {
        setWarn(true);
        setWarnings(warnings + 1);
      } else {
        handleSubmit();
      }
    }
  };

  useEffect(() => {
    if (document.addEventListener) {
      document.addEventListener("fullscreenchange", exitHandler, false);
      document.addEventListener("mozfullscreenchange", exitHandler, false);
      document.addEventListener("MSFullscreenChange", exitHandler, false);
      document.addEventListener("webkitfullscreenchange", exitHandler, false);
    }
    return () => {
      if (document.removeEventListener) {
        document.removeEventListener("fullscreenchange", exitHandler, false);
        document.removeEventListener("mozfullscreenchange", exitHandler, false);
        document.removeEventListener("MSFullscreenChange", exitHandler, false);
        document.removeEventListener(
          "webkitfullscreenchange",
          exitHandler,
          false
        );
      }
    };
  }, [warnings]);

  if (warn === true && warnings < 2) {
    return <ReSetup />;
  } else {
    return (
      <main className="flex h-screen w-full flex-col bg-white text-black select-none">
        {/* Timer */}
        <div className="px-4 py-2 text-4xl font-bold tracking-wider border-b-2">
          <span>
            {hours >= 10 ? null : 0}
            {hours}
          </span>
          :
          <span>
            {minutes >= 10 ? null : 0}
            {minutes}
          </span>
          :
          <span>
            {seconds >= 10 ? null : 0}
            {seconds}
          </span>
        </div>
        <div className="flex h-full p-2 border-t-2 gap-x-2">
          {/* Body */}
          <div className="flex w-full justify-between items-center">
            <div className="grid grid-cols-5 w-1/5 h-2/6 border overflow-y-auto p-2 ">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 flex items-center justify-center justify-self-center border ${
                    selectedQuestion === question
                      ? "border-blue-500 bg-blue-100"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedQuestion(question)}
                >
                  {question.id}
                </div>
              ))}
            </div>
            <div className="w-4/5 h-full p-4 border border-gray-300 ml-4 ">
              <p className="font-semibold text-lg">
                {selectedQuestion.id}. &nbsp;
                {selectedQuestion.question}
              </p>
              {selectedQuestion.options.map((option, index) => (
                <div key={index} className="mt-2">
                  <input
                    type="checkbox"
                    id={option}
                    checked={
                      selectedOptions[selectedQuestion.question] &&
                      selectedOptions[selectedQuestion.question].includes(
                        option
                      )
                    }
                    onChange={() =>
                      handleOptionChange(selectedQuestion, option)
                    }
                  />
                  <label className="ml-2" htmlFor={option}>
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }
}
