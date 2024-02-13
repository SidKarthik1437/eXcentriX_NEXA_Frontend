const TableRow = ({
  question,
  questionIndex,
  handleCellChange,
  handleQuestionImageUpload,
  handleChoiceChange,
  handleChoiceImageUpload,
  handleCorrectChoiceChange_SINGLE,
  handleCorrectChoiceChangeMultiple,
  confirmMultipleChoiceChanges,
  handleDeleteQuestion,
}) => {
  return (
    <tr className="h-auto" key={questionIndex}>
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
          onChange={(e) => handleQuestionImageUpload(e, questionIndex)}
        />
        {question?.image ? (
          <img
            src={question.image}
            alt="Question"
            className="h-auto max-h-40 w-full object-cover rounded"
          />
        ) : null}
      </td>
      <td className="border px-4 py-2 border-purple-300">
        <select
          value={question.question_type}
          onChange={(e) => handleCellChange(e, questionIndex, "question_type")}
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
          key={choice?.id}
          className="space-y-2 border px-4 py-2 border-purple-300"
        >
          <input
            type="text"
            defaultValue={choice.content}
            onChange={(e) =>
              handleChoiceChange(e, questionIndex, choice.id, "content")
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
          {choice?.image ? (
            <img
              src={choice?.image}
              alt="Choice"
              className="h-auto max-h-40 w-full object-cover rounded"
            />
          ) : null}
        </td>
      ))}
      <td className=" border px-2 py-2 border-purple-300 border-r-0">
        <select
          multiple={question.question_type === "MULTIPLE"}
          value={
            question.question_type === "MULTIPLE"
              ? question.choices
                  .filter((ch) => ch.is_correct)
                  .map((choice) => choice.id)
              : question.choices.find((ch) => ch.is_correct)?.id || ""
          }
          onChange={(e) => {
            question.question_type === "SINGLE"
              ? handleCorrectChoiceChange_SINGLE(e, questionIndex)
              : handleCorrectChoiceChangeMultiple(e, questionIndex);
          }}
          className="w-32 bg-transparent focus:ring-0 focus:outline-none border-none"
        >
          {question.choices.map((choice) => (
            <option key={choice.id} value={choice.id}>
              {choice.content}
            </option>
          ))}
        </select>

        {question.question_type === "MULTIPLE" ? (
          <button
            onClick={(e) => confirmMultipleChoiceChanges(e, questionIndex)}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded ml-2"
          >
            Confirm
          </button>
        ) : null}
      </td>
      <td className="border px-4 py-2 border-purple-300">
        <button
          onClick={() => handleDeleteQuestion(question.id)}
          className="text-red-500 hover:text-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default TableRow;
