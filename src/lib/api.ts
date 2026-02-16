export type Medicine = {
  id: string;
  name: string;
};

export async function getMedicines(): Promise<Medicine[]> {
  const res = await fetch("https://medistore-backend.vercel.app/api/medicines", {
    cache: "no-store",
  });

  const data = await res.json();

  return data.data; 
}
