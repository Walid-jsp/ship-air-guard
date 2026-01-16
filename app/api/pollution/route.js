import { NextResponse } from 'next/server';

const ATMOSUD_API = 'https://api.atmosud.org/observations/stations/mesures/derniere';

export async function GET() {
  try {
    const response = await fetch(ATMOSUD_API, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    if (!response.ok) throw new Error('Erreur AtmoSud');
    const data = await response.json();

    // Filtre pour garder les stations maritimes (Marseille/Fos) et les polluants navires
    const portData = data.filter(item => 
      (item.nom_station.includes("Marseille") || item.nom_station.includes("Fos") || item.nom_station.includes("Port")) &&
      ["SO2", "NO2", "PM10"].includes(item.nom_polluant)
    );

    return NextResponse.json(portData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}