export interface SampleWoundPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  dayLabel: string;
  generateImage: () => string;
}

/**
 * Procedurally generates realistic clinical wound images on high-resolution canvas
 */
function createWoundCanvas(
  type: 'acute_day0' | 'acute_day3' | 'acute_day7' | 'chronic_slough' | 'necrotic_scab' | 'clean_skin'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d')!;

  // 1. Base skin tone (realistic Caucasian/Fitzpatrick II-III or IV skin gradient with natural texture)
  const skinGrad = ctx.createRadialGradient(320, 240, 50, 320, 240, 400);
  skinGrad.addColorStop(0, '#e8c4b0');
  skinGrad.addColorStop(0.5, '#deb49f');
  skinGrad.addColorStop(1, '#cca08a');
  ctx.fillStyle = skinGrad;
  ctx.fillRect(0, 0, 640, 480);

  // Add subtle skin texture noise
  const imgData = ctx.getImageData(0, 0, 640, 480);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 12;
    imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + noise));
    imgData.data[i + 1] = Math.min(255, Math.max(0, imgData.data[i + 1] + noise * 0.8));
    imgData.data[i + 2] = Math.min(255, Math.max(0, imgData.data[i + 2] + noise * 0.6));
  }
  ctx.putImageData(imgData, 0, 0);

  if (type === 'clean_skin') {
    return canvas.toDataURL('image/jpeg', 0.92);
  }

  // Draw Wound based on type
  const cx = 320;
  const cy = 240;

  if (type === 'acute_day0') {
    // Large irregular acute wound (Day 0 Baseline)
    // Peri-wound erythema (halo of redness)
    const haloGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 140);
    haloGrad.addColorStop(0, 'rgba(215, 60, 60, 0.7)');
    haloGrad.addColorStop(0.5, 'rgba(230, 90, 80, 0.4)');
    haloGrad.addColorStop(1, 'rgba(220, 140, 120, 0.0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 140, 110, Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();

    // Core granulation bed (deep red)
    const coreGrad = ctx.createRadialGradient(cx - 10, cy - 5, 10, cx, cy, 90);
    coreGrad.addColorStop(0, '#a81c1c');
    coreGrad.addColorStop(0.6, '#bf2e2e');
    coreGrad.addColorStop(0.9, '#d94848');
    coreGrad.addColorStop(1, '#e36868');
    ctx.fillStyle = coreGrad;

    ctx.beginPath();
    ctx.moveTo(cx - 75, cy - 35);
    ctx.bezierCurveTo(cx - 60, cy - 75, cx + 50, cy - 80, cx + 75, cy - 25);
    ctx.bezierCurveTo(cx + 90, cy + 35, cx + 55, cy + 75, cx - 15, cy + 80);
    ctx.bezierCurveTo(cx - 85, cy + 70, cx - 95, cy + 15, cx - 75, cy - 35);
    ctx.closePath();
    ctx.fill();

    // Add fibrin and vascular micro-texture
    ctx.fillStyle = 'rgba(240, 200, 130, 0.55)';
    ctx.beginPath();
    ctx.ellipse(cx + 15, cy - 10, 25, 16, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'acute_day3') {
    // Moderate healing wound under Nanofiber Film (Day 3)
    const haloGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 90);
    haloGrad.addColorStop(0, 'rgba(210, 70, 70, 0.5)');
    haloGrad.addColorStop(1, 'rgba(220, 140, 120, 0.0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 90, 70, Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();

    // Reduced granulation tissue
    const coreGrad = ctx.createRadialGradient(cx - 5, cy, 5, cx, cy, 55);
    coreGrad.addColorStop(0, '#b82828');
    coreGrad.addColorStop(0.7, '#cf3c3c');
    coreGrad.addColorStop(1, '#df5e5e');
    ctx.fillStyle = coreGrad;

    ctx.beginPath();
    ctx.moveTo(cx - 50, cy - 20);
    ctx.bezierCurveTo(cx - 40, cy - 50, cx + 35, cy - 50, cx + 50, cy - 15);
    ctx.bezierCurveTo(cx + 60, cy + 25, cx + 35, cy + 50, cx - 10, cy + 50);
    ctx.bezierCurveTo(cx - 55, cy + 45, cx - 60, cy + 10, cx - 50, cy - 20);
    ctx.closePath();
    ctx.fill();

    // Re-epithelializing pink margin
    ctx.strokeStyle = 'rgba(240, 160, 170, 0.7)';
    ctx.lineWidth = 4;
    ctx.stroke();
  } else if (type === 'acute_day7') {
    // Advanced healing wound (Day 7)
    const haloGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 50);
    haloGrad.addColorStop(0, 'rgba(210, 90, 90, 0.3)');
    haloGrad.addColorStop(1, 'rgba(220, 140, 120, 0.0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 50, 40, Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();

    // Small remaining wound bed
    ctx.fillStyle = '#c93838';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 28, 20, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // Delicate pink re-epithelialization
    ctx.fillStyle = 'rgba(245, 170, 175, 0.8)';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 38, 26, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#b32d2d';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 18, 12, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'chronic_slough') {
    // Chronic Ulcer with Yellow/Brown Slough & Exudate
    const haloGrad = ctx.createRadialGradient(cx, cy, 40, cx, cy, 130);
    haloGrad.addColorStop(0, 'rgba(190, 50, 50, 0.6)');
    haloGrad.addColorStop(1, 'rgba(210, 130, 110, 0.0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 130, 100, 0, 0, Math.PI * 2);
    ctx.fill();

    // Peripheral inflamed ring
    ctx.fillStyle = '#a62424';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 95, 75, 0, 0, Math.PI * 2);
    ctx.fill();

    // Heavy yellow/fibrinous slough center
    const sloughGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 70);
    sloughGrad.addColorStop(0, '#e2c56a');
    sloughGrad.addColorStop(0.4, '#d4b353');
    sloughGrad.addColorStop(0.8, '#bfa044');
    sloughGrad.addColorStop(1, '#8f4f26');
    ctx.fillStyle = sloughGrad;
    ctx.beginPath();
    ctx.ellipse(cx - 5, cy + 2, 70, 50, Math.PI / 10, 0, Math.PI * 2);
    ctx.fill();

    // Slough patches
    ctx.fillStyle = '#f0d984';
    ctx.beginPath();
    ctx.arc(cx - 20, cy - 10, 22, 0, Math.PI * 2);
    ctx.arc(cx + 25, cy + 15, 18, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'necrotic_scab') {
    // Necrotic / Dark Scab Lesion
    const haloGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 90);
    haloGrad.addColorStop(0, 'rgba(180, 60, 60, 0.45)');
    haloGrad.addColorStop(1, 'rgba(210, 130, 110, 0.0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 90, 75, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark brown/black eschar/scab tissue
    const scabGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 65);
    scabGrad.addColorStop(0, '#261714');
    scabGrad.addColorStop(0.6, '#381e18');
    scabGrad.addColorStop(0.9, '#52241b');
    scabGrad.addColorStop(1, '#8a3424');
    ctx.fillStyle = scabGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 65, 48, -Math.PI / 12, 0, Math.PI * 2);
    ctx.fill();

    // Scab fissures and cracks
    ctx.strokeStyle = '#140b0a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy - 15);
    ctx.lineTo(cx + 25, cy + 10);
    ctx.moveTo(cx - 10, cy + 20);
    ctx.lineTo(cx + 15, cy - 25);
    ctx.stroke();
  }

  return canvas.toDataURL('image/jpeg', 0.92);
}

