// Option.jsx
import { baseURL } from "../../../../api/axiosTextInstance";

const Option = ({
  option,
  selectedOptions,
  handleOptionChange,
  selectedQuestion,
  isSingleAnswerType // Boolean indicating whether it's a single-answer type
}) => {
  const checkboxStyle = isSingleAnswerType ? "rounded-full" : "rounded"; // Rounded style for single-answer type

  return (
    <div
      className={`mt-2 border h-fit max-h-72 w-full rounded-lg hover:bg-purple-100 flex items-center
      ${
        selectedOptions[selectedQuestion.id] &&
        selectedOptions[selectedQuestion.id].includes(option.id)
          ? " bg-purple-100"
          : "border-gray-300"
      }`}
    >
      <div className="flex h-10 items-center font-medium">
        <input
          className={`border-2 ml-2 form-checkbox border-gray-300 ${checkboxStyle} text-purple-500 checked:bg-purple-500 hover:bg-purple-500 appearance-none outline-none focus:ring-0 focus:outline-0`}
          type="checkbox"
          id={option.id}
          checked={
            selectedOptions[selectedQuestion.id]
              ? selectedOptions[selectedQuestion.id].includes(option.id)
              : false // ensure that checked is not undefined
          }
          onChange={() => handleOptionChange(selectedQuestion, option.id)}
        />
        <label
          className="ml-2 h-full flex w-max items-center !font-normal "
          htmlFor={option.label}
        >
          {option.label}. {option.content}
        </label>
      </div>
      {option?.image && (
        <img
          src={`${baseURL}${option.image}`}
          alt="choice image"
          className="w-auto max-w-44 h-auto max-h-44 object-contain rounded m-2"
        />
      )}
    </div>
  );
};

export default Option;

