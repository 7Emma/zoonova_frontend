import { Listbox } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

const zones = [
  { id: "FR", name: "France" },
  { id: "EU", name: "Europe" },
];

export default function ShippingZoneSelector({
  shippingZone,
  setShippingZone,
}) {
  const selected = zones.find((z) => z.id === shippingZone);

  return (
    <div className="mb-6">
      <label className="font-semibold text-slate-700 block mb-2">
        Choisir votre zone de livraison :
      </label>

      <Listbox value={shippingZone} onChange={setShippingZone}>
        <div className="relative w-60">
          {/* Button visible */}
          <Listbox.Button className="relative w-full cursor-pointer border rounded-md px-4 py-2 text-left bg-white shadow-sm flex justify-between items-center">
            <span>{selected?.name}</span>
            <ChevronDown size={18} />
          </Listbox.Button>

          {/* Dropdown personnalisée */}
          <Listbox.Options className="absolute mt-2 w-full rounded-md bg-white shadow-lg border py-1 animate-fadeIn z-50">
            {zones.map((zone) => (
              <Listbox.Option
                key={zone.id}
                value={zone.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between"
              >
                {zone.name}
                {shippingZone === zone.id && <Check size={16} />}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
