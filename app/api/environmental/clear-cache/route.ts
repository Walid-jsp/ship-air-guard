import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE() {
  try {
    // Nettoyer les données plus anciennes que 30 jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deletedRecords = await prisma.environmentalData.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${deletedRecords.count} enregistrements supprimés`,
      cutoffDate: thirtyDaysAgo.toISOString(),
    });

  } catch (error) {
    console.error('Erreur nettoyage données environnementales:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors du nettoyage des anciennes données',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Statistiques sur la base de données
    const totalRecords = await prisma.environmentalData.count();
    const oldRecords = await prisma.environmentalData.count({
      where: {
        createdAt: {
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 jours
        },
      },
    });

    const recentRecords = await prisma.environmentalData.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 heures
        },
      },
    });

    const oldestRecord = await prisma.environmentalData.findFirst({
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        createdAt: true,
      },
    });

    const newestRecord = await prisma.environmentalData.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalRecords,
        recentRecords: recentRecords,
        oldRecords: oldRecords,
        oldestRecord: oldestRecord?.createdAt || null,
        newestRecord: newestRecord?.createdAt || null,
        databaseSize: `~${Math.round(totalRecords * 0.5)} KB`, // Estimation approximative
      },
      recommendations: {
        shouldCleanup: oldRecords > 1000,
        message: oldRecords > 1000 
          ? 'Nettoyage recommandé - Beaucoup d\'anciens enregistrements'
          : 'Base de données optimisée'
      }
    });

  } catch (error) {
    console.error('Erreur stats données environnementales:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des statistiques',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}