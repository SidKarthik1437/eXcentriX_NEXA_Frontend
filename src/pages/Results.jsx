import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { DataContext } from "../context/DataContext";
import QuestionsTable from "../components/admin/ExamConfig/QuestionsTable/QuestionsTable";
import ExamConfig from "../components/admin/ExamConfig/ExamConfig";
import { reportServices } from "@/api/services";
import axios from "axios";

function Results() {
  const location = useLocation();
  let exam = location.state?.exam;

  const { subjects, departments } = useContext(DataContext);

  const handleExcel = () => {
    // Make API call to download the Excel file
    reportServices
      .fetchExcel(exam?.id)
      .then((response) => {
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `results_${exam?.id}_${exam?.subject}_${
            departments[exam?.department].name
          }.xlsx`
        );
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error downloading results:", error);
        // Handle error
      });
  };
  const handlePdf = () => {
    // Make API call to download the Excel file
    reportServices
      .fetchPdf(exam?.id)
      .then((response) => {
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `results_${exam?.id}_${exam?.subject}_${
            departments[exam?.department].name
          }.pdf`
        );
        document.body.appendChild(link);
        link.click();
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
              <div className="space-x-2">
                <button
                  onClick={handleExcel}
                  className="bg-purple-700 hover:bg-purple-600 text-white font-semibold py-1 px-4 rounded tracking-widest"
                >
                  Results as Excel
                </button>
                <button
                  onClick={handlePdf}
                  className="bg-purple-700 hover:bg-purple-600 text-white font-semibold py-1 px-4 rounded tracking-widest"
                >
                  Results as PDF
                </button>
              </div>
            </div>
            {/* Questions */}
            <div className="flex flex-col h-full w-full p-2 gap-y-2">
              Table of results goes here
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Results;
