import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExamCard from "../components/student/ExamCard";

import { UserContext } from "../context/UserContext";
import StudentDetails from "../components/student/StudentDetails";
import Header from "../components/Header";
import { DataContext } from "../context/DataContext";
import useFetchData from "../hooks/useFetchData";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Main() {
  const navigate = useNavigate();
  useFetchData();
  const { user, setUser } = useContext(UserContext);

  const { tests } = useContext(DataContext);
  useEffect(() => {
    if (!user) {
      setUser(JSON.parse(localStorage.getItem("user")));
      console.log(user?.name);
    }
    if (user?.role == "ADMIN") {
      navigate("/admin", { replace: true });
    }
  }, [user, setUser]);

  // console.log(tests);

  return (
    <main className="flex h-screen w-full flex-col bg-white text-black select-none">
      <ToastContainer />
      <Header />
      <div className="flex h-full p-2 border-t-2 gap-x-2">
        {/*//! Body */}
        <div className="flex w-full justify-between items-center gap-2">
          <section className="flex flex-col  w-1/5 h-full  gap-y-4 ">
            {/* //! Student & Exam Details */}
            <StudentDetails user={user} />
            {/* //! Question Nav */}
          </section>
          <section className="w-full h-full flex flex-col items-start justify-start border rounded-lg">
            <div className="text-2xl w-full font-medium border-b-2 py-2 px-4">
              <span>T E S T S</span>
            </div>
            <div className="grid grid-cols-4 w-full h-max overflow-y-auto p-2 rounded scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 ">
              {tests.map((test) => (
                <ExamCard key={test.id} exam={test} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Main;
