'use client';

import { useCallback } from 'react';
import { jsPDF } from 'jspdf';
// @ts-ignore
import autoTable from 'jspdf-autotable';

type HistorySeries = {
  labels: string[];
  co2: number[];
  voc: number[];
  temp: number[];
};

function safeFilePart(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

export default function ReportPdfButton({
  zoneName,
  history,
  disabled,
}: {
  zoneName: string;
  history: HistorySeries | null | undefined;
  disabled?: boolean;
}) {
  const handleExport = useCallback(() => {
    if (!history || !history.labels?.length) return;

    const exportedAt = new Date();
    const exportedAtText = exportedAt.toLocaleString('fr-FR');

    const rowCount = history.labels.length;
    const dangerRows = new Set<number>();

    for (let i = 0; i < rowCount; i++) {
      const co2 = history.co2?.[i] ?? 0;
      const voc = history.voc?.[i] ?? 0;
      const temp = history.temp?.[i] ?? 0;

      if (co2 > 1000 || voc > 250 || temp > 40) {
        dangerRows.add(i);
      }
    }

    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    autoTable(doc, {
      head: [['Heure', 'CO2 (ppm)', 'VOC (ppb)', 'Température (°C)']],
      body: history.labels.map((label, i) => [
        label,
        Math.round(history.co2?.[i] ?? 0).toString(),
        Math.round(history.voc?.[i] ?? 0).toString(),
        (Math.round((history.temp?.[i] ?? 0) * 10) / 10).toString(),
      ]),
      startY: 36,
      margin: { top: 36, right: 14, bottom: 18, left: 14 },
      styles: {
        fontSize: 9,
        textColor: [15, 23, 42],
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [15, 23, 42],
        fontStyle: 'bold',
      },
      didParseCell: (data) => {
        if (data.section !== 'body') return;

        const rowIndex = data.row.index;
        if (!dangerRows.has(rowIndex)) return;

        data.cell.styles.textColor = [220, 38, 38];
        data.cell.styles.fontStyle = 'bold';
      },
      didDrawPage: () => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setTextColor(15, 23, 42);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('SHIP AIR GUARD - RAPPORT DE SÉCURITÉ', pageWidth / 2, 14, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Navire - ${zoneName}`, 14, 22);
        doc.text(`Export : ${exportedAtText}`, 14, 28);

        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text('Certifié par Ship Air Guard System', pageWidth / 2, pageHeight - 10, { align: 'center' });
      },
    });

    const fileName = `ship-air-guard-rapport-${safeFilePart(zoneName)}-${safeFilePart(exportedAt.toISOString())}.pdf`;
    doc.save(fileName);
  }, [history, zoneName]);

  const isDisabled = disabled || !history || history.labels?.length === 0;

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isDisabled}
      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 border ${
        isDisabled
          ? 'bg-slate-800/30 border-slate-700/30 text-slate-500 cursor-not-allowed'
          : 'bg-white/5 hover:bg-white/10 border-slate-700/60 text-slate-100'
      }`}
      title={isDisabled ? 'Historique indisponible' : 'Télécharger le rapport PDF'}
    >
      📄 Télécharger Rapport PDF
    </button>
  );
}
