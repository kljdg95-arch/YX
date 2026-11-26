import { useEffect, useMemo, useRef, useState } from 'react';
import JSZip from 'jszip';
import {
  QrCode, Barcode, ScanLine, Library, Layers, Loader2, Camera, CameraOff,
  Download, Save, Trash2, Copy, Pencil, AlertTriangle, ShieldCheck,
} from 'lucide-react';
import { useLang } from '@/i18n/language';
import TokenBadge from '@/components/TokenBadge';
import AppShell from '@/components/AppShell';
import {
  buildPayload, renderQrToCanvas, renderBarcode, downloadCanvasPng, downloadSvg,
  useCodeLibrary, BARCODE_FORMATS, DEFAULT_DESIGN,
  type QrType, type QrDesign, type BarcodeFormat, type WifiFields, type VcardFields,
} from '@/lib/yqro';
import { useProjectAuth } from '@/hooks/useProjectAuth';

type Tab = 'generate' | 'scan' | 'library' | 'bulk';

export default function YqroApp() {
  return (
    <AppShell project="yqro" appName="YQRO">
      {() => <YqroInner />}
    </AppShell>
  );
}

function YqroInner() {
  const { t, lang } = useLang();
  const auth = useProjectAuth('yqro');
  const [tab, setTab] = useState<Tab>('generate');
  const library = useCodeLibrary(!!auth.user);

  const TABS: { id: Tab; label: string; icon: typeof QrCode }[] = useMemo(() => [
    { id: 'generate', label: t('yqro.generate'), icon: QrCode },
    { id: 'scan', label: t('yqro.scan'), icon: ScanLine },
    { id: 'library', label: t('yqro.library'), icon: Library },
    { id: 'bulk', label: t('yqro.bulk'), icon: Layers },
  ], [t]);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-6 py-3">
        <TokenBadge />
        <nav className="flex flex-wrap gap-2" aria-label="YQRO">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              aria-current={tab === id}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs transition-all ${
                tab === id ? 'border-[var(--accent)] text-accent' : 'border-line text-muted hover:text-[var(--ink)]'
              }`}
            >
              <Icon size={13} aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>
        <span className="ms-auto hidden text-xs text-muted sm:block">yqro.yx</span>
      </div>

      <div className="flex-1">
        {tab === 'generate' && <GenerateTab authenticated={!!auth.user} library={library} />}
        {tab === 'scan' && <ScanTab />}
        {tab === 'library' && <LibraryTab library={library} authenticated={!!auth.user} />}
        {tab === 'bulk' && <BulkTab />}
      </div>

      {lang === 'fa' && <span className="sr-only">YQRO فارسی</span>}
    </div>
  );
}

type LibraryApi = ReturnType<typeof useCodeLibrary>;

function GenerateTab({ authenticated, library }: { authenticated: boolean; library: LibraryApi }) {
  const { t, lang } = useLang();
  const [kind, setKind] = useState<'qr' | 'barcode'>('qr');
  const [qrType, setQrType] = useState<QrType>('url');
  const [text, setText] = useState('https://yx.example');
  const [wifi, setWifi] = useState<WifiFields>({ ssid: '', password: '', encryption: 'WPA' });
  const [vcard, setVcard] = useState<VcardFields>({ fn: '', org: '', tel: '', email: '', url: '' });
  const [design, setDesign] = useState<QrDesign>(DEFAULT_DESIGN);
  const [bcFormat, setBcFormat] = useState<BarcodeFormat>('CODE128');
  const [bcValue, setBcValue] = useState('YX-2026');
  const [bcError, setBcError] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const payload = useMemo(() => buildPayload(qrType, text, wifi, vcard), [qrType, text, wifi, vcard]);

  useEffect(() => {
    if (kind !== 'qr' || !canvasRef.current || !payload) return;
    void renderQrToCanvas(canvasRef.current, payload, design);
  }, [kind, payload, design]);

  useEffect(() => {
    if (kind !== 'barcode' || !svgRef.current) return;
    setBcError(renderBarcode(svgRef.current, bcFormat, bcValue) ? null : 'invalid');
  }, [kind, bcFormat, bcValue]);

  const doSave = async () => {
    setSaveMsg(null);
    const ok = await library.save({
      kind,
      format: kind === 'qr' ? 'QR' : bcFormat,
      name: (kind === 'qr' ? payload : bcValue).slice(0, 40) || 'Untitled',
      content: kind === 'qr' ? payload : bcValue,
      options: kind === 'qr' ? { ...design, type: qrType } : {},
    });
    setSaveMsg(ok ? t('yqro.saveLibrary') + ' ✓' : t('common.error'));
  };

  const qrTypes: { id: QrType; label: string }[] = [
    { id: 'url', label: t('yqro.url') },
    { id: 'text', label: t('yqro.text') },
    { id: 'wifi', label: t('yqro.wifi') },
    { id: 'email', label: t('yqro.email') },
    { id: 'phone', label: t('yqro.phone') },
    { id: 'sms', label: t('yqro.sms') },
    { id: 'vcard', label: t('yqro.vcard') },
  ];

  return (
    <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-2">
      <div>
        <div className="flex gap-2">
          <button onClick={() => setKind('qr')} className={`btn-ghost flex-1 justify-center !py-2 text-xs ${kind === 'qr' ? '!border-[var(--accent)] !text-accent' : ''}`}>
            <QrCode size={14} aria-hidden="true" /> QR
          </button>
          <button onClick={() => setKind('barcode')} className={`btn-ghost flex-1 justify-center !py-2 text-xs ${kind === 'barcode' ? '!border-[var(--accent)] !text-accent' : ''}`}>
            <Barcode size={14} aria-hidden="true" /> Barcode
          </button>
        </div>

        {kind === 'qr' ? (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {qrTypes.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setQrType(id)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${qrType === id ? 'border-[var(--accent)] text-accent' : 'border-line text-muted hover:text-[var(--ink)]'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {qrType === 'wifi' ? (
              <div className="mt-5 space-y-3">
                <LabeledInput label="SSID" value={wifi.ssid} onChange={(v) => setWifi({ ...wifi, ssid: v })} />
                <LabeledInput label={t('common.password')} value={wifi.password} onChange={(v) => setWifi({ ...wifi, password: v })} />
              </div>
            ) : qrType === 'vcard' ? (
              <div className="mt-5 space-y-3">
                <LabeledInput label="Name" value={vcard.fn} onChange={(v) => setVcard({ ...vcard, fn: v })} />
                <LabeledInput label="Organization" value={vcard.org} onChange={(v) => setVcard({ ...vcard, org: v })} />
                <LabeledInput label={t('yqro.phone')} value={vcard.tel} onChange={(v) => setVcard({ ...vcard, tel: v })} />
                <LabeledInput label={t('yqro.email')} value={vcard.email} onChange={(v) => setVcard({ ...vcard, email: v })} />
                <LabeledInput label={t('yqro.url')} value={vcard.url} onChange={(v) => setVcard({ ...vcard, url: v })} />
              </div>
            ) : (
              <div className="mt-5">
                <LabeledInput label={t('yqro.content')} value={text} onChange={setText} />
              </div>
            )}

            <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-muted">{t('yqro.design')}</h3>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <ColorInput label="Foreground" value={design.dark} onChange={(v) => setDesign({ ...design, dark: v, gradient: false })} />
              <ColorInput label="Background" value={design.light} onChange={(v) => setDesign({ ...design, light: v })} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(['square', 'rounded', 'dots'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setDesign({ ...design, moduleShape: s })}
                  className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${design.moduleShape === s ? 'border-[var(--accent)] text-accent' : 'border-line text-muted'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <label htmlFor="ecc" className="text-xs text-muted">Error correction</label>
              <select
                id="ecc"
                value={design.ecc}
                onChange={(e) => setDesign({ ...design, ecc: e.target.value as QrDesign['ecc'] })}
                className="rounded-lg border border-line bg-transparent px-2 py-1 text-xs"
              >
                <option value="L">L (7%)</option>
                <option value="M">M (15%)</option>
                <option value="Q">Q (25%)</option>
                <option value="H">H (30%)</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <div className="mt-4">
              <label htmlFor="bcformat" className="text-xs text-muted">Format</label>
              <select
                id="bcformat"
                value={bcFormat}
                onChange={(e) => setBcFormat(e.target.value as BarcodeFormat)}
                className="mt-1 w-full rounded-xl border border-line bg-transparent px-3 py-2 text-sm"
              >
                {BARCODE_FORMATS.map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>
            <div className="mt-3">
              <LabeledInput label="Value" value={bcValue} onChange={setBcValue} />
            </div>
            {bcError && (
              <p role="alert" className="mt-3 flex items-center gap-2 text-xs text-[#b91c1c] dark:text-[#f87171]">
                <AlertTriangle size={13} aria-hidden="true" />
                {lang === 'fa' ? 'مقدار برای این قالب نامعتبر است.' : 'The value is not valid for this format.'}
              </p>
            )}
            <p className="mt-4 text-xs leading-relaxed text-muted">
              {lang === 'fa'
                ? 'نمادها را خوانا نگه دارید؛ لوگو روی میله‌های بارکد یک‌بعدی قرار نمی‌گیرد.'
                : 'Keep the bars readable; logos are never placed over 1D barcode bars.'}
            </p>
          </>
        )}
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white">
            {kind === 'qr' ? (
              <canvas ref={canvasRef} aria-label="QR preview" className="h-full w-full object-contain" />
            ) : (
              <svg ref={svgRef} aria-label="Barcode preview" className="max-w-full" />
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => canvasRef.current && downloadCanvasPng(canvasRef.current, 'yqro-qr.png')}
              disabled={kind !== 'qr'}
              className="btn-primary flex-1 justify-center !py-2 text-xs disabled:opacity-40"
            >
              <Download size={13} aria-hidden="true" /> PNG
            </button>
            <button
              onClick={() => svgRef.current && downloadSvg(svgRef.current, 'yqro-barcode.svg')}
              disabled={kind !== 'barcode'}
              className="btn-ghost flex-1 justify-center !py-2 text-xs disabled:opacity-40"
            >
              <Download size={13} aria-hidden="true" /> SVG
            </button>
            <button onClick={doSave} disabled={!authenticated} title={authenticated ? undefined : t('auth.signInTo') + ' YQRO'} className="btn-ghost flex-1 justify-center !py-2 text-xs disabled:opacity-40">
              <Save size={13} aria-hidden="true" /> {t('yqro.saveLibrary')}
            </button>
          </div>
          {saveMsg && <p className="mt-3 text-center text-xs text-accent" role="status">{saveMsg}</p>}
          {!authenticated && <p className="mt-3 text-center text-[11px] text-muted">{t('auth.signInTo')} YQRO</p>}
        </div>
      </div>
    </div>
  );
}

function ScanTab() {
  const { t, lang } = useLang();

  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);

  const stop = () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    setScanning(false);
  };

  useEffect(() => stop, []);

  const start = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setScanning(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        void tick();
      }
    } catch {
      setError(t('yqro.scanUnsupported'));
    }
  };

  const tick = async () => {
    if (!videoRef.current || !streamRef.current) return;
    try {
      const { BrowserMultiFormatReader } = await import('@zxing/browser');
      const reader = new BrowserMultiFormatReader();
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      try {
        const res = await reader.decodeFromImageUrl(dataUrl);
        if (res) {
          setResult(res.getText());
          stop();
          return;
        }
      } catch {
        // no code in this frame
      }
    } catch {
      // decoder unavailable
    }
    rafRef.current = requestAnimationFrame(() => void tick());
  };

  const onFile = async (file: File) => {
    setError(null);
    try {
      const { BrowserMultiFormatReader } = await import('@zxing/browser');
      const reader = new BrowserMultiFormatReader();
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      canvas.getContext('2d')?.drawImage(bitmap, 0, 0);
      const res = await reader.decodeFromImageUrl(canvas.toDataURL('image/png'));
      if (res) setResult(res.getText());
      else setError(t('common.error'));
    } catch {
      setError(lang === 'fa' ? 'کدی در تصویر پیدا نشد.' : 'No code found in the image.');
    }
  };

  const isUrl = result ? /^https?:\/\//i.test(result.trim()) : false;
  let host = '';
  try { host = result ? new URL(result.trim()).host : ''; } catch { /* not a URL */ }

  const editValue = result ?? '';
  const [edited, setEdited] = useState<string | null>(null);
  const current = edited ?? editValue;

  return (
    <div className="mx-auto max-w-xl p-6 md:p-10">
      <p className="text-sm leading-relaxed text-muted">{t('yqro.scanNote')}</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex aspect-video items-center justify-center bg-black/90">
          {scanning ? (
            <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
          ) : (
            <CameraOff size={28} className="text-white/50" aria-hidden="true" />
          )}
        </div>
        <div className="flex gap-2 p-4">
          {scanning ? (
            <button onClick={stop} className="btn-ghost flex-1 justify-center !py-2 text-xs">
              <CameraOff size={13} aria-hidden="true" /> {t('common.close')}
            </button>
          ) : (
            <button onClick={() => void start()} className="btn-primary flex-1 justify-center !py-2 text-xs">
              <Camera size={13} aria-hidden="true" /> {t('yqro.scan')}
            </button>
          )}
          <label className="btn-ghost flex-1 cursor-pointer justify-center !py-2 text-xs">
            {t('yqro.scan')} (image)
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && void onFile(e.target.files[0])} />
          </label>
        </div>
      </div>

      {error && <p role="alert" className="mt-4 text-sm text-[#b91c1c] dark:text-[#f87171]">{error}</p>}

      {result && (
        <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck size={14} className="text-accent" aria-hidden="true" />
            {t('yqro.scanToEdit')}
          </h2>

          {isUrl && (
            <p className="mt-3 rounded-xl border border-line px-3 py-2 text-xs text-muted">
              {t('yqro.openLink')}: <span className="font-medium text-[var(--ink)]">{host}</span>
            </p>
          )}

          <textarea
            value={current}
            onChange={(e) => setEdited(e.target.value)}
            aria-label={t('yqro.content')}
            className="mt-3 w-full rounded-xl border border-line bg-transparent p-3 font-mono text-xs outline-none focus:border-[var(--accent)]"
            rows={3}
            dir="ltr"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {isUrl && (
              <button onClick={() => setConfirmOpen(true)} className="btn-primary !py-2 text-xs">
                {t('yqro.openLink')}
              </button>
            )}
            <button
              onClick={() => navigator.clipboard.writeText(current)}
              className="btn-ghost !py-2 text-xs"
            >
              <Copy size={13} aria-hidden="true" /> {t('yqro.copy')}
            </button>
            <button
              onClick={() => setEdited('')}
              className="btn-ghost !py-2 text-xs"
              title={t('yqro.scanToEdit')}
            >
              <Pencil size={13} aria-hidden="true" /> {t('yqro.scanToEdit')}
            </button>
          </div>
        </div>
      )}

      {confirmOpen && result && (
        <div role="dialog" aria-modal="true" aria-label={t('yqro.openLink')} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6">
            <h3 className="text-sm font-semibold">{t('yqro.openLink')}?</h3>
            <p className="mt-2 break-all text-xs text-muted" dir="ltr">{result}</p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => window.open(result.trim(), '_blank', 'noopener')} className="btn-primary flex-1 justify-center !py-2 text-xs">
                {t('common.confirm')}
              </button>
              <button onClick={() => setConfirmOpen(false)} className="btn-ghost flex-1 justify-center !py-2 text-xs">
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LibraryTab({ library, authenticated }: { library: LibraryApi; authenticated: boolean }) {
  const { t, lang } = useLang();

  if (!authenticated) {
    return <p className="p-10 text-sm text-muted">{t('auth.signInTo')} YQRO.</p>;
  }

  return (
    <div className="p-6 md:p-10">
      {library.loading ? (
        <Loader2 className="animate-spin text-muted" size={18} aria-hidden="true" />
      ) : library.codes.length === 0 ? (
        <p className="text-sm text-muted">{lang === 'fa' ? 'هنوز کدی ذخیره نشده است.' : 'No saved codes yet.'}</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {library.codes.map((c) => (
            <li key={c.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-widest text-muted">{c.format}</p>
                </div>
                <button onClick={() => void library.remove(c.id)} aria-label={t('common.delete')} className="text-muted transition-colors hover:text-[#b91c1c] dark:hover:text-[#f87171]">
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
              <p className="mt-3 truncate font-mono text-xs text-muted" dir="ltr">{c.content}</p>
              <p className="mt-2 text-[11px] text-muted">{new Date(c.created_at).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-GB')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BulkTab() {
  const { t, lang } = useLang();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const run = async (file: File) => {
    setBusy(true);
    setError(null);
    setProgress(0);
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const contentIdx = header.indexOf('content');
      if (contentIdx === -1) throw new Error('missing content column');
      const rows = lines.slice(1).map((l) => l.split(',')[contentIdx]?.trim()).filter(Boolean) as string[];

      const zip = new JSZip();
      const tmp = document.createElement('canvas');
      for (let i = 0; i < rows.length; i++) {
        await renderQrToCanvas(tmp, rows[i], { ...DEFAULT_DESIGN, width: 512 });
        const blob = await new Promise<Blob | null>((res) => tmp.toBlob(res, 'image/png'));
        if (blob) zip.file(`qr-${String(i + 1).padStart(4, '0')}.png`, blob);
        setProgress(Math.round(((i + 1) / rows.length) * 100));
      }
      const out = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(out);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'yqro-bulk-qr.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError(t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl p-6 md:p-10">
      <p className="text-sm leading-relaxed text-muted">{t('yqro.bulkNote')}</p>
      <label className={`btn-primary mt-6 inline-flex cursor-pointer items-center gap-2 text-xs ${busy ? 'pointer-events-none opacity-60' : ''}`}>
        {busy && <Loader2 size={13} className="animate-spin" aria-hidden="true" />}
        {busy ? `${progress}%` : t('yqro.bulk')}
        <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => e.target.files?.[0] && void run(e.target.files[0])} />
      </label>
      {error && <p role="alert" className="mt-4 text-sm text-[#b91c1c] dark:text-[#f87171]">{error}</p>}
      {progress > 0 && (
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--line)]" role="progressbar" aria-valuenow={progress}>
          <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

function LabeledInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = label.replace(/\W+/g, '-').toLowerCase();
  return (
    <div>
      <label htmlFor={id} className="text-xs text-muted">{label}</label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
      />
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = `color-${label.toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="text-xs text-muted">{label}</label>
      <input
        id={id}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block h-9 w-full cursor-pointer rounded-lg border border-line bg-transparent"
      />
    </div>
  );
}
