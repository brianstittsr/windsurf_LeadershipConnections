import React from 'react';

const ContactInfo = ({ handleChange, values }: { handleChange: (input: any) => (e: any) => void, values: any }) => {
  const inputClassName = "w-full rounded-sm border border-gray-300 bg-white px-6 py-3 text-base text-gray-900 placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20";
  const labelClassName = "mb-3 block text-sm font-semibold text-gray-700";

  return (
    <div className="shadow-one w-full rounded bg-white px-4 py-6 sm:px-6 sm:py-8">
      <h3 className="mb-4 text-center text-xl font-bold text-primary sm:text-2xl">Contact Information</h3>
      <form>
        <div className="mb-8">
          <label htmlFor="name" className={labelClassName}>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            onChange={handleChange('name')}
            defaultValue={values.name}
            className={inputClassName}
          />
        </div>
        <div className="mb-8">
          <label htmlFor="address" className={labelClassName}>Address</label>
          <input
            type="text"
            name="address"
            placeholder="Enter your address"
            onChange={handleChange('address')}
            defaultValue={values.address}
            className={inputClassName}
          />
        </div>
        <div className="mb-8">
          <label htmlFor="city" className={labelClassName}>City</label>
          <input
            type="text"
            name="city"
            placeholder="Enter your city"
            onChange={handleChange('city')}
            defaultValue={values.city}
            className={inputClassName}
          />
        </div>
        <div className="mb-8">
          <label htmlFor="state" className={labelClassName}>State</label>
          <input
            type="text"
            name="state"
            placeholder="Enter your state"
            onChange={handleChange('state')}
            defaultValue={values.state}
            className={inputClassName}
          />
        </div>
        <div className="mb-8">
          <label htmlFor="zip" className={labelClassName}>Zip</label>
          <input
            type="text"
            name="zip"
            placeholder="Enter your zip code"
            onChange={handleChange('zip')}
            defaultValue={values.zip}
            className={inputClassName}
          />
        </div>
        <div className="mb-8">
          <label htmlFor="email" className={labelClassName}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange('email')}
            defaultValue={values.email}
            className={inputClassName}
          />
        </div>
        <div className="mb-8">
          <label htmlFor="phone" className={labelClassName}>Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            onChange={handleChange('phone')}
            defaultValue={values.phone}
            className={inputClassName}
          />
        </div>
        <div className="mb-8">
          <label htmlFor="password" className={labelClassName}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange('password')}
            defaultValue={values.password}
            className={inputClassName}
          />
        </div>
      </form>
    </div>
  );
};

export default ContactInfo;
