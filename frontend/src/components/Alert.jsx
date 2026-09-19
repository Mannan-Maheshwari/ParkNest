export default function Alert({ message, type = "error" }) {
  if (!message) return null;
  const styles = type === "success"
    ? "border-green-200 bg-green-50 text-green-800"
    : "border-red-200 bg-red-50 text-red-800";
  return <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>{message}</div>;
}