export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 rounded-lg bg-[#84cc16]/10" />
      <div className="h-4 w-64 rounded bg-[#84cc16]/5" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="admin-stat-card">
            <div className="h-12 w-12 rounded-xl bg-[#84cc16]/10" />
            <div className="ml-4 space-y-2">
              <div className="h-8 w-12 rounded bg-[#84cc16]/10" />
              <div className="h-4 w-20 rounded bg-[#84cc16]/5" />
            </div>
          </div>
        ))}
      </div>
      <div className="admin-card">
        <div className="space-y-4 p-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-48 rounded bg-[#84cc16]/5" />
              <div className="h-4 w-16 rounded bg-[#84cc16]/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
