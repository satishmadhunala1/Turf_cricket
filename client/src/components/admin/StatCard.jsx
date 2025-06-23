const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`${color} p-6 rounded-lg shadow-md`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
};

export default StatCard;