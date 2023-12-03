import { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { DataContext } from "../context/DataContext";

const useFetchData = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { setTests, setSubjects, setDepartments } = useContext(DataContext); // Use DataContext

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!user) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
    // if (user?.role === "ADMIN") {
    //   navigate("/admin", { replace: true });
    // }
    if (!token) {
      navigate("/login", { replace: true });
    } else {
      const fetchData = async () => {
        try {
          const examsResponse = await axios.get(
            "http://127.0.0.1:8000/exams/",
            {
              headers: { Authorization: `Token ${token}` },
            }
          );
          setTests(examsResponse.data);
          if (user?.role === "ADMIN") {
            const subjectsResponse = await axios.get(
              "http://127.0.0.1:8000/subjects/",
              {
                headers: { Authorization: `Token ${token}` },
              }
            );
            setSubjects(subjectsResponse.data);

            const departmentsResponse = await axios.get(
              "http://127.0.0.1:8000/departments/",
              {
                headers: { Authorization: `Token ${token}` },
              }
            );
            setDepartments(departmentsResponse.data);
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }
  }, [navigate, setUser, user, setTests, setSubjects, setDepartments]);
};

export default useFetchData;
