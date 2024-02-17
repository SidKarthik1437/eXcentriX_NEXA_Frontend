import { baseURL } from "../api/axiosTextInstance";

export const transformResponseToSchema = (data) => {
  return data.map((item) => ({
    id: item.id,
    text: item.text,
    subject: item.subject,
    created_by: item.created_by,
    image: `${baseURL}${item.image}`,
    exam: item.exam,
    question_type: item.question_type,
    choices: item.choices.map((choice) => ({
      id: choice.id,
      label: choice.label,
      content: choice.content,
      image: `${baseURL}${choice.image}`,
      is_correct: choice.is_correct,
    })),
  }));
};
