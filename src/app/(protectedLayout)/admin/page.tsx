export default async function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <h3 className="font-semibold mb-2">Total Users</h3>
          <p className="text-2xl font-bold">---</p>
        </div>
        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <h3 className="font-semibold mb-2">Total Orders</h3>
          <p className="text-2xl font-bold">---</p>
        </div>
        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <h3 className="font-semibold mb-2">Revenue</h3>
          <p className="text-2xl font-bold">$---</p>
        </div>
      </div>
    </div>
  );
}
