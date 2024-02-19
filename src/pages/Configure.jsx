import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { AdminDetails } from "./Admin";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { DataContext } from "../context/DataContext";
import axios from "axios";
import QuestionsTable from "../components/QuestionsTable";
import ExamConfig from "../components/ExamConfig";

function Configure() {
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
  let exam = location.state.exam;

  console.log(exam)

  const { subjects, departments } = useContext(DataContext);

  const downloadResults = () => {
    const downloadUrl = 'http://localhost:8000/report-excel/3/';
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.download = 'student_marks_report.xlsx'; 
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };


  const handleResultsClick = () => {
    if (exam) {
      downloadResults(exam.id);
    }
  };

  return (
    <main className="flex h-full w-full flex-col bg-white text-black select-none">
      <Header />
      <div className="flex h-full p-2 border-t-2 gap-x-2">
        {/* Body */}
        <div className="flex w-full justify-between items-center gap-2">
          <section className="w-full h-full flex flex-col items-start justify-start border rounded-lg">
<<<<<<< Updated upstream
            <div className="text-2xl w-full font-medium border-b-2 py-2 px-4">
              <span>
                <div>Exam ID : {exam.id}</div>
              </span>
=======
            <div className="flex justify-between items-center  w-full font-medium border-b-2 py-2 px-4">
              <div className="text-2xl">
                <span>Exam ID : {exam?.id}</span>
              </div>
              <div className="flex items-center h-6 space-x-1 text-base bg-yellow-300 px-3 rounded-full text-yellow-700">
                <span className="text-center h-5 mb-1">●</span>
                <span>{exam?.status}</span>
              </div>
              <button
                onClick={handleResultsClick}
                className="bg-purple-700 hover:bg-purple-600 text-white font-semibold py-1 px-4 rounded tracking-widest"
              >
                Results
              </button>
>>>>>>> Stashed changes
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