export const SAMPLE_WOUND_SERIES: SampleWoundPreset[] = [
  {
    id: 'case1-day0',
    name: 'Clinical Case A - Day 0 (Acute Baseline)',
    category: 'Acute Surgical / Laceration Series',
    description: 'Initial wound with prominent peripheral erythema and deep granulation core. Recommended for setting as Baseline.',
    dayLabel: 'Day 0 (Baseline)',
    generateImage: () => createWoundCanvas('acute_day0'),
  },
  {
    id: 'case1-day3',
    name: 'Clinical Case A - Day 3 (Nanofiber Film Treated)',
    category: 'Acute Surgical / Laceration Series',
    description: 'Day 3 post-application of antimicrobial nanofiber film. Noticeable contraction of perimeter and reduced inflammation.',
    dayLabel: 'Day 3',
    generateImage: () => createWoundCanvas('acute_day3'),
  },
  {
    id: 'case1-day7',
    name: 'Clinical Case A - Day 7 (Advanced Remodeling)',
    category: 'Acute Surgical / Laceration Series',
    description: 'Day 7 post-treatment. Wound area contracted by >65% with healthy pink epithelial tissue bridging.',
    dayLabel: 'Day 7',
    generateImage: () => createWoundCanvas('acute_day7'),
  },
  {
    id: 'case2-slough',
    name: 'Clinical Case B - Chronic Ulcer with Slough',
    category: 'Chronic & Exudative Wounds',
    description: 'Moderate venous ulcer featuring dense yellow fibrinous slough tissue (tested via A/B color channel filters).',
    dayLabel: 'Day 0 (Slough)',
    generateImage: () => createWoundCanvas('chronic_slough'),
  },
  {
    id: 'case3-scab',
    name: 'Clinical Case C - Necrotic Eschar & Scab',
    category: 'Necrotic & Burn Lesions',
    description: 'Abrasive lesion with dark scab / eschar tissue (tested via local lightness delta filter).',
    dayLabel: 'Day 0 (Eschar)',
    generateImage: () => createWoundCanvas('necrotic_scab'),
  },
];
