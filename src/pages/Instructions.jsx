import { usePageVisibility } from "../hooks/getVisState";
import { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import StudentDetails from "../components/StudentDetails";
import screenfull from "screenfull";
import Setup from "../components/student/modals/Setup";

export default function Instructions() {
  const visibilityState = usePageVisibility();
  const { user, setUser } = useContext(UserContext);
  // console.log(user?.name);

  const navigate = useNavigate();
  const location = useLocation();
  let exam = location.state.exam;

  useEffect(() => {
    if (!user) {
      setUser(JSON.parse(localStorage.getItem("user")));
      // console.log(user?.name);
    }
  }, []);

  const [accepted, setAccepted] = useState(false);

  const goFullScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  };

  // console.log("instructions", exam);

  return (
    <main
      className={`flex relative h-screen w-full flex-col bg-white text-black `}
    >
      {!accepted && (
        <Setup goFullScreen={goFullScreen} setAccepted={setAccepted} />
      )}
      {accepted && (
        <div>
          <div className="px-4 py-2 text-4xl font-bold tracking-widest border-b-2">
            PREFACE
          </div>
          <div className="flex w-full justify-start ">
            <section className="flex flex-col w-1/5 h-full  gap-y-4 p-4">
              {/* Student & Exam Details */}
              <StudentDetails user={user} />
            </section>
            <section className="flex flex-col w-full h-full p-4 items-start justify-start">
              <div className="text-2xl font-bold tracking-wider">
                INSTRUCTIONS
              </div>
            </section>
          </div>
          <div className="flex justify-end p-2 border-t-2 gap-x-2">
            <Link
              to={`/exam/${exam.id}`}
              state={exam}
              className="py-2 px-4 text-center bg-blue-600 text-lg text-white rounded font-semibold tracking-widest"
              // onClick={() => {
              //   navigate("/exam");
              // }}
              replace={true}
            >
              Enter
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
