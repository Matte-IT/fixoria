export default function StatCard({ title, price, bgColor }) {
  return (
    <div className={`w-[150px] p-4 rounded-lg ${bgColor}`}>
      <h3 className="text-gray-500 text-base font-semibold mb-1">{title}</h3>
      <h3 className="text-gray-700 text-lg font-semibold">{price}</h3>
    </div>
  );
}
