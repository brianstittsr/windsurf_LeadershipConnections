import React from 'react';

const ProgramInterests = ({ handleChange, values }: { handleChange: (input: any) => (e: any) => void, values: any }) => {

  return (
    <div className="shadow-one w-full rounded bg-white px-4 py-6 sm:px-6 sm:py-8">
      <h3 className="mb-4 text-center text-xl font-bold text-primary sm:text-2xl">Program Interests</h3>
      <form>
        <div className="mb-8">
          <h4 className="mb-3 text-lg font-semibold text-black">Fitness and Arts Experience (Red Carpet Kids, USA)</h4>
          <div className="flex flex-col gap-4">
            <label className="flex items-center text-black">
              <input type="checkbox" name="letsMove" onChange={handleChange('letsMove')} defaultChecked={values.letsMove} className="mr-2" />
              Let's Move (Fitness)
            </label>
            <label className="flex items-center text-black">
              <input type="checkbox" name="arts" onChange={handleChange('arts')} defaultChecked={values.arts} className="mr-2" />
              Arts (Singing & Dance)
            </label>
            <label className="flex items-center text-black">
              <input type="checkbox" name="fitnessAndArtsBoth" onChange={handleChange('fitnessAndArtsBoth')} defaultChecked={values.fitnessAndArtsBoth} className="mr-2" />
              Both
            </label>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="mb-3 text-lg font-semibold text-black">Technology and Trades Experience</h4>
          <div className="flex flex-col gap-4">
            <label className="flex items-center text-black">
              <input type="checkbox" name="ppivotHighTech" onChange={handleChange('ppivotHighTech')} defaultChecked={values.ppivotHighTech} className="mr-2" />
              PPIVOT - High Technology Trades
            </label>
            <label className="flex items-center text-black">
              <input type="checkbox" name="ppivotConstruction" onChange={handleChange('ppivotConstruction')} defaultChecked={values.ppivotConstruction} className="mr-2" />
              PPIVOT - Construction Trades
            </label>
            <label className="flex items-center text-black">
              <input type="checkbox" name="techAndTradesBoth" onChange={handleChange('techAndTradesBoth')} defaultChecked={values.techAndTradesBoth} className="mr-2" />
              Both
            </label>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="mb-3 text-lg font-semibold text-black">College and University Experience</h4>
          <div className="flex flex-col gap-4">
            <label className="flex items-center text-black">
              <input type="checkbox" name="ncAAndT" onChange={handleChange('ncAAndT')} defaultChecked={values.ncAAndT} className="mr-2" />
              North Carolina A & T University
            </label>
            <label className="flex items-center text-black">
              <input type="checkbox" name="ncState" onChange={handleChange('ncState')} defaultChecked={values.ncState} className="mr-2" />
              North Carolina State University
            </label>
            <label className="flex items-center text-black">
              <input type="checkbox" name="shaw" onChange={handleChange('shaw')} defaultChecked={values.shaw} className="mr-2" />
              Shaw University
            </label>
            <label className="flex items-center text-black">
              <input type="checkbox" name="duke" onChange={handleChange('duke')} defaultChecked={values.duke} className="mr-2" />
              Duke University
            </label>
            <label className="flex items-center text-black">
              <input type="checkbox" name="elon" onChange={handleChange('elon')} defaultChecked={values.elon} className="mr-2" />
              Elon University
            </label>
            <label className="flex items-center text-black">
              <input type="checkbox" name="uncChapelHill" onChange={handleChange('uncChapelHill')} defaultChecked={values.uncChapelHill} className="mr-2" />
              University of North Carolina at Chapel Hill
            </label>
            <label className="flex items-center text-black">
              <input type="checkbox" name="otherUniversity" onChange={handleChange('otherUniversity')} defaultChecked={values.otherUniversity} className="mr-2" />
              Other
            </label>
          </div>
        </div>

      </form>
    </div>
  );
};

export default ProgramInterests;
