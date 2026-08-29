// ============================================================
// Web Browser — Tabbed browser with bookmarks, downloads, and enhanced mocks
// ============================================================

import { useState, useRef, useEffect, useCallback, memo } from 'react';
import {
  ArrowLeft, ArrowRight, RefreshCw, Home, Star, Plus, X, Lock, Search,
  Globe, Youtube, Github, Twitter, Linkedin, ShoppingBag, Newspaper, Code,
  Download, ExternalLink, AlertCircle, Loader
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ---- Types ----
interface Tab {
  id: string;
  url: string;
  title: string;
  history: string[];
  historyIndex: number;
  loading: boolean;
}

interface Bookmark {
  url: string;
  title: string;
}

interface Download {
  id: string;
  url: string;
  filename: string;
  size: number;
  progress: number;
  completed: boolean;
}

// ---- Quick Links ----
const QUICK_LINKS: { icon: LucideIcon; name: string; url: string; color: string }[] = [
  { icon: Search, name: 'Google', url: 'https://google.com', color: '#4285F4' },
  { icon: Youtube, name: 'YouTube', url: 'https://youtube.com', color: '#FF0000' },
  { icon: Github, name: 'GitHub', url: 'https://github.com', color: '#333' },
  { icon: Twitter, name: 'Twitter', url: 'https://twitter.com', color: '#1DA1F2' },
  { icon: Linkedin, name: 'LinkedIn', url: 'https://linkedin.com', color: '#0A66C2' },
  { icon: ShoppingBag, name: 'Amazon', url: 'https://amazon.com', color: '#FF9900' },
  { icon: Code, name: 'Stack Overflow', url: 'https://stackoverflow.com', color: '#F48024' },
  { icon: Newspaper, name: 'Reddit', url: 'https://reddit.com', color: '#FF4500' },
];

// ---- News articles for homepage ----
const NEWS_ARTICLES = [
  { title: 'Ubuntu 24.04 LTS Released with New Features', source: 'ubuntu.com', time: '2h ago' },
  { title: 'React 19 Introduces New Compiler for Performance', source: 'react.dev', time: '4h ago' },
  { title: 'TypeScript 5.5 Brings Improved Type Inference', source: 'dev.to', time: '6h ago' },
  { title: 'WebAssembly Now Supported in All Major Browsers', source: 'webassembly.org', time: '8h ago' },
];

// ---- Simulated pages with enhanced mock content ----
const IFRAME_FRIENDLY_SITES = ['example.com', 'wikipedia.org', 'ubuntu.com'];

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const buildSitePage = (url: string, onDownload: (url: string, filename: string) => void): string => {
  const host = url.replace(/^https?:\/\//, '').split('/')[0];
  const safeHost = escapeHtml(host);

  if (host.includes('youtube.com')) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: Inter, Arial, sans-serif;
            background: linear-gradient(180deg, #0f0f11, #16161b);
            color: #f5f5f5;
            min-height: 100vh;
          }
          .shell {
            max-width: 1180px;
            margin: 0 auto;
            padding: 28px 18px 48px;
          }
          .topbar {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 22px;
          }
          .logo {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            display: grid;
            place-items: center;
            background: linear-gradient(135deg, #ff3b30, #ff5f6d);
            font-weight: bold;
            color: white;
          }
          .search {
            flex: 1;
            background: #222227;
            border: 1px solid #33333a;
            padding: 14px 16px;
            border-radius: 999px;
            color: #fafafa;
            font-size: 14px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 18px;
          }
          .card {
            background: #1c1c22;
            border: 1px solid #2f2f38;
            border-radius: 18px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.2s;
          }
          .card:hover { transform: translateY(-4px); }
          .thumb {
            height: 140px;
            background: linear-gradient(135deg, #ff3b30, #f9a825, #8e24aa);
          }
          .content {
            padding: 14px;
          }
          .badge {
            display: inline-block;
            margin-bottom: 10px;
            background: rgba(255, 59, 48, 0.18);
            color: #ff7b73;
            padding: 4px 8px;
            border-radius: 999px;
            font-size: 11px;
            text-transform: uppercase;
          }
          .title { font-size: 15px; font-weight: 700; margin-bottom: 8px; }
          .meta { color: #9ca3af; font-size: 12px; }
          .action {
            margin-top: 18px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 14px;
            border-radius: 10px;
            background: #ff3b30;
            color: white;
            text-decoration: none;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="shell">
          <div class="topbar">
            <div class="logo">▶</div>
            <input class="search" value="${safeHost}" aria-label="Search" readonly />
          </div>
          <div class="grid">
            <article class="card">
              <div class="thumb"></div>
              <div class="content">
                <span class="badge">Now trending</span>
                <div class="title">Web Linux Desktop: powerful browser simulation</div>
                <div class="meta">2.3M views • 3 days ago</div>
              </div>
            </article>
            <article class="card">
              <div class="thumb" style="background: linear-gradient(135deg, #3a86ff, #8338ec, #ff006e);"></div>
              <div class="content">
                <span class="badge">Recommended</span>
                <div class="title">Build polished desktop apps in the browser</div>
                <div class="meta">842K views • 1 week ago</div>
              </div>
            </article>
            <article class="card">
              <div class="thumb" style="background: linear-gradient(135deg, #06d6a0, #0d9488, #2563eb);"></div>
              <div class="content">
                <span class="badge">Latest</span>
                <div class="title">The next generation of web-based Linux desktops</div>
                <div class="meta">512K views • 2 weeks ago</div>
              </div>
            </article>
          </div>
          <a class="action" href="${escapeHtml(url)}" target="_blank">Open the real site externally</a>
        </div>
      </body>
      </html>
    `;
  }

  if (host.includes('github.com')) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin:0; background:#0d1117; color:#f0f6fc; font-family:Arial,sans-serif; }
          .wrap { max-width:900px; margin: 40px auto; padding: 20px; }
          .card { background:#161b22; border:1px solid #30363d; border-radius:14px; padding:20px; }
          .repo { color:#58a6ff; font-size:18px; font-weight:700; margin-bottom: 10px; }
          .desc { color:#8b949e; line-height:1.6; }
          .chips { display:flex; gap:8px; margin-top:16px; flex-wrap:wrap; }
          .chip { padding:6px 10px; background:#21262d; border-radius:999px; font-size:12px; }
          .btn { display:inline-block; margin-top:20px; padding:10px 16px; background:#238636; color:white; text-decoration:none; border-radius:6px; font-weight:600; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="card">
            <div class="repo">${safeHost}</div>
            <div class="desc">This is a polished GitHub-style mockup rendered inside the Web Linux browser. It mirrors the feel of the site while keeping the desktop sandbox safe.</div>
            <div class="chips">
              <span class="chip">repo</span>
              <span class="chip">ui</span>
              <span class="chip">desktop</span>
              <span class="chip">browser</span>
            </div>
            <a class="btn" href="${escapeHtml(url)}" target="_blank">Clone on GitHub</a>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  if (host.includes('stackoverflow.com')) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin:0; background:#f6f6f6; color:#3b4045; font-family:Arial,sans-serif; }
          .wrap { max-width:1100px; margin: 40px auto; padding: 20px; }
          .card { background:white; border:1px solid #e3e6e8; border-radius:8px; padding:24px; margin-bottom:16px; }
          .title { color:#0074cc; font-size:20px; font-weight:400; margin-bottom:12px; }
          .meta { color:#6a737c; font-size:13px; margin-bottom:16px; }
          .tags { display:flex; gap:6px; flex-wrap:wrap; }
          .tag { padding:4px 8px; background:#e1ecf4; color:#39739d; border-radius:4px; font-size:12px; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="card">
            <div class="title">How to build a web-based Linux desktop environment?</div>
            <div class="meta">Asked 2 hours ago • Viewed 1.2k times</div>
            <p>I'm trying to create a browser-based Ubuntu-like desktop. What are the best practices for managing windows, tabs, and state?</p>
            <div class="tags">
              <span class="tag">javascript</span>
              <span class="tag">react</span>
              <span class="tag">ubuntu</span>
              <span class="tag">desktop</span>
            </div>
          </div>
          <div class="card">
            <div class="title">Why do iframes fail to load external sites?</div>
            <div class="meta">Asked yesterday • Viewed 3.4k times</div>
            <p>When I try to embed Google or YouTube in an iframe, the page shows a blank screen or an error. What's happening?</p>
            <div class="tags">
              <span class="tag">iframe</span>
              <span class="tag">security</span>
              <span class="tag">x-frame-options</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #f5f5f5;
          padding: 40px;
          color: #333;
        }
        .header {
          background: linear-gradient(135deg, #7C4DFF, #FF9800);
          color: white;
          padding: 40px;
          border-radius: 12px;
          margin-bottom: 30px;
        }
        .header h1 { font-size: 32px; margin-bottom: 8px; }
        .header p { font-size: 16px; opacity: 0.9; }
        .alert {
          background: #fff3cd;
          border: 1px solid #ffc107;
          color: #856404;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .content {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .content h2 { color: #7C4DFF; margin-bottom: 16px; }
        .content p { line-height: 1.7; margin-bottom: 12px; }
        .btn {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 24px;
          background: #7C4DFF;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: background 0.2s;
        }
        .btn:hover { background: #6b3ee6; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${safeHost}</h1>
        <p>UbuntuOS Browser Sandbox</p>
      </div>
      <div class="alert">
        <div>
          <strong>Why you're seeing this page:</strong>
          <p style="margin-top:8px;">Most websites block iframe embedding for security reasons (X-Frame-Options or CSP headers). This is a simulated preview of ${safeHost}.</p>
        </div>
      </div>
      <div class="content">
        <h2>Welcome to ${safeHost}</h2>
        <p>This is a safe simulated version of the site running inside the UbuntuOS browser sandbox. The real site cannot be embedded due to security restrictions.</p>
        <p>To visit the actual website, click the button below:</p>
        <a href="${escapeHtml(url)}" target="_blank" class="btn">Open ${safeHost} in new tab</a>
      </div>
    </body>
    </html>
  `;
};

// ---- Helpers ----
const generateId = () => Math.random().toString(36).slice(2);

const normalizeUrl = (input: string): string => {
  const trimmed = input.trim();
  if (trimmed === '') return '';
  if (trimmed === 'home') return 'home';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.includes(' ') || (!trimmed.includes('.') && !trimmed.startsWith('localhost'))) {
    return `search://${trimmed}`;
  }
  return `https://${trimmed}`;
};

// ---- Homepage Component ----
const Homepage = memo(function Homepage({ onNavigate }: { onNavigate: (url: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) onNavigate(`search://${searchQuery.trim()}`);
  };

  return (
    <div className="h-full flex flex-col items-center justify-start pt-12 custom-scrollbar overflow-auto" style={{ background: 'var(--bg-window)' }}>
      <div className="flex items-center gap-3 mb-8">
        <Globe size={36} style={{ color: 'var(--accent-primary)' }} />
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>UbuntuOS Browser</h1>
      </div>

      <form onSubmit={handleSearch} className="w-full flex justify-center px-4 mb-10">
        <div
          className="flex items-center gap-2 px-4"
          style={{
            width: '480px', height: '44px', borderRadius: '22px',
            background: 'var(--bg-input)', border: '1px solid var(--border-default)',
          }}
        >
          <Search size={18} style={{ color: 'var(--text-disabled)', flexShrink: 0 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or enter address"
            className="flex-1 bg-transparent outline-none"
            style={{ color: 'var(--text-primary)', fontSize: '14px' }}
          />
        </div>
      </form>

      <div className="grid grid-cols-4 gap-4 mb-10" style={{ maxWidth: '400px' }}>
        {QUICK_LINKS.map((link) => (
          <button
            key={link.name}
            onClick={() => onNavigate(link.url)}
            className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all hover:scale-105"
            style={{ background: 'var(--bg-hover)' }}
          >
            <div
              className="flex items-center justify-center"
              style={{ width: 48, height: 48, borderRadius: 12, background: link.color + '20' }}
            >
              <link.icon size={24} style={{ color: link.color }} />
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{link.name}</span>
          </button>
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: '640px', padding: '0 24px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>Top Stories</h2>
        <div className="grid grid-cols-1 gap-3">
          {NEWS_ARTICLES.map((article, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all"
              style={{ background: 'var(--bg-titlebar)', border: '1px solid var(--border-subtle)' }}
              onClick={() => onNavigate(`https://${article.source}`)}
            >
              <div className="flex-1">
                <h3 style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{article.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{article.source}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{article.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// ---- Search Results Page ----
const SearchResults = memo(function SearchResults({ query, onNavigate }: { query: string; onNavigate: (url: string) => void }) {
  const results = [
    { title: `${query} - Google Search`, url: `https://google.com/search?q=${encodeURIComponent(query)}`, desc: `Search results for ${query} from Google.` },
    { title: `${query} - Wikipedia`, url: `https://wikipedia.org/wiki/${encodeURIComponent(query)}`, desc: `Read about ${query} on Wikipedia, the free encyclopedia.` },
    { title: `${query} - Stack Overflow`, url: `https://stackoverflow.com/questions/tagged/${encodeURIComponent(query)}`, desc: `Questions and answers about ${query} on Stack Overflow.` },
    { title: `${query} - GitHub`, url: `https://github.com/search?q=${encodeURIComponent(query)}`, desc: `Code repositories related to ${query} on GitHub.` },
    { title: `${query} news and updates`, url: `https://news.ycombinator.com/item?id=${encodeURIComponent(query)}`, desc: `Latest news and discussions about ${query}.` },
  ];

  return (
    <div className="h-full p-6 custom-scrollbar overflow-auto" style={{ background: '#f5f5f5' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#333', marginBottom: '16px' }}>
        Search results for "{query}"
      </h1>
      <div className="flex flex-col gap-4" style={{ maxWidth: '680px' }}>
        {results.map((r, i) => (
          <div key={i} className="p-4 rounded-lg bg-white" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <button
              onClick={() => onNavigate(r.url)}
              className="text-left block w-full"
            >
              <h3 style={{ fontSize: '15px', fontWeight: 500, color: '#1a0dab', marginBottom: '4px' }}>{r.title}</h3>
              <p style={{ fontSize: '12px', color: '#006621', marginBottom: '4px' }}>{r.url}</p>
              <p style={{ fontSize: '13px', color: '#545454' }}>{r.desc}</p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

// ---- Main Browser Component ----
export default function Browser() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: generateId(), url: 'home', title: 'New Tab', history: ['home'], historyIndex: 0, loading: false },
  ]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem('ubuntuos_browser_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [showDownloads, setShowDownloads] = useState(false);
  const [addressBarValue, setAddressBarValue] = useState('');
  const showBookmarks = true;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    localStorage.setItem('ubuntuos_browser_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Sync address bar when switching tabs
  useEffect(() => {
    setAddressBarValue(activeTab.url === 'home' ? '' : activeTab.url);
  }, [activeTab]);

  const updateActiveTab = useCallback((updates: Partial<Tab>) => {
    setTabs((prev) => prev.map((t) => (t.id === activeTabId ? { ...t, ...updates } : t)));
  }, [activeTabId]);

  const navigateTo = useCallback((url: string) => {
    const normalized = normalizeUrl(url);
    if (!normalized) return;

    updateActiveTab({ loading: true });

    setTimeout(() => {
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id !== activeTabId) return t;
          const newHistory = t.history.slice(0, t.historyIndex + 1);
          if (newHistory[newHistory.length - 1] !== normalized) {
            newHistory.push(normalized);
          }
          const title = normalized === 'home' ? 'New Tab' : 
                       normalized.startsWith('search://') ? `Search: ${normalized.replace('search://', '')}` :
                       normalized.replace(/^https?:\/\//, '').split('/')[0];
          return { ...t, url: normalized, title, history: newHistory, historyIndex: newHistory.length - 1, loading: false };
        })
      );
    }, 400);
  }, [activeTabId, updateActiveTab]);

  const addTab = useCallback(() => {
    const newTab: Tab = { id: generateId(), url: 'home', title: 'New Tab', history: ['home'], historyIndex: 0, loading: false };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setTabs((prev) => {
      if (prev.length === 1) {
        return [{ id: generateId(), url: 'home', title: 'New Tab', history: ['home'], historyIndex: 0, loading: false }];
      }
      const filtered = prev.filter((t) => t.id !== tabId);
      if (activeTabId === tabId) {
        const idx = prev.findIndex((t) => t.id === tabId);
        const newActive = prev[idx - 1] || prev[idx + 1];
        if (newActive) setActiveTabId(newActive.id);
      }
      return filtered;
    });
  }, [activeTabId]);

  const goBack = useCallback(() => {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id !== activeTabId || t.historyIndex <= 0) return t;
        const newIndex = t.historyIndex - 1;
        const url = t.history[newIndex];
        return { ...t, url, historyIndex: newIndex };
      })
    );
  }, [activeTabId]);

  const goForward = useCallback(() => {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id !== activeTabId || t.historyIndex >= t.history.length - 1) return t;
        const newIndex = t.historyIndex + 1;
        const url = t.history[newIndex];
        return { ...t, url, historyIndex: newIndex };
      })
    );
  }, [activeTabId]);

  const refresh = useCallback(() => {
    const tab = tabs.find((t) => t.id === activeTabId);
    if (tab) navigateTo(tab.url);
  }, [activeTabId, tabs, navigateTo]);

  const toggleBookmark = useCallback(() => {
    if (activeTab.url === 'home' || activeTab.url.startsWith('search://')) return;
    setBookmarks((prev) => {
      const exists = prev.find((b) => b.url === activeTab.url);
      if (exists) return prev.filter((b) => b.url !== activeTab.url);
      return [...prev, { url: activeTab.url, title: activeTab.title }];
    });
  }, [activeTab]);

  const simulateDownload = useCallback((url: string, filename: string) => {
    const download: Download = {
      id: generateId(),
      url,
      filename,
      size: Math.floor(Math.random() * 50000000) + 1000000, // 1-50 MB
      progress: 0,
      completed: false,
    };
    setDownloads((prev) => [download, ...prev]);

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloads((prev) =>
        prev.map((d) => {
          if (d.id === download.id) {
            const newProgress = Math.min(d.progress + 10, 100);
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...d, progress: 100, completed: true };
            }
            return { ...d, progress: newProgress };
          }
          return d;
        })
      );
    }, 200);
  }, []);

  const isBookmarked = bookmarks.some((b) => b.url === activeTab.url);
  const canGoBack = activeTab.historyIndex > 0;
  const canGoForward = activeTab.historyIndex < activeTab.history.length - 1;
  const activeDownloads = downloads.filter((d) => !d.completed).length;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(addressBarValue);
  };

  // Render content based on URL
  const renderContent = () => {
    if (activeTab.loading) {
      return (
        <div className="h-full flex items-center justify-center" style={{ background: 'var(--bg-window)' }}>
          <div className="flex flex-col items-center gap-3">
            <Loader size={32} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-disabled)' }}>Loading...</span>
          </div>
        </div>
      );
    }

    if (activeTab.url === 'home') {
      return <Homepage onNavigate={navigateTo} />;
    }

    if (activeTab.url.startsWith('search://')) {
      return <SearchResults query={activeTab.url.replace('search://', '')} onNavigate={navigateTo} />;
    }

    const host = activeTab.url.replace(/^https?:\/\//, '').split('/')[0];
    const isIframeFriendly = IFRAME_FRIENDLY_SITES.some((s) => host.includes(s));

    if (isIframeFriendly) {
      return (
        <iframe
          ref={iframeRef}
          src={activeTab.url}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          title={activeTab.title}
        />
      );
    }

    return (
      <iframe
        ref={iframeRef}
        srcDoc={buildSitePage(activeTab.url, simulateDownload)}
        className="w-full h-full border-0"
        title={activeTab.title}
      />
    );
  };

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-window)' }}>
      {/* Address Bar */}
      <div
        className="flex items-center gap-2 px-3 shrink-0"
        style={{
          height: 44,
          background: 'var(--bg-titlebar)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className="flex items-center justify-center rounded-lg transition-all hover:bg-[var(--bg-hover)]"
          style={{ width: 32, height: 32, opacity: canGoBack ? 1 : 0.3 }}
        >
          <ArrowLeft size={16} style={{ color: 'var(--text-primary)' }} />
        </button>
        <button
          onClick={goForward}
          disabled={!canGoForward}
          className="flex items-center justify-center rounded-lg transition-all hover:bg-[var(--bg-hover)]"
          style={{ width: 32, height: 32, opacity: canGoForward ? 1 : 0.3 }}
        >
          <ArrowRight size={16} style={{ color: 'var(--text-primary)' }} />
        </button>
        <button
          onClick={refresh}
          className="flex items-center justify-center rounded-lg transition-all hover:bg-[var(--bg-hover)]"
          style={{ width: 32, height: 32 }}
        >
          <RefreshCw size={16} style={{ color: 'var(--text-primary)' }} />
        </button>
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center justify-center rounded-lg transition-all hover:bg-[var(--bg-hover)]"
          style={{ width: 32, height: 32 }}
        >
          <Home size={16} style={{ color: 'var(--text-primary)' }} />
        </button>

        <form onSubmit={handleAddressSubmit} className="flex-1 flex items-center">
          <div
            className="flex items-center gap-2 px-3 flex-1"
            style={{
              height: 32,
              borderRadius: 16,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-default)',
            }}
          >
            <Lock size={14} style={{ color: 'var(--accent-success)', flexShrink: 0 }} />
            <input
              type="text"
              value={addressBarValue}
              onChange={(e) => setAddressBarValue(e.target.value)}
              placeholder="Search Google or type a URL"
              className="flex-1 bg-transparent outline-none"
              style={{ color: 'var(--text-primary)', fontSize: '13px' }}
            />
          </div>
        </form>

        <button
          onClick={toggleBookmark}
          className="flex items-center justify-center rounded-lg transition-all hover:bg-[var(--bg-hover)]"
          style={{ width: 32, height: 32 }}
          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <Star
            size={16}
            style={{ color: isBookmarked ? 'var(--accent-secondary)' : 'var(--text-secondary)' }}
            fill={isBookmarked ? 'var(--accent-secondary)' : 'none'}
          />
        </button>

        <button
          onClick={() => setShowDownloads(!showDownloads)}
          className="flex items-center justify-center rounded-lg transition-all hover:bg-[var(--bg-hover)] relative"
          style={{ width: 32, height: 32 }}
          title="Downloads"
        >
          <Download size={16} style={{ color: 'var(--text-primary)' }} />
          {activeDownloads > 0 && (
            <span
              className="absolute -top-1 -right-1 flex items-center justify-center rounded-full"
              style={{
                width: 16,
                height: 16,
                background: 'var(--accent-primary)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 600,
              }}
            >
              {activeDownloads}
            </span>
          )}
        </button>
      </div>

      {/* Bookmark bar */}
      {showBookmarks && bookmarks.length > 0 && (
        <div
          className="flex items-center gap-1 px-3 shrink-0 overflow-x-auto custom-scrollbar"
          style={{
            height: 32,
            background: 'var(--bg-titlebar)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {bookmarks.map((bm) => (
            <button
              key={bm.url}
              onClick={() => navigateTo(bm.url)}
              className="flex items-center gap-1.5 px-2 py-1 rounded transition-all hover:bg-[var(--bg-hover)] shrink-0"
              style={{ maxWidth: 140 }}
            >
              <Star size={12} style={{ color: 'var(--accent-secondary)', flexShrink: 0 }} fill="var(--accent-secondary)" />
              <span className="truncate" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{bm.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Downloads panel */}
      {showDownloads && downloads.length > 0 && (
        <div
          className="shrink-0 custom-scrollbar overflow-auto"
          style={{
            maxHeight: 200,
            background: 'var(--bg-titlebar)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '12px',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Downloads</h3>
            <button
              onClick={() => setShowDownloads(false)}
              className="text-xs hover:underline"
              style={{ color: 'var(--text-secondary)' }}
            >
              Close
            </button>
          </div>
          {downloads.map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-3 p-2 rounded mb-2"
              style={{ background: 'var(--bg-window)' }}
            >
              <Download size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="truncate" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
                    {d.filename}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-disabled)', flexShrink: 0, marginLeft: 8 }}>
                    {d.completed ? '✓ Complete' : `${d.progress}%`}
                  </span>
                </div>
                {!d.completed && (
                  <div
                    className="h-1 rounded-full overflow-hidden"
                    style={{ background: 'var(--border-subtle)' }}
                  >
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${d.progress}%`,
                        background: 'var(--accent-primary)',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Bar */}
      <div
        className="flex items-center gap-1 px-2 shrink-0 overflow-x-auto custom-scrollbar"
        style={{
          height: 36,
          background: 'var(--bg-titlebar)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-t-lg cursor-pointer transition-all shrink-0 relative"
            style={{
              maxWidth: 180,
              minWidth: 100,
              background: tab.id === activeTabId ? 'var(--bg-window)' : 'transparent',
              borderTop: tab.id === activeTabId ? '2px solid var(--accent-primary)' : '2px solid transparent',
            }}
          >
            {tab.loading ? (
              <Loader size={14} className="animate-spin" style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            ) : (
              <Globe size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            )}
            <span className="truncate flex-1" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
              {tab.title}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
              className="flex items-center justify-center rounded-full transition-all hover:bg-[var(--bg-hover)]"
              style={{ width: 16, height: 16, flexShrink: 0 }}
            >
              <X size={12} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        ))}
        <button
          onClick={addTab}
          className="flex items-center justify-center rounded-lg transition-all hover:bg-[var(--bg-hover)] ml-1"
          style={{ width: 28, height: 28, flexShrink: 0 }}
        >
          <Plus size={16} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      {/* Viewport */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}
