import React from 'react';

const ContactInfo = ({ handleChange, values }: { handleChange: (input: any) => (e: any) => void, values: any }) => {

  return (
    <div className="shadow-one w-full rounded bg-white px-4 py-6 sm:px-6 sm:py-8">
      <h3 className="mb-4 text-center text-xl font-bold text-primary sm:text-2xl">Contact Information</h3>
      <form>
        <div className="mb-8">
          <label htmlFor="name" className="mb-3 block text-sm font-semibold text-black">Full Name</label>
          <input type="text" name="name" placeholder="Enter your full name" onChange={handleChange('name')} defaultValue={values.name} className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none" />
        </div>
        <div className="mb-8">
          <label htmlFor="address" className="mb-3 block text-sm font-semibold text-black">Address</label>
          <input type="text" name="address" placeholder="Enter your address" onChange={handleChange('address')} defaultValue={values.address} className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none" />
        </div>
        <div className="mb-8">
          <label htmlFor="city" className="mb-3 block text-sm font-semibold text-black">City</label>
          <input type="text" name="city" placeholder="Enter your city" onChange={handleChange('city')} defaultValue={values.city} className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none" />
        </div>
        <div className="mb-8">
          <label htmlFor="state" className="mb-3 block text-sm font-semibold text-black">State</label>
          <input type="text" name="state" placeholder="Enter your state" onChange={handleChange('state')} defaultValue={values.state} className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none" />
        </div>
        <div className="mb-8">
          <label htmlFor="zip" className="mb-3 block text-sm font-semibold text-black">Zip</label>
          <input type="text" name="zip" placeholder="Enter your zip code" onChange={handleChange('zip')} defaultValue={values.zip} className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none" />
        </div>
        <div className="mb-8">
          <label htmlFor="email" className="mb-3 block text-sm font-semibold text-black">Email</label>
          <input type="email" name="email" placeholder="Enter your email" onChange={handleChange('email')} defaultValue={values.email} className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none" />
        </div>
        <div className="mb-8">
          <label htmlFor="phone" className="mb-3 block text-sm font-semibold text-black">Phone</label>
          <input type="text" name="phone" placeholder="Enter your phone number" onChange={handleChange('phone')} defaultValue={values.phone} className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none" />
        </div>
        <div className="mb-8">
          <label htmlFor="password" className="mb-3 block text-sm font-semibold text-black">Password</label>
          <input type="password" name="password" placeholder="Enter your password" onChange={handleChange('password')} defaultValue={values.password} className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none" />
        </div>
      </form>
    </div>
  );
};

export default ContactInfo;
