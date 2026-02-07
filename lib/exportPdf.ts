import jsPDF from 'jspdf';
import { Scene, SceneCharacter } from '@/types';

// ── Image Helpers ──────────────────────────────────────────────

async function loadImageAsBase64(src: string): Promise<string | null> {
  if (!src) return null;
  if (src.startsWith('data:')) return src;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(null); return; }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function preloadAllImages(scenes: Scene[]): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();
  const urls = new Set<string>();

  for (const scene of scenes) {
    if (scene.locationImage) urls.add(scene.locationImage);
    for (const char of scene.characters) {
      const look = char.looks?.[char.selectedLookIndex];
      if (look?.image) urls.add(look.image);
    }
  }

  const results = await Promise.allSettled(
    Array.from(urls).map(async (url) => {
      const base64 = await loadImageAsBase64(url);
      return { url, base64 };
    })
  );

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.base64) {
      imageMap.set(result.value.url, result.value.base64);
    }
  }

  return imageMap;
}

// ── Draw Helpers ───────────────────────────────────────────────

function drawHeader(pdf: jsPDF, pageW: number, margin: number) {
  // Header bar background
  pdf.setFillColor(23, 23, 23);
  pdf.rect(0, 0, pageW, 14, 'F');
  // Bottom border
  pdf.setDrawColor(35, 35, 35);
  pdf.setLineWidth(0.2);
  pdf.line(0, 14, pageW, 14);

  // SP logo box
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(margin, 3, 8, 8, 1.5, 1.5, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  pdf.setTextColor(23, 23, 23);
  pdf.text('SP', margin + 4, 8.2, { align: 'center' });

  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(11);
  pdf.text('Simpalette', margin + 11, 8.5);

  // Subtitle
  pdf.setTextColor(115, 115, 115);
  pdf.setFontSize(8);
  pdf.text('Palette Selector', pageW - margin, 8.5, { align: 'right' });
}

function drawSceneCard(
  pdf: jsPDF,
  scene: Scene,
  x: number,
  y: number,
  w: number
): number {
  const pad = 5;
  const hasNotes = !!scene.presenterNotes;
  const cardH = hasNotes ? 52 : 40;

  // Card background
  pdf.setFillColor(23, 23, 23);
  pdf.roundedRect(x, y, w, cardH, 2, 2, 'F');
  // Card border
  pdf.setDrawColor(40, 40, 40);
  pdf.setLineWidth(0.2);
  pdf.roundedRect(x, y, w, cardH, 2, 2, 'S');

  // Scene title
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text(`Scene ${scene.sceneNumber || '\u2014'}`, x + pad, y + 7);

  // 4-column field row
  const fieldY = y + 12;
  const gap = 3;
  const colW = (w - 2 * pad - 3 * gap) / 4;
  const fields = [
    { label: 'Scene Number', value: scene.sceneNumber || '\u2014' },
    { label: 'Location', value: scene.scriptLocation || '\u2014' },
    { label: 'Time of Day', value: scene.timeDay || '\u2014' },
    { label: 'Shoot Day', value: scene.shootDay != null ? `Day ${scene.shootDay}` : '\u2014' },
  ];

  fields.forEach((field, idx) => {
    const fx = x + pad + idx * (colW + gap);

    // Label
    pdf.setTextColor(163, 163, 163);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    pdf.text(field.label, fx, fieldY);

    // Input box
    pdf.setFillColor(38, 38, 38);
    pdf.roundedRect(fx, fieldY + 1.5, colW, 7, 1, 1, 'F');
    pdf.setDrawColor(64, 64, 64);
    pdf.setLineWidth(0.15);
    pdf.roundedRect(fx, fieldY + 1.5, colW, 7, 1, 1, 'S');

    // Value
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(7.5);
    const truncated = field.value.length > 25 ? field.value.substring(0, 24) + '\u2026' : field.value;
    pdf.text(truncated, fx + 2, fieldY + 6.3);
  });

  // Description
  const descY = fieldY + 12;
  pdf.setTextColor(163, 163, 163);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6.5);
  pdf.text('Description', x + pad, descY);

  // Description box
  const descBoxW = w - 2 * pad;
  pdf.setFillColor(38, 38, 38);
  pdf.roundedRect(x + pad, descY + 1.5, descBoxW, 9, 1, 1, 'F');
  pdf.setDrawColor(64, 64, 64);
  pdf.roundedRect(x + pad, descY + 1.5, descBoxW, 9, 1, 1, 'S');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7.5);
  const desc = scene.description || '\u2014';
  const truncDesc = desc.length > 140 ? desc.substring(0, 139) + '\u2026' : desc;
  pdf.text(truncDesc, x + pad + 2, descY + 7);

  // Presenter Notes (if any)
  if (hasNotes) {
    const notesY = descY + 12;
    pdf.setTextColor(163, 163, 163);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    pdf.text('Notes', x + pad, notesY);

    const notesBoxW = w - 2 * pad;
    pdf.setFillColor(38, 38, 38);
    pdf.roundedRect(x + pad, notesY + 1.5, notesBoxW, 9, 1, 1, 'F');
    pdf.setDrawColor(64, 64, 64);
    pdf.roundedRect(x + pad, notesY + 1.5, notesBoxW, 9, 1, 1, 'S');

    pdf.setTextColor(212, 212, 212);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'italic');
    const notes = scene.presenterNotes!;
    const truncNotes = notes.length > 140 ? notes.substring(0, 139) + '\u2026' : notes;
    pdf.text(truncNotes, x + pad + 2, notesY + 7);
  }

  return y + cardH + 4;
}

function drawLocationImage(
  pdf: jsPDF,
  scene: Scene,
  imageMap: Map<string, string>,
  pageW: number,
  y: number
): number {
  if (!scene.locationImage) {
    // Empty state - subtle gradient bar
    pdf.setFillColor(20, 20, 20);
    pdf.rect(0, y, pageW, 25, 'F');
    pdf.setTextColor(80, 80, 80);
    pdf.setFontSize(7);
    pdf.text('No location image', pageW / 2, y + 13, { align: 'center' });
    return y + 25;
  }

  const imgData = imageMap.get(scene.locationImage);
  if (!imgData) return y;

  const imgH = 52;
  try {
    pdf.addImage(imgData, 'JPEG', 0, y, pageW, imgH);
  } catch {
    pdf.setFillColor(30, 30, 30);
    pdf.rect(0, y, pageW, imgH, 'F');
  }

  // Bottom fade: draw progressively darker strips at the bottom
  const fadeStrips = 12;
  const fadeH = imgH * 0.5;
  for (let s = 0; s < fadeStrips; s++) {
    const stripH = fadeH / fadeStrips;
    const stripY = y + imgH - fadeH + s * stripH;
    const alpha = (s / fadeStrips) * 0.9;
    const c = Math.round(10 + (1 - alpha) * 0); // blend toward #0a0a0a
    pdf.setFillColor(10, 10, 10);
    // Use GState for opacity if available
    const gs = (pdf as any).GState?.({ opacity: alpha });
    if (gs) {
      (pdf as any).setGState?.(gs);
      pdf.rect(0, stripY, pageW, stripH + 0.3, 'F');
    }
  }
  // Reset any GState
  const gsReset = (pdf as any).GState?.({ opacity: 1 });
  if (gsReset) (pdf as any).setGState?.(gsReset);

  return y + imgH;
}

