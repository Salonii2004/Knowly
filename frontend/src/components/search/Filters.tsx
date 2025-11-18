interface FiltersProps {
  onFilterChange: (filters: { [key: string]: string }) => void;
}

export default function Filters({ onFilterChange }: FiltersProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ [e.target.name]: e.target.value });
  };

  return (
    <div className="flex gap-4 items-center mt-4">
      <select
        name="type"
        onChange={handleChange}
        className="border rounded px-3 py-2"
      >
        <option value="">All Types</option>
        <option value="pdf">PDF</option>
        <option value="doc">DOC</option>
        <option value="txt">Text</option>
      </select>

      <select
        name="date"
        onChange={handleChange}
        className="border rounded px-3 py-2"
      >
        <option value="">Any Date</option>
        <option value="24h">Last 24 Hours</option>
        <option value="7d">Last 7 Days</option>
        <option value="30d">Last 30 Days</option>
      </select>
    </div>
  );
}
