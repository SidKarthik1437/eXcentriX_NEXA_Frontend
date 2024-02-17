import { baseURL } from "../../../../api/axiosTextInstance";
import Option from "./Option";

const QuestionDisplay = ({
  selectedQuestion,
  selectedOptions,
  handleOptionChange,
}) => {
  return (
    <div className="flex flex-col w-full font-semibold text-lg justify-center space-y-2">
      <div className="w-fit text-center text-sm bg-purple-300 px-2 rounded-xl text-purple-700">
        {selectedQuestion?.question_type}
      </div>
      <div>{selectedQuestion?.text}</div>
      {selectedQuestion?.image && (
        <img
          src={`${baseURL}${selectedQuestion.image}`}
          alt="question"
          className="w-72 max-h-44 object-contain rounded"
        />
      )}
      <div className="overflow-y-auto h-[30rem] scrollbar-thin scrollbar-track-purple-200 scrollbar-thumb-purple-500 scrollbar-thumb-rounded-full">
        {selectedQuestion?.choices.map((option, index) => (
          <Option
            key={index}
            option={option}
            selectedOptions={selectedOptions}
            handleOptionChange={handleOptionChange}
            selectedQuestion={selectedQuestion}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionDisplay;
