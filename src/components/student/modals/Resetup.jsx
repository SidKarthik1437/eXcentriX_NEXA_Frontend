import screenfull from "screenfull";

const ReSetup = ({ setWarn }) => {
  const goFullScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.request();
      setWarn(false);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent">
      <div className="w-1/3 bg-white border-2 border-gray-600 rounded-lg shadow-2xl">
        <div className="px-4 py-2 text-2xl font-bold tracking-wider border-b-2">
          Warning!
        </div>
        <div className="flex flex-col p-2 tracking-wide gap-y-2">
          <span>You are about to "Exit" the portal.</span>
          <span>
            NOTE: YOU HAVE ATTEMPTED TO EXIT THE EXAM PORTAL. DO NOT EXIT OR
            SWITCH TABS OR WINDOWS DURING THE EXAM.
            <span>NEXT ATTEMPT WILL RESULT IN AUTOMATIC SUBMISSION.</span>
          </span>
        </div>
        <div className="flex justify-end p-2 border-t-2 gap-x-2">
          <button
            className="py-2 px-4 text-center bg-blue-600 text-lg text-white rounded font-semibold tracking-widest"
            onClick={() => {
              goFullScreen();
              setWarn(false);
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReSetup;
