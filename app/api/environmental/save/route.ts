import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const environmentalDelegate = (prisma as any).environmentalData;
    if (!environmentalDelegate) {
      return NextResponse.json(
        {
          success: false,
          error: "Prisma non synchronisé: modèle EnvironmentalData absent du client Prisma.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    
    // Validation des données reçues
    const {
      timestamp,
      latitude,
      longitude,
      temperature,
      pm10,
      pm25,
      ozone
    } = body;

    // Sauvegarde en base de données
    const environmentalData = await environmentalDelegate.create({
      data: {
        timestamp: new Date(timestamp),
        latitude: parseFloat(latitude) || 43.2951,
        longitude: parseFloat(longitude) || 5.3744,
        temperature: parseFloat(temperature) || null,
        pm10: parseFloat(pm10) || null,
        pm25: parseFloat(pm25) || null,
        ozone: parseFloat(ozone) || null,
        dataSource: 'open-meteo',
      },
    });

    return NextResponse.json({
      success: true,
      data: environmentalData,
      message: 'Données environnementales sauvegardées avec succès'
    });

  } catch (error) {
    console.error('Erreur sauvegarde données environnementales:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la sauvegarde des données environnementales',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}