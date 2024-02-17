import { usePageVisibility } from "../hooks/getVisState";
import { useState, useEffect, useContext } from "react";
import screenfull from "screenfull";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import StudentDetails from "../components/student/StudentDetails";
import axios from "axios";
import ReSetup from "../components/student/modals/Resetup";
import QuestionNavGrid from "../components/student/exam/QuestionNavGrid";
import QuestionStats from "../components/student/exam/QuestionStats";
import ButtonsSection from "../components/student/exam/ButtonSection";
import QuestionDisplay from "../components/student/exam/Questions/QuestionDisplay";
import ExamHeader from "../components/student/exam/ExamHeader";
import {
  examServices,
  questionAssignmentServices,
  studentAnswerServices,
} from "../api/services";

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

  const handleSubmit = async () => {
    console.log("Submitted!");
    // Check if there are any unsaved answers
    if (warnings < 2) {
      if (unsaved > 0) {
        alert("You have unsaved answers. Please save before submitting.");
        return; // Optionally, you can show a notification to the user
      }
    }

    // Transform answers to the format expected by your backend
    const payload = answers.map((answer) => ({
      question_id: answer.id,
      selected_choices: selectedOptions[answer.id],
    }));

    console.log(payload);

    examServices
      .endExamSession(exam.id)
      .then((res) => {
        console.log(res.data);
        studentAnswerServices
          .submitStudentAnswers({
            exam_id: exam.id,
            answers: payload,
          })
          .then((res) => {
            console.log(res.data);
            navigate("/submission", {
              replace: true,
              state: { result: res.data },
            });
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

    questionAssignmentServices
      .fetchQuestionAssignments(exam.id)
      .then((res) => {
        if (isMounted) {
          console.log(res.data);
          setQuestions(res.data[0].assigned_questions);
          setSelectedQuestion(res.data[0].assigned_questions[0]);
          console.log(questions);
        }
      })
      .catch((err) => console.log(err));

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

  useEffect(() => {
    getUnsaved();
  }, [selectedOptions]);

  if (warn === true && warnings < 2) {
    return <ReSetup setWarn={setWarn} />;
  } else {
    return (
      <main className="flex h-screen w-full flex-col bg-white text-black select-none overflow-hidden">
        <ExamHeader handleSubmit={handleSubmit} />
        <div className="flex h-full p-2 border-t-2 gap-x-2">
          <div className="flex w-full justify-between items-center">
            <section className="flex flex-col  w-1/5 h-full  gap-y-4 ">
              <StudentDetails user={user} />
              <QuestionNavGrid
                questions={questions}
                selectedQuestion={selectedQuestion}
                setSelectedQuestion={setSelectedQuestion}
                answers={answers}
                selectedOptions={selectedOptions}
              />
              <QuestionStats
                answers={answers}
                unsaved={unsaved}
                questions={questions}
              />
            </section>
            <section className="flex flex-col w-4/5 h-full border border-gray-300 ml-4 rounded ">
              <div className="flex flex-col w-full h-full py-5 p-10 space-y-2 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400">
                <QuestionDisplay
                  selectedQuestion={selectedQuestion}
                  selectedOptions={selectedOptions}
                  handleOptionChange={handleOptionChange}
                />
              </div>
              <ButtonsSection
                handleSave={handleSave}
                handleSubmit={handleSubmit}
                handleReset={handleReset}
                time={time}
              />
            </section>
          </div>
        </div>
      </main>
    );
  }
}
