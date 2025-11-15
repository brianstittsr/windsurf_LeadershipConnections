import React from 'react';

const ContactInfo = ({ handleChange, values }: { handleChange: (input: any) => (e: any) => void, values: any }) => {

  return (
    <div className="shadow-one w-full rounded bg-white px-4 py-6 sm:px-6 sm:py-8">
      <h3 className="mb-4 text-center text-xl font-bold text-primary sm:text-2xl">Contact Information</h3>
      <form>
        <div className="mb-8">
          <label htmlFor="name" className="mb-3 block text-sm font-semibold text-body-color dark:text-white">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            onChange={handleChange('name')}
            defaultValue={values.name}
            className="w-full rounded-sm border border-stroke bg-[#2C303B] px-6 py-3 text-base text-white placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white dark:shadow-two dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:ring-0"
          />
        </div>
        <div className="mb-8">
          <label htmlFor="address" className="mb-3 block text-sm font-semibold text-body-color dark:text-white">Address</label>
          <input
            type="text"
            name="address"
            placeholder="Enter your address"
            onChange={handleChange('address')}
            defaultValue={values.address}
            className="w-full rounded-sm border border-stroke bg-[#2C303B] px-6 py-3 text-base text-white placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white dark:shadow-two dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:ring-0"
          />
        </div>
        <div className="mb-8">
          <label htmlFor="city" className="mb-3 block text-sm font-semibold text-body-color dark:text-white">City</label>
          <input
            type="text"
            name="city"
            placeholder="Enter your city"
            onChange={handleChange('city')}
            defaultValue={values.city}
            className="w-full rounded-sm border border-stroke bg-[#2C303B] px-6 py-3 text-base text-white placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white dark:shadow-two dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:ring-0"
          />
        </div>
        <div className="mb-8">
          <label htmlFor="state" className="mb-3 block text-sm font-semibold text-body-color dark:text-white">State</label>
          <input
            type="text"
            name="state"
            placeholder="Enter your state"
            onChange={handleChange('state')}
            defaultValue={values.state}
            className="w-full rounded-sm border border-stroke bg-[#2C303B] px-6 py-3 text-base text-white placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white dark:shadow-two dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:ring-0"
          />
        </div>
        <div className="mb-8">
          <label htmlFor="zip" className="mb-3 block text-sm font-semibold text-body-color dark:text-white">Zip</label>
          <input
            type="text"
            name="zip"
            placeholder="Enter your zip code"
            onChange={handleChange('zip')}
            defaultValue={values.zip}
            className="w-full rounded-sm border border-stroke bg-[#2C303B] px-6 py-3 text-base text-white placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white dark:shadow-two dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:ring-0"
          />
        </div>
        <div className="mb-8">
          <label htmlFor="email" className="mb-3 block text-sm font-semibold text-body-color dark:text-white">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange('email')}
            defaultValue={values.email}
            className="w-full rounded-sm border border-stroke bg-[#2C303B] px-6 py-3 text-base text-white placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white dark:shadow-two dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:ring-0"
          />
        </div>
        <div className="mb-8">
          <label htmlFor="phone" className="mb-3 block text-sm font-semibold text-body-color dark:text-white">Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            onChange={handleChange('phone')}
            defaultValue={values.phone}
            className="w-full rounded-sm border border-stroke bg-[#2C303B] px-6 py-3 text-base text-white placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white dark:shadow-two dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:ring-0"
          />
        </div>
        <div className="mb-8">
          <label htmlFor="password" className="mb-3 block text-sm font-semibold text-body-color dark:text-white">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange('password')}
            defaultValue={values.password}
            className="w-full rounded-sm border border-stroke bg-[#2C303B] px-6 py-3 text-base text-white placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white dark:shadow-two dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:ring-0"
          />
        </div>
      </form>
    </div>
  );
};

export default ContactInfo;
