import { NextResponse } from 'next/server';

const ATMOSUD_API = 'https://api.atmosud.org/observations/stations/mesures/derniere';

export async function GET() {
  try {
    // 1. TENTATIVE DE CONNEXION RÉELLE
    console.log("Fetching AtmoSud data...");
    let apiData = [];
    
    try {
      const response = await fetch(ATMOSUD_API, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      });
      if (response.ok) {
        const json = await response.json();
        // Gestion de la structure parfois imbriquée
        apiData = Array.isArray(json) ? json : (json.data || []);
      }
    } catch (e) {
      console.error("API AtmoSud injoignable, passage en mode simulation.");
    }

    // 2. FILTRAGE MARITIME (On cherche Marseille, Fos, Port-de-Bouc...)
    let portData = apiData.filter(item => {
        if (!item.nom_station || !item.nom_polluant) return false;
        const name = item.nom_station.toLowerCase();
        // Mots clés maritimes
        const isZone = name.includes("marseille") || name.includes("fos") || name.includes("port") || name.includes("bouc");
        // Polluants clés : SO2 (Soufre navires), NO2, PM10
        const isPolluant = ["SO2", "NO2", "PM10", "PM2.5"].includes(item.nom_polluant);
        return isZone && isPolluant;
    });

    // 3. MODE SIMULATION (Si l'API ne renvoie RIEN pour la zone, on génère des fausses données pour la démo)
    if (portData.length === 0) {
        console.log("⚠️ Aucune donnée réelle trouvée -> Activation données simulation Ship Air Guard");
        portData = [
            { nom_station: "Navire - Cale Moteur", nom_polluant: "SO2", valeur: 45, unite: "µg/m³", date_fin: new Date().toISOString() },
            { nom_station: "Navire - Pont Supérieur", nom_polluant: "NO2", valeur: 120, unite: "µg/m³", date_fin: new Date().toISOString() },
            { nom_station: "Port de Marseille - J4", nom_polluant: "PM10", valeur: 28, unite: "µg/m³", date_fin: new Date().toISOString() },
            { nom_station: "Fos-sur-Mer - Terminal", nom_polluant: "SO2", valeur: 310, unite: "µg/m³", date_fin: new Date().toISOString() }, // Valeur critique simulée
            { nom_station: "Capteur Vacao+ (Test)", nom_polluant: "CO2", valeur: 412, unite: "ppm", date_fin: new Date().toISOString() }
        ];
    }

    return NextResponse.json(portData);

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}