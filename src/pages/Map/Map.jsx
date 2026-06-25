import ScanCard from "../../components/Quetes/questScan";

export default function Map() {
  return <main className="w-full px-6">
    <h1 className="text-xl font-bold font-archivo-black text-white mb-4 text-left pl-6">
        Quêtes
      </h1>
      <ScanCard
        stand="Stand A"
        title="Logitech G"
        subtitle="Tapis de souris + 20pts"
        onScan={() => console.log("scan")}
      />
      <ScanCard
        stand="Stand B"
        title="RedBull"
        subtitle="1 redbull gratuite + 20pts"
        onScan={() => console.log("scan")}
      />
      <ScanCard
        stand="Stand C"
        title="Razer"
        subtitle="Clavier mécanique + 20pts"
        onScan={() => console.log("scan")}
      />
      <ScanCard
        stand="Stand D"
        title="SNCF Connect"
        subtitle="1 bon de réduction + 20pts"
        onScan={() => console.log("scan")}
      />
      <ScanCard
        stand="Stand E"
        title="Samsung"
        subtitle="1 bon de réduction + 20pts"
        onScan={() => console.log("scan")}
      />
  </main>
}
