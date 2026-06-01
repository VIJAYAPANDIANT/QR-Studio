/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
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
  ExternalLink,
  Wifi,
  User,
  Mail,
  MessageSquare,
  Sparkles,
  Plus,
  Play,
  BarChart3,
  ArrowLeft,
  Printer,
  RefreshCw,
  Smartphone,
  Eye,
  Upload,
  Calendar,
  X,
  Key,
  Database,
  ArrowRight,
  TrendingUp,
  Globe,
  Monitor
} from "lucide-react";
import { cn } from "./lib/utils";
import { GoogleGenAI } from "@google/genai";

// SVG base64 logos to overlay in the center of QR codes
const PRESET_LOGOS: Record<string, string> = {
  wifi: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0id2hpdGUiIC8+PGcgdHJhbnNmb3JtPSJzY2FsZSgwLjcpIHRyYW5zbGF0ZSg1LjE0LCA1LjE0KSI+PHBhdGggZmlsbD0iIzNiODJmNiIgZD0iTTEyIDIxYTIgMiAwIDEgMSAwLTQgMiAyIDAgMCAxIDAgNHptLTYuMzY0LS4zNjRhOSA5IDAgMCAxIDEyLjcyOCAwIDIgMiAwIDAgMCAyLjgyOC0yLjgyOCAxMyAxMyAwIDAgMC0xOC4zODQgMCAyIDIgMCAwIDAgMi44MjggMi44Mjh6bTMuNTM1LTMuNTM1YTUgNSAwIDAgMSA3LjA3MiAwIDIgMiAwIDAgMCAyLjgyOS0yLjgyOCA5IDkgMCAwIDAtMTIuNzMgMCAyIDIgMCAwIDAgMi44MjkgMi44Mjh6TTEyIDNhNiA2IDAgMCAwIDAgMTJoMmE2IDYgMCAwIDAgMC0xMmgtMnoiLz48L2c+PC9zdmc+",
  link: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0id2hpdGUiIC8+PGcgdHJhbnNmb3JtPSJzY2FsZSgwLjcpIHRyYW5zbGF0ZSg1LjE0LCA1LjE0KSI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjM2I4MmY2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTEwIDEzaDRhNSA1IDAgMCAwIDAtMTBoLTRhNSA1IDAgMCAwIDAgMTBtdi02YTUgNSAwIDAgMCAwIDEwaDRhNSA1IDAgMCAwIDAtMTAiLz48L2c+PC9zdmc+",
  mail: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0id2hpdGUiIC8+PGcgdHJhbnNmb3JtPSJzY2FsZSgwLjcpIHRyYW5zbGF0ZSg1LjE0LCA1LjE0KSI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB4PSIyIiB5PSI0IiByeD0iMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjM2I4MmY2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJtMjIgNy04IDUtOC01IiAvPjwvZz48L3N2Zz4=",
  user: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0id2hpdGUiIC8+PGcgdHJhbnNmb3JtPSJzY2FsZSgwLjcpIHRyYW5zbGF0ZSg1LjE0LCA1LjE0KSI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjM2I4MmY2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDIxdi0yYTQgNCAwIDAgMC00LTRIOWE0IDQgMCAwIDAtNCA0djJNMTYgN2E0IDQgMCAxIDEtOCAwIDQgNCAwIDAgMSA4IDB6IiAvPjwvZz48L3N2Zz4=",
  google: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0id2hpdGUiIC8+PGcgdHJhbnNmb3JtPSJzY2FsZSgwLjcpIHRyYW5zbGF0ZSg1LjE0LCA1LjE0KSI+PHBhdGggZmlsbD0iIzQyODVGNCIgZD0iTTIzLjc0NSAxMi4yN2MtLjA2LS44MTUtLjczLTEuNDk1LTEuNTUtMS40OTVoLTkuOTM2djQuMDhoNS43MDhjLS4yNTUgMS4zNTYtMS4wMTUgMi40OS0yLjE5IDMuMjYzbDIuOTgtNC4yNzljMi4xMzctMS45NzMgMy40MjgtNC44NzUgMy40MjgtOC4yMXoiLz48cGF0aCBmaWxsPSIjMzRBODUzIiBkPSJNMTIuMjYgMjMuNzQ1YzMuMjA1IDAgNS45NDEtMS4wNjUgNy45MjQtMi44OThsLTIuOTgtNC4yNzljLS44NzUuNTkxLTEuOTguOTUtMy4xNDQuOTUtMy4xNDIgMC01Ljc4Ni0yLjEyMi02LjczNS00Ljk5NWwtMy4wODQgMi4zODNjMi4wMTEgNC4wMjggNi4xNTEgNi43MzQgMTAuOTg2IDYuNzM0eiIvPjxwYXRoIGZpbGw9IiNGQkJDMDUiIGQ9Ik01LjUyNSAxMi41ODNjLS4yNC0uNzE1LS4zNzUtMS40OC0uMzc1LTIuMjU1cy4xMzUtMS41NC4zNzUtMi4yNTVsLTMuMDg0LTIuMzgzQy45MzcgNy4wMTcuNSAxMi41ODMuNSAxMC4zMjhzLjQzNyA1Ljg2NSAxLjk0MSA4LjAxMmwzLjA4NC0yLjM4MjkiLz48cGF0aCBmaWxsPSIjRUE0MzM1IiBkPSJNMTIuMjYgMy43NTVjMS43NTcgMCAzLjMzMy42MDUgNC41NiAxLjc4bDMuNDE3LTMuNDE3QzE4LjE5IDEuMDk2IDE1LjQzNS41IDEyLjI2LjVjLTQuODM1IDAtOC45NzUgNC43ODItMTAuOTg2IDguODA5bDMuMDg0IDIuMzgzYy45NDktMi44NzMgMy41OTMtNC45OTYgNi43MzUtNC45OTZ6Ii8+PC9nPjwvc3ZnPg==",
  github: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0id2hpdGUiIC8+PGcgdHJhbnNmb3JtPSJzY2FsZSgwLjcpIHRyYW5zbGF0ZSg1LjE0LCA1LjE0KSI+PHBhdGggZmlsbD0iIzE4MTcxNyIgZD0iTTEyIC4yOTdjLTYuNjMgMC0xMiA1LjM3My0xMiAxMiAwIDUuMzAzIDMuNDM4IDkuOCA4LjIwNSAxMS4zODUuNi4xMTMuODItLjI1OC44Mi0uNTc3di0yLjIzNGMtMy4zMzguNzI0LTQuMDQyLTEuNjEtNC4wNDItMS42MUM0LjQyMiAxOC4wNyAzLjYzMyAxNy43IDMuNjMzIDE3LjdjLTEuMDg3LS43NDQuMDg0LS43MjkuMDg0LS43MjkgMS4yMDUuMDg0IDEuODM4IDEuMjM2IDEuODM4IDEuMjM2IDEuMDcgMS44MzUgMi44MDkgMS4zMDUgMy40OTUuOTk4LjEwOC0uNzc2LjQxNy0xLjMwNS43Ni0xLjYwNS0yLjY2NS0uMy01LjQ2Ni0xLjMyMi01LjQ2Ni01LjkzIDAtMS4zMS40NjUtMi4zOCAxLjIzNS0zLjIyLS4xMzUtLjMwMy0uNTQtMS41MjMuMTA1LTMuMTc2IDAgMCAxLjAwNS0uMzIyIDMuMyAxLjIzLjk2LS4yNjcgMS45OC0uMzk5IDMtLjQwNSAxLjAyLjAwNiAyLjA0LjEzOCAzIC40MDUgMi4yOC0xLjU1MiAzLjI4NS0xLjIzIDMuMjg1LTEuMjMuNjQ1IDEuNjUzLjI0IDIuODczLjEyIDMuMTc2Ljc2NS44NCAxLjIzIDEuOTEgMS4yMyAzLjIyIDAgNC42MS0yLjgwNSA1LjYyNS01LjQ3NSA1LjkyLjQyLjM2LjgxIDEuMDk2LjgxIDIuMjJ2My4yOTNjMCAuMzAyLjIxLjY4NS44My41NzdDMTkuODg1IDIyLjA5IDIzLjMyOCAxNy41OSAyMy4zMjggMTIuMjk3YzAtNi42MjctNS4zNzMtMTItMTItMTIiLz48L2c+PC9zdmc+"
};

interface QRHistoryItem {
  id: string;
  type: string; // 'url' | 'wifi' | 'vcard' | 'email' | 'sms'
  value: string;
  label: string;
  timestamp: number;
  fgColor: string;
  bgColor: string;
}

