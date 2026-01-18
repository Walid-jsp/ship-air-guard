import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // --- SIMULATION REALISTE ---
    
    // Pour éviter que ça soit toujours rouge, on génère des chiffres plus bas.
    
    // CO2 : Entre 400 et 1100 (Le danger est à 1000). 
    // Donc la plupart du temps ce sera < 1000 (Vert).
    const co2 = Math.floor(Math.random() * (1100 - 400) + 400); 

    // VOC : Entre 10 et 300 (Le danger est à 250).
    const voc = Math.floor(Math.random() * (300 - 10) + 10);

    // Température : Entre 20°C et 42°C (Le danger est à 40°C).
    const temp = Math.floor(Math.random() * (42 - 20) + 20);

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