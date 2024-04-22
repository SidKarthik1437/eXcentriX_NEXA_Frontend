import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { transformResponseToSchema } from "../../../../hooks/dataTransform";
import usePrepareQuestionData from "../../../../hooks/usePrepareQuestionData";
import { UserContext } from "../../../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";
import Controls from "./Controls";
import {
  choiceServices,
  examServices,
  questionServices,
} from "../../../../api/services";

function QuestionsTable({ exam }) {
  const [questions, setQuestions] = useState([]);
  const [originalQuestionTypes, setOriginalQuestionTypes] = useState({});
  const { user, setUser } = useContext(UserContext);

  var file = null;
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    subject: exam.subject,
    exam: exam.id,
    question_type: "SINGLE",
    choices: [
      {
        label: "A",
        content: "",
        is_correct: false,
      },
      {
        label: "B",
        content: "",
        is_correct: false,
      },
      {
        label: "C",
        content: "",
        is_correct: false,
      },
      {
        label: "D",
        content: "",
        is_correct: false,
      },
    ],
  });

  const [changes, setChanges] = useState({});

  useEffect(() => {
    // axios.get(API_ENDPOINT, {
    //   headers: {
    //     Authorization: `Token ${token}`,
    //   },
    // });

    console.log(exam.id);
    questionServices.getQuestions(exam.id).then((response) => {
      // });

      console.log("hoho", response);
      const transformedData = transformResponseToSchema(response.data);
      setQuestions(transformedData);
      console.log("q", transformedData);
      const originalTypes = transformedData.reduce((types, question) => {
        types[question.id] = question.question_type;
        return types;
      }, {});
      setOriginalQuestionTypes(originalTypes);
    });
    // .catch((error) => {
    //   console.error("Error fetching questions:", error);
    // })
    // .then((response) => {
    //   console.log("hoho", response.data);
    //   const transformedData = transformResponseToSchema(response.data);
    //   setQuestions(transformedData);
    //   console.log("q", transformedData);
    //   const originalTypes = transformedData.reduce((types, question) => {
    //     types[question.id] = question.question_type;
    //     return types;
    //   }, {});
    //   setOriginalQuestionTypes(originalTypes);
    // });
  }, []);

  const handleQuestionImageUpload = async (e, questionIndex) => {
    const updatedQuestions = [...questions];
    const file = e.target.files[0];

    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          updatedQuestions[questionIndex].image = reader.result;
          setQuestions(updatedQuestions);

          const updatedChanges = {
            ...changes,
            [questionIndex]: updatedQuestions[questionIndex],
          };
          setChanges(updatedChanges);

          // Send a request to update the question image in the backend

          const questionId = updatedQuestions[questionIndex].id; // Replace with your question ID logic

          const formData = new FormData();
          formData.append("image", file);

          questionServices
            .updateImage(questionId, formData)
            .then((response) => {
              console.log("Question image updated successfully.");
            })
            .catch((error) => {
              console.error("Error updating question image:", error);
            });
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  const handleChoiceImageUpload = async (e, questionIndex, choiceIndex) => {
    const updatedQuestions = [...questions];
    const questionToUpdate = updatedQuestions[questionIndex];
    const file = e.target.files[0];

    if (choiceIndex !== -1) {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const updatedChoice = {
          content: questionToUpdate.choices[choiceIndex].content,
          image: reader.result, // Use reader.result to set the image data directly
          label: questionToUpdate.choices[choiceIndex].label,
        };

        questionToUpdate.choices[choiceIndex] = {
          ...questionToUpdate.choices[choiceIndex],
          ...updatedChoice,
        };
        updatedQuestions[questionIndex] = questionToUpdate;

        setQuestions(updatedQuestions);

        const updatedChanges = {
          ...changes,
          [questionIndex]: questionToUpdate,
        };

        setChanges(updatedChanges);

        // Send a request to update the choice image in the backend
        const choiceId = questionToUpdate.choices[choiceIndex].id;

        const formData = new FormData();
        formData.append("image", file);
        formData.append(
          "content",
          questionToUpdate.choices[choiceIndex].content
        );
        formData.append("label", questionToUpdate.choices[choiceIndex].label);

        try {
          choiceServices.updateImage(choiceId, formData);
          console.log("Choice image updated successfully.");
        } catch (error) {
          console.error("Error updating choice image:", error);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async (e) => {
    file = e.target.files[0];
    if (!file) {
      console.log("Nofile!");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      // console.log(excelData);

      const transformedData = excelData.map((item) => {
        console.log("item", item);
        return {
          text: item.Question,
          subject: exam.subject,
          created_by: user.usn,
          exam: exam.id,
          question_type: item["Question Type"],
          choices: ["A", "B", "C", "D"].map((label) => {
            return {
              label,
              content: item[`Choice ${label}`],
              is_correct: label === item["Correct Choice"],
            };
          }),
        };
      });
      console.log("Transformed data:", transformedData);

      // setChanges([...questions, ...transformedData]);
      setQuestions([...questions, ...transformedData]);

      questionServices
        .createQuestion(transformedData)
        .catch((err) => {
          console.error(
            "questions upload error",
            err.message,
            err.response.data
          );
          console.error(err);
        })
        .then((res) => {
          console.log("Question Created Successfully! ", res.data);
          // setQuestions([...questions, transformedData]);
        });
    };

    reader.readAsArrayBuffer(file);
  };

  const handleCellChange = async (e, questionIndex, key) => {
    const updatedQuestions = [...questions];
    const updatedQuestion = {
      ...updatedQuestions[questionIndex],
      [key]: e.target.value,
    };

    // Check if question type has changed
    if (key === "question_type") {
      const newQuestionType = e.target.value;
      const originalType = originalQuestionTypes[updatedQuestion.id];

      if (newQuestionType !== originalType) {
        updatedQuestion.question_type_changed = true; // Add a flag to indicate the change
      }
    }

    updatedQuestions[questionIndex] = updatedQuestion;

    // Update the changes state
    const updatedChanges = {
      ...changes,
      [questionIndex]: updatedQuestion,
    };

    setQuestions(updatedQuestions);
    setChanges(updatedChanges);

    const questionId = updatedQuestion.id;

    const updatedQuestionData = {
      [key]: e.target.value,
    };

    try {
      await questionServices.updateQuestion(questionId, updatedQuestionData);
      console.log("Question data updated successfully.");
    } catch (error) {
      console.error("Error updating question data:", error);
    }
  };

  const handleChoiceChange = async (e, questionIndex, choiceId, field) => {
    const updatedQuestions = [...questions];
    const questionToUpdate = updatedQuestions[questionIndex];
    const choiceIndex = questionToUpdate.choices.findIndex(
      (choice) => choice.id === choiceId
    );
    console.log("choiceIndex", choiceIndex);
    if (choiceIndex !== -1) {
      const updatedChoice = {
        [field]: e.target.value,
        label: questionToUpdate.choices[choiceIndex].label, // Include the label
      };

      questionToUpdate.choices[choiceIndex] = {
        ...questionToUpdate.choices[choiceIndex],
        ...updatedChoice,
      };
      updatedQuestions[questionIndex] = questionToUpdate;

      setQuestions(updatedQuestions);

      const updatedChanges = {
        ...changes,
        [questionIndex]: questionToUpdate,
      };

      setChanges(updatedChanges);

      try {
        await choiceServices.updateChoice(choiceId, updatedChoice);
        console.log("Choice field updated successfully.");
      } catch (error) {
        console.error("Error updating choice field:", error);
      }
    }
  };

  const handleCorrectChoiceChange_SINGLE = async (e, questionIndex) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];

    if (question.question_type === "SINGLE") {
      const selectedChoiceId = e.target.value;

      for (const choice of question.choices) {
        choice.is_correct = choice.id === selectedChoiceId;
        // console.log("choice", choice.id, selectedChoiceId);
        // Send a PATCH request to update the correct choice
        if (choice.id == selectedChoiceId) {
          const updatedChoiceData = {
            is_correct: true,
            label: choice.label,
            content: choice.content,
          };

          try {
            await choiceServices.updateChoice(choice.id, updatedChoiceData);
            console.log("Correct choice updated successfully.");
          } catch (error) {
            console.error("Error updating correct choice:", error);
          }
        } else {
          const updatedChoiceData = {
            is_correct: false,
            label: choice.label,
            content: choice.content,
          };

          try {
            await choiceServices.updateChoice(choice.id, updatedChoiceData);
            console.log("Choice set to false");
          } catch (error) {
            console.error("Error updating correct choice:", error);
          }
        }
      }
    }
    setQuestions(updatedQuestions);

    const updatedChanges = {
      ...changes,
      [questionIndex]: question,
    };

    setChanges(updatedChanges);
  };

  const handleCorrectChoiceChangeMultiple = (e, questionIndex) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    const selectedChoiceIds = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );

    for (const choice of question.choices) {
      choice.is_correct = selectedChoiceIds.includes(choice.id.toString());
    }

    setQuestions(updatedQuestions);
  };

  const confirmMultipleChoiceChanges = async (e, questionIndex) => {
    const questionToUpdate = questions[questionIndex];

    // Send a PATCH request to update each choice separately
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    };

    try {
      for (const choice of questionToUpdate.choices) {
        await choiceServices
          .updateChoice(choice.id, {
            is_correct: choice.is_correct,
            label: choice.label,
            content: choice.content,
          })
          .then((response) => {
            toast(`Choice ${choice.id} updated successfully.`);
          });
      }
    } catch (error) {
      console.error("Error updating choices:", error);
    }
  };

  const handleAddQuestion = async () => {
    const newQuestionTemplate = {
      text: "new question",
      subject: exam.subject,
      created_by: user.usn, // Assuming this is the correct user ID
      exam: exam.id,
      question_type: "SINGLE",
      choices: [
        {
          label: "A",
          content: "A",
          is_correct: true,
        },
        {
          label: "B",
          content: "B",
          is_correct: true,
        },
        {
          label: "C",
          content: "C",
          is_correct: false,
        },
        {
          label: "D",
          content: "D",
          is_correct: false,
        },
      ],
    };
    setNewQuestion(newQuestionTemplate);
    console.log("neww");
    questionServices
      .createQuestion(newQuestionTemplate)
      .catch((err) => {
        console.error(err.message, err.response.data);
        console.error(err);
      })
      .then((res) => {
        toast("Question Created Successfully! ", res.data);
        questionServices.getQuestions(exam.subject).then((response) => {
          // });

          console.log("hoho", response);
          const transformedData = transformResponseToSchema(response.data);
          setQuestions(transformedData);
          console.log("q", transformedData);
          const originalTypes = transformedData.reduce((types, question) => {
            types[question.id] = question.question_type;
            return types;
          }, {});
          setOriginalQuestionTypes(originalTypes);
        });
        // setQuestions([...questions, newQuestionTemplate]);
      });
  };

  const handleDeleteQuestion = async (questionId) => {
    console.log(questionId);
    await questionServices
      .deleteQuestion(questionId)
      .then((response) => {
        // Handle success, e.g., update the UI or show a success message
        toast("Question deleted successfully");
        const updatedQuestions = questions.filter(
          (question) => question.id !== questionId
        );
        setQuestions(updatedQuestions);
      })
      .catch((error) => {
        // Handle errors, e.g., display an error message
        console.error("Error deleting question:", error);
      });
  };

  const handleCancelAdd = () => {
    setNewQuestion({
      Question: "",
      "Question Type": "SINGLE",
      "Choice A": "",
      "Choice B": "",
      "Choice C": "",
      "Choice D": "",
      "Correct Choices": [],
    });
  };
  const resetAllQuestions = () => {
    setQuestions([]);
  };

  // const preparedData = usePrepareQuestionData(questions, changes);
  const handlePublish = async () => {
    await examServices
      .updateExam(exam.id, {
        is_published: true,
      })
      .then((response) => {
        console.log("Exam published successfully:", response.data);
        toast("Exam published successfully");
      })
      .catch((error) => {
        console.error("Error publishing exam:", error);
        toast("Error publishing exam");
      });
  };
  const handleRedact = async () => {
    await examServices
      .updateExam(exam.id, {
        is_published: false,
      })
      .then((response) => {
        console.log("Exam Redacted successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error publishing exam:", error);
      });
  };
  console.log(questions);
  return (
    <div className="container mx-auto">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-4">Excel Upload and Edit</h1>
      <div className="mb-4">
        <label className="block text-purple-700 font-semibold mb-2">
          Upload Excel File:
        </label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="mb-2"
        />
        {file ? (
          <button
            onClick={handleFileUpload}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-1 px-4 rounded ml-2"
          >
            Re-upload
          </button>
        ) : null}
      </div>

      <div
        className="rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-track-purple-200 scrollbar-thumb-purple-500  "
        style={{ maxHeight: "400px", width: "100%" }}
      >
        <table className="table-auto w-full border-collapse border-purple-300 rounded-lg ">
          <thead className="rounded-t-lg">
            <TableHeader />
          </thead>
          <tbody className="rounded-lg">
            {questions.map((question, questionIndex) => (
              <TableRow
                key={question.id}
                question={question}
                questionIndex={questionIndex}
                handleCellChange={handleCellChange}
                handleQuestionImageUpload={handleQuestionImageUpload}
                handleChoiceChange={handleChoiceChange}
                handleChoiceImageUpload={handleChoiceImageUpload}
                handleCorrectChoiceChange_SINGLE={
                  handleCorrectChoiceChange_SINGLE
                }
                handleCorrectChoiceChangeMultiple={
                  handleCorrectChoiceChangeMultiple
                }
                confirmMultipleChoiceChanges={confirmMultipleChoiceChanges}
                handleDeleteQuestion={handleDeleteQuestion}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Controls
        handleAddQuestion={handleAddQuestion}
        handleCancelAdd={handleCancelAdd}
        handleRedact={handleRedact}
        handlePublish={handlePublish}
      />
    </div>
  );
}

export default QuestionsTable;
