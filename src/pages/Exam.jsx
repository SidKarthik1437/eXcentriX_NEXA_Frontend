"use client";
import { usePageVisibility } from "../hooks/getVisState";
import { useState, useEffect, useRef } from "react";
import screenfull from "screenfull";
import { Link, useNavigate } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import { questions } from "../misc/questions";

const time = new Date();
time.setSeconds(time.getSeconds() + 30000);

export default function Home() {
  const visibilityState = usePageVisibility();

  const navigate = useNavigate();
  const [warn, setWarn] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [answers, setAnswers] = useState([]);
  const [unsaved, setUnsaved] = useState(false);

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
        [question.id]: [option],
      }));
    } else {
      setSelectedOptions((prevState) => ({
        ...prevState,
        [question.id]: prevState[question.id]
          ? prevState[question.id].includes(option)
            ? prevState[question.id].filter((o) => o !== option)
            : [...prevState[question.id], option]
          : [option],
      }));
    }
  };

  const handleSubmit = () => {
    console.log("Submitted!");
    // navigate("/submission", {
    //   replace: true,
    // });
  };

  const getUnsaved = () => {
    let count = 0;
    for (let question of questions) {
      if (
        selectedOptions[question.id] !== undefined &&
        !answers.some((answer) => answer.id === question.id)
      ) {
        count += 1;
      }
    }
    setUnsaved(count);
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

  const handleSave = (e) => {
    setAnswers((prevState) => {
      // Check if the selected question is already answered
      const existingAnswerIndex = prevState.findIndex(
        (answer) => answer.id === selectedQuestion.id
      );

      // If it is answered, update the answer
      if (existingAnswerIndex !== -1) {
        return prevState.map((answer, index) =>
          index === existingAnswerIndex
            ? {
                id: selectedQuestion.id,
                answer: selectedOptions[selectedQuestion.question],
              }
            : answer
        );
      } else {
        // If not, append the new answer
        return [
          ...prevState,
          {
            id: selectedQuestion.id,
            answer: selectedOptions[selectedQuestion.question],
          },
        ];
      }
    });
  };

  const Timer = () => (
    <div className="flex text-black text-4xl font-medium tracking-widest">
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

  useEffect(() => {
    getUnsaved();
  }, [selectedOptions]);

  if (warn === true && warnings < 2) {
    return <ReSetup />;
  } else {
    return (
      <main className="flex h-screen w-full flex-col bg-white text-black select-none">
        <div className="flex px-4 py-2  border-b-2 justify-between items-center">
          <div className="text-4xl font-bold tracking-wider">
            <span className="">N</span>
            <span className="text-purple-700">E</span>
            <span className="">X</span>
            <span className="text-purple-700">A</span>
          </div>
          <div>
            <button className=" h-8 bg-purple-600 text-white font-semibold px-2 rounded">
              Submit
            </button>
          </div>
        </div>
        <div className="flex h-full p-2 border-t-2 gap-x-2">
          {/* Body */}
          <div className="flex w-full justify-between items-center">
            <section className="flex flex-col  w-1/5 h-full  gap-y-4 ">
              {/* Student & Exam Details */}
              <div className="flex flex-col h-2/6 w-full gap-y-1 justify-evenly">
                <div className="flex space-x-2">
                  <div className="flex flex-col items-center border-2 rounded-lg p-2 w-full h-fit  bg-white-500 text-gray-600 font-medium">
                    {/* <span className="text-sm font-sm px-1">Answered</span> */}
                    <span>Name</span>
                    <hr className="text-white w-full h-[2px]" />
                    <span>Siddharth M Karthikeyan</span>
                  </div>
                </div>
                <div className="flex gap-x-2">
                  <div className="flex flex-col items-center border-2 rounded-lg p-2 w-full h-fit bg-white-500 text-gray-600 font-medium ">
                    {/* <span className="text-sm font-sm px-1">Answered</span> */}
                    <span>USN</span>
                    <hr className="text-white w-full h-[2px]" />
                    <span>1GA20AD044</span>
                  </div>

                  <div className="flex flex-col items-center border-2 rounded-lg p-2 w-full h-fit bg-white-500 text-gray-600 font-medium ">
                    {/* <span className="text-sm font-sm px-1">Answered</span> */}
                    <span>Sub Code</span>
                    <hr className="text-white w-full h-[2px]" />
                    <span>20MAT662</span>
                  </div>
                </div>
                <div className="flex gap-x-2">
                  <div className="flex flex-col items-center border-2 rounded-lg p-2 w-full h-fit bg-white-500 text-gray-600 font-medium ">
                    {/* <span className="text-sm font-sm px-1">Answered</span> */}
                    <span>Subject Name</span>
                    <hr className="text-white w-full h-[2px]" />
                    <span>Queuing Theory</span>
                  </div>
                </div>
              </div>
              {/* Question Nav */}
              <div className="grid grid-cols-5 h-3/6 w-full overflow-y-auto p-2 border rounded scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 ">
                {questions.map((question, index) => (
                  <div
                    key={index}
                    className={`w-10 h-10 m-1 flex items-center justify-center justify-self-center rounded border-2 font-semibold hover:bg-purple-200
                            ${
                              selectedQuestion === question
                                ? "!border-purple-500 bg-purple-200 text-purple-700"
                                : "border-gray-300"
                            }
                            ${
                              answers.findIndex(
                                (answer) => answer.id === question.id
                              ) !== -1
                                ? "bg-green-500 border-green-400 text-white"
                                : null
                            }
                            ${
                              selectedOptions[question.id] !== undefined &&
                              answers.findIndex(
                                (answer) => answer.id === question.id
                              ) === -1
                                ? "bg-yellow-500 border-yellow-400 text-white"
                                : null
                            }`}
                    onClick={() => setSelectedQuestion(question)}
                  >
                    {question.id}
                  </div>
                ))}
              </div>
              {/* Stats */}
              <div className="flex h-2/6 w-full gap-x-1 justify-evenly">
                <div
                  className="flex flex-row items-center border-2 rounded-3xl w-fit h-fit p-2 gap-x-1 bg-green-500 text-white font-medium text-lg 
                "
                >
                  <span className="text-sm font-normal px-1">Answered</span>
                  <span>{answers.length}</span>/
                  {/* <hr className="text-white bg-whote w-10 h-[2px]" /> */}
                  <span>{questions.length}</span>
                </div>
                <div
                  className="flex flex-row items-center border-2 rounded-3xl w-fit h-fit p-2 gap-x-1 bg-yellow-500 text-white font-medium text-lg
                "
                >
                  <span className="text-sm font-normal px-1">Attempted</span>
                  <span>{unsaved}</span>/
                  {/* <hr className="text-white bg-whote w-10 h-[2px]" /> */}
                  <span>{questions.length}</span>
                </div>
              </div>
            </section>
            <div className="flex flex-col w-4/5 h-full border border-gray-300 ml-4 rounded justify-between">
              <div className="p-10">
                <div className="font-semibold text-lg">
                  {selectedQuestion.id}. &nbsp;
                  {selectedQuestion.question}
                </div>
                {selectedQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`mt-2 border h-10 w-full rounded-lg hover:bg-purple-100 flex items-center 
                    ${
                      selectedOptions[selectedQuestion.id] &&
                      selectedOptions[selectedQuestion.id].includes(option)
                        ? " bg-purple-100"
                        : "border-gray-300"
                    }
                    `}
                  >
                    <input
                      className="border-2 ml-2 form-checkbox border-gray-300 rounded-full text-purple-500  checked:bg-purple-500 hover:bg-purple-500 appearance-none outline-none  focus:ring-0 focus:outline-0"
                      type="checkbox"
                      id={option}
                      checked={
                        selectedOptions[selectedQuestion.id] &&
                        selectedOptions[selectedQuestion.id].includes(option)
                      }
                      onChange={() =>
                        handleOptionChange(selectedQuestion, option)
                      }
                    />
                    <label
                      className="ml-2 w-full h-full flex items-center  "
                      htmlFor={option}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex border-t-2 h-16 items-center px-4 justify-between">
                <div>
                  <button
                    className="bg-green-500 w-14 h-8 rounded font-semibold text-white tracking-wider"
                    onClick={(e) => handleSave(e)}
                  >
                    Save
                  </button>
                </div>
                <Timer />
                <div>
                  <button className="bg-red-500 w-14 h-8 rounded font-semibold text-white tracking-wider">
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
