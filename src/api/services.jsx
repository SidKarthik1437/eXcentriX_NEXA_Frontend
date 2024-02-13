import axiosInstance from "./axiosInstance";

// Authentication Services
export const authServices = {
  login: (credentials) =>
    axiosInstance.post("login/", credentials).then((res) => {
      return res;
    }),
  logout: () =>
    axiosInstance.post("logout/").then((res) => {
      return res;
    }),
  createUser: (userData) =>
    axiosInstance.post("create_user/", userData).then((res) => {
      return res;
    }),
};

// Subject Services
export const subjectServices = {
  fetchSubjects: () =>
    axiosInstance.get("subjects/").then((res) => {
      return res;
    }),
  createSubject: (subjectData) =>
    axiosInstance.post("subjects/", subjectData).then((res) => {
      return res;
    }),
  updateSubject: (id, subjectData) =>
    axiosInstance.put(`subjects/${id}/`, subjectData).then((res) => {
      return res;
    }),
  deleteSubject: (id) =>
    axiosInstance.delete(`subjects/${id}/`).then((res) => {
      return res;
    }),
};

// Exam Services
export const examServices = {
  fetchExams: () =>
    axiosInstance.get("exams/").then((res) => {
      return res;
    }),
  getExam: (id) =>
    axiosInstance.get(`exams/${id}/`).then((res) => {
      return res;
    }),
  createExam: (examData) =>
    axiosInstance.post("exams/", examData).then((res) => {
      return res;
    }),
  updateExam: (id, examData) =>
    axiosInstance.put(`exams/${id}/`, examData).then((res) => {
      return res;
    }),
  deleteExam: (id) =>
    axiosInstance.delete(`exams/${id}/`).then((res) => {
      return res;
    }),
};

// Question Services
export const questionServices = {
  fetchQuestions: () =>
    axiosInstance.get("questions/").then((res) => {
      return res;
    }),
  getQuestions: (subjectId) =>
    axiosInstance.get(`questions/?subject=${subjectId}`).then((res) => {
      return res;
    }),
  createQuestion: (questionData) =>
    axiosInstance.post("questions/", questionData).then((res) => {
      return res;
    }),
  updateQuestion: (id, questionData) =>
    axiosInstance
      .patch(`questions/${id}/`, questionData, {
        "Content-Type": "multipart/form-data",
      })
      .then((res) => {
        return res;
      }),
  deleteQuestion: (id) =>
    axiosInstance.delete(`questions/${id}/`).then((res) => {
      return res;
    }),
};

// Choice Services
export const choiceServices = {
  fetchChoices: () =>
    axiosInstance.get("choices/").then((res) => {
      return res;
    }),
  createChoice: (choiceData) =>
    axiosInstance.post("choices/", choiceData).then((res) => {
      return res;
    }),
  updateChoice: (id, choiceData) =>
    axiosInstance.patch(`choices/${id}/`, choiceData).then((res) => {
      return res;
    }),
  deleteChoice: (id) =>
    axiosInstance.delete(`choices/${id}/`).then((res) => {
      return res;
    }),
};

// Department Services
export const departmentServices = {
  fetchDepartments: () =>
    axiosInstance.get("departments/").then((res) => {
      return res;
    }),
  createDepartment: (departmentData) =>
    axiosInstance.post("departments/", departmentData).then((res) => {
      return res;
    }),
  updateDepartment: (id, departmentData) =>
    axiosInstance.put(`departments/${id}/`, departmentData).then((res) => {
      return res;
    }),
  deleteDepartment: (id) =>
    axiosInstance.delete(`departments/${id}/`).then((res) => {
      return res;
    }),
};

// Question Assignment Services
export const questionAssignmentServices = {
  fetchQuestionAssignments: (examId) =>
    axiosInstance.get(`question-assignments/${examId}/`).then((res) => {
      return res;
    }),
};

// Student Answers Services
export const studentAnswerServices = {
  submitStudentAnswers: (answersData) =>
    axiosInstance.post("student-answers", answersData).then((res) => {
      return res;
    }),
};