function drawCharacterCard(
  pdf: jsPDF,
  char: SceneCharacter,
  imageMap: Map<string, string>,
  x: number,
  y: number,
  cardW: number,
  cardH: number
) {
  const look = char.looks?.[char.selectedLookIndex];

  // Card background
  pdf.setFillColor(38, 38, 38);
  pdf.roundedRect(x, y, cardW, cardH, 2, 2, 'F');

  // Character image
  if (look?.image) {
    const imgData = imageMap.get(look.image);
    if (imgData) {
      try {
        // Save state, clip to rounded rect area, draw image
        pdf.addImage(imgData, 'JPEG', x + 0.3, y + 0.3, cardW - 0.6, cardH - 0.6);
      } catch {
        // fallback: just show placeholder
      }
    }
  }

  // Rounded border on top of image
  pdf.setDrawColor(55, 55, 55);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(x, y, cardW, cardH, 2, 2, 'S');

  // Cast type badge (top-left)
  const badgeLabel =
    char.castType === 'A' ? 'Lead' : char.castType === 'B' ? 'Supporting' : 'BG';
  pdf.setFontSize(5.5);
  pdf.setFont('helvetica', 'bold');
  const badgeTextW = pdf.getStringUnitWidth(badgeLabel) * 5.5 / pdf.internal.scaleFactor;
  const badgeW = badgeTextW + 3;
  const badgeH = 4;
  const bx = x + 2;
  const by = y + 2;

  if (char.castType === 'A') {
    pdf.setFillColor(100, 70, 10);
    pdf.roundedRect(bx, by, badgeW, badgeH, 1, 1, 'F');
    pdf.setDrawColor(200, 160, 40);
    pdf.setLineWidth(0.15);
    pdf.roundedRect(bx, by, badgeW, badgeH, 1, 1, 'S');
    pdf.setTextColor(254, 240, 138);
  } else if (char.castType === 'B') {
    pdf.setFillColor(25, 50, 90);
    pdf.roundedRect(bx, by, badgeW, badgeH, 1, 1, 'F');
    pdf.setDrawColor(80, 140, 230);
    pdf.setLineWidth(0.15);
    pdf.roundedRect(bx, by, badgeW, badgeH, 1, 1, 'S');
    pdf.setTextColor(147, 197, 253);
  } else {
    pdf.setFillColor(55, 55, 55);
    pdf.roundedRect(bx, by, badgeW, badgeH, 1, 1, 'F');
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.15);
    pdf.roundedRect(bx, by, badgeW, badgeH, 1, 1, 'S');
    pdf.setTextColor(229, 229, 229);
  }
  pdf.text(badgeLabel, bx + 1.5, by + 2.9);

  // Bottom overlay with look name + counter
  if (look) {
    const overlayH = 8;
    const oy = y + cardH - overlayH;
    // Dark overlay strip
    pdf.setFillColor(0, 0, 0);
    pdf.rect(x + 0.3, oy, cardW - 0.6, overlayH - 0.3, 'F');

    // Look name
    pdf.setTextColor(230, 230, 230);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6);
    const lookName = look.name.length > 14 ? look.name.substring(0, 13) + '\u2026' : look.name;
    pdf.text(lookName, x + 2.5, oy + 4.5);

    // Look counter
    pdf.setTextColor(160, 160, 160);
    pdf.setFontSize(5);
    pdf.text(
      `${char.selectedLookIndex + 1}/${char.looks.length}`,
      x + cardW - 2.5,
      oy + 4.5,
      { align: 'right' }
    );
  }

  // Character name below card
  pdf.setTextColor(212, 212, 212);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  const name = char.name.length > 14 ? char.name.substring(0, 13) + '\u2026' : char.name;
  pdf.text(name, x + cardW / 2, y + cardH + 4, { align: 'center' });
}

