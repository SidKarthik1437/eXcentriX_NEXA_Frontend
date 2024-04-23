import React from "react";

const SubjectsSection = ({ subjects, setSubOpen, handleSubjectDelete }) => {
  return (
    <div className="flex flex-col w-1/2 p-3 border-2 border-purple-200 shadow shadow-purple-20 rounded">
      <div className="flex items-center justify-between text-xl font-semibold tracking-wide">
        <span>Subjects</span>
        <NewSubjectButton setSubOpen={setSubOpen} />
      </div>
      <div className="flex flex-col items-center gap-y-2 pt-2 px-2 overflow-y-auto scrollbar-thin scrollbar-track-purple-200 scrollbar-thumb-purple-500 scrollbar-thumb-rounded-full">
        {subjects.map((subject) => (
          <SubjectItem
            key={subject?.id}
            subject={subject}
            handleSubjectDelete={handleSubjectDelete}
          />
        ))}
      </div>
    </div>
  );
};

const NewSubjectButton = ({ setSubOpen }) => {
  return (
    <button
      onClick={() => setSubOpen(true)}
      className="text-lg bg-purple-700 text-white px-2 rounded font-semibold"
    >
      New Subject +
    </button>
  );
};

const SubjectItem = ({ subject, handleSubjectDelete }) => {
  return (
    <div className="flex justify-between w-full font-medium p-2 border-2 border-purple-200 shadow shadow-purple-200 rounded">
      <span>
        {subject.id} - {subject.name}
      </span>
      <button
        className="rounded px-2 bg-red-500 text-white"
        onClick={(e) => handleSubjectDelete(e, subject.id)}
      >
        del
      </button>
    </div>
  );
};

export default SubjectsSection;
