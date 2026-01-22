import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Récupérer les dernières données
    const lastRecord = await prisma.environmentalData.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Compter le nombre total d'enregistrements
    const totalCount = await prisma.environmentalData.count();

    // Compter les enregistrements des dernières 24h
    const last24h = new Date();
    last24h.setHours(last24h.getHours() - 24);
    
    const count24h = await prisma.environmentalData.count({
      where: {
        createdAt: {
          gte: last24h
        }
      }
    });

    return NextResponse.json({
      success: true,
      database: 'SQLite',
      status: 'active',
      totalRecords: totalCount,
      recordsLast24h: count24h,
      lastRecord: lastRecord ? {
        timestamp: lastRecord.timestamp,
        temperature: lastRecord.temperature,
        pm10: lastRecord.pm10,
        sulphurDioxide: lastRecord.sulphurDioxide,
        createdAt: lastRecord.createdAt
      } : null
    });

  } catch (error) {
    console.error('Erreur statut base de données:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur base de données',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      }, 
      { status: 500 }
    );
  }
}