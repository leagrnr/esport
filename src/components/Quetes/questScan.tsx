//import { useState } from "react";
// import { Html5Qrcode } from "html5-qrcode"; // décommenter quand on branche la caméra

type ScanCardProps = {
  stand: string;
  title: string;
  subtitle: string;
  scanned?: boolean;
  onScan?: () => void;
};

export default function ScanCard({
  stand,
  title,
  subtitle,
  scanned = false,
  onScan,
}: ScanCardProps) {
  // const [scanning, setScanning] = useState(false); // décommenter pour la caméra

  const handleScan = () => {
    onScan?.();

    //Bon là la team, on vérifie que le QR code scanné correspond bien au stand, mais pour le moment on fait direct parce que la caméra ça m'embête un peu
    // setScanning(true);
    // const html5QrCode = new Html5Qrcode("qr-reader");
    // try {
    //   await html5QrCode.start(
    //     { facingMode: "environment" },
    //     { fps: 10, qrbox: 250 },
    //     (decodedText) => {
    //       html5QrCode.stop();
    //       setScanning(false);
    //       if (decodedText === `STAND_${stand.slice(-1)}`) {
    //         onScan?.();
    //       } else {
    //         alert("Ce QR code ne correspond pas à ce stand !");
    //       }
    //     },
    //     () => {}
    //   );
    // } catch {
    //   setScanning(false);
    // }
  };

  return (
    <>
      {/* Quand ça s'affiche à l'écran mais pour le moment ça m'embété donc on réussi direct)
      {scanning && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <div id="qr-reader" style={{ width: 300 }} />
          <button
            onClick={() => setScanning(false)}
            className="mt-6 text-white border border-gray-600 px-4 py-2 rounded-lg"
          >
            Annuler
          </button>
        </div>
      )}
      */}

      <div
        className={`flex items-center gap-4 bg-[#1e1e1e] border rounded-xl px-4 py-3 mx-4 mb-4 ${scanned ? "border-green-600" : "border-gray-600"}`}
      >
        <span className="text-white text-sm font-medium w-12 shrink-0">
          {stand}
        </span>

        <div className="flex-1 min-w-0 text-left">
          <p className="text-white text-sm font-medium truncate">{title}</p>
          <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>
        </div>

        <button
          onClick={handleScan}
          disabled={scanned}
          style={{ cursor: scanned ? "default" : "pointer" }}
          className={`shrink-0 px-3 py-1.5 rounded-lg border text-sm ${
            scanned
              ? "border-green-600 text-green-500"
              : "border-gray-600 text-gray-300"
          }`}
        >
          {scanned ? "Scanné ✓" : "Scanner"}
        </button>
      </div>
    </>
  );
}
