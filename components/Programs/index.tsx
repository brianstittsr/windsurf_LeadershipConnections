"use client";
import { useState, useEffect } from "react";
import SingleProgram from "./SingleProgram";
import programsData from "./programsData";

const Programs = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    setPrograms(programsData);
  }, []);

  return (
    <section className="pb-[120px] pt-[120px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          {programs.map((program) => (
            <div
              key={program.id}
              className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
            >
              <SingleProgram program={program} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
