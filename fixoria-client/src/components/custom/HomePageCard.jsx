const HomePageCard = ({ title, price, text, children }) => {
  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="text-gray-500 mb-6 font-semibold">{title}</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-semibold text-headingTextColor mb-2">
            ${price}
          </p>
          <p className="text-green-500">{text}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default HomePageCard;
