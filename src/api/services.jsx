import axiosFileInstance from "./axiosFileInstance";
import axiosImageInstance from "./axiosImageInstance";
import axiosTextInstance from "./axiosTextInstance";

// Authentication Services
export const authServices = {
  login: (credentials) =>
    axiosTextInstance.post("login/", credentials).then((res) => {
      return res;
    }),
  logout: () =>
    axiosTextInstance.post("logout/").then((res) => {
      return res;
    }),
  createUser: (userData) =>
    axiosTextInstance.post("create_user/", userData).then((res) => {
      return res;
    }),
};

// Subject Services
export const subjectServices = {
  fetchSubjects: () =>
    axiosTextInstance.get("subjects/").then((res) => {
      return res;
    }),
  createSubject: (subjectData) =>
    axiosTextInstance.post("subjects/", subjectData).then((res) => {
      return res;
    }),
  updateSubject: (id, subjectData) =>
    axiosTextInstance.put(`subjects/${id}/`, subjectData).then((res) => {
      return res;
    }),
  deleteSubject: (id) =>
    axiosTextInstance.delete(`subjects/${id}/`).then((res) => {
      return res;
    }),
};

// Exam Services
export const examServices = {
  fetchExams: () =>
    axiosTextInstance.get("exams/").then((res) => {
      return res;
    }),
  getExam: (id) =>
    axiosTextInstance.get(`exams/${id}/`).then((res) => {
      return res;
    }),
  createExam: (examData) =>
    axiosTextInstance.post("exams/", examData).then((res) => {
      return res;
    }),
  updateExam: (id, examData) =>
    axiosTextInstance.patch(`exams/${id}/`, examData).then((res) => {
      return res;
    }),
  deleteExam: (id) =>
    axiosTextInstance.delete(`exams/${id}/`).then((res) => {
      return res;
    }),
  startExamSession: (examId) =>
    axiosTextInstance.post(`exams/${examId}/start-session/`).then((res) => {
      return res;
    }),
  endExamSession: (examId) =>
    axiosTextInstance.post(`exams/${examId}/end-session/`).then((res) => {
      return res;
    }),
  getActiveSessions: (examId) =>
    axiosTextInstance.get(`exams/${examId}/active-sessions/`).then((res) => {
      return res;
    }),
};

// Question Services
export const questionServices = {
  fetchQuestions: () =>
    axiosTextInstance.get("questions/").then((res) => {
      return res;
    }),
  getQuestions: (examId) =>
    axiosTextInstance.get(`questions/?exam=${examId}`).then((res) => {
      return res;
    }),
  createQuestion: (questionData) =>
    axiosTextInstance.post("questions/", questionData).then((res) => {
      return res;
    }),
  updateQuestion: (id, questionData) =>
    axiosTextInstance
      .patch(`questions/${id}/`, questionData, {
        "Content-Type": "multipart/form-data",
      })
      .then((res) => {
        return res;
      }),
  deleteQuestion: (id) =>
    axiosTextInstance.delete(`questions/${id}/`).then((res) => {
      return res;
    }),
  updateImage: (id, data) =>
    axiosImageInstance.patch(`questions/${id}/`, data).then((res) => {
      return res;
    }),
};

// Choice Services
export const choiceServices = {
  fetchChoices: () =>
    axiosTextInstance.get("choices/").then((res) => {
      return res;
    }),
  createChoice: (choiceData) =>
    axiosTextInstance.post("choices/", choiceData).then((res) => {
      return res;
    }),
  updateChoice: (id, choiceData) =>
    axiosTextInstance.patch(`choices/${id}/`, choiceData).then((res) => {
      return res;
    }),
  deleteChoice: (id) =>
    axiosTextInstance.delete(`choices/${id}/`).then((res) => {
      return res;
    }),
  updateImage: (id, data) =>
    axiosImageInstance.patch(`choices/${id}/`, data).then((res) => {
      return res;
    }),
};

// Department Services
export const departmentServices = {
  fetchDepartments: () =>
    axiosTextInstance.get("departments/").then((res) => {
      return res;
    }),
  createDepartment: (departmentData) =>
    axiosTextInstance.post("departments/", departmentData).then((res) => {
      return res;
    }),
  updateDepartment: (id, departmentData) =>
    axiosTextInstance.put(`departments/${id}/`, departmentData).then((res) => {
      return res;
    }),
  deleteDepartment: (id) =>
    axiosTextInstance.delete(`departments/${id}/`).then((res) => {
      return res;
    }),
};

// Question Assignment Services
export const questionAssignmentServices = {
  fetchQuestionAssignments: (examId) =>
    axiosTextInstance.get(`question-assignments/${examId}/`).then((res) => {
      return res;
    }),
};

// Student Answers Services
export const studentAnswerServices = {
  submitStudentAnswers: (answersData) =>
    axiosTextInstance.post("student-answers", answersData).then((res) => {
      return res;
    }),
};

export const userServices = {
  fetchUsers: () =>
    axiosTextInstance.get("users/").then((res) => {
      return res.data;
    }),
  createUser: (userData) =>
    axiosTextInstance.post("create_user/", userData).then((res) => {
      return res;
    }),
  updateUser: (id, userData) =>
    axiosTextInstance.put(`users/${id}/`, userData).then((res) => {
      return res;
    }),
  deleteUser: (id) =>
    axiosTextInstance.delete(`users/${id}/`).then((res) => {
      return res;
    }),
};

export const reportServices = {
  fetchPdf: (exam_id) =>
    axiosFileInstance
      .get(`/reports/${exam_id}/generate_pdf_report/`)
      .then((res) => {
        return res;
      }),
  fetchExcel: (exam_id) =>
    axiosFileInstance
      .get(`/reports/${exam_id}/generate_excel_report/`)
      .then((response) => {
        return response;
      }),
};
