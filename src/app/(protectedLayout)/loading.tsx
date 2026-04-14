export default function ProtectedLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/10">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <p className="text-lg font-medium animate-pulse">Loading secure area...</p>
      </div>
    </div>
  );
}
