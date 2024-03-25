
const QuestionNavGrid = ({
  questions,
  selectedQuestion,
  setSelectedQuestion,
  answers,
  selectedOptions,
}) => {
  return (
    <div className="grid grid-cols-5 grid-rows-5 h-3/6 w-full overflow-y-auto p-2 border rounded scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400">
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
  );
};

export default QuestionNavGrid