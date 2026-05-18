export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-4 bg-slate-100 rounded w-24"></div>
          <div className="h-8 bg-slate-100 rounded w-32"></div>
          <div className="h-4 bg-slate-100 rounded w-20"></div>
        </div>
        <div className="h-14 w-14 bg-slate-100 rounded-2xl"></div>
      </div>
    </div>
  );
}
