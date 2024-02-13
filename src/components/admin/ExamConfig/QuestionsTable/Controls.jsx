const Controls = ({
  handleAddQuestion,
  handleCancelAdd,
  handleRedact,
  handlePublish,
}) => {
  return (
    <div className="flex w-full justify-between">
      <div>
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
      </div>
      <div>
        <button
          onClick={handleRedact}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded ml-2"
        >
          Redact
        </button>
        <button
          onClick={handlePublish}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded ml-2"
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default Controls;
