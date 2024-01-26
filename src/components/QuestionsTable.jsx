import axios from "axios";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { transformResponseToSchema } from "../hooks/dataTransform";
import usePrepareQuestionData from "../hooks/usePrepareQuestionData";

function QuestionsTable({ exam }) {
  const [questions, setQuestions] = useState([]);
  const [originalQuestionTypes, setOriginalQuestionTypes] = useState({});
  const [choiceIds, setChoiceIds] = useState({});

  var file = null;
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    subject: exam.subject.id,
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
    const token = localStorage.getItem("token");
    const API_ENDPOINT = `http://127.0.0.1:8000/questions/?subject=${exam.subject.id}`;

    axios
      .get(API_ENDPOINT, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        const transformedData = transformResponseToSchema(response.data);
        setQuestions(transformedData);
        console.log(transformedData);
        const originalTypes = transformedData.reduce((types, question) => {
          types[question.id] = question.question_type;
          return types;
        }, {});
        setOriginalQuestionTypes(originalTypes);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
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
          const token = localStorage.getItem("token");
          const questionId = updatedQuestions[questionIndex].id; // Replace with your question ID logic
          const questionEndpoint = `http://127.0.0.1:8000/questions/${questionId}/`; // Update with your API endpoint
          const formData = new FormData();
          formData.append("image", file);

          const headers = {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          };

          axios
            .patch(questionEndpoint, formData, { headers })
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
        const token = localStorage.getItem("token");
        const choiceId = questionToUpdate.choices[choiceIndex].id;
        const choiceEndpoint = `http://127.0.0.1:8000/choices/${choiceId}/`;
        const formData = new FormData();
        formData.append("image", file);
        formData.append(
          "content",
          questionToUpdate.choices[choiceIndex].content
        );
        formData.append("label", questionToUpdate.choices[choiceIndex].label);

        const headers = {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        };

        try {
          await axios.patch(choiceEndpoint, formData, { headers });
          console.log("Choice image updated successfully.");
        } catch (error) {
          console.error("Error updating choice image:", error);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e) => {
    file = e.target.files[0];
    if (!file) {
      console.log("Nofile!");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      const transformedData = excelData.map((item) => {
        console.log("item", item);
        return {
          text: item.Question,
          subject: exam.subject.id,
          created_by: 8,
          exam: exam.id,
          // question_type: item["question_type"],
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
      setChanges([...questions, ...transformedData]);
      setQuestions([...questions, ...transformedData]);
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

    // Send a PATCH request to update the changed question data
    const token = localStorage.getItem("token");
    const questionId = updatedQuestion.id; // Replace with your logic to get the question ID
    const questionEndpoint = `http://127.0.0.1:8000/questions/${questionId}/`; // Replace with your API endpoint

    const updatedQuestionData = {
      [key]: e.target.value,
    };

    const headers = {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    };

    try {
      await axios.patch(questionEndpoint, updatedQuestionData, { headers });
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

      // Send a request to update the specific choice field in the backend
      const token = localStorage.getItem("token");
      const choiceEndpoint = `http://127.0.0.1:8000/choices/${choiceId}/`;
      const headers = {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      };
      console.log("uc", updatedChoice);
      try {
        await axios.patch(choiceEndpoint, updatedChoice, { headers });
        console.log("Choice field updated successfully.");
      } catch (error) {
        console.error("Error updating choice field:", error);
      }
    }
  };

  const handleCorrectChoiceChange = async (e, questionIndex) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];

    if (question.question_type === "SINGLE") {
      const selectedChoiceId = e.target.value;

      for (const choice of question.choices) {
        choice.is_correct = choice.id === selectedChoiceId;
        console.log("choice", choice.id, selectedChoiceId);
        // Send a PATCH request to update the correct choice
        if (choice.id == selectedChoiceId) {
          const token = localStorage.getItem("token");
          const choiceEndpoint = `http://127.0.0.1:8000/choices/${choice.id}/`;
          const headers = {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          };

          const updatedChoiceData = {
            is_correct: true,
            label: choice.label,
            content: choice.content,
          };

          try {
            await axios.patch(choiceEndpoint, updatedChoiceData, { headers });
            console.log("Correct choice updated successfully.");
          } catch (error) {
            console.error("Error updating correct choice:", error);
          }
        } else {
          const token = localStorage.getItem("token");
          const choiceEndpoint = `http://127.0.0.1:8000/choices/${choice.id}/`;
          const headers = {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          };

          const updatedChoiceData = {
            is_correct: false,
            label: choice.label,
            content: choice.content,
          };

          try {
            await axios.patch(choiceEndpoint, updatedChoiceData, { headers });
            console.log("Choice set to false");
          } catch (error) {
            console.error("Error updating correct choice:", error);
          }
        }
      }
    } else {
      // MULTIPLE choice
      const selectedChoiceIds = Array.from(e.target.selectedOptions).map(
        (option) => option.value
      );
      console.log(
        "selectedChoiceIds",
        selectedChoiceIds
        // selectedChoiceIds.includes('66')
      );

      for (const choice of question.choices) {
        // Initialize updatedChoiceData
        const updatedChoiceData = {
          is_correct: selectedChoiceIds.includes(choice.id.toString()), // Set is_correct based on whether it's selected
          label: choice.label,
          content: choice.content,
        };

        // Send a PATCH request to update each choice's is_correct
        const token = localStorage.getItem("token");
        const choiceEndpoint = `http://127.0.0.1:8000/choices/${choice.id}/`;
        const headers = {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        };

        try {
          await axios.patch(choiceEndpoint, updatedChoiceData, { headers });
          console.log(
            "Choice updated successfully.",
            choice.id,
            selectedChoiceIds.includes(choice.id.toString())
          );
        } catch (error) {
          console.error("Error updating choice:", error);
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

  const handleAddQuestion = () => {
    const newQuestionTemplate = {
      text: "",
      subject: exam.subject.id,
      created_by: 8, // Assuming this is the correct user ID
      exam: exam.id,
      question_type: "SINGLE",
      choices: [
        "","","",""
      ],
    };
    setNewQuestion(newQuestionTemplate);
    setQuestions([...questions, newQuestionTemplate]);
  };

  const handleDeleteQuestion = (questionIndex) => {
    const updatedQuestions = questions.filter(
      (_, index) => index !== questionIndex
    );

    setQuestions(updatedQuestions);

    // Optionally, handle changes state if necessary
    const updatedChanges = { ...changes };
    delete updatedChanges[questionIndex];
    setChanges(updatedChanges);
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

  const preparedData = usePrepareQuestionData(questions, changes);
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const API_ENDPOINT = `http://127.0.0.1:8000/questions/`;

    console.log("before", preparedData);

    await Promise.all(
      preparedData.map(async (question) => {
        const headers = {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        };

        try {
          if (question?.id !== undefined) {
            // PATCH for existing question

            console.log("patch", question.id);
            const response = await axios.patch(
              `http://127.0.0.1:8000/questions/${question.id}/`,
              question, // Send the question with changed choices
              { headers }
            );
            console.log(response.data);
          } else {
            // POST for new question
            console.log("post", question.id);
            const response = await axios.post(
              `http://127.0.0.1:8000/questions/`,
              question, // Send the question with changed choices
              { headers }
            );
            console.log(response.data);
          }
        } catch (error) {
          console.error(error);
        }
      })
    );
  };

  return (
    <div className="container mx-auto">
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
        className="overflow-y-auto scrollbar-thin scrollbar-track-purple-200 scrollbar-thumb-purple-500 scrollbar-thumb-rounded-full py-4"
        style={{ maxHeight: "400px" }}
      >
        <table className="table-auto w-full border-collapse border-purple-300 rounded-lg mb-10">
          <thead className="rounded-t-lg">
            <tr className="bg-purple-700 text-white rounded-t-lg">
              <th className=" px-4 py-2 border-purple-300 w-1/3">Question</th>
              <th className=" px-4 py-2 border-purple-300">Type</th>
              <th className=" px-4 py-2 border-purple-300">Choice A</th>
              <th className=" px-4 py-2 border-purple-300">Choice B</th>
              <th className=" px-4 py-2 border-purple-300">Choice C</th>
              <th className=" px-4 py-2 border-purple-300">Choice D</th>
              <th className=" px-4 py-2 border-purple-300">Correct Choice</th>
              <th className=" px-4 py-2 border-purple-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, questionIndex) => (
              <tr key={questionIndex}>
                <td className="flex flex-col gap-y-2 border px-4 py-2 border-purple-300">
                  <input
                    type="text"
                    defaultValue={question.text}
                    onChange={(e) => handleCellChange(e, questionIndex, "text")}
                    className="w-full bg-transparent focus:ring-0 focus:outline-none border-none"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleQuestionImageUpload(e, questionIndex)
                    }
                  />
                  {question?.image && (
                    <img
                      src={question.image}
                      alt="Question"
                      className="h-40 w-full object-cover rounded"
                    />
                  )}
                </td>
                <td className="border px-4 py-2 border-purple-300">
                  <select
                    value={question.question_type}
                    onChange={(e) =>
                      handleCellChange(e, questionIndex, "question_type")
                    }
                    className="w-32 bg-transparent focus:ring-0 focus:outline-none border-none checked:bg-purple-500"
                  >
                    <option key={`${questionIndex}_SINGLE`} value="SINGLE">
                      SINGLE
                    </option>
                    <option key={`${questionIndex}_MULTIPLE`} value="MULTIPLE">
                      MULTIPLE
                    </option>
                  </select>
                </td>
                {question.choices.map((choice, choiceIndex) => (
                  <td
                    key={choice?.id} // Use choice ID as the key
                    className="space-y-2 border px-4 py-2 border-purple-300"
                  >
                    <input
                      type="text"
                      defaultValue={choice.content}
                      onChange={
                        (e) =>
                          handleChoiceChange(
                            e,
                            questionIndex,
                            choice.id,
                            "content"
                          ) // Pass choice ID
                      }
                      className="w-full bg-transparent focus:ring-0 focus:outline-none border-none"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleChoiceImageUpload(e, questionIndex, choiceIndex)
                      }
                    />
                    {choice?.image && (
                      <img
                        src={choice?.image}
                        alt="Choice"
                        className="h-40 w-full object-cover rounded"
                      />
                    )}
                  </td>
                ))}

                <td className=" border px-2 py-2 border-purple-300 border-r-0">
                  <select
                    multiple={question.question_type === "MULTIPLE"}
                    value={
                      question.question_type === "MULTIPLE"
                        ? question.choices
                            .filter((ch) => ch.is_correct)
                            .map((choice) => choice.id) // Use choice IDs for value
                        : [question.choices.find((ch) => ch.is_correct)?.id] // Use an array for single-select
                    }
                    onChange={(e) =>
                      handleCorrectChoiceChange(e, questionIndex)
                    }
                    className="w-32 bg-transparent focus:ring-0 focus:outline-none border-none"
                  >
                    {question.choices.map((choice) => (
                      <option key={choice.id} value={choice.id}>
                        {choice.content}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border px-4 py-2 border-purple-300">
                  <button
                    onClick={() => handleDeleteQuestion(questionIndex)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <button
          onClick={handleAddQuestion}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded"
        >
          Add Question
        </button>
        <button
          onClick={handleCancelAdd}
          className="ml-2 text-purple-500 hover:text-purple-600 font-semibold py-2 px-4 rounded"
        >
          Cancel Add
        </button>
        <button
          onClick={resetAllQuestions}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded ml-2"
        >
          Reset All
        </button>
        <button
          onClick={handleSave}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded ml-2"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default QuestionsTable;
