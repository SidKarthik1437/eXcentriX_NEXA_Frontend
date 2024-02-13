import Logo from "../../Logo";

const ExamHeader = ({ handleSubmit }) => (
  <div className="flex px-4 py-2  border-b-2 justify-between items-center">
    <Logo />
    <div>
      <button
        className=" h-8 bg-purple-600 text-white font-semibold px-2 rounded"
        onClick={() => handleSubmit()}
      >
        Submit
      </button>
    </div>
  </div>
);

export default ExamHeader;
