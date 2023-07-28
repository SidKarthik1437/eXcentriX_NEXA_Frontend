"use client";
import { usePageVisibility } from "../hooks/getVisState";
import { useState, useEffect, useRef } from "react";
import screenfull from "screenfull";
import { Link, useNavigate } from "react-router-dom";
import { useTimer } from "react-timer-hook";

const questions = [
  {
    id: 1,
    question: "What is the capital of India?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    type: "one",
  },
  {
    id: 2,
    question: "What is the capital of Singapore?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    type: "many",
  },
  {
    id: 3,
    question: "What is the capital of IDK?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    type: "one",
  },
  {
    id: 4,
    question: "What is the capital of pakistan?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    type: "many",
  },
  {
    id: 5,
    question: "What is the capital of India?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    type: "one",
  },
  {
    id: 6,
    question: "What is the capital of Singapore?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    type: "many",
  },
  {
    id: 1,
    question: "What is the capital of India?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    type: "one",
  },
  {
    id: 2,
    question: "What is the capital of Singapore?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    type: "many",
  },
  {
    id: 3,
    question: "What is the capital of IDK?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    type: "one",
  },
  {
    id: 4,
    question: "What is the capital of pakistan?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    type: "many",
  },
  {
    id: 5,
    question: "What is the capital of India?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    type: "one",
  },
  {
    id: 6,
    question: "What is the capital of Singapore?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    type: "many",
  },
  {
    id: 1,
    question: "What is the capital of India?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    type: "one",
  },
  {
    id: 2,
    question: "What is the capital of Singapore?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    type: "many",
  },
  {
    id: 3,
    question: "What is the capital of IDK?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    type: "one",
  },
  {
    id: 4,
    question: "What is the capital of pakistan?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    type: "many",
  },
  {
    id: 5,
    question: "What is the capital of India?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    type: "one",
  },
  {
    id: 6,
    question: "What is the capital of Singapore?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    type: "many",
  },
];
const time = new Date();
time.setSeconds(time.getSeconds() + 3);

export default function Home() {
  const visibilityState = usePageVisibility();

  const navigate = useNavigate();

  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);
  const [selectedOptions, setSelectedOptions] = useState({});

  if (!screenfull.isEnabled) {
    screenfull.request();
  }

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
    onExpire: () => console.log("Ended"),
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

  useEffect(() => {
    if (visibilityState === "hidden") {
      // User has switched tabs or minimized the browser
      // You can implement your warning or auto-submit logic here
      console.log("User has left the page");
    }
  }, [visibilityState]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = (e) => {
    // Cancel the event as stated by the standard.
    e.preventDefault();
    // Chrome requires returnValue to be set.
    e.returnValue = "";
  };

  // console.log()
  return (
    <main className="flex h-screen w-full flex-col bg-white text-black select-none">
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
        {/* <div></div>
        <div>
          <div>Question</div>
          <div>Options</div>
        </div> */}
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
                    selectedOptions[selectedQuestion.question].includes(option)
                  }
                  onChange={() => handleOptionChange(selectedQuestion, option)}
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