interface DynamicCode {
  id: string;
  label: string;
  targetUrl: string;
  timestamp: number;
  fgColor: string;
  bgColor: string;
  logoPreset: string;
  logoDataUrl: string;
  logoSize: number;
  badgeText: string;
  tagline: string;
  gradientStyle: string;
}

interface ScanLog {
  id: string;
  codeId: string;
  timestamp: number;
  device: "Mobile" | "Tablet" | "Desktop";
  os: string;
  browser: string;
  referrer: string;
}

interface AIThemeResponse {
  fgColor: string;
  bgColor: string;
  cardGradient: string;
  tagline: string;
  badgeText: string;
}

const PRESET_THEMES = [
  {
    name: "Cyberpunk Glow",
    fgColor: "#00f0ff",
    bgColor: "#09090e",
    cardGradient: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #00f0ff 100%)",
    tagline: "SCAN TO ENTER THE FUTURE",
    badgeText: "NEON",
  },
  {
    name: "Minimalist Gold",
    fgColor: "#d4af37",
    bgColor: "#171717",
    cardGradient: "linear-gradient(135deg, #1f1f2e 0%, #111119 100%)",
    tagline: "EXPERIENCE PURE LUXURY",
    badgeText: "PREMIUM",
  },
  {
    name: "Eco Organic",
    fgColor: "#15803d",
    bgColor: "#f0fdf4",
    cardGradient: "linear-gradient(135deg, #4ade80 0%, #15803d 100%)",
    tagline: "GROW WITH US NATURALLY",
    badgeText: "ORGANIC",
  },
  {
    name: "Sunset Rose",
    fgColor: "#be123c",
    bgColor: "#fff1f2",
    cardGradient: "linear-gradient(135deg, #f97316 0%, #e11d48 100%)",
    tagline: "LET'S WORK TOGETHER",
    badgeText: "WELCOME",
  }
];

