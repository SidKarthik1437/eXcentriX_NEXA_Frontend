import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [tests, setTests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);

  return (
    <DataContext.Provider
      value={{
        tests,
        setTests,
        subjects,
        setSubjects,
        departments,
        setDepartments,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
