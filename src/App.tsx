/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Download, 
  Copy, 
  History, 
  Trash2, 
  Settings2, 
  QrCode, 
  Link as LinkIcon, 
  Type as TextIcon,
  Check,
  Share2,
  ExternalLink
} from "lucide-react";
import { cn } from "./lib/utils";

interface QRHistoryItem {
  id: string;
  value: string;
  timestamp: number;
  fgColor: string;
  bgColor: string;
}

export default function App() {
  const [value, setValue] = useState("https://ai.studio");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(256);
  const [includeMargin, setIncludeMargin] = useState(true);
  const [history, setHistory] = useState<QRHistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("qr_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (val: string) => {
    if (!val.trim()) return;
    
    const newItem: QRHistoryItem = {
      id: crypto.randomUUID(),
      value: val,
      timestamp: Date.now(),
      fgColor,
      bgColor,
    };

    const updatedHistory = [newItem, ...history.filter(h => h.value !== val)].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem("qr_history", JSON.stringify(updatedHistory));
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `qrcode-${Date.now()}.png`;
      link.href = url;
      link.click();
      saveToHistory(value);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("qr_history");
  };

  const removeHistoryItem = (id: string) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem("qr_history", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <QrCode className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">QR Studio</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "p-2 rounded-full transition-colors",
                showSettings ? "bg-blue-50 text-blue-600" : "hover:bg-neutral-100 text-neutral-500"
              )}
            >
              <Settings2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Section */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-neutral-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  {value.startsWith("http") ? (
                    <LinkIcon className="w-5 h-5 text-blue-600" />
                  ) : (
                    <TextIcon className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <h2 className="text-lg font-semibold">Content</h2>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter URL or text here..."
                    className="w-full h-32 p-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none outline-none text-lg"
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button 
                      onClick={copyToClipboard}
                      className="p-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors shadow-sm"
                      title="Copy content"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-neutral-500" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {["https://google.com", "https://github.com", "Hello World!"].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setValue(preset)}
                      className="px-3 py-1.5 text-sm bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-600 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Customization Section */}
            <AnimatePresence>
              {showSettings && (
                <motion.section
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-neutral-200 overflow-hidden"
                >
                  <h2 className="text-lg font-semibold mb-6">Customization</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-500">Foreground Color</label>
                      <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                        <input 
                          type="color" 
                          value={fgColor} 
                          onChange={(e) => setFgColor(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                        />
                        <span className="font-mono text-sm uppercase">{fgColor}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-500">Background Color</label>
                      <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                        <input 
                          type="color" 
                          value={bgColor} 
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                        />
                        <span className="font-mono text-sm uppercase">{bgColor}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-500">Size ({size}px)</label>
                      <input 
                        type="range" 
                        min="128" 
                        max="512" 
                        step="8"
                        value={size} 
                        onChange={(e) => setSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                      <span className="text-sm font-medium text-neutral-500">Include Margin</span>
                      <button 
                        onClick={() => setIncludeMargin(!includeMargin)}
                        className={cn(
                          "w-12 h-6 rounded-full transition-colors relative",
                          includeMargin ? "bg-blue-600" : "bg-neutral-300"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                          includeMargin ? "left-7" : "left-1"
                        )} />
                      </button>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* History Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-neutral-400" />
                  <h2 className="text-lg font-semibold">Recent</h2>
                </div>
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="text-sm text-neutral-400 hover:text-red-500 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="bg-neutral-100/50 border-2 border-dashed border-neutral-200 rounded-3xl p-12 text-center">
                  <p className="text-neutral-400">No history yet. Generate your first QR code!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatePresence mode="popLayout">
                    {history.map((item) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={item.id}
                        className="group bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
                      >
                        <div className="w-12 h-12 flex-shrink-0 bg-neutral-50 rounded-lg flex items-center justify-center overflow-hidden border border-neutral-100">
                          <QRCodeCanvas 
                            value={item.value} 
                            size={48} 
                            fgColor={item.fgColor}
                            bgColor={item.bgColor}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-neutral-700">{item.value}</p>
                          <p className="text-xs text-neutral-400">{new Date(item.timestamp).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setValue(item.value)}
                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                            title="Reuse"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => removeHistoryItem(item.id)}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-neutral-200 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-8">
                <h2 className="text-lg font-semibold">Preview</h2>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full uppercase tracking-wider">Live</span>
              </div>

              <motion.div 
                key={`${value}-${fgColor}-${bgColor}-${size}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                ref={qrRef}
                className="p-6 bg-white rounded-3xl shadow-inner border border-neutral-100 mb-8"
              >
                {value ? (
                  <QRCodeCanvas
                    value={value}
                    size={size}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level="H"
                    includeMargin={includeMargin}
                    className="max-w-full h-auto"
                  />
                ) : (
                  <div className="w-64 h-64 bg-neutral-50 flex items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200">
                    <QrCode className="w-12 h-12 text-neutral-200" />
                  </div>
                )}
              </motion.div>

              <div className="w-full space-y-3">
                <button
                  disabled={!value}
                  onClick={downloadQRCode}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
                >
                  <Download className="w-5 h-5" />
                  Download PNG
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled={!value}
                    onClick={copyToClipboard}
                    className="py-3 bg-neutral-100 hover:bg-neutral-200 disabled:text-neutral-400 text-neutral-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy Link"}
                  </button>
                  <button
                    disabled={!value}
                    className="py-3 bg-neutral-100 hover:bg-neutral-200 disabled:text-neutral-400 text-neutral-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              <p className="mt-8 text-xs text-neutral-400 text-center leading-relaxed">
                Scan with any QR reader. High-quality output suitable for print and digital use.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-neutral-200 bg-white py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <QrCode className="w-5 h-5 text-blue-600" />
            <span className="font-bold">QR Studio</span>
          </div>
          <p className="text-sm text-neutral-500">
            Professional QR code generation made simple. No tracking, no ads.
          </p>
        </div>
      </footer>
    </div>
  );
}
