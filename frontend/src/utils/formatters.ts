// Format date into human-readable string
export const formatDate = (date: string | Date) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

// Shorten text for previews/snippets
export const truncateText = (text: string, maxLength = 120) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

// Format source name (e.g., "nyt" -> "New York Times")
export const formatSource = (source: string) => {
  const mapping: Record<string, string> = {
    nyt: "New York Times",
    bbc: "BBC",
    cnn: "CNN",
  };
  return mapping[source] || source;
};
