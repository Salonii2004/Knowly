interface ResultCardProps {
  title: string;
  snippet: string;
  source?: string;
}

export default function ResultCard({ title, snippet, source }: ResultCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <h3 className="font-semibold text-lg text-blue-600">{title}</h3>
      <p className="text-gray-700 mt-2">{snippet}</p>
      {source && (
        <p className="text-xs text-gray-500 mt-2">Source: {source}</p>
      )}
    </div>
  );
}
