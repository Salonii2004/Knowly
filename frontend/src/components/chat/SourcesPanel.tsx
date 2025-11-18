interface SourcesPanelProps {
  sources: { id: string; title: string; url: string }[];
}

export default function SourcesPanel({ sources }: SourcesPanelProps) {
  if (!sources.length) return null;

  return (
    <div className="border-t p-3 bg-gray-50">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Sources:</h4>
      <ul className="space-y-1">
        {sources.map((s) => (
          <li key={s.id}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
