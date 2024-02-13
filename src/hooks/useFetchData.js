import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { DataContext } from "../context/DataContext";
import axiosInstance from "../api/axiosInstance";
import {
  departmentServices,
  examServices,
  subjectServices,
} from "../api/services";

const useFetchData = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { setTests, setSubjects, setDepartments } = useContext(DataContext); // Use DataContext

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!user) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
    if (!token) {
      navigate("/login", { replace: true });
    } else {
      const fetchData = async () => {
        try {
          // Using axiosInstance for API requests
          // const examsResponse = await axiosInstance.get("exams/");
          const examsResponse = await examServices.fetchExams();
          setTests(examsResponse.data);
          if (user?.role === "ADMIN") {
            // const subjectsResponse = await axiosInstance.get("subjects/");
            const subjectsResponse = await subjectServices.fetchSubjects();

            setSubjects(subjectsResponse.data);

            // const departmentsResponse = await axiosInstance.get("departments/");
            const departmentsResponse =
              await departmentServices.fetchDepartments();
            setDepartments(departmentsResponse.data);
          }
        } catch (error) {
          console.log(error);
          // Redirect to login on authorization error (handled globally by axiosInstance)
        }
      };

      fetchData();
    }
  }, [navigate, setUser, user, setTests, setSubjects, setDepartments]);
};

export default useFetchData;
