import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";

function Submission() {
  const location = useLocation();
  const result = location.state.result;

  // Calculate score percentage
  const scorePercentage = (result.score / result.totalMarks) * 100;

  // Determine remarks based on score percentage
  let remarks;
  if (scorePercentage >= 90) {
    remarks = "Excellent Performance!";
  } else if (scorePercentage >= 70) {
    remarks = "Good Performance!";
  } else if (scorePercentage >= 50) {
    remarks = "Keep Improving!";
  } else {
    remarks = "Work Harder!";
  }

  return (
    <main className="flex relative h-screen w-full flex-col bg-white text-black ">
      <Header />
      <div className="flex flex-col justify-center items-center h-full">
        <div className="text-4xl font-bold mb-4">Submitted</div>
        <div className="w-96 border border-gray-300 rounded-lg p-4">
          <div className="text-lg font-semibold mb-4">Your Score:</div>
          <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-green-500"
              style={{ width: `${scorePercentage}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-white">
              {`${scorePercentage}%`}
            </div>
          </div>
          <div className="text-lg font-semibold mt-4">Score Details:</div>
          <div className="flex justify-between text-sm mt-2">
            <div>Obtained Marks: {result.score}</div>
            <div>Total Marks: {result.totalMarks}</div>
          </div>
          <div className="text-lg font-semibold mt-4">Remarks:</div>
          <div className="mt-2">{remarks}</div>
        </div>
      </div>
    </main>
  );
}

export default Submission;
