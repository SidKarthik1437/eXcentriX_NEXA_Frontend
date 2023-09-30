import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExamCard from "../components/ExamCard";
import axios from "axios";

import { UserContext } from "../App";
import StudentDetails from "../components/StudentDetails";

function Main() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [tests, setTests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!user) {
      setUser(JSON.parse(localStorage.getItem("user")));
      console.log(user?.name);
    }
    if (!token) {
      navigate("/login", {
        replace: true,
      });
    } else {
      axios
        .get("http://127.0.0.1:8000/exams/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setTests(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <main className="flex h-screen w-full flex-col bg-white text-black select-none">
      <div className="flex px-4 py-2  border-b-2 justify-between items-center">
        <div className="text-4xl font-bold tracking-wider">
          <span className="">N</span>
          <span className="text-purple-700">E</span>
          <span className="">X</span>
          <span className="text-purple-700">A</span>
        </div>
        <div>
          <button
            className=" h-8 bg-purple-600 text-white font-semibold px-2 rounded"
            onClick={() => handleLogout()}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex h-full p-2 border-t-2 gap-x-2">
        {/* Body */}
        <div className="flex w-full justify-between items-center gap-2">
          <section className="flex flex-col  w-1/5 h-full  gap-y-4 ">
            {/* Student & Exam Details */}
            <StudentDetails user={user} />
            {/* Question Nav */}
          </section>
          <section className="w-full h-full flex flex-col items-start justify-start border rounded-lg">
            <div className="text-2xl w-full font-medium border-b-2 py-2 px-4">
              <span>T E S T S</span>
            </div>
            <div className="flex flex-col w-full h-max overflow-y-auto p-2 rounded scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 ">
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
