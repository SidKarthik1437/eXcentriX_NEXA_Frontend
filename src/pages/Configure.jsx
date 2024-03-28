import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { DataContext } from "../context/DataContext";
import QuestionsTable from "../components/admin/ExamConfig/QuestionsTable/QuestionsTable";
import ExamConfig from "../components/admin/ExamConfig/ExamConfig";

function Configure() {
  const location = useLocation();
  let exam = location.state?.exam;

  const { subjects, departments } = useContext(DataContext);

  const handleClick = () => {
    // Replace 'int:exam_id' with actual exam ID
    const apiUrl = `http://127.0.0.1:8000/report-excel/${exam?.id}/`;
    // Make API call to download the Excel file
    fetch(apiUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a temporary URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([blob]));
        // Create a temporary <a> element to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `results_${exam?.id}.xlsx`);
        // Simulate a click on the link to trigger the download
        document.body.appendChild(link);
        link.click();
        // Clean up the temporary URL and <a> element
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading results:", error);
        // Handle error
      });
  };

  return (
    <main className="flex h-full w-full flex-col bg-white text-black select-none">
      <Header />
      <div className="flex h-full p-2 border-t-2 gap-x-2">
        {/* Body */}
        <div className="flex w-full justify-between items-center gap-2">
          <section className="w-full h-full flex flex-col items-start justify-start border rounded-lg">
            <div className="flex justify-between items-center  w-full font-medium border-b-2 py-2 px-4">
              <div className="text-2xl">
                <span>Exam ID : {exam?.id}</span>
              </div>
              <div className="flex items-center h-6 space-x-1 text-base bg-yellow-300 px-3 rounded-full text-yellow-700">
                <span className="text-center h-5 mb-1">●</span>
                <span>{exam?.status}</span>
              </div>
              <button
                onClick={handleClick}
                className="bg-purple-700 hover:bg-purple-600 text-white font-semibold py-1 px-4 rounded tracking-widest"
              >
                Results
              </button>
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
