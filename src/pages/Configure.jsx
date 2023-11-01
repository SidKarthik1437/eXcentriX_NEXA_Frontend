import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { AdminDetails } from "./Admin";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import axios from "axios";
import QuestionsTable from "../components/QuestionsTable";
import ExamConfig from "../components/ExamConfig";

function Configure() {
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
  let exam = location.state.exam;

  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(exam);

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
        .get(`http://127.0.0.1:8000/subjects/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((res) => {
          setSubjects(res.data);
        });

      // Fetch departments
      axios
        .get(`http://127.0.0.1:8000/departments/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((res) => {
          setDepartments(res.data);
        });
    }
  }, []);

  return (
    <main className="flex h-full w-full flex-col bg-white text-black select-none">
      <Header />
      <div className="flex h-full p-2 border-t-2 gap-x-2">
        {/* Body */}
        <div className="flex w-full justify-between items-center gap-2">
          <section className="w-full h-full flex flex-col items-start justify-start border rounded-lg">
            <div className="text-2xl w-full font-medium border-b-2 py-2 px-4">
              <span>
                <div>Exam ID : {exam.id}</div>
              </span>
            </div>
            {/* Questions */}
            <div className="flex flex-col h-full w-full p-2 gap-y-2">
              <ExamConfig
                exam={exam}
                departments={departments}
                subjects={subjects}
              />
              <div className="flex flex-col w-full border border-purple-300 rounded p-4 space-y-4">
                <div className="font-semibold text-xl tracking-wider">
                  Questions
                </div>
                <hr />
                <div>
                  <QuestionsTable exam={exam} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Configure;
