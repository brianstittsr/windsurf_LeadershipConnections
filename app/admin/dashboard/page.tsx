const DashboardPage = () => {
  const metrics = [
    { name: 'Total Events', value: '12' },
    { name: 'Grants Awarded', value: '$50,000' },
    { name: 'Active Users', value: '350' },
    { name: 'Unprocessed Registrations', value: '5' },
    { name: 'Total Donations', value: '$12,500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-500">{metric.name}</h3>
            <p className="text-4xl font-bold mt-2">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
