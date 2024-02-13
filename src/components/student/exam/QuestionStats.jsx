const QuestionStats = ({ answers, unsaved, questions }) => {
  return (
    <div className="flex h-2/6 w-full gap-x-1 justify-evenly">
      <QuestionStat
        label="Answered"
        count={answers.length}
        total={questions.length}
        color="bg-green-500"
      />
      <QuestionStat
        label="Attempted"
        count={unsaved}
        total={questions.length}
        color="bg-yellow-500"
      />
    </div>
  );
};

const QuestionStat = ({ label, count, total, color }) => {
  return (
    <div
      className={`flex flex-row items-center border-2 rounded-3xl w-fit h-fit p-3 gap-x-1 ${color} text-white font-medium text-lg`}
    >
      <span className="text-sm font-normal px-1">{label}</span>
      <span>{count}</span>/<span>{total}</span>
    </div>
  );
};

export default QuestionStats;
