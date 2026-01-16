import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // SIMULATION DU CAPTEUR VACAO+ (Espace Confiné)
    // On génère des valeurs aléatoires pour que tu puisses voir la ventilation changer en rafraîchissant la page.
    
    // Niveau CO2 (Normal ~400-800, Danger > 1000)
    const co2 = Math.floor(Math.random() * (2000 - 400) + 400); 
    // Niveau VOC (Substances Chimiques)
    const voc = Math.floor(Math.random() * (500 - 10) + 10);
    // Température
    const temp = Math.floor(Math.random() * (45 - 20) + 20);

    const sensorData = [
      { 
        nom_station: "Navire - Cale Moteur", 
        nom_polluant: "CO2", 
        valeur: co2, 
        unite: "ppm",
        seuil_danger: 1000 
      },
      { 
        nom_station: "Navire - Cale Moteur", 
        nom_polluant: "VOC (Chimique)", 
        valeur: voc, 
        unite: "ppb",
        seuil_danger: 250
      },
      { 
        nom_station: "Navire - Cale Moteur", 
        nom_polluant: "Température", 
        valeur: temp, 
        unite: "°C",
        seuil_danger: 40
      }
    ];

    return NextResponse.json(sensorData);

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}