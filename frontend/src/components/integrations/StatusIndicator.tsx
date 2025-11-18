interface StatusIndicatorProps {
  status: "connected" | "disconnected" | "error";
}

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  let color = "bg-gray-400";
  let text = "Unknown";

  if (status === "connected") {
    color = "bg-green-500";
    text = "Connected";
  } else if (status === "disconnected") {
    color = "bg-red-500";
    text = "Disconnected";
  } else if (status === "error") {
    color = "bg-yellow-500";
    text = "Error";
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${color}`}></span>
      <span className="text-sm text-gray-700">{text}</span>
    </div>
  );
}
