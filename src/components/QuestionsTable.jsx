import axios from "axios";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { transformResponseToSchema } from "../hooks/dataTransform";

function QuestionsTable({ exam }) {
  const [questions, setQuestions] = useState([]);
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Replace with your API endpoint and any necessary configurations
    const API_ENDPOINT = `http://127.0.0.1:8000/questions/?subject=${exam.subject.id}`;

    axios
      .get(API_ENDPOINT, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        const transformedData = transformResponseToSchema(response.data);
        setQuestions(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, []);

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
      setQuestions(transformedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleCellChange = (e, rowIndex, key) => {
    const updatedQuestions = [...questions];
    updatedQuestions[rowIndex][key] = e.target.value;
    setQuestions(updatedQuestions);
  };
  const handleChoiceChange = (e, questionIndex, choiceIndex, field) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices[choiceIndex][field] =
      e.target.value;
    setQuestions(updatedQuestions);
  };
  const handleCorrectChoiceChange = (e, questionIndex) => {
    const selectedValues = Array.from(e.target.options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices.forEach((choice) => {
      choice.is_correct = selectedValues.includes(choice.label);
    });
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, newQuestion]);
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

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
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

  const handleSave = () => {
    // Implement your save logic here
    // This function should save the questions data
    console.log(questions);
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
            {questions.map((question, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border px-4 py-2 border-purple-300">
                  <input
                    type="text"
                    defaultValue={question.text}
                    onChange={(e) => handleCellChange(e, rowIndex, "text")}
                    className="w-full bg-transparent focus:ring-0 focus:outline-none border-none"
                  />
                </td>
                <td className="border px-4 py-2 border-purple-300">
                  <select
                    value={question.question_type}
                    onChange={(e) =>
                      handleCellChange(e, rowIndex, "question_type")
                    }
                    className="w-32 bg-transparent focus:ring-0 focus:outline-none border-none checked:bg-purple-500"
                  >
                    <option value="SINGLE">SINGLE</option>
                    <option value="MULTIPLE">MULTIPLE</option>
                  </select>
                </td>
                {question.choices.map((choice, choiceIndex) => (
                  <td
                    key={choice.label}
                    className="border px-4 py-2 border-purple-300"
                  >
                    <input
                      type="text"
                      defaultValue={choice.content}
                      onChange={(e) =>
                        handleChoiceChange(e, rowIndex, choiceIndex, "content")
                      }
                      className="w-full bg-transparent focus:ring-0 focus:outline-none border-none"
                    />
                  </td>
                ))}
                <td className="border px-4 py-2 border-purple-300">
                  <select
                    multiple={question.question_type === "MULTIPLE"}
                    value={
                      question.question_type === "MULTIPLE"
                        ? question.choices
                            .filter((ch) => ch.is_correct)
                            .map((choice) => choice.label)
                        : question.choices.findIndex((ch) => ch.is_correct)
                    }
                    onChange={(e) => handleCorrectChoiceChange(e, rowIndex)}
                    className="w-full bg-transparent focus:ring-0 focus:outline-none border-none"
                  >
                    {question.choices.map((choice) => (
                      <option key={choice.label} value={choice.label}>
                        {choice.content}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border px-4 py-2 border-purple-300">
                  <button
                    onClick={() => handleDeleteQuestion(rowIndex)}
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
