const faqs = [
  ["How do I book parking?", "Sign in as a driver, open Find Parking, choose an available location, select your time and vehicle number, and confirm the simulated checkout."],
  ["Can I cancel a booking?", "Yes. Confirmed bookings can be cancelled from your dashboard, subject to the booking rules."],
  ["How can I list my parking space?", "Create a Parking Owner account. The owner dashboard lets you add, edit, activate or deactivate your parking spaces."],
  ["What information is required for a parking space?", "The system expects a name, address, coordinates, price, description and total number of spots."],
  ["What happens when a booking is created?", "The system will reserve the parking space for the specified time and send a confirmation to both the driver and the owner."],
];

export default function FAQ() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center"><p className="text-sm font-bold uppercase tracking-widest text-blue-600">Help centre</p><h1 className="mt-2 text-4xl font-extrabold text-slate-900">Frequently asked questions</h1><p className="mt-3 text-slate-500">A quick guide to using ParkNest.</p></div>
        <div className="mt-10 space-y-3">{faqs.map(([q, a]) => <details key={q} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><summary className="cursor-pointer list-none pr-6 font-bold text-slate-900">{q}<span className="float-right text-slate-400 group-open:rotate-45 transition">+</span></summary><p className="mt-3 leading-7 text-slate-500">{a}</p></details>)}</div>
      </div>
    </main>
  );
}