import { Button } from "@/components/ui/button";
import { getMedicines, Medicine } from "@/lib/api";
import { Navbar } from '@/components/navbar1';

export default async function Home() {
  const medicines = await getMedicines();
  console.log(medicines);
  return (
    <div >
      
      <Button>Click ME!</Button>
      <h1>Medicines</h1>
      {medicines.map((m: Medicine) => (
        <p key={m.id}>{m.name}</p>
      ))}

    </div>
    
  );
}
