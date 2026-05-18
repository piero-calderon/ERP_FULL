export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full animate-in fade-in duration-700">
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
        <div className="absolute h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-blue-600 animate-pulse"></div>
        </div>
      </div>
      <p className="mt-4 text-slate-500 font-medium animate-pulse">Cargando módulo...</p>
    </div>
  );
}
