import React from 'react';

const ContactInfo = ({ nextStep, handleChange, values }: { nextStep: () => void, handleChange: (input: any) => (e: any) => void, values: any }) => {
  const continueStep = (e: any) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
      <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">Contact Information</h3>
      <form>
        <div className="mb-8">
          <label htmlFor="name" className="mb-3 block text-sm text-dark dark:text-white">Full Name</label>
          <input type="text" name="name" placeholder="Enter your full name" onChange={handleChange('name')} defaultValue={values.name} className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none" />
        </div>
        <div className="mb-8">
          <label htmlFor="address" className="mb-3 block text-sm text-dark dark:text-white">Address</label>
          <input type="text" name="address" placeholder="Enter your address" onChange={handleChange('address')} defaultValue={values.address} className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none" />
        </div>
        <div className="mb-8">
          <label htmlFor="city" className="mb-3 block text-sm text-dark dark:text-white">City</label>
          <input type="text" name="city" placeholder="Enter your city" onChange={handleChange('city')} defaultValue={values.city} className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none" />
        </div>
        <div className="mb-8">
          <label htmlFor="state" className="mb-3 block text-sm text-dark dark:text-white">State</label>
          <input type="text" name="state" placeholder="Enter your state" onChange={handleChange('state')} defaultValue={values.state} className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none" />
        </div>
        <div className="mb-8">
          <label htmlFor="zip" className="mb-3 block text-sm text-dark dark:text-white">Zip</label>
          <input type="text" name="zip" placeholder="Enter your zip code" onChange={handleChange('zip')} defaultValue={values.zip} className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none" />
        </div>
        <div className="mb-8">
          <label htmlFor="email" className="mb-3 block text-sm text-dark dark:text-white">Email</label>
          <input type="email" name="email" placeholder="Enter your email" onChange={handleChange('email')} defaultValue={values.email} className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none" />
        </div>
        <div className="mb-8">
          <label htmlFor="phone" className="mb-3 block text-sm text-dark dark:text-white">Phone</label>
          <input type="text" name="phone" placeholder="Enter your phone number" onChange={handleChange('phone')} defaultValue={values.phone} className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none" />
        </div>
        <div className="mb-8">
          <label htmlFor="password" className="mb-3 block text-sm text-dark dark:text-white">Password</label>
          <input type="password" name="password" placeholder="Enter your password" onChange={handleChange('password')} defaultValue={values.password} className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none" />
        </div>
        <div className="mb-6">
          <button onClick={continueStep} className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90">Next</button>
        </div>
      </form>
    </div>
  );
};

export default ContactInfo;