function drawCharacterGrid(
  pdf: jsPDF,
  characters: SceneCharacter[],
  imageMap: Map<string, string>,
  margin: number,
  contentW: number,
  startY: number,
  pageH: number
): number {
  if (characters.length === 0) {
    // Empty state
    pdf.setDrawColor(50, 50, 50);
    pdf.setLineWidth(0.3);
    // Dashed border simulation
    const emptyX = margin;
    const emptyY = startY;
    const emptyW = contentW;
    const emptyH = 20;
    pdf.setFillColor(15, 15, 15);
    pdf.roundedRect(emptyX, emptyY, emptyW, emptyH, 2, 2, 'F');
    pdf.setDrawColor(50, 50, 50);
    pdf.roundedRect(emptyX, emptyY, emptyW, emptyH, 2, 2, 'S');
    pdf.setTextColor(115, 115, 115);
    pdf.setFontSize(7);
    pdf.text('No characters in this scene', margin + contentW / 2, emptyY + 11, { align: 'center' });
    return emptyY + emptyH + 4;
  }

  const maxPerRow = 6;
  const gap = 4;
  const cardW = Math.min(40, (contentW - (maxPerRow - 1) * gap) / maxPerRow);
  const cardH = cardW * 1.5;
  const charBlockH = cardH + 7; // card + name

  // Overlap into location image area (like -mt-24 in web)
  const y = startY - 12;
  let cx = margin;
  let cy = y;

  for (let c = 0; c < characters.length; c++) {
    if (c > 0 && c % maxPerRow === 0) {
      cx = margin;
      cy += charBlockH + 3;
    }

    drawCharacterCard(pdf, characters[c], imageMap, cx, cy, cardW, cardH);
    cx += cardW + gap;
  }

  const rows = Math.ceil(characters.length / maxPerRow);
  return cy + charBlockH + 4;
}

// ── Main Export Function ───────────────────────────────────────

export type PdfSortOrder = 'scene-number' | 'shoot-day';

export async function exportScenesToPdf(scenes: Scene[], sortOrder: PdfSortOrder = 'scene-number'): Promise<void> {
  // Filter scenes that have any content
  let scenesToExport = scenes.filter(
    (s) =>
      s.characters.length > 0 ||
      s.locationImage ||
      s.scriptLocation ||
      s.description
  );

  if (scenesToExport.length === 0) {
    alert('No scenes to export. Add some content first!');
    return;
  }

  // Sort based on chosen order
  if (sortOrder === 'shoot-day') {
    scenesToExport = [...scenesToExport].sort((a, b) => {
      if (a.shootDay == null && b.shootDay == null) return 0;
      if (a.shootDay == null) return 1;
      if (b.shootDay == null) return -1;
      return a.shootDay - b.shootDay;
    });
  } else {
    scenesToExport = [...scenesToExport].sort((a, b) => {
      const numA = parseFloat(a.sceneNumber) || 0;
      const numB = parseFloat(b.sceneNumber) || 0;
      if (numA !== numB) return numA - numB;
      return a.sceneNumber.localeCompare(b.sceneNumber);
    });
  }

  // Preload all images
  const imageMap = await preloadAllImages(scenesToExport);

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageW = 297;
  const pageH = 210;
  const margin = 12;
  const contentW = pageW - 2 * margin;

  for (let i = 0; i < scenesToExport.length; i++) {
    if (i > 0) pdf.addPage();
    const scene = scenesToExport[i];

    // Page background
    pdf.setFillColor(10, 10, 10);
    pdf.rect(0, 0, pageW, pageH, 'F');

    // Header
    drawHeader(pdf, pageW, margin);

    // Scene info card
    let y = 18;
    y = drawSceneCard(pdf, scene, margin, y, contentW);

    // Location image
    y = drawLocationImage(pdf, scene, imageMap, pageW, y);

    // Character grid
    y = drawCharacterGrid(pdf, scene.characters, imageMap, margin, contentW, y, pageH);

    // Footer
    pdf.setTextColor(80, 80, 80);
    pdf.setFontSize(6);
    pdf.text(
      `Scene ${scene.sceneNumber || String(i + 1)}  \u2022  Page ${i + 1} of ${scenesToExport.length}`,
      pageW / 2,
      pageH - 5,
      { align: 'center' }
    );
    pdf.text('Simpalette', pageW - margin, pageH - 5, { align: 'right' });
  }

  pdf.save('simpalette-scenes.pdf');
}
