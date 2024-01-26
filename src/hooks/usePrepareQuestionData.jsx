import { useMemo } from "react";

const usePrepareQuestionData = (questions, changes) => {
  const preparedData = useMemo(() => {
    const dataToSave = [];

    Object.entries(changes).forEach(([questionIndex, modifiedQuestion]) => {
      // Ensure to merge with the original question to retain the 'id'
      let originalQuestion = questions[parseInt(questionIndex)];
      let questionData = { ...originalQuestion, ...modifiedQuestion };

      // Handle image data for the question
      if (
        questionData.image &&
        typeof questionData.image === "string" &&
        !questionData.image.startsWith("http")
      ) {
        // Include new image data
      } else {
        // Exclude image URL or if no image change
        delete questionData.image;
      }

      // Handle image data for choices
      if (questionData.choices) {
        questionData.choices = questionData.choices.map((choice, index) => {
          // Merge with original choice to retain any essential properties
          let originalChoice = originalQuestion.choices
            ? originalQuestion.choices[index]
            : {};
          let updatedChoice = { ...originalChoice, ...choice };

          if (
            updatedChoice.image &&
            typeof updatedChoice.image === "string" &&
            !updatedChoice.image.startsWith("http")
          ) {
            // Include new image data
            return updatedChoice;
          } else {
            // Exclude image URL or if no image change
            let { image, ...rest } = updatedChoice;
            return rest;
          }
        });
      }

      dataToSave.push(questionData);
    });

    return dataToSave;
  }, [questions, changes]);

  return preparedData;
};

export default usePrepareQuestionData;
