import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminExamCard from "../components/AdminExamCard";
import axios from "axios";

import { UserContext } from "../App";
import StudentDetails from "../components/StudentDetails";
import Header from "../components/Header";

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
      <Header />
      <div className="flex h-full p-2 border-t-2 gap-x-2">
        {/* Body */}
        <div className="flex w-full justify-between items-center gap-2">
          <section className="flex flex-col  w-1/5 h-full  gap-y-4 ">
            {/* Student & Exam Details */}
            <AdminDetails user={user} />
            {/* Question Nav */}
          </section>
          <section className="w-full h-full flex flex-col items-start justify-start border rounded-lg">
            <div className="flex text-2xl w-full  border-b-2 py-2 px-4 items-center justify-between">
              <span className="font-bold">T E S T S</span>
              <span className="text-lg bg-purple-700 text-white px-2 rounded font-semibold">
                New Test +{" "}
              </span>
            </div>
            <div className="grid grid-cols-5 w-full h-max overflow-y-auto p-2 rounded scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 ">
              {tests.map((test) => (
                <AdminExamCard key={test.id} exam={test} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Admin;
