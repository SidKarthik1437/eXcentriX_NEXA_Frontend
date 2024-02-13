const Setup = ({ setAccepted, goFullScreen }) => {
  return (
    <div className="w-1/3 h-auto border-2 border-gray-600 rounded-lg relative self-center z-10 place-self-center top-1/3">
      <div className="px-4 py-2 text-2xl font-bold tracking-wider border-b-2">
        Attention!
      </div>
      <div className="flex flex-col p-2 tracking-wide gap-y-2">
        <span>You are about to enter the exam portal.</span>
        <span>
          Please note that any attempt to change the tab or window during the
          test may result in automatic termination and submission of your exam.
        </span>
        <span>
          Stay focused and ensure that you complete the exam within the
          allocated time. Good luck!
        </span>
      </div>
      <div className="flex justify-end p-2 border-t-2 gap-x-2">
        <button className="py-2 px-4 text-center bg-red-600 text-lg text-white rounded font-semibold tracking-widest">
          Exit
        </button>
        <button
          className="py-2 px-4 text-center bg-blue-600 text-lg text-white rounded font-semibold tracking-widest"
          onClick={() => {
            setAccepted(true);
            goFullScreen();
          }}
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default Setup;
