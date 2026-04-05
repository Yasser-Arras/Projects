export default function HighlightCard({ title, value }) {
  return (
    <div className="bg-[#0d221f] rounded-xl">
      <p className="text-sm opacity-70">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  );
}