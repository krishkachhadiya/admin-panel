export default function TableHeader({
  label,
  field,
  sortField,
  sortOrder,
  onSort,
  className = "",
}) {
  return (
    <th
      onClick={() => onSort(field)}
      className={`px-4 py-3 text-left font-semibold cursor-pointer select-none hover:bg-black   -100 transition ${className}`}
    >
      <div className="flex items-center gap-2">
        <span>{label}</span>

        {sortField === field ? (
          sortOrder === "asc" ? (
            <span>↑</span>
          ) : (
            <span>↓</span>
          )
        ) : (
          <span className="text-gray-400">↕</span>
        )}
      </div>
    </th>
  );
}