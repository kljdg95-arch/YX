import { useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { projectClients } from '@/lib/projectSupabase';

export type QrType = 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'sms' | 'vcard';

export interface QrDesign {
  dark: string;
  light: string;
  gradient: boolean;
  gradientTo: string;
  moduleShape: 'square' | 'dots' | 'rounded';
  ecc: 'L' | 'M' | 'Q' | 'H';
  margin: number;
  width: number;
}

export const DEFAULT_DESIGN: QrDesign = {
  dark: '#0a0a0b',
  light: '#ffffff',
  gradient: false,
  gradientTo: '#0f766e',
  moduleShape: 'square',
  ecc: 'M',
  margin: 2,
  width: 512,
};

export interface WifiFields { ssid: string; password: string; encryption: 'WPA' | 'WEP' | 'nopass' }
export interface VcardFields { fn: string; org: string; tel: string; email: string; url: string }

export function buildPayload(type: QrType, text: string, wifi: WifiFields, vcard: VcardFields): string {
  switch (type) {
    case 'wifi':
      return `WIFI:T:${wifi.encryption};S:${wifi.ssid};P:${wifi.password};;`;
    case 'email':
      return `mailto:${text}`;
    case 'phone':
      return `tel:${text}`;
    case 'sms':
      return `SMSTO:${text}`;
    case 'vcard':
      return [
        'BEGIN:VCARD', 'VERSION:3.0',
        `FN:${vcard.fn}`, `ORG:${vcard.org}`, `TEL:${vcard.tel}`,
        `EMAIL:${vcard.email}`, `URL:${vcard.url}`,
        'END:VCARD',
      ].join('\n');
    default:
      return text;
  }
}

export async function renderQrToCanvas(
  canvas: HTMLCanvasElement,
  content: string,
  design: QrDesign
): Promise<void> {
  await QRCode.toCanvas(canvas, content, {
    width: design.width,
    margin: design.margin,
    errorCorrectionLevel: design.ecc,
    color: { dark: design.dark, light: design.light },
  });
  if (design.moduleShape !== 'square' || design.gradient) {
    decorateModules(canvas, content, design);
  }
}

// Post-process the generated matrix for module shapes and gradients. QRCode's
// matrix is re-derived so shapes are drawn precisely.
function decorateModules(canvas: HTMLCanvasElement, content: string, design: QrDesign): void {
  const qr = QRCode.create(content, { errorCorrectionLevel: design.ecc });
  const count = qr.modules.size;
  const margin = design.margin;
  const cell = design.width / (count + margin * 2);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = design.light;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let paint: string | CanvasGradient = design.dark;
  if (design.gradient) {
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    g.addColorStop(0, design.dark);
    g.addColorStop(1, design.gradientTo);
    paint = g;
  }

  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!qr.modules.get(r, c)) continue;
      const x = (c + margin) * cell;
      const y = (r + margin) * cell;
      ctx.fillStyle = paint;
      if (design.moduleShape === 'dots') {
        ctx.beginPath();
        ctx.arc(x + cell / 2, y + cell / 2, cell / 2.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (design.moduleShape === 'rounded') {
        roundRect(ctx, x + cell * 0.08, y + cell * 0.08, cell * 0.84, cell * 0.84, cell * 0.3);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, cell, cell);
      }
    }
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export type BarcodeFormat =
  | 'EAN13' | 'EAN8' | 'UPC' | 'CODE128' | 'CODE39' | 'ITF';

export const BARCODE_FORMATS: { id: BarcodeFormat; label: string; note?: string }[] = [
  { id: 'EAN13', label: 'EAN-13' },
  { id: 'EAN8', label: 'EAN-8' },
  { id: 'UPC', label: 'UPC-A' },
  { id: 'CODE128', label: 'Code 128' },
  { id: 'CODE39', label: 'Code 39' },
  { id: 'ITF', label: 'ITF' },
];

export function renderBarcode(svg: SVGSVGElement, format: BarcodeFormat, value: string): boolean {
  try {
    JsBarcode(svg, value, {
      format,
      lineColor: '#0a0a0b',
      background: '#ffffff',
      width: 2,
      height: 90,
      displayValue: true,
      font: 'monospace',
      margin: 8,
    });
    return true;
  } catch {
    return false;
  }
}

export interface SavedCode {
  id: string;
  kind: 'qr' | 'barcode';
  format: string;
  name: string;
  content: string;
  options: Record<string, unknown>;
  created_at: string;
}

export function useCodeLibrary(authenticated: boolean) {
  const client = projectClients.yqro;
  const [codes, setCodes] = useState<SavedCode[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!authenticated) { setCodes([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await client.from('yqro_codes').select('*').order('created_at', { ascending: false });
    if (!error && data) setCodes(data as SavedCode[]);
    setLoading(false);
  }, [client, authenticated]);

  useEffect(() => { void refresh(); }, [refresh]);

  const save = useCallback(async (entry: Omit<SavedCode, 'id' | 'created_at'>) => {
    const { error } = await client.from('yqro_codes').insert({
      kind: entry.kind, format: entry.format, name: entry.name, content: entry.content, options: entry.options,
    });
    if (!error) await refresh();
    return !error;
  }, [client, refresh]);

  const remove = useCallback(async (id: string) => {
    await client.from('yqro_codes').delete().eq('id', id);
    await refresh();
  }, [client, refresh]);

  return { codes, loading, save, remove, refresh };
}

export function downloadCanvasPng(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    triggerDownload(URL.createObjectURL(blob), filename);
  }, 'image/png');
}

export function downloadSvg(svg: SVGSVGElement, filename: string) {
  const xml = new XMLSerializer().serializeToString(svg);
  triggerDownload(URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml' })), filename);
}

export function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

export function useScanTimeout() {
  const ref = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(ref.current), []);
  return ref;
}
