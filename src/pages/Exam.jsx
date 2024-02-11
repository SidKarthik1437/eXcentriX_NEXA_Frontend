import { usePageVisibility } from "../hooks/getVisState";
import { useState, useEffect, useRef, useContext } from "react";
import screenfull from "screenfull";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTimer } from "react-timer-hook";
// import { questions } from "../misc/questions";
import { UserContext } from "../context/UserContext";
import StudentDetails from "../components/StudentDetails";
import devtools from "devtools-detect";
import axios from "axios";

// const time = new Date();
// time.setSeconds(time.getSeconds() + 30000);
var ansTable = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
};

export default function Exam() {
  const visibilityState = usePageVisibility();
  const { user, setUser } = useContext(UserContext);

  const navigate = useNavigate();
  const location = useLocation();

  let exam = location.state;
  let time = new Date(
    new Date().getTime() +
      exam.duration
        .split(":")
        .reduce((acc, time, i) => acc + time * Math.pow(60, 2 - i) * 1000, 0)
  );

  const [warn, setWarn] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [unsaved, setUnsaved] = useState(false);
  const [qi, setQI] = useState(1);

  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: time,
    autoStart: true,
    onExpire: () => {
      handleSubmit();
    },
  });

  const handleOptionChange = (question, optionLabel) => {
    // If the question is not in selectedOptions and not in answers, increase the unsaved count by 1
    if (
      selectedOptions[question.id] === undefined &&
      !answers.some((answer) => answer.id === question.id)
    ) {
      setUnsaved((prev) => prev + 1);
    }

    // If the question is already in answers, remove it as it needs to be saved again
    setAnswers((prev) => prev.filter((answer) => answer.id !== question.id));

    if (question.question_type === "SINGLE") {
      setSelectedOptions((prevState) => ({
        ...prevState,
        [question.id]: [optionLabel],
      }));
    } else {
      setSelectedOptions((prevState) => ({
        ...prevState,
        [question.id]: prevState[question.id]
          ? prevState[question.id].includes(optionLabel)
            ? prevState[question.id].filter((o) => o !== optionLabel)
            : [...prevState[question.id], optionLabel]
          : [optionLabel],
      }));
    }
  };

  const handleReset = () => {
    if (!selectedQuestion) return; // Return if no question is selected

    // Decrease unsaved count by 1 if the question is in selectedOptions but not in answers
    if (
      selectedOptions[selectedQuestion.id] !== undefined &&
      !answers.some((answer) => answer.id === selectedQuestion.id)
    ) {
      setUnsaved((prev) => (prev > 0 ? prev - 1 : 0));
    }

    // Update selectedOptions state to remove the selected options for the current question
    setSelectedOptions((prev) => {
      const newState = { ...prev };
      delete newState[selectedQuestion.id];
      return newState;
    });

    // Update answers state to remove the saved answer for the current question
    setAnswers((prev) =>
      prev.filter((answer) => answer.id !== selectedQuestion.id)
    );
  };

  const handleSubmit = () => {
    console.log("Submitted!");
    // Check if there are any unsaved answers
    if (unsaved > 0) {
      console.log("You have unsaved answers. Please save before submitting.");
      return; // Optionally, you can show a notification to the user
    }

    // Assuming the token is stored in localStorage
    const token = localStorage.getItem("token");

    // Construct the headers for the request
    const headers = {
      Authorization: `Token ${token}`, // Change to the type of token you are using, e.g., Bearer or Token
      "Content-Type": "application/json",
    };

    // Transform answers to the format expected by your backend
    const payload = answers.map((answer) => ({
      question_id: answer.id,
      selected_choices: selectedOptions[answer.id],
    }));

    console.log(payload);
    // alert("submitted");

    // // Send the request
    axios
      .post(
        "http://localhost:8000/student-answers",
        {
          exam_id: exam.id,
          answers: payload,
        },
        { headers }
      )
      .then((res) => {
        console.log(res.data);
        navigate("/submission", {
          replace: true,
          state: { result: res.data },
        });
      })
      .catch((err) => console.log(err));
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
    let isMounted = true; // To track whether component is mounted

    const token = localStorage.getItem("token");

    if (!user) {
      const localUser = JSON.parse(localStorage.getItem("user"));
      setUser(localUser);
    }

    if (!token) {
      navigate("/login", { replace: true });
    } else {
      axios
        .get(`http://127.0.0.1:8000/question-assignments/${exam.id}`, {
          headers: { Authorization: `Token ${token}` },
        })
        .then((res) => {
          if (isMounted) {
            console.log(res.data);
            setQuestions(res.data[0].assigned_questions);
            setSelectedQuestion(res.data[0].assigned_questions[0]);
            console.log(questions);
          }
        })
        .catch((err) => console.log(err));
    }

    return () => (isMounted = false); // Clean up: set isMounted to false when component unmounts
  }, [user, setUser, navigate, setQuestions]);

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
    window.addEventListener("devtoolschange", handleDevToolsChange);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // window.removeEventListener("devtoolschange", handleDevToolsChange);
    };
  }, []);

  const handleBeforeUnload = (e) => {
    console.log("NOOO IDEA");
    alert("NOOO IDEA");
    e.returnValue = "";
  };
  const handleDevToolsChange = (event) => {
    console.log("Is DevTools open:", event.detail.isOpen);
    // alert("Is DevTools open:", event.detail.isOpen);
    setWarn(true);
    setWarnings(warnings + 1);
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

  const handleSave = () => {
    // Check if an option is selected for the current question
    if (!selectedQuestion || !selectedOptions[selectedQuestion.id]) {
      console.log("No answer selected!"); // Optionally log a message or show a notification to the user
      return; // Return if no option is selected
    }

    // If the question is in selectedOptions but not in answers, decrease the unsaved count by 1
    if (
      selectedOptions[selectedQuestion.id] !== undefined &&
      !answers.some((answer) => answer.id === selectedQuestion.id)
    ) {
      setUnsaved((prev) => (prev > 0 ? prev - 1 : 0));
    }

    // Proceed with saving the answer
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
                answer: selectedOptions[selectedQuestion.id],
              }
            : answer
        );
      } else {
        // If not, append the new answer
        return [
          ...prevState,
          {
            id: selectedQuestion.id,
            answer: selectedOptions[selectedQuestion.id],
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
      <main className="flex h-screen w-full flex-col bg-white text-black select-none overflow-hidden">
        <div className="flex px-4 py-2  border-b-2 justify-between items-center">
          <div className="text-4xl font-bold tracking-wider">
            <span className="">N</span>
            <span className="text-purple-700">E</span>
            <span className="">X</span>
            <span className="text-purple-700">A</span>
          </div>
          <div>
            <button
              className=" h-8 bg-purple-600 text-white font-semibold px-2 rounded"
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
          </div>
        </div>
        <div className="flex h-full p-2 border-t-2 gap-x-2">
          {/* Body */}
          <div className="flex w-full justify-between items-center">
            <section className="flex flex-col  w-1/5 h-full  gap-y-4 ">
              {/* Student & Exam Details */}
              <StudentDetails user={user} />
              {/* Question Nav */}
              <div className="grid grid-cols-5 grid-rows-5 h-3/6 w-full overflow-y-auto p-2 border rounded scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 ">
                {questions?.map((question, index) => (
                  <div
                    key={index}
                    className={`
        w-10 h-10 m-1 flex items-center justify-center 
        justify-self-center rounded border-2 font-semibold 
        hover:bg-purple-200 
        ${
          selectedQuestion === question
            ? "!border-purple-500 bg-purple-200 text-purple-700"
            : "border-gray-300"
        } 
        ${
          answers.findIndex((answer) => answer.id === question.id) !== -1
            ? "!bg-green-500 border-green-400 text-white"
            : null
        } 
        ${
          selectedOptions[question.id] !== undefined &&
          answers.findIndex((answer) => answer.id === question.id) === -1
            ? "bg-yellow-500 border-yellow-400 text-white"
            : null
        }
    `}
                    onClick={() => setSelectedQuestion(question)}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              {/* Stats */}
              <div className="flex h-2/6 w-full gap-x-1 justify-evenly">
                <div
                  className="flex flex-row items-center border-2 rounded-3xl w-fit h-fit p-3 gap-x-1 bg-green-500 text-white font-medium text-lg 
                "
                >
                  <span className="text-sm font-normal px-1">Answered</span>
                  <span>{answers?.length}</span>/
                  {/* <hr className="text-white bg-whote w-10 h-[2px]" /> */}
                  <span>{questions?.length}</span>
                </div>
                <div
                  className="flex flex-row items-center border-2 rounded-3xl w-fit h-fit p-3 gap-x-1 bg-yellow-500 text-white font-medium text-lg
                "
                >
                  <span className="text-sm font-normal px-1">Attempted</span>
                  <span>{unsaved}</span>/
                  {/* <hr className="text-white bg-whote w-10 h-[2px]" /> */}
                  <span>{questions?.length}</span>
                </div>
              </div>
            </section>
            <div className="flex flex-col w-4/5 h-full border border-gray-300 ml-4 rounded ">
              <div className="flex flex-col h-full py-5 p-10 space-y-2 overflow-y-scroll">
                <div className="flex flex-col font-semibold text-lg justify-center">
                  <div className="w-fit text-center text-sm bg-purple-300 px-2 rounded-xl text-purple-700">
                    {selectedQuestion?.question_type}
                  </div>
                  <div>{selectedQuestion?.text}</div>
                </div>
                {selectedQuestion?.image ? (
                  // <div className="h-44 object-cover">
                  <img
                    src={`http://localhost:8000${selectedQuestion.image}`}
                    alt="question"
                    className="w-72 max-h-44 object-contain rounded "
                  />
                ) : // </div>
                null}
                {selectedQuestion?.choices.map((option, index) => (
                  <div
                    key={index}
                    className={`mt-2 border h-fit max-h-72 w-full rounded-lg hover:bg-purple-100 flex items-center
                    ${
                      selectedOptions[selectedQuestion.id] &&
                      selectedOptions[selectedQuestion.id].includes(option.id)
                        ? " bg-purple-100"
                        : "border-gray-300"
                    }
                    `}
                  >
                    <div className="flex h-10 items-center">
                      <input
                        className="border-2 ml-2 form-checkbox border-gray-300 rounded-full text-purple-500  checked:bg-purple-500 hover:bg-purple-500 appearance-none outline-none  focus:ring-0 focus:outline-0"
                        type="checkbox"
                        id={option.id}
                        checked={
                          selectedOptions[selectedQuestion.id]
                            ? selectedOptions[selectedQuestion.id].includes(
                                option.id
                              )
                            : false // ensure that checked is not undefined
                        }
                        onChange={() =>
                          handleOptionChange(selectedQuestion, option.id)
                        }
                      />
                      <label
                        className="ml-2 h-full flex w-max items-center  "
                        htmlFor={option.label}
                      >
                        {option.label}. {option.content}
                      </label>
                    </div>
                    {option?.image ? (
                      <img
                        src={`http://localhost:8000${option.image}`}
                        alt="choice image"
                        className="w-auto max-w-44 h-auto max-h-44 object-contain rounded m-2 "
                      />
                    ) : null}
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
                  <button
                    className="bg-red-500 w-14 h-8 rounded font-semibold text-white tracking-wider"
                    onClick={handleReset}
                  >
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
