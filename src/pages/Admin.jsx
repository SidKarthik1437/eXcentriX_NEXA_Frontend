import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminExamCard from "../components/AdminExamCard";
import axios from "axios";

import { UserContext } from "../context/UserContext";
import { DataContext } from "../context/DataContext";
import StudentDetails from "../components/StudentDetails";
import Header from "../components/Header";
import ExamConfig from "../components/ExamConfig";
import NewTest from "../components/NewTest";
import NewSubject from "../components/NewSubject";
import NewDepartment from "../components/NewDepartment";

export const AdminDetails = ({ user }) => (
  <div className="flex flex-col h-2/6 w-full gap-y-1 justify-evenly">
    <div className="flex space-x-2">
      <div className="flex flex-col items-center border-2 rounded-lg p-2 w-full h-fit  bg-white-500 text-gray-600 font-medium">
        {/* <span className="text-sm font-sm px-1">Answered</span> */}
        <span>Name</span>
        <hr className="text-white w-full h-[2px]" />
        <span>{user?.name}</span>
      </div>
    </div>
    <div className="flex gap-x-2">
      <div className="flex flex-col items-center border-2 rounded-lg p-2 w-full h-fit bg-white-500 text-gray-600 font-medium ">
        {/* <span className="text-sm font-sm px-1">Answered</span> */}
        <span>USN</span>
        <hr className="text-white w-full h-[2px]" />
        <span>{user?.usn.toUpperCase()}</span>
      </div>
    </div>
  </div>
);

function Admin() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const {
    departments,
    setDepartments,
    subjects,
    setSubjects,
    tests,
    setTests,
  } = useContext(DataContext);

  const [testOpen, setTestOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [depOpen, setDepOpen] = useState(false);

  const handleSubjectDelete = (e, id) => {
    axios
      .delete(`http://127.0.0.1:8000/subjects/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("subject deleted successfully: ", id, res);
      });
    axios
      .get(`http://127.0.0.1:8000/subjects/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        setSubjects(res.data);
      });
  };

  return (
    <main className="flex h-screen w-full flex-col bg-white text-black select-none">
      <Header />
      {testOpen && (
        <div className="flex h-full w-full bg-gray-600 bg-opacity-30 items-center justify-center z-10 absolute">
          <NewTest
            departments={departments}
            subjects={subjects}
            setTestOpen={setTestOpen}
          />
        </div>
      )}
      {subOpen && (
        <div className="flex h-full w-full bg-gray-600 bg-opacity-30 items-center justify-center z-10 absolute">
          <NewSubject
            departments={departments}
            setSubOpen={setSubOpen}
            setSubjects={setSubjects}
          />
        </div>
      )}
      {depOpen && (
        <div className="flex h-full w-full bg-gray-600 bg-opacity-30 items-center justify-center z-10 absolute">
          <NewDepartment setDepOpen={setDepOpen} />
        </div>
      )}
      <div className="flex h-full p-2 border-t-2 gap-x-2 relative ">
        {/* Body */}
        <div className="flex w-full justify-between items-center gap-2">
          <section className="flex flex-col  w-1/5 h-full  gap-y-4 ">
            {/* Student & Exam Details */}
            <AdminDetails user={user} />
            {/* Question Nav */}
          </section>
          <section className="w-full h-full flex flex-col items-start justify-between border rounded-lg">
            <section className="w-full">
              <div className="flex text-2xl w-full  border-b-2 py-2 px-4 items-center justify-between">
                <span className="font-bold">T E S T S</span>
                {/* <div className="space-x-2"> */}
                <button
                  onClick={() => setTestOpen(true)}
                  className="text-lg bg-purple-700 text-white px-2 rounded font-semibold"
                >
                  New Test +{" "}
                </button>
                {/* </div> */}
              </div>
              <div className="grid grid-cols-5 w-full h-max overflow-y-auto p-2 rounded scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 ">
                {tests.map((test) => (
                  <AdminExamCard key={test.id} exam={test} subjects={subjects}/>
                ))}
              </div>
            </section>
            <section className="flex w-full h-1/3 p-2 border-t-2 gap-2">
              <div className="flex flex-col w-1/2 p-3 border-2 border-purple-200 shadow shadow-purple-20 rounded">
                <div className="flex items-center justify-between text-xl font-semibold tracking-wide">
                  <span>Subjects</span>
                  <button
                    onClick={() => setSubOpen(true)}
                    className="text-lg bg-purple-700 text-white px-2 rounded font-semibold"
                  >
                    New Subject +{" "}
                  </button>
                </div>
                <div className="flex flex-col items-center gap-y-2 pt-2 overflow-y-auto scrollbar-thin scrollbar-track-purple-200 scrollbar-thumb-purple-500 scrollbar-thumb-rounded-full">
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="flex justify-between w-full font-medium p-2 border-2 border-purple-200 shadow shadow-purple-200 rounded"
                    >
                      <span>
                        {subject.id} - {subject.name}
                      </span>
                      <button
                        className="rounded px-2 bg-red-500 text-white"
                        onClick={(e) => handleSubjectDelete(e, subject.id)}
                      >
                        del
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col w-1/2 p-3 border-2 border-purple-200 shadow shadow-purple-20 rounded">
                <div className="flex items-center justify-between text-xl font-semibold tracking-wide">
                  <span>Departments</span>
                  <button
                    onClick={() => setDepOpen(true)}
                    className="text-lg bg-purple-700 text-white px-2 rounded font-semibold"
                  >
                    New Department +{" "}
                  </button>
                </div>
                <div className="flex flex-col items-center gap-y-2 pt-2 overflow-y-auto scrollbar-thin scrollbar-thin-purple-500">
                  {departments.map((department) => (
                    <div
                      key={department.id}
                      className="w-full font-medium p-2 border-2 border-purple-200 shadow shadow-purple-200 rounded"
                    >
                      {department.id} - {department.name}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Admin;
