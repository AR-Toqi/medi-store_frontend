export default async function MedicineDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Medicine Details: {id}</h1>
      <p>Detailed information about the medicine will be fetched and displayed here.</p>
    </div>
  );
}
