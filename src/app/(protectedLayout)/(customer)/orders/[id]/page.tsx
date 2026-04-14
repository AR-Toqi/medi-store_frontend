export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Order Details: {id}</h1>
      <p>Track your order status and view items here.</p>
    </div>
  );
}
