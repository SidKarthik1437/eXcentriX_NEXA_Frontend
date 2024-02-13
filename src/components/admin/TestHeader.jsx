const TestHeader = ({ onNewTestClick }) => {
  return (
    <div className="flex text-2xl w-full border-b-2 py-2 px-4 items-center justify-between">
      <span className="font-bold">T E S T S</span>
      <button
        onClick={onNewTestClick}
        className="text-lg bg-purple-700 text-white px-2 rounded font-semibold"
      >
        New Test +
      </button>
    </div>
  );
};

export default TestHeader;
