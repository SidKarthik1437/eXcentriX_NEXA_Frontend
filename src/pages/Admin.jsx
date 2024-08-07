import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminExamCard from "../components/admin/AdminExamCard";

import { UserContext } from "../context/UserContext";
import { DataContext } from "../context/DataContext";
import Header from "../components/Header";
import NewTest from "../components/admin/modals/NewTest";
import NewSubject from "../components/admin/modals/NewSubject";
import NewDepartment from "../components/admin/modals/NewDepartment";
import AdminDetails from "../components/admin/AdminDetails";
import DepartmentsSection from "../components/admin/Departments";
import SubjectsSection from "../components/admin/Subjects";
import TestHeader from "../components/admin/TestHeader";
import { subjectServices } from "../api/services";
import useFetchData from "../hooks/useFetchData";

function Admin() {
  const navigate = useNavigate();
  useFetchData();
  const { user, setUser } = useContext(UserContext);
  const { departments, subjects, setSubjects, tests } = useContext(DataContext);

  const [testOpen, setTestOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [depOpen, setDepOpen] = useState(false);

  const handleSubjectDelete = async (e, id) => {
    await subjectServices.deleteSubject(id).then((res) => {
      console.log("subject deleted successfully: ", id, res);
      setSubjects((prevSubjects) =>
        prevSubjects.filter((subject) => subject.id !== id)
      );
    });
    await subjectServices.fetchSubjects().then((res) => {
      setSubjects(res.data);
    });
  };

  const handleNewTestClick = () => {
    setTestOpen(true);
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
          <NewSubject setSubOpen={setSubOpen} />
        </div>
      )}
      {depOpen && (
        <div className="flex h-full w-full bg-gray-600 bg-opacity-30 items-center justify-center z-10 absolute">
          <NewDepartment setDepOpen={setDepOpen} />
        </div>
      )}
      <div className="flex h-full p-2 border-t-2 gap-x-2 relative overflow-y-hidden">
        {/* Body */}
        <div className="flex w-full justify-between items-center gap-2">
          <section className="flex flex-col w-1/5 h-full  gap-y-4 justify-between">
            {/* Student & Exam Details */}
            <AdminDetails user={user} />
            <Link
              to="/userAdmin"
              className="flex items-center justify-center rounded text-center font-semibold tracking-wider text-white bg-purple-700 h-10 cursor-pointer "
            >
              User Admin
            </Link>
            {/* Question Nav */}
          </section>
          <section className="w-full h-full flex flex-col items-start justify-between border rounded-lg">
            <section className="w-full">
              <TestHeader onNewTestClick={handleNewTestClick} />
              <div className="overflow-y-auto rounded scrollbar-thin scrollbar-track-purple-200 scrollbar-thumb-purple-500 scrollbar-thumb-rounded-full">
                <div className="grid grid-cols-5 max-h-[25.2rem] w-full p-2 gap-5">
                  {tests.map((test) => (
                    <AdminExamCard
                      key={test?.id}
                      exam={test}
                      subjects={subjects}
                      departments={departments}
                    />
                  ))}
                </div>
              </div>
            </section>
            <section className="flex w-full h-1/3 p-2 border-t-2 gap-2">
              <SubjectsSection
                subjects={subjects}
                setSubOpen={setSubOpen}
                handleSubjectDelete={handleSubjectDelete}
              />
              <DepartmentsSection
                departments={departments}
                setDepOpen={setDepOpen}
              />
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Admin;
