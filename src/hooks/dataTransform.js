export const transformResponseToSchema = (data) => {
  return data.map((item) => ({
    text: item.text,
    subject: item.subject,
    created_by: item.created_by,
    exam: item.exam,
    question_type: item.question_type,
    choices: item.choices.map((choice) => ({
      label: choice.label,
      content: choice.content,
      is_correct: choice.is_correct,
    })),
  }));
};