export default function App() {
  // Redirection handling
  const [redirecting, setRedirecting] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState("");
  const [redirectLabel, setRedirectLabel] = useState("");

  // App core states
  const [activeMode, setActiveMode] = useState<"static" | "dynamic" | "print">("static");
  const [staticType, setStaticType] = useState<"url" | "wifi" | "vcard" | "email" | "sms">("url");

  // QR canvas customizations
  const [value, setValue] = useState("https://google.com");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(256);
  const [includeMargin, setIncludeMargin] = useState(true);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<"L" | "M" | "Q" | "H">("H");

  // Branded card overlays (AI/Theme driven)
  const [badgeText, setBadgeText] = useState("SCAN ME");
  const [tagline, setTagline] = useState("Scan code to access destination");
  const [cardGradient, setCardGradient] = useState("linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)");

  // Logo settings
  const [logoPreset, setLogoPreset] = useState<string>("none");
  const [logoDataUrl, setLogoDataUrl] = useState<string>("");
  const [logoSize, setLogoSize] = useState<number>(20);
  const [excavateLogo, setExcavateLogo] = useState<boolean>(true);

  // Static schema values
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiSec, setWifiSec] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);

  const [vCardFirst, setVCardFirst] = useState("");
  const [vCardLast, setVCardLast] = useState("");
  const [vCardPhone, setVCardPhone] = useState("");
  const [vCardEmail, setVCardEmail] = useState("");
  const [vCardOrg, setVCardOrg] = useState("");
  const [vCardTitle, setVCardTitle] = useState("");
  const [vCardUrl, setVCardUrl] = useState("");
  const [vCardAddress, setVCardAddress] = useState("");

  const [emailTo, setEmailTo] = useState("");
  const [emailSub, setEmailSub] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const [smsPhone, setSmsPhone] = useState("");
  const [smsMsg, setSmsMsg] = useState("");

  // Dynamic QR Codes Database
  const [dynamicCodes, setDynamicCodes] = useState<DynamicCode[]>([]);
  const [selectedDynamicCode, setSelectedDynamicCode] = useState<DynamicCode | null>(null);
  
  // Dynamic fields
  const [dynLabel, setDynLabel] = useState("");
  const [dynTarget, setDynTarget] = useState("");
  const [isEditingDyn, setIsEditingDyn] = useState(false);

  // Scan logs for Analytics
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
  const [analyticsCodeId, setAnalyticsCodeId] = useState<string | null>(null);

  // AI Theme Assistant
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiState, setAiState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [aiErrorMsg, setAiErrorMsg] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Print Settings
  const [printTitle, setPrintTitle] = useState("QR CODE SHEET");
  const [printSub, setPrintSub] = useState("Scan codes below for quick information");
  const [printRepeats, setPrintRepeats] = useState(4);
  const [printColumns, setPrintColumns] = useState(2);
  const [printCutMarks, setPrintCutMarks] = useState(true);
  const [printFrameNotes, setPrintFrameNotes] = useState("Scan to explore details");

  // General App Helpers
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<QRHistoryItem[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  
  // Simulation Modal
  const [simModalOpen, setSimModalOpen] = useState(false);
  const [simCodeId, setSimCodeId] = useState("");
  const [simDevice, setSimDevice] = useState<"Mobile" | "Tablet" | "Desktop">("Mobile");
  const [simOS, setSimOS] = useState("iOS");
  const [simBrowser, setSimBrowser] = useState("Safari");
  const [simReferrer, setSimReferrer] = useState("Direct (Scan)");

  const qrRef = useRef<HTMLDivElement>(null);

  // Detect Redirect search parameters immediately on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rId = params.get("r");
    if (rId) {
      const savedCodes = localStorage.getItem("qr_dynamic_codes");
      if (savedCodes) {
        try {
          const codes: DynamicCode[] = JSON.parse(savedCodes);
          const matched = codes.find(c => c.id === rId);
          if (matched) {
            setRedirecting(true);
            setRedirectTarget(matched.targetUrl);
            setRedirectLabel(matched.label);

            // Fetch visitor platform details
            const ua = navigator.userAgent;
            const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
            const isTablet = /iPad/i.test(ua) || (isMobile && window.innerWidth > 600);
            const device = isTablet ? "Tablet" : isMobile ? "Mobile" : "Desktop";
            
            let os = "Other";
            if (/Windows/i.test(ua)) os = "Windows";
            else if (/Macintosh/i.test(ua)) os = "macOS";
            else if (/Android/i.test(ua)) os = "Android";
            else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
            else if (/Linux/i.test(ua)) os = "Linux";
            
            let browser = "Other";
            if (/Chrome/i.test(ua)) browser = "Chrome";
            else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
            else if (/Firefox/i.test(ua)) browser = "Firefox";
            else if (/Edge/i.test(ua)) browser = "Edge";

            const referrerVal = document.referrer ? new URL(document.referrer).hostname : "Direct (Scan)";

            const newScan: ScanLog = {
              id: crypto.randomUUID(),
              codeId: rId,
              timestamp: Date.now(),
              device,
              os,
              browser,
              referrer: referrerVal
            };

            const savedScans = localStorage.getItem("qr_scans");
            const scans: ScanLog[] = savedScans ? JSON.parse(savedScans) : [];
            scans.push(newScan);
            localStorage.setItem("qr_scans", JSON.stringify(scans));

            const timer = setTimeout(() => {
              window.location.replace(matched.targetUrl);
            }, 2200);
            return () => clearTimeout(timer);
          }
        } catch (e) {
          console.error("Redirection failure", e);
        }
      }
    }
  }, []);

  // Fetch data on load
  useEffect(() => {
    const savedHistory = localStorage.getItem("qr_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedDynamic = localStorage.getItem("qr_dynamic_codes");
    if (savedDynamic) setDynamicCodes(JSON.parse(savedDynamic));

    const savedScans = localStorage.getItem("qr_scans");
    if (savedScans) setScanLogs(JSON.parse(savedScans));

    const savedKey = localStorage.getItem("user_gemini_api_key");
    if (savedKey) setGeminiApiKey(savedKey);
  }, []);

  // Sync state values to static QR formats
  useEffect(() => {
    if (activeMode !== "static") return;

    if (staticType === "url") {
      // Keep whatever URL value is loaded or typed
    } else if (staticType === "wifi") {
      const wifiStr = `WIFI:S:${wifiSSID};T:${wifiSec};P:${wifiPass};${wifiHidden ? "H:true" : ""};`;
      setValue(wifiStr);
    } else if (staticType === "vcard") {
      const vcardStr = `BEGIN:VCARD\nVERSION:3.0\nN:${vCardLast};${vCardFirst};;;\nFN:${vCardFirst} ${vCardLast}\nORG:${vCardOrg}\nTITLE:${vCardTitle}\nTEL:${vCardPhone}\nEMAIL:${vCardEmail}\nURL:${vCardUrl}\nADR:;;${vCardAddress}\nEND:VCARD`;
      setValue(vcardStr);
    } else if (staticType === "email") {
      const emailStr = `mailto:${emailTo}?subject=${encodeURIComponent(emailSub)}&body=${encodeURIComponent(emailBody)}`;
      setValue(emailStr);
    } else if (staticType === "sms") {
      const smsStr = `sms:${smsPhone}:${smsMsg}`;
      setValue(smsStr);
    }
  }, [staticType, wifiSSID, wifiPass, wifiSec, wifiHidden, vCardFirst, vCardLast, vCardPhone, vCardEmail, vCardOrg, vCardTitle, vCardUrl, vCardAddress, emailTo, emailSub, emailBody, smsPhone, smsMsg, activeMode]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      triggerToast("Content copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `qr-studio-${Date.now()}.png`;
      link.href = url;
      link.click();
      
      // Save static items to history on download
      if (activeMode === "static") {
        const titleStr = staticType.toUpperCase() + ": " + (value.length > 30 ? value.substring(0, 30) + "..." : value);
        const newItem: QRHistoryItem = {
          id: crypto.randomUUID(),
          type: staticType,
          value,
          label: titleStr,
          timestamp: Date.now(),
          fgColor,
          bgColor,
        };
        const updated = [newItem, ...history.filter(h => h.value !== value)].slice(0, 10);
        setHistory(updated);
        localStorage.setItem("qr_history", JSON.stringify(updated));
      }
      triggerToast("QR Code PNG downloaded!");
    }
  };

  // Dynamic QR operations
  const saveDynamicCode = () => {
    if (!dynLabel.trim() || !dynTarget.trim()) {
      triggerToast("Please enter both Label and Destination URL");
      return;
    }
    // Simple URL validation
    if (!/^https?:\/\//.test(dynTarget)) {
      triggerToast("Destination must start with http:// or https://");
      return;
    }

    if (selectedDynamicCode && isEditingDyn) {
      // Edit mode
      const updated = dynamicCodes.map(code => {
        if (code.id === selectedDynamicCode.id) {
          return {
            ...code,
            label: dynLabel,
            targetUrl: dynTarget,
            fgColor,
            bgColor,
            logoPreset,
            logoDataUrl,
            logoSize,
            badgeText,
            tagline,
            gradientStyle: cardGradient
          };
        }
        return code;
      });
      setDynamicCodes(updated);
      localStorage.setItem("qr_dynamic_codes", JSON.stringify(updated));
      setIsEditingDyn(false);
      triggerToast("Dynamic link updated successfully!");
    } else {
      // Add new
      const newId = crypto.randomUUID();
      const newCode: DynamicCode = {
        id: newId,
        label: dynLabel,
        targetUrl: dynTarget,
        timestamp: Date.now(),
        fgColor,
        bgColor,
        logoPreset,
        logoDataUrl,
        logoSize,
        badgeText,
        tagline,
        gradientStyle: cardGradient
      };
      const updated = [newCode, ...dynamicCodes];
      setDynamicCodes(updated);
      localStorage.setItem("qr_dynamic_codes", JSON.stringify(updated));
      selectDynamicCodeObj(newCode);
      triggerToast("Dynamic link created!");
    }
    setDynLabel("");
    setDynTarget("");
  };

  const selectDynamicCodeObj = (code: DynamicCode) => {
    setSelectedDynamicCode(code);
    setFgColor(code.fgColor);
    setBgColor(code.bgColor);
    setLogoPreset(code.logoPreset);
    setLogoDataUrl(code.logoDataUrl);
    setLogoSize(code.logoSize);
    setBadgeText(code.badgeText);
    setTagline(code.tagline);
    setCardGradient(code.gradientStyle);
    
    // Set active redirect value
    const redirUrl = `${window.location.origin}${window.location.pathname}?r=${code.id}`;
    setValue(redirUrl);
  };

  const deleteDynamicCode = (id: string) => {
    const updated = dynamicCodes.filter(c => c.id !== id);
    setDynamicCodes(updated);
    localStorage.setItem("qr_dynamic_codes", JSON.stringify(updated));
    if (selectedDynamicCode?.id === id) {
      setSelectedDynamicCode(null);
      setValue("");
    }
    // Delete associated scans
    const savedScans = localStorage.getItem("qr_scans");
    if (savedScans) {
      const scans: ScanLog[] = JSON.parse(savedScans);
      const filteredScans = scans.filter(s => s.codeId !== id);
      setScanLogs(filteredScans);
      localStorage.setItem("qr_scans", JSON.stringify(filteredScans));
    }
    triggerToast("Dynamic link deleted.");
  };

  // Run Simulation Scan
  const runSimulation = () => {
    const matched = dynamicCodes.find(c => c.id === simCodeId);
    if (!matched) return;

    const newScan: ScanLog = {
      id: crypto.randomUUID(),
      codeId: simCodeId,
      timestamp: Date.now(),
      device: simDevice,
      os: simOS,
      browser: simBrowser,
      referrer: simReferrer
    };

    const updatedScans = [...scanLogs, newScan];
    setScanLogs(updatedScans);
    localStorage.setItem("qr_scans", JSON.stringify(updatedScans));
    setSimModalOpen(false);
    triggerToast("Simulated Scan Recorded!");
  };

  // CSV Exporter for scans
  const exportScansCsv = (codeId: string) => {
    const codeScans = scanLogs.filter(s => s.codeId === codeId);
    if (codeScans.length === 0) {
      triggerToast("No scans to export!");
      return;
    }

    const headers = ["Scan ID", "Timestamp", "Device", "OS", "Browser", "Referrer"];
    const rows = codeScans.map(s => [
      s.id,
      new Date(s.timestamp).toLocaleString(),
      s.device,
      s.os,
      s.browser,
      s.referrer
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `scans-${codeId}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("CSV Downloaded!");
  };

  // File logo reader
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoPreset("upload");
          setLogoDataUrl(event.target.result as string);
          triggerToast("Logo uploaded successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Call Gemini API for Brand Theme Generation
  const generateAIBranding = async () => {
    if (!aiPrompt.trim()) {
      triggerToast("Please input a brand vibe description first.");
      return;
    }

    const keyToUse = geminiApiKey || process.env.GEMINI_API_KEY || "";
    if (!keyToUse) {
      setShowApiKeyModal(true);
      return;
    }

    setAiState("loading");
    setAiErrorMsg("");

    try {
      const ai = new GoogleGenAI({ apiKey: keyToUse });
      
      const systemInstruction = `
        You are a branding design expert. Based on the user's description of their business/project, generate a matching visual color scheme and call-to-actions.
        You must return a valid, parsable JSON object EXACTLY in this format, with no formatting wrappers, markdown tags (like \`\`\`json), or trailing commas:
        {
          "fgColor": "Hex code for foreground QR blocks. Must have high contrast with bgColor.",
          "bgColor": "Hex code for background QR space.",
          "cardGradient": "CSS linear-gradient syntax, matching the branding (e.g. 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)').",
          "tagline": "Engaging call to action text under the QR code (3-5 words max, ALL CAPS).",
          "badgeText": "1-2 word tag for a visual banner sticker (e.g. 'WIFI', 'JOIN', 'BUY', 'INFO')"
        }

        Contrast Rule: The contrast ratio between fgColor and bgColor MUST be at least 4.5:1 to keep the QR code easily readable by smartphone cameras.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `User Prompt: ${aiPrompt}\n\nRules & Guidelines:\n${systemInstruction}`,
      });

      const rawText = response.text || "";
      // Clean up markdown block headers if returned
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const result: AIThemeResponse = JSON.parse(cleanJson);

      if (result.fgColor && result.bgColor) {
        setFgColor(result.fgColor);
        setBgColor(result.bgColor);
        setCardGradient(result.cardGradient);
        setTagline(result.tagline);
        setBadgeText(result.badgeText);
        setAiState("success");
        triggerToast("AI Branding Theme generated!");
      } else {
        throw new Error("Invalid response format received from AI.");
      }
    } catch (err: any) {
      console.error(err);
      setAiState("error");
      setAiErrorMsg(err.message || "Failed to contact Gemini API. Please check your network and API key.");
      triggerToast("AI generation failed.");
    }
  };

  const applyPresetTheme = (theme: typeof PRESET_THEMES[0]) => {
    setFgColor(theme.fgColor);
    setBgColor(theme.bgColor);
    setCardGradient(theme.cardGradient);
    setTagline(theme.tagline);
    setBadgeText(theme.badgeText);
    triggerToast(`${theme.name} Applied!`);
  };

  // Print execution helper
  const executePrint = () => {
    window.print();
  };

  // Get active logo URL
  const getLogoSrc = () => {
    if (logoPreset === "upload") return logoDataUrl;
    if (logoPreset !== "none") return PRESET_LOGOS[logoPreset];
    return "";
  };

  // Custom SVG Chart calculations
  const renderSVGChart = (codeId: string) => {
    const codeScans = scanLogs.filter(s => s.codeId === codeId);
    
    // Last 7 days dates
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }).reverse();

    const counts = last7Days.map(d => {
      return codeScans.filter(s => new Date(s.timestamp).toISOString().split("T")[0] === d).length;
    });

    const maxCount = Math.max(...counts, 4);
    const width = 450;
    const height = 180;
    const paddingLeft = 30;
    const paddingRight = 15;
    const paddingTop = 20;
    const paddingBottom = 30;

    const points = counts.map((count, i) => {
      const x = paddingLeft + (i * (width - paddingLeft - paddingRight)) / (counts.length - 1);
      const y = height - paddingBottom - (count * (height - paddingTop - paddingBottom)) / maxCount;
      return { x, y, count, date: last7Days[i] };
    });

    const pathD = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");

    const fillD = points.length > 0 
      ? `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z` 
      : "";

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>Scan Volume Timeline</span>
          <span className="font-semibold text-white">{codeScans.length} Total Scans</span>
        </div>
        <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
            <defs>
              <linearGradient id="svgChartGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = paddingTop + ratio * (height - paddingTop - paddingBottom);
              const val = Math.round(maxCount * (1 - ratio));
              return (
                <g key={index} className="opacity-30">
                  <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#333" strokeDasharray="3,3" />
                  <text x={paddingLeft - 8} y={y + 4} fill="#888" fontSize="10" textAnchor="end" className="font-mono">{val}</text>
                </g>
              );
            })}

            {/* Gradient fill */}
            {points.length > 0 && <path d={fillD} fill="url(#svgChartGlow)" />}

            {/* Line path */}
            {points.length > 0 && <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

            {/* Dots */}
            {points.map((p, i) => (
              <g key={i} className="group/dot cursor-pointer">
                <circle cx={p.x} cy={p.y} r="4" fill="#3b82f6" stroke="#0a0a0c" strokeWidth="1.5" className="hover:scale-150 transition-transform" />
                <title>{`${p.date}: ${p.count} scans`}</title>
              </g>
            ))}

            {/* Date labels */}
            {points.map((p, i) => {
              const dt = new Date(p.date);
              const day = dt.toLocaleDateString("en-US", { weekday: "short" });
              const dateNum = dt.getDate();
              return (
                <text key={i} x={p.x} y={height - 10} fill="#666" fontSize="10" textAnchor="middle" className="font-mono">
                  {`${day} ${dateNum}`}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  const getAnalyticsBreakdown = (codeId: string) => {
    const codeScans = scanLogs.filter(s => s.codeId === codeId);
    const total = codeScans.length || 1; // avoid division by 0

    const devices = { Mobile: 0, Tablet: 0, Desktop: 0 };
    const browsers: Record<string, number> = {};
    const OSs: Record<string, number> = {};
    const referrers: Record<string, number> = {};

    codeScans.forEach(s => {
      devices[s.device] = (devices[s.device] || 0) + 1;
      browsers[s.browser] = (browsers[s.browser] || 0) + 1;
      OSs[s.os] = (OSs[s.os] || 0) + 1;
      referrers[s.referrer] = (referrers[s.referrer] || 0) + 1;
    });

    const getSortedBreakdown = (obj: Record<string, number>) => {
      return Object.entries(obj)
        .map(([key, count]) => ({ key, count, pct: Math.round((count / total) * 100) }))
        .sort((a, b) => b.count - a.count);
    };

    return {
      mobilePct: Math.round((devices.Mobile / total) * 100),
      tabletPct: Math.round((devices.Tablet / total) * 100),
      desktopPct: Math.round((devices.Desktop / total) * 100),
      sortedBrowsers: getSortedBreakdown(browsers),
      sortedOSs: getSortedBreakdown(OSs),
      sortedReferrers: getSortedBreakdown(referrers)
    };
  };

  // Full Screen Redirect Render
  if (redirecting) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white font-sans p-6 overflow-hidden relative">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />

        <div className="z-10 text-center max-w-md w-full bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
            <QrCode className="w-8 h-8 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/20 to-transparent animate-scan w-full h-full" />
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight mb-2">QR Studio Redirection</h2>
          <p className="text-neutral-400 text-sm mb-6">
            Redirecting you to <span className="font-semibold text-white">{redirectLabel || "destination"}</span>
          </p>

          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-850 mb-8 max-w-full">
            <span className="text-xs text-neutral-500 font-mono truncate">{redirectTarget}</span>
          </div>

          <div className="w-full flex justify-center items-center gap-1.5 text-neutral-400 text-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            <span>Connecting...</span>
          </div>

          <a 
            href={redirectTarget} 
            className="mt-6 text-xs text-blue-400 hover:text-blue-300 underline font-medium"
            onClick={(e) => {
              e.preventDefault();
              window.location.replace(redirectTarget);
            }}
          >
            Click here if you aren't redirected automatically
          </a>
        </div>
      </div>
    );
  }

  // Render Print Layout Panel instead of regular screen if in Print Preview state
  if (activeMode === "print") {
    return (
      <div className="min-h-screen bg-neutral-900 text-white p-6 font-sans">
        {/* Navigation bar in designer */}
        <div className="max-w-5xl mx-auto flex items-center justify-between mb-8 border-b border-neutral-800 pb-4 print:hidden">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveMode("static")} 
              className="p-2 hover:bg-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Print Studio Layout</h1>
          </div>
          <button 
            onClick={executePrint}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
          >
            <Printer className="w-5 h-5" />
            Print / Save PDF
          </button>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
          {/* Controls Side */}
          <div className="lg:col-span-4 space-y-6 print:hidden">
            <div className="bg-neutral-800/50 border border-neutral-850 p-6 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold">Page Header Configuration</h2>
              <div className="space-y-3">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Sheet Title</label>
                <input 
                  type="text" 
                  value={printTitle} 
                  onChange={(e) => setPrintTitle(e.target.value)} 
                  className="w-full bg-neutral-900 border border-neutral-750 px-3 py-2 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Sheet Subtitle</label>
                <input 
                  type="text" 
                  value={printSub} 
                  onChange={(e) => setPrintSub(e.target.value)} 
                  className="w-full bg-neutral-900 border border-neutral-750 px-3 py-2 rounded-xl focus:ring-1 focus:ring-blue-500" 
                />
              </div>
            </div>

            <div className="bg-neutral-800/50 border border-neutral-850 p-6 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold">Grid Layout Options</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-neutral-400">Total QR Cards</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="12" 
                    value={printRepeats} 
                    onChange={(e) => setPrintRepeats(parseInt(e.target.value) || 1)} 
                    className="w-full bg-neutral-900 border border-neutral-750 px-3 py-2 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-neutral-400">Grid Columns</label>
                  <select 
                    value={printColumns} 
                    onChange={(e) => setPrintColumns(parseInt(e.target.value) || 2)} 
                    className="w-full bg-neutral-900 border border-neutral-750 px-3 py-2 rounded-xl"
                  >
                    <option value="1">1 Column</option>
                    <option value="2">2 Columns</option>
                    <option value="3">3 Columns</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-neutral-750">
                <span className="text-sm text-neutral-350">Scissor Cut Out Guides</span>
                <button 
                  onClick={() => setPrintCutMarks(!printCutMarks)}
                  className={cn("w-10 h-5.5 rounded-full relative transition-colors", printCutMarks ? "bg-blue-600" : "bg-neutral-600")}
                >
                  <div className={cn("absolute w-4 h-4 bg-white rounded-full top-0.75 transition-all", printCutMarks ? "left-5" : "left-1")} />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral-400">Individual Card Frame Subtext</label>
                <input 
                  type="text" 
                  value={printFrameNotes} 
                  onChange={(e) => setPrintFrameNotes(e.target.value)} 
                  className="w-full bg-neutral-900 border border-neutral-750 px-3 py-2 rounded-xl focus:ring-1 focus:ring-blue-500" 
                />
              </div>
            </div>

            <div className="text-xs text-neutral-400 leading-relaxed bg-neutral-850 p-4 rounded-xl border border-neutral-800">
              💡 <strong>Real-World Tip</strong>: For printing, a high-contrast theme works best. Make sure your foreground and background QR colors are distinct before printing on paper.
            </div>
          </div>

          {/* Printable Sheet Area */}
          <div className="lg:col-span-8 bg-white text-neutral-900 rounded-3xl p-8 border border-neutral-700 max-w-full shadow-2xl printable-sheet flex flex-col justify-between">
            <div className="border-b border-neutral-200 pb-4 mb-8 text-center">
              <h2 className="text-3xl font-extrabold tracking-tight uppercase">{printTitle || "QR CODE SHEET"}</h2>
              <p className="text-neutral-500 text-sm mt-1">{printSub || "Scan below for info"}</p>
            </div>

            {/* QR repeating grid */}
            <div 
              className="grid gap-6 flex-grow"
              style={{
                gridTemplateColumns: `repeat(${printColumns}, minmax(0, 1fr))`
              }}
            >
              {Array.from({ length: printRepeats }).map((_, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "flex flex-col items-center justify-between p-6 border rounded-2xl bg-neutral-50 print-card",
                    printCutMarks ? "border-dashed border-neutral-450 relative" : "border-neutral-200"
                  )}
                >
                  {printCutMarks && (
                    <div className="absolute top-2 left-2 text-[10px] text-neutral-400 uppercase font-mono print:hidden select-none">
                      ✂️ Cut Out
                    </div>
                  )}

                  <div className="w-full flex items-center justify-center p-4 bg-white rounded-xl shadow-inner border border-neutral-100 mb-4">
                    {value ? (
                      <QRCodeCanvas
                        value={value}
                        size={160}
                        fgColor={fgColor}
                        bgColor={bgColor}
                        level={errorCorrectionLevel}
                        includeMargin={includeMargin}
                        imageSettings={logoPreset !== "none" ? {
                          src: getLogoSrc(),
                          height: (160 * logoSize) / 100,
                          width: (160 * logoSize) / 100,
                          excavate: excavateLogo,
                        } : undefined}
                      />
                    ) : (
                      <div className="w-40 h-40 bg-neutral-100 flex items-center justify-center rounded-xl border border-neutral-200 text-neutral-400">
                        No Code Input
                      </div>
                    )}
                  </div>

                  <p className="text-center font-bold text-sm tracking-wide text-neutral-800 uppercase">{printFrameNotes}</p>
                  <p className="text-[10px] text-neutral-400 font-mono mt-1 select-all break-all text-center max-w-[200px]">{value}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-250 pt-4 mt-8 flex justify-between items-center text-[10px] text-neutral-400">
              <span>PRODUCED BY QR STUDIO PRO</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Workspace Rendering
  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 font-sans selection:bg-blue-600 selection:text-white relative pb-12">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-neutral-900">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <QrCode className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
              QR Studio <span className="text-blue-500 font-extrabold">Pro</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5">
              <button 
                onClick={() => { setActiveMode("static"); setValue("https://google.com"); }}
                className={cn("px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all", activeMode === "static" ? "bg-neutral-800 text-white shadow" : "text-neutral-400 hover:text-white")}
              >
                Static
              </button>
              <button 
                onClick={() => { setActiveMode("dynamic"); setValue(""); setSelectedDynamicCode(null); }}
                className={cn("px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all", activeMode === "dynamic" ? "bg-neutral-800 text-white shadow" : "text-neutral-400 hover:text-white")}
              >
                Dynamic
              </button>
            </div>

            <button 
              onClick={() => setActiveMode("print")}
              className="p-2 hover:bg-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-colors"
              title="Open Print Designer"
            >
              <Printer className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setShowApiKeyModal(true)}
              className={cn("p-2 rounded-xl transition-all border", geminiApiKey ? "bg-emerald-600/10 border-emerald-500/20 text-emerald-400" : "bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-400 hover:text-white")}
              title="AI Settings"
            >
              <Key className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Workspace container */}
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Form Section */}
            <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-6">
              
              {/* STATIC CREATOR */}
              {activeMode === "static" ? (
                <>
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Settings2 className="w-5 h-5 text-blue-500" />
                      Static QR Parameters
                    </h2>
                    <span className="text-xs text-neutral-500 px-2 py-0.5 bg-neutral-800 rounded border border-neutral-750">No redirect URL</span>
                  </div>

                  {/* Schema Selection tabs */}
                  <div className="grid grid-cols-5 gap-1.5 p-1 bg-neutral-950 rounded-2xl border border-neutral-800">
                    {[
                      { id: "url", icon: LinkIcon, label: "URL" },
                      { id: "wifi", icon: Wifi, label: "WiFi" },
                      { id: "vcard", icon: User, label: "Contact" },
                      { id: "email", icon: Mail, label: "Mail" },
                      { id: "sms", icon: MessageSquare, label: "SMS" },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setStaticType(tab.id as any)}
                          className={cn(
                            "flex flex-col items-center py-2.5 rounded-xl transition-all gap-1.5",
                            staticType === tab.id 
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" 
                              : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[10px] font-bold">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Schema fields */}
                  <div className="space-y-4 pt-2">
                    {staticType === "url" && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Destination URL</label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          placeholder="e.g. https://google.com"
                          className="w-full bg-neutral-950 border border-neutral-850 px-4 py-3 rounded-2xl focus:ring-1 focus:ring-blue-500 outline-none font-medium"
                        />
                      </div>
                    )}

                    {staticType === "wifi" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">WiFi Network Name (SSID)</label>
                          <input
                            type="text"
                            placeholder="Home_Wifi"
                            value={wifiSSID}
                            onChange={(e) => setWifiSSID(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-850 px-4 py-3 rounded-2xl focus:ring-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Password</label>
                            <input
                              type="password"
                              placeholder="••••••••"
                              value={wifiPass}
                              onChange={(e) => setWifiPass(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-850 px-4 py-3 rounded-2xl focus:ring-1"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Security Type</label>
                            <select
                              value={wifiSec}
                              onChange={(e) => setWifiSec(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-850 px-4 py-3 rounded-2xl focus:ring-1"
                            >
                              <option value="WPA">WPA/WPA2</option>
                              <option value="WEP">WEP</option>
                              <option value="nopass">None (Open)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {staticType === "vcard" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs text-neutral-400">First Name</label>
                            <input type="text" placeholder="John" value={vCardFirst} onChange={(e) => setVCardFirst(e.target.value)} className="w-full bg-neutral-950 border border-neutral-850 px-4 py-2.5 rounded-xl text-sm" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs text-neutral-400">Last Name</label>
                            <input type="text" placeholder="Doe" value={vCardLast} onChange={(e) => setVCardLast(e.target.value)} className="w-full bg-neutral-950 border border-neutral-850 px-4 py-2.5 rounded-xl text-sm" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs text-neutral-400">Phone</label>
                            <input type="tel" placeholder="+123456789" value={vCardPhone} onChange={(e) => setVCardPhone(e.target.value)} className="w-full bg-neutral-950 border border-neutral-850 px-4 py-2.5 rounded-xl text-sm" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs text-neutral-400">Email</label>
                            <input type="email" placeholder="john@example.com" value={vCardEmail} onChange={(e) => setVCardEmail(e.target.value)} className="w-full bg-neutral-950 border border-neutral-850 px-4 py-2.5 rounded-xl text-sm" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs text-neutral-400">Company</label>
                            <input type="text" placeholder="ACME Corp" value={vCardOrg} onChange={(e) => setVCardOrg(e.target.value)} className="w-full bg-neutral-950 border border-neutral-850 px-4 py-2.5 rounded-xl text-sm" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs text-neutral-400">Job Title</label>
                            <input type="text" placeholder="Engineer" value={vCardTitle} onChange={(e) => setVCardTitle(e.target.value)} className="w-full bg-neutral-950 border border-neutral-850 px-4 py-2.5 rounded-xl text-sm" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-neutral-400">Website</label>
                          <input type="text" placeholder="https://johndoe.com" value={vCardUrl} onChange={(e) => setVCardUrl(e.target.value)} className="w-full bg-neutral-950 border border-neutral-850 px-4 py-2.5 rounded-xl text-sm" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-neutral-400">Postal Address</label>
                          <input type="text" placeholder="123 Main St, New York, NY" value={vCardAddress} onChange={(e) => setVCardAddress(e.target.value)} className="w-full bg-neutral-950 border border-neutral-850 px-4 py-2.5 rounded-xl text-sm" />
                        </div>
                      </div>
                    )}

                    {staticType === "email" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs text-neutral-400">Recipient Email</label>
                          <input type="email" placeholder="feedback@brand.com" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className="w-full bg-neutral-950 border border-neutral-850 px-4 py-3 rounded-2xl" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-neutral-400">Subject</label>
                          <input type="text" placeholder="Product Review" value={emailSub} onChange={(e) => setEmailSub(e.target.value)} className="w-full bg-neutral-950 border border-neutral-850 px-4 py-3 rounded-2xl" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-neutral-400">Body Content</label>
                          <textarea placeholder="Write message..." value={emailBody} onChange={(e) => setEmailBody(e.target.value)} className="w-full h-24 bg-neutral-950 border border-neutral-850 px-4 py-3 rounded-2xl resize-none" />
                        </div>
                      </div>
                    )}

                    {staticType === "sms" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs text-neutral-400">Phone Number</label>
                          <input type="tel" placeholder="+10000000" value={smsPhone} onChange={(e) => setSmsPhone(e.target.value)} className="w-full bg-neutral-950 border border-neutral-850 px-4 py-3 rounded-2xl" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-neutral-400">Default Text Message</label>
                          <textarea placeholder="e.g. Please subscribe me!" value={smsMsg} onChange={(e) => setSmsMsg(e.target.value)} className="w-full h-24 bg-neutral-950 border border-neutral-850 px-4 py-3 rounded-2xl resize-none" />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* DYNAMIC CREATOR */
                <>
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-indigo-400" />
                      Dynamic Link Manager
                    </h2>
                    <span className="text-xs text-indigo-400 px-2 py-0.5 bg-indigo-500/10 rounded border border-indigo-500/20">Modifiable Targets</span>
                  </div>

                  <div className="space-y-4 bg-neutral-950/60 p-5 rounded-2xl border border-neutral-850">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
                      {isEditingDyn ? "Edit Selected Link" : "Create New Dynamic Link"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-400">Friendly Name / Label</label>
                        <input
                          type="text"
                          placeholder="e.g. Summer Specials Menu"
                          value={dynLabel}
                          onChange={(e) => setDynLabel(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-750 px-3 py-2 rounded-xl text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-400">Destination URL</label>
                        <input
                          type="text"
                          placeholder="e.g. https://mycafe.com/menu.pdf"
                          value={dynTarget}
                          onChange={(e) => setDynTarget(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-750 px-3 py-2 rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      {isEditingDyn && (
                        <button
                          onClick={() => {
                            setIsEditingDyn(false);
                            setDynLabel("");
                            setDynTarget("");
                          }}
                          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-sm font-semibold rounded-xl"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={saveDynamicCode}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        {isEditingDyn ? "Save Changes" : "Create Link"}
                      </button>
                    </div>
                  </div>

                  {/* List of Dynamic codes */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wide">Active Dynamic Links</h3>
                    
                    {dynamicCodes.length === 0 ? (
                      <div className="text-center py-8 bg-neutral-950/20 border border-dashed border-neutral-800 rounded-2xl text-neutral-500 text-sm">
                        No dynamic links created yet. Set up one above!
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3.5">
                        {dynamicCodes.map((code) => {
                          const codeScans = scanLogs.filter(s => s.codeId === code.id);
                          const isSelected = selectedDynamicCode?.id === code.id;
                          return (
                            <div 
                              key={code.id}
                              className={cn(
                                "p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer",
                                isSelected ? "bg-indigo-950/20 border-indigo-500/50" : "bg-neutral-900/50 border-neutral-800/80 hover:border-neutral-700"
                              )}
                              onClick={() => selectDynamicCodeObj(code)}
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className="p-2 bg-neutral-950 rounded-lg border border-neutral-800 flex-shrink-0">
                                  <QRCodeCanvas 
                                    value={`${window.location.origin}${window.location.pathname}?r=${code.id}`} 
                                    size={36} 
                                    fgColor={code.fgColor} 
                                    bgColor={code.bgColor} 
                                  />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-sm font-bold truncate text-white">{code.label}</h4>
                                  <p className="text-xs text-neutral-400 truncate flex items-center gap-1.5 mt-0.5">
                                    <ArrowRight className="w-3 h-3 text-neutral-600 flex-shrink-0" />
                                    <span className="truncate">{code.targetUrl}</span>
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between md:justify-end gap-3.5 border-t md:border-t-0 border-neutral-800/50 pt-2.5 md:pt-0">
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-950 rounded-full border border-neutral-800">
                                  <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                                  <span className="text-xs font-bold text-white font-mono">{codeScans.length}</span>
                                  <span className="text-[10px] text-neutral-500">scans</span>
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSimCodeId(code.id);
                                      setSimModalOpen(true);
                                    }}
                                    className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-indigo-400 rounded-xl transition-colors"
                                    title="Simulate Scan"
                                  >
                                    <Play className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAnalyticsCodeId(analyticsCodeId === code.id ? null : code.id);
                                    }}
                                    className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-blue-400 rounded-xl transition-colors"
                                    title="View Analytics"
                                  >
                                    <BarChart3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedDynamicCode(code);
                                      setDynLabel(code.label);
                                      setDynTarget(code.targetUrl);
                                      setIsEditingDyn(true);
                                    }}
                                    className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-xl transition-colors"
                                    title="Edit Link"
                                  >
                                    <Settings2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteDynamicCode(code.id);
                                    }}
                                    className="p-2 hover:bg-neutral-800 text-neutral-500 hover:text-red-400 rounded-xl transition-colors"
                                    title="Delete Link"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </section>

            {/* AI Theme & Customization Options */}
            <section className="bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 pb-3 border-b border-neutral-800">
                <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                AI Branding & QR Customizer
              </h2>

              {/* AI generator */}
              <div className="space-y-4 bg-blue-950/10 border border-blue-950/20 p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      Describe Your Theme (Gemini AI)
                    </label>
                    <span className="text-[10px] text-blue-400 font-semibold px-2 py-0.5 bg-blue-500/10 rounded">Pro Agent</span>
                  </div>
                  
                  <textarea
                    placeholder="e.g. Cozy boutique coffee shop with rustic green wood accents and elegant fonts..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 px-4 py-3 rounded-2xl text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none h-20"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-neutral-500">Generates custom color matching, badge, & marketing slogan</span>
                  <button
                    onClick={generateAIBranding}
                    disabled={aiState === "loading"}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-800 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/15 active:scale-[0.98] transition-all"
                  >
                    {aiState === "loading" ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Generate Style
                      </>
                    )}
                  </button>
                </div>

                {/* Error Panel */}
                {aiState === "error" && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center justify-between">
                    <span>{aiErrorMsg}</span>
                    <button onClick={() => setAiState("idle")} className="p-1 hover:bg-red-500/20 rounded-md">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Preset Themes selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Or Apply Preset Theme</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_THEMES.map((theme, i) => (
                    <button
                      key={i}
                      onClick={() => applyPresetTheme(theme)}
                      className="p-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 rounded-xl text-left transition-all group hover:scale-[1.02]"
                    >
                      <div className="text-xs font-bold text-white group-hover:text-blue-400 truncate">{theme.name}</div>
                      <div className="flex gap-1.5 mt-2">
                        <div className="w-4 h-4 rounded-full border border-neutral-800" style={{ backgroundColor: theme.fgColor }} />
                        <div className="w-4 h-4 rounded-full border border-neutral-800" style={{ backgroundColor: theme.bgColor }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors, Logo, and Correction Level controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-neutral-800/50">
                
                {/* Visual Adjustments */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Visual Palettes</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-neutral-450 font-semibold">Foreground</label>
                      <div className="flex items-center gap-2 p-2 bg-neutral-950 rounded-xl border border-neutral-850">
                        <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" />
                        <span className="font-mono text-xs uppercase">{fgColor}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-neutral-450 font-semibold">Background</label>
                      <div className="flex items-center gap-2 p-2 bg-neutral-950 rounded-xl border border-neutral-850">
                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" />
                        <span className="font-mono text-xs uppercase">{bgColor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-neutral-450 font-semibold">QR Size ({size}px)</label>
                    <input 
                      type="range" min="128" max="512" step="16" value={size} 
                      onChange={(e) => setSize(parseInt(e.target.value))} 
                      className="w-full h-1.5 bg-neutral-850 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-xl border border-neutral-850">
                      <span className="text-xs text-neutral-400">Margin</span>
                      <button 
                        onClick={() => setIncludeMargin(!includeMargin)}
                        className={cn("w-9 h-5 rounded-full relative transition-colors", includeMargin ? "bg-blue-600" : "bg-neutral-700")}
                      >
                        <div className={cn("absolute w-3.5 h-3.5 bg-white rounded-full top-0.75 transition-all", includeMargin ? "left-4.75" : "left-0.75")} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-xl border border-neutral-850">
                      <span className="text-xs text-neutral-400">Excavate Logo</span>
                      <button 
                        onClick={() => setExcavateLogo(!excavateLogo)}
                        className={cn("w-9 h-5 rounded-full relative transition-colors", excavateLogo ? "bg-blue-600" : "bg-neutral-700")}
                      >
                        <div className={cn("absolute w-3.5 h-3.5 bg-white rounded-full top-0.75 transition-all", excavateLogo ? "left-4.75" : "left-0.75")} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Brand Logo Customization */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Logo Overlay</h3>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] text-neutral-450 font-semibold">Select Icon / Symbol</label>
                    <div className="flex flex-wrap gap-1.5 p-1.5 bg-neutral-950 rounded-xl border border-neutral-850">
                      {["none", "wifi", "link", "mail", "user", "google", "github"].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setLogoPreset(preset)}
                          className={cn(
                            "px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wide",
                            logoPreset === preset ? "bg-neutral-800 text-white" : "text-neutral-500 hover:text-neutral-300"
                          )}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex items-center justify-center gap-2 border border-dashed border-neutral-800 hover:border-neutral-700 rounded-xl p-3 cursor-pointer bg-neutral-950 text-neutral-400 hover:text-white transition-all">
                      <Upload className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-semibold">Upload Brand Logo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                    
                    {logoPreset === "upload" && (
                      <div className="w-10 h-10 border border-neutral-800 rounded-lg overflow-hidden bg-white flex items-center justify-center p-0.5 relative group">
                        <img src={logoDataUrl} alt="uploaded logo" className="max-w-full max-h-full object-contain" />
                        <button 
                          onClick={() => { setLogoPreset("none"); setLogoDataUrl(""); }} 
                          className="absolute inset-0 bg-red-600/80 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] text-neutral-450 font-semibold">
                      <span>Logo Size ({logoSize}%)</span>
                      <span className="text-yellow-500/80">⚠️ Max 25% recommended</span>
                    </div>
                    <input 
                      type="range" min="10" max="30" step="1" value={logoSize} 
                      onChange={(e) => setLogoSize(parseInt(e.target.value))} 
                      className="w-full h-1.5 bg-neutral-850 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                    />
                  </div>
                </div>

              </div>

              {/* Card Label and Badge Customizations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-800/50">
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400">Card Header Sticker / Badge</label>
                  <input
                    type="text" value={badgeText} onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="e.g. JOIN NOW"
                    className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400">Card Footer Slogan / Tagline</label>
                  <input
                    type="text" value={tagline} onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Scan to follow our Twitter"
                    className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded-xl text-sm"
                  />
                </div>
              </div>
            </section>

            {/* Static History Section */}
            {activeMode === "static" && (
              <section className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-neutral-500" />
                    <h2 className="text-base font-bold">Static Downloads History</h2>
                  </div>
                  {history.length > 0 && (
                    <button 
                      onClick={() => { setHistory([]); localStorage.removeItem("qr_history"); triggerToast("History cleared."); }}
                      className="text-xs text-neutral-500 hover:text-red-400 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear History
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="bg-neutral-900/10 border border-dashed border-neutral-850 rounded-2xl p-6 text-center text-neutral-500 text-sm">
                    No history. Choose a static format above and download to record items here!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => { setValue(item.value); setFgColor(item.fgColor); setBgColor(item.bgColor); setStaticType(item.type as any); }}
                        className="group bg-neutral-900/40 p-3 rounded-xl border border-neutral-850 hover:border-neutral-700 transition-all flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-1 bg-white rounded border border-neutral-100 flex-shrink-0">
                            <QRCodeCanvas value={item.value} size={36} fgColor={item.fgColor} bgColor={item.bgColor} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{item.label}</p>
                            <p className="text-[10px] text-neutral-500">{new Date(item.timestamp).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = history.filter(h => h.id !== item.id);
                            setHistory(updated);
                            localStorage.setItem("qr_history", JSON.stringify(updated));
                          }}
                          className="p-1.5 hover:bg-neutral-800 text-neutral-500 hover:text-red-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

          </div>

          {/* Interactive Preview Container (Right-hand sticky column) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md flex flex-col items-center shadow-2xl relative">
              
              <div className="w-full flex items-center justify-between mb-6">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Live Preview</span>
                </div>
                {activeMode === "dynamic" && selectedDynamicCode && (
                  <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/15 flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    DYNAMIC LINK ACTIVE
                  </span>
                )}
              </div>

              {/* GORGEOUS PREMIUM WRAPPED BRAND CARD */}
              <div 
                className="w-full rounded-2xl p-6 flex flex-col items-center relative overflow-hidden transition-all duration-500 shadow-xl border border-neutral-250/10"
                style={{ background: cardGradient }}
              >
                {/* AI Glow panel helper */}
                {aiState === "loading" && (
                  <div className="absolute inset-0 bg-[#09090b]/80 flex flex-col items-center justify-center z-15 backdrop-blur-sm">
                    <div className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-full animate-pulse-glow mb-2">
                      <Sparkles className="w-8 h-8 text-blue-400 animate-spin" />
                    </div>
                    <span className="text-xs font-bold text-white tracking-widest animate-pulse">AI BRANDING SCAN...</span>
                  </div>
                )}

                {/* Badge Header tag */}
                {badgeText && (
                  <div className="mb-5 px-3 py-1 bg-white/95 backdrop-blur shadow text-[10px] font-black text-neutral-900 rounded-full tracking-widest uppercase border border-neutral-100 select-none">
                    {badgeText}
                  </div>
                )}

                {/* QR Canvas frame */}
                <div 
                  ref={qrRef}
                  className="p-5 bg-white rounded-2xl shadow-2xl border border-neutral-100 select-none flex items-center justify-center relative overflow-hidden"
                >
                  {value ? (
                    <QRCodeCanvas
                      value={value}
                      size={size > 300 ? 256 : size} // Cap preview size for layout integrity
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level={errorCorrectionLevel}
                      includeMargin={includeMargin}
                      imageSettings={logoPreset !== "none" ? {
                        src: getLogoSrc(),
                        height: (256 * logoSize) / 100,
                        width: (256 * logoSize) / 100,
                        excavate: excavateLogo,
                      } : undefined}
                    />
                  ) : (
                    <div className="w-64 h-64 bg-neutral-950 flex flex-col items-center justify-center rounded-xl border border-neutral-800 text-neutral-500">
                      <QrCode className="w-12 h-12 text-neutral-800 animate-pulse mb-2" />
                      <span className="text-xs text-neutral-600 font-bold uppercase tracking-wider">No Content Entered</span>
                    </div>
                  )}
                </div>

                {/* Tagline footer text */}
                {tagline && (
                  <p className="mt-5 font-black text-xs text-center tracking-wider leading-relaxed select-none text-neutral-900 drop-shadow-sm uppercase">
                    {tagline}
                  </p>
                )}
              </div>

              {/* Action grid */}
              <div className="w-full mt-6 space-y-3">
                <button
                  disabled={!value}
                  onClick={downloadQRCode}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/15 transition-all hover:scale-[1.01] active:scale-[0.99] border border-blue-500/30"
                >
                  <Download className="w-5 h-5" />
                  Download High-Res PNG
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled={!value}
                    onClick={copyToClipboard}
                    className="py-3 bg-neutral-950 border border-neutral-850 hover:border-neutral-750 hover:bg-neutral-900 disabled:text-neutral-600 text-neutral-350 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4.5 h-4.5" />}
                    {copied ? "Copied" : "Copy Value"}
                  </button>

                  <button
                    onClick={() => setActiveMode("print")}
                    className="py-3 bg-neutral-950 border border-neutral-850 hover:border-neutral-750 hover:bg-neutral-900 text-neutral-350 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Printer className="w-4.5 h-4.5" />
                    Print Layout
                  </button>
                </div>
              </div>

              {/* Mini Details block */}
              <div className="w-full mt-5 bg-neutral-950 p-4 rounded-xl border border-neutral-850/80 text-[11px] text-neutral-500 leading-relaxed font-mono flex items-start gap-2 select-all break-all">
                <Globe className="w-4 h-4 text-neutral-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-400 font-bold block mb-1">CURRENT EXPORTS VALUE:</span>
                  {value || "(empty)"}
                </div>
              </div>

            </div>

            {/* Live Analytics Dashboard sub-pane */}
            {activeMode === "dynamic" && (
              <AnimatePresence>
                {analyticsCodeId && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-6 backdrop-blur-md space-y-6 shadow-2xl"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-sm font-bold">Link Insights & Analytics</h3>
                      </div>
                      <button 
                        onClick={() => setAnalyticsCodeId(null)}
                        className="p-1 text-neutral-500 hover:text-white rounded-md hover:bg-neutral-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Check if scans exist */}
                    {scanLogs.filter(s => s.codeId === analyticsCodeId).length === 0 ? (
                      <div className="text-center py-10 bg-neutral-950/30 rounded-2xl border border-dashed border-neutral-850 text-neutral-500 text-sm space-y-2">
                        <Smartphone className="w-8 h-8 text-neutral-700 mx-auto animate-bounce" />
                        <p>No scans recorded for this link yet.</p>
                        <p className="text-xs text-neutral-600">Click the "Play" icon to run a scan simulation!</p>
                      </div>
                    ) : (
                      <>
                        {/* Timeline */}
                        {renderSVGChart(analyticsCodeId)}

                        {/* Device bar & Breakdown metrics */}
                        {(() => {
                          const stats = getAnalyticsBreakdown(analyticsCodeId);
                          return (
                            <div className="space-y-4 pt-2">
                              {/* Device progress */}
                              <div className="space-y-2">
                                <span className="text-xs text-neutral-400 block">Scans By Device Platform</span>
                                <div className="h-4.5 w-full bg-neutral-950 rounded-xl overflow-hidden flex border border-neutral-800/50">
                                  {stats.mobilePct > 0 && <div className="bg-blue-500 h-full" style={{ width: `${stats.mobilePct}%` }} title={`Mobile: ${stats.mobilePct}%`} />}
                                  {stats.tabletPct > 0 && <div className="bg-emerald-500 h-full" style={{ width: `${stats.tabletPct}%` }} title={`Tablet: ${stats.tabletPct}%`} />}
                                  {stats.desktopPct > 0 && <div className="bg-purple-500 h-full" style={{ width: `${stats.desktopPct}%` }} title={`Desktop: ${stats.desktopPct}%`} />}
                                </div>
                                <div className="flex gap-4 text-[10px] text-neutral-400 font-mono">
                                  <div className="flex items-center gap-1">
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm" />
                                    <span>Mobile {stats.mobilePct}%</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
                                    <span>Tablet {stats.tabletPct}%</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-sm" />
                                    <span>Desktop {stats.desktopPct}%</span>
                                  </div>
                                </div>
                              </div>

                              {/* Referrer & OS list grid */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 bg-neutral-950/60 p-3 rounded-xl border border-neutral-850">
                                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Top Referrers</span>
                                  <div className="space-y-1.5">
                                    {stats.sortedReferrers.slice(0, 3).map((ref, idx) => (
                                      <div key={idx} className="flex justify-between text-xs font-mono">
                                        <span className="text-neutral-400 truncate max-w-[80px]">{ref.key}</span>
                                        <span className="text-white font-bold">{ref.pct}%</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2 bg-neutral-950/60 p-3 rounded-xl border border-neutral-850">
                                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Top Browsers</span>
                                  <div className="space-y-1.5">
                                    {stats.sortedBrowsers.slice(0, 3).map((bro, idx) => (
                                      <div key={idx} className="flex justify-between text-xs font-mono">
                                        <span className="text-neutral-400 truncate max-w-[80px]">{bro.key}</span>
                                        <span className="text-white font-bold">{bro.pct}%</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* CSV Exporter */}
                              <button
                                onClick={() => exportScansCsv(analyticsCodeId)}
                                className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-750 text-xs font-semibold rounded-xl text-indigo-400 flex items-center justify-center gap-1.5 transition-colors"
                              >
                                <Database className="w-3.5 h-3.5" />
                                Export Raw Scans Log (CSV)
                              </button>
                            </div>
                          );
                        })()}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}

          </div>

        </div>
      </main>

      {/* Floating toast alerts */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-100 bg-[#09090b] border border-blue-500/20 shadow-2xl shadow-blue-500/10 px-5 py-3 rounded-xl flex items-center gap-3"
          >
            <Check className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-white tracking-wide">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan Simulator Modal */}
      <AnimatePresence>
        {simModalOpen && (
          <div className="fixed inset-0 z-100 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-md w-full space-y-6"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="font-bold flex items-center gap-2">
                  <Play className="w-5 h-5 text-indigo-400" />
                  Live QR Scan Simulator
                </h3>
                <button onClick={() => setSimModalOpen(false)} className="p-1 text-neutral-500 hover:text-white rounded-md">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed">
                This triggers a simulated scan. In the real world, someone pointing their phone at this QR code records the platform browser, OS type, and redirection referrer instantly.
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-neutral-400">Device Category</label>
                    <select 
                      value={simDevice} 
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setSimDevice(val);
                        if (val === "Mobile") { setSimOS("iOS"); setSimBrowser("Safari"); }
                        else if (val === "Tablet") { setSimOS("iOS"); setSimBrowser("Safari"); }
                        else { setSimOS("Windows"); setSimBrowser("Chrome"); }
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded-xl text-sm text-white"
                    >
                      <option value="Mobile">Mobile Phone</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Desktop">Desktop PC</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-neutral-400">Operating System</label>
                    <select 
                      value={simOS} 
                      onChange={(e) => setSimOS(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded-xl text-sm text-white"
                    >
                      {simDevice === "Mobile" || simDevice === "Tablet" ? (
                        <>
                          <option value="iOS">iOS (Apple)</option>
                          <option value="Android">Android</option>
                        </>
                      ) : (
                        <>
                          <option value="Windows">Windows</option>
                          <option value="macOS">macOS (Apple)</option>
                          <option value="Linux">Linux</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-neutral-400">Visitor Browser</label>
                    <select 
                      value={simBrowser} 
                      onChange={(e) => setSimBrowser(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded-xl text-sm text-white"
                    >
                      <option value="Safari">Safari</option>
                      <option value="Chrome">Google Chrome</option>
                      <option value="Firefox">Mozilla Firefox</option>
                      <option value="Edge">Microsoft Edge</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-neutral-400">Source Referrer</label>
                    <select 
                      value={simReferrer} 
                      onChange={(e) => setSimReferrer(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded-xl text-sm text-white"
                    >
                      <option value="Direct (Scan)">Direct Camera Scan</option>
                      <option value="Google">Google Search</option>
                      <option value="Facebook">Facebook App</option>
                      <option value="Twitter/X">Twitter/X Post</option>
                      <option value="Email">Newsletter Email</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                onClick={runSimulation}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Check className="w-5 h-5" />
                Record Simulation Scan
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* API Key Modal */}
      <AnimatePresence>
        {showApiKeyModal && (
          <div className="fixed inset-0 z-100 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-md w-full space-y-6 text-white"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="font-bold flex items-center gap-2">
                  <Key className="w-5 h-5 text-yellow-400" />
                  Gemini API Configuration
                </h3>
                <button onClick={() => setShowApiKeyModal(false)} className="p-1 text-neutral-500 hover:text-white rounded-md">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-neutral-400 leading-relaxed">
                  To use the AI Branding Agent, please enter your <strong>Google AI Studio API Key</strong>. It is saved only in your local browser storage and never sent anywhere else.
                </p>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 font-bold underline flex items-center gap-1 select-none">
                  Get a Free API Key from AI Studio
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Gemini API Key</label>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => {
                    setGeminiApiKey(e.target.value);
                    localStorage.setItem("user_gemini_api_key", e.target.value);
                  }}
                  placeholder="AIzaSy..."
                  className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 rounded-2xl text-sm focus:ring-1 focus:ring-blue-500 font-mono outline-none"
                />
              </div>

              <button 
                onClick={() => {
                  setShowApiKeyModal(false);
                  triggerToast("API Key Configured.");
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 font-bold rounded-2xl transition-colors"
              >
                Close and Save Key
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Footer */}
      <footer className="mt-20 border-t border-neutral-900 py-12 print:hidden relative z-10">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-white">QR Studio Pro</span>
          </div>
          <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
            Professional QR Code production ecosystem. Fully local dynamic redirects, visual brand customizer, and integrated AI.
          </p>
          <div className="text-[10px] text-neutral-600 font-mono">
            © 2026 QR Studio Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
