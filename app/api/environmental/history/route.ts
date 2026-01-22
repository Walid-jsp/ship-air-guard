import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
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

    type EnvironmentalRecord = {
      temperature: number | null;
      pm10: number | null;
      pm25: number | null;
      createdAt: Date;
    };

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const hours = parseInt(searchParams.get('hours') || '24');

    // Calculer la date de début (x heures en arrière)
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);

    // Récupérer les données de la base
    const environmentalData = (await environmentalDelegate.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })) as EnvironmentalRecord[];

    // Calculer les statistiques
    const stats = {
      totalRecords: environmentalData.length,
      averageTemperature: 0,
      averagePM10: 0,
      averagePM25: 0,
      lastUpdate: environmentalData[0]?.createdAt || null,
    };

    if (environmentalData.length > 0) {
      const validTemp = environmentalData.filter(d => d.temperature !== null);
      const validPM10 = environmentalData.filter(d => d.pm10 !== null);
      const validPM25 = environmentalData.filter(d => d.pm25 !== null);

      if (validTemp.length > 0) {
        stats.averageTemperature = validTemp.reduce((sum, d) => sum + (d.temperature || 0), 0) / validTemp.length;
      }
      if (validPM10.length > 0) {
        stats.averagePM10 = validPM10.reduce((sum, d) => sum + (d.pm10 || 0), 0) / validPM10.length;
      }
      if (validPM25.length > 0) {
        stats.averagePM25 = validPM25.reduce((sum, d) => sum + (d.pm25 || 0), 0) / validPM25.length;
      }
    }

    // Mapper les données de Prisma (camelCase) vers le format attendu par le frontend (snake_case)
    const formattedData = environmentalData.map((record: any) => ({
      ...record,
      carbon_dioxide: record.carbonDioxide,
      carbon_monoxide: record.carbonMonoxide,
    }));

    return NextResponse.json({
      success: true,
      count: formattedData.length,
      data: formattedData,
      period: `${hours}h`,
      from: startDate.toISOString(),
      to: new Date().toISOString(),
      stats,
      meta: {
        limit,
        hours,
        startDate,
        count: formattedData.length,
      }
    });

  } catch (error) {
    console.error('Erreur récupération historique:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération de l\'historique',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}