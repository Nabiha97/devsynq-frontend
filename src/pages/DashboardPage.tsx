import { useState, useEffect } from "react";
import { useMe } from "../hooks/useMe";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Home, Target, GraduationCap, Mail, Settings, Bell,
  ExternalLink, Flame, TrendingUp, Code2, Activity, BookOpen,
  Github, User, ChevronRight, ChevronDown, ChevronUp, Zap,
  CheckCircle, Flag, X, Menu, Plus,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

// const githubData = [
//   { date: "Jul 1", commits: 3 }, { date: "Jul 3", commits: 7 },
//   { date: "Jul 5", commits: 4 }, { date: "Jul 7", commits: 9 },
//   { date: "Jul 9", commits: 5 }, { date: "Jul 11", commits: 12 },
//   { date: "Jul 13", commits: 8 }, { date: "Jul 15", commits: 15 },
//   { date: "Jul 17", commits: 6 }, { date: "Jul 19", commits: 11 },
//   { date: "Jul 21", commits: 14 }, { date: "Jul 23", commits: 10 },
//   { date: "Jul 25", commits: 18 },
// ];

// const leetcodeData = [
//   { week: "W1", solved: 8 }, { week: "W2", solved: 12 },
//   { week: "W3", solved: 6 }, { week: "W4", solved: 15 },
//   { week: "W5", solved: 11 }, { week: "W6", solved: 19 },
//   { week: "W7", solved: 14 }, { week: "W8", solved: 22 },
// ];

const habits = [
  { name: "Daily Coding", percent: 85, streak: 12 },
  { name: "Reading Docs", percent: 72, streak: 7 },
  { name: "Exercise", percent: 60, streak: 5 },
  { name: "Code Review", percent: 45, streak: 3 },
  { name: "System Design", percent: 38, streak: 2 },
];

const w3courses = [
  { name: "JavaScript Advanced", percent: 90 },
  { name: "CSS Grid & Flexbox", percent: 75 },
  { name: "React Fundamentals", percent: 58 },
  { name: "Node.js & Express", percent: 32 },
  { name: "SQL Databases", percent: 20 },
];

const upcomingCheckpoints = [
  { title: "Complete 3 LeetCode problems", subtitle: "Medium difficulty · Due today", time: "11:59 PM", done: false },
  { title: "Push 2 GitHub commits", subtitle: "Any repo · Ongoing goal", time: "Tonight", done: false },
  { title: "Finish CSS Grid module", subtitle: "W3Schools · 2 lessons left", time: "This week", done: false },
  { title: "30-min code review session", subtitle: "Habit streak goal · 5-day target", time: "Today", done: true },
];

const HEATMAP = Array.from({ length: 70 }, (_, i) => {
  const seed = (i * 2654435761) >>> 0;
  return (seed % 5) as 0 | 1 | 2 | 3 | 4;
});
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// ─── Shared primitives ─────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#2F4156] text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-[#567C8D]/30">
      <p className="font-semibold mb-1 text-[#C8D9E6]">{label}</p>
      {payload.map((e, i) => (
        <p key={i}>{e.name}: <span className="font-bold text-white">{e.value}</span></p>
      ))}
    </div>
  );
}

function ProgressBar({ name, percent, extra }: { name: string; percent: number; extra?: string }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-semibold text-[#2F4156]">{name}</span>
        <span className="text-xs font-bold text-[#567C8D]">{percent}%</span>
      </div>
      <div className="w-full h-2 bg-[#C8D9E6] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percent}%`, background: "linear-gradient(90deg,#567C8D 0%,#2F4156 100%)" }} />
      </div>
      {extra && <p className="text-[11px] text-[#567C8D] mt-0.5 opacity-80">{extra}</p>}
    </div>
  );
}

function HeatCell({ level }: { level: number }) {
  const fills = ["bg-[#EDE8E4]", "bg-[#C8D9E6]", "bg-[#9BBACF]", "bg-[#567C8D]", "bg-[#2F4156]"];
  return <div className={`w-[10px] h-[10px] rounded-[2px] ${fills[level]}`} />;
}

function ExpandSection({ label, children, defaultOpen = false }: {
  label: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left">
        <span className="text-sm font-bold text-[#2F4156]"
          style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{label}</span>
        {open ? <ChevronUp size={16} className="text-[#567C8D]" />
               : <ChevronDown size={16} className="text-[#567C8D]" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

// ─── Page types ────────────────────────────────────────────────────────────────

type Page = "dashboard" | "checkpoints" | "skills" | "contact";

// ─── Mobile header ─────────────────────────────────────────────────────────────

function MobileHeader({ onMenuOpen }: { onMenuOpen: () => void }) {
  return (
    <header className="lg:hidden sticky top-0 z-20 bg-[#F5EFEB] border-b border-[#C8D9E6]/50 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#567C8D] flex items-center justify-center">
          <Zap size={13} className="text-white" />
        </div>
        <span className="text-[#2F4156] font-extrabold text-base"
          style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>DevSynq</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-full bg-white border border-[#C8D9E6]/70 flex items-center justify-center shadow-sm">
          <Bell size={15} className="text-[#2F4156]" />
        </button>
        <button onClick={onMenuOpen}
          className="w-9 h-9 rounded-full bg-white border border-[#C8D9E6]/70 flex items-center justify-center shadow-sm">
          <Menu size={15} className="text-[#2F4156]" />
        </button>
      </div>
    </header>
  );
}

// ─── Slide-out drawer (mobile) ────────────────────────────────────────────────

function MobileDrawer({ open, onClose, active, setActive }: {
  open: boolean; onClose: () => void; active: Page; setActive: (p: Page) => void;
}) {
  const NAV = [
    { id: "dashboard" as Page, label: "Dashboard", Icon: Home },
    { id: "checkpoints" as Page, label: "Checkpoints", Icon: Target },
    { id: "skills" as Page, label: "Skill Recs", Icon: GraduationCap },
    { id: "contact" as Page, label: "Contact & Report", Icon: Mail },
  ];
  return (
    <>
      <div className={`lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose} />
      <div className={`lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-[#2F4156] z-50 flex flex-col py-6 px-4 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#567C8D] flex items-center justify-center">
              <Zap size={13} className="text-white" />
            </div>
            <span className="text-white font-extrabold text-base"
              style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>DevSynq</span>
          </div>
          <button onClick={onClose} className="text-[#C8D9E6]/60 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => { setActive(id); onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all text-left min-h-[44px] ${
                active === id ? "bg-[#567C8D] text-white" : "text-[#C8D9E6]/80 hover:bg-[#3a5168] hover:text-white"}`}>
              <Icon size={17} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="border-t border-[#567C8D]/30 pt-4 flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[#C8D9E6] flex items-center justify-center flex-shrink-0">
            <User size={13} className="text-[#2F4156]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate">Nabiha</p>
            <p className="text-[#C8D9E6]/70 text-xs truncate">emaadfatima4@gmail.com</p>
          </div>
          <button className="text-[#C8D9E6]/60 hover:text-white transition-colors">
            <Settings size={15} />
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Bottom tab bar (mobile) ───────────────────────────────────────────────────

function BottomTabBar({ active, setActive }: { active: Page; setActive: (p: Page) => void }) {
  const TABS = [
    { id: "dashboard" as Page, label: "Home", Icon: Home },
    { id: "checkpoints" as Page, label: "Goals", Icon: Target },
    { id: "skills" as Page, label: "Skills", Icon: GraduationCap },
    { id: "contact" as Page, label: "Contact", Icon: Mail },
  ];
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-[#C8D9E6]/60 flex pb-[env(safe-area-inset-bottom)]">
      {TABS.map(({ id, label, Icon }) => (
        <button key={id} onClick={() => setActive(id)}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] transition-colors ${active === id ? "text-[#2F4156]" : "text-[#9BBACF]"}`}>
          <Icon size={active === id ? 20 : 18} strokeWidth={active === id ? 2.5 : 1.8} />
          <span className={`text-[10px] font-semibold leading-none ${active === id ? "text-[#2F4156]" : "text-[#9BBACF]"}`}>{label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─── Desktop left sidebar ──────────────────────────────────────────────────────

function DesktopSidebar({ active, setActive }: { active: Page; setActive: (p: Page) => void }) {
  const NAV = [
    { id: "dashboard" as Page, label: "Dashboard", Icon: Home },
    { id: "checkpoints" as Page, label: "Checkpoints", Icon: Target },
    { id: "skills" as Page, label: "Skill Recs", Icon: GraduationCap },
    { id: "contact" as Page, label: "Contact & Report", Icon: Mail },
  ];
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[210px] bg-[#2F4156] flex-col py-6 px-4 z-30 overflow-y-auto">
      <div className="flex items-center gap-2.5 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-[#567C8D] flex items-center justify-center flex-shrink-0">
          <Zap size={15} className="text-white" />
        </div>
        <span className="text-white font-extrabold text-lg tracking-tight"
          style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>DevSynq</span>
      </div>
      <nav className="flex-1 space-y-0.5">
        {NAV.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setActive(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
              active === id ? "bg-[#567C8D] text-white shadow-sm" : "text-[#C8D9E6]/80 hover:bg-[#3a5168] hover:text-white"}`}>
            <Icon size={17} className="flex-shrink-0" /><span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="border-t border-[#567C8D]/30 pt-4 flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded-full bg-[#C8D9E6] flex items-center justify-center flex-shrink-0">
          <User size={13} className="text-[#2F4156]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-bold truncate">Nabiha</p>
          <p className="text-[#C8D9E6]/70 text-xs truncate">emaadfatima4@gmail.com</p>
        </div>
        <button className="text-[#C8D9E6]/60 hover:text-white transition-colors flex-shrink-0">
          <Settings size={15} />
        </button>
      </div>
    </aside>
  );
}

// ─── Desktop right sidebar ────────────────────────────────────────────────────

function DesktopRightSidebar({ setActive }: { setActive: (p: Page) => void }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <aside className="hidden lg:flex fixed right-0 top-0 bottom-0 w-[268px] bg-white border-l border-[#C8D9E6]/60 flex-col py-6 px-5 z-30 overflow-y-auto">
      <div className="mb-5">
        <p className="text-xs text-[#567C8D] font-medium mb-0.5">
          {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <p className="text-[22px] font-bold text-[#2F4156] tabular-nums"
          style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </p>
      </div>
      <div className="rounded-2xl p-4 mb-4"
        style={{ background: "linear-gradient(135deg,#C8D9E6 0%,#9BBACF 100%)" }}>
        <div className="flex items-center gap-2 mb-2">
          <Flame size={17} className="text-[#2F4156]" />
          <span className="text-xs font-bold text-[#2F4156] uppercase tracking-wide">Week Streak</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-extrabold text-[#2F4156]"
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>18</span>
          <span className="text-sm font-semibold text-[#567C8D]">days</span>
        </div>
        <p className="text-xs text-[#567C8D] mt-1.5">
          Personal best: <span className="font-bold text-[#2F4156]">31 days</span>
        </p>
      </div>
      <div className="rounded-2xl p-4 border border-[#C8D9E6]/60 mb-5 bg-white">
        <p className="text-xs font-bold text-[#2F4156] mb-3">Activity · GitHub + LeetCode</p>
        <div className="flex gap-[3px] mb-1">
          {DAYS.map(d => (
            <div key={d} className="w-[10px] text-center"
              style={{ fontSize: "8px", color: "#9BBACF" }}>{d}</div>
          ))}
        </div>
        <div className="flex flex-col gap-[3px]">
          {Array.from({ length: 10 }, (_, row) => (
            <div key={row} className="flex gap-[3px]">
              {HEATMAP.slice(row * 7, row * 7 + 7).map((l, col) => <HeatCell key={col} level={l} />)}
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-[#2F4156] uppercase tracking-wide mb-3">Upcoming Checkpoints</p>
        <div className="space-y-1">
          {upcomingCheckpoints.map((cp, i) => (
            <div key={i}
              className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors cursor-pointer group ${cp.done ? "opacity-50" : "hover:bg-[#F5EFEB]"}`}>
              <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${cp.done ? "bg-green-400" : "bg-[#567C8D]"}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold leading-snug ${cp.done ? "line-through text-[#9BBACF]" : "text-[#2F4156]"}`}>{cp.title}</p>
                <p className="text-xs text-[#567C8D] mt-0.5 opacity-80">{cp.subtitle}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs text-[#567C8D] font-medium whitespace-nowrap">{cp.time}</span>
                <ExternalLink size={10} className="text-[#C8D9E6] group-hover:text-[#567C8D] transition-colors" />
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setActive("checkpoints")}
          className="mt-3 text-xs font-bold text-[#567C8D] hover:text-[#2F4156] flex items-center gap-1 transition-colors">
          See all checkpoints <ChevronRight size={12} />
        </button>
      </div>
    </aside>
  );
}

// ─── Dashboard page ────────────────────────────────────────────────────────────

function DashboardHome({
  setActive,
  me,
}: {
  setActive: (p: Page) => void;
  me: any;
}) {

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-4">
      <div className="hidden lg:block">
        <h1 className="text-2xl font-extrabold text-[#2F4156]"
          style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Welcome, Nabiha</h1>
        <p className="text-sm text-[#567C8D] mt-0.5 font-medium">Your developer progress overview</p>
      </div>

      <div className="lg:hidden px-1 pt-1">
        <p className="text-xs text-[#567C8D] font-medium">
          {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="text-xl font-extrabold text-[#2F4156] mt-0.5"
          style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Welcome back, Nabiha</h1>
      </div>

      <div className="lg:hidden rounded-2xl p-5 shadow-sm"
        style={{ background: "linear-gradient(135deg,#C8D9E6 0%,#9BBACF 100%)" }}>
        <div className="flex items-center gap-2 mb-2">
          <Flame size={18} className="text-[#2F4156]" />
          <span className="text-xs font-bold text-[#2F4156] uppercase tracking-wide">Week Streak</span>
        </div>
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-[#2F4156]"
              style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>18</span>
            <span className="text-base font-semibold text-[#567C8D]">days</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#567C8D]">Personal best</p>
            <p className="text-lg font-extrabold text-[#2F4156]"
              style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>31 days</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-xs text-[#567C8D]">
          <TrendingUp size={12} /><span>On track for a new record</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4 lg:p-5 shadow-sm"
          style={{ background: "linear-gradient(135deg,#567C8D 0%,#2F4156 100%)" }}>
          <p className="text-[11px] lg:text-xs font-semibold text-[#C8D9E6] mb-2 lg:mb-3">Commits Today</p>
         {me?.githubConnected ? (
  <span className="text-3xl lg:text-4xl font-extrabold text-white block"
    style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
    {me.commitsToday ?? 0}
  </span>
) : (
  <p className="text-xs text-[#C8D9E6]">Connect GitHub to see this</p>
)}

          <div className="flex items-center gap-1 mt-2 text-[11px] text-[#C8D9E6]">
            <TrendingUp size={11} /><span>+3 from yesterday</span>
          </div>
        </div>
        <div className="rounded-2xl p-4 lg:p-5 shadow-sm bg-white">
          <p className="text-[11px] lg:text-xs font-semibold text-[#567C8D] mb-2 lg:mb-3">Problems Solved</p>
          {me?.leetcodeConnected ? (
  <span className="text-3xl lg:text-4xl font-extrabold text-[#2F4156] block"
    style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
    {me.leetcodeSolved?.total ?? 0}
  </span>
) : (
  <p className="text-xs text-[#567C8D]">Connect LeetCode to see this</p>
)}

          <div className="flex items-center gap-1 mt-2 text-[11px] text-[#567C8D]">
            <span>🔥 18-day streak</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-[11px] font-bold text-[#567C8D] uppercase tracking-wide mb-3">Trackers connected</p>
        <div className="flex flex-wrap gap-2">
          {[
  {
    name: "GitHub",
    Icon: Github,
    connected: me?.githubConnected,
  },
  {
    name: "LeetCode",
    Icon: Code2,
    connected: me?.leetcodeConnected,
  },
  {
    name: "Habits",
    Icon: Activity,
    connected: (me?.habits?.length ?? 0) > 0,
  },
  {
    name: "W3Schools",
    Icon: BookOpen,
    connected: (me?.courseProgress?.length ?? 0) > 0,
  },
]
.map(({ name, Icon, connected }) => (

            <div key={name}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#F5EFEB] border border-[#C8D9E6]/60 min-h-[36px]">
              <Icon size={12} className="text-[#2F4156]" />
              <span className="text-xs font-semibold text-[#2F4156]">{name}</span>
              <div
  className={`w-1.5 h-1.5 rounded-full ${
    connected ? "bg-emerald-400" : "bg-gray-300"
  }`}
/>

            </div>
          ))}
        </div>
        <p className="text-xs text-[#567C8D] mt-2.5 flex items-center gap-1 font-medium">
          <CheckCircle size={11} className="text-emerald-400" />
{[
  me?.githubConnected,
  me?.leetcodeConnected,
  (me?.habits?.length ?? 0) > 0,
  (me?.courseProgress?.length ?? 0) > 0,
].every(Boolean)
  ? "All synced"
  : "Some trackers are not connected"}

        </p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-sm font-bold text-[#2F4156] mb-4"
          style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Habit Completion</p>
{(me?.habits ?? []).slice(0, 3).map(h => (
  <ProgressBar
    key={h.id}
    name={h.name}
    percent={h.completedToday ? 100 : 0}
    extra={`${h.currentStreak}-day streak`}
  />
))}
{(me?.habits?.length ?? 0) > 3 && (
  <ExpandSection label={`+${(me?.habits?.length ?? 0) - 3} more habits`}>
    {(me?.habits ?? []).slice(3).map(h => (
      <ProgressBar
        key={h.id}
        name={h.name}
        percent={h.completedToday ? 100 : 0}
        extra={`${h.currentStreak}-day streak`}
      />
    ))}
  </ExpandSection>
)}

      </div>

      <div className="lg:hidden bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-sm font-bold text-[#2F4156] mb-3"
          style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Upcoming Checkpoints</p>
        <div className="space-y-1">
          {upcomingCheckpoints.slice(0, 3).map((cp, i) => (
            <div key={i}
              className={`flex items-start gap-3 p-3 rounded-xl ${cp.done ? "opacity-50" : "active:bg-[#F5EFEB]"} transition-colors`}>
              <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${cp.done ? "bg-green-400" : "bg-[#567C8D]"}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold leading-snug ${cp.done ? "line-through text-[#9BBACF]" : "text-[#2F4156]"}`}>{cp.title}</p>
                <p className="text-xs text-[#567C8D] mt-0.5">{cp.subtitle}</p>
              </div>
              <span className="text-xs text-[#567C8D] font-medium whitespace-nowrap flex-shrink-0">{cp.time}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setActive("checkpoints")}
          className="mt-3 text-xs font-bold text-[#567C8D] hover:text-[#2F4156] flex items-center gap-1 transition-colors">
          See all checkpoints <ChevronRight size={12} />
        </button>
      </div>

      <ExpandSection label="Growth overview — GitHub commits">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart 
 data={
   me?.commitsToday
   ? [
       {
        date:"Today",
        commits:me.commitsToday
       }
     ]
   : []
 }
>

            <defs>
              <linearGradient id="cFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#567C8D" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#567C8D" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#C8D9E6" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9BBACF" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9BBACF" }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="commits" name="Commits" stroke="#2F4156" strokeWidth={2.5}
              fill="url(#cFill)" dot={{ fill: "#567C8D", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#2F4156", strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ExpandSection>

      <ExpandSection label="LeetCode problems by week">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart 
data={
 me?.leetcodeSolved
 ?
 [
  {
   week:"Total",
   solved:me.leetcodeSolved.total
  }
 ]
 :
 []
}
>

            <CartesianGrid strokeDasharray="3 3" stroke="#C8D9E6" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#9BBACF" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9BBACF" }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="solved" name="Solved" fill="#567C8D" radius={[5, 5, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </ExpandSection>

      <ExpandSection label="Activity heatmap">
        <div>
          <div className="flex gap-[3px] mb-1">
            {DAYS.map(d => (
              <div key={d} className="w-[10px] text-center"
                style={{ fontSize: "8px", color: "#9BBACF" }}>{d}</div>
            ))}
          </div>
          <div className="flex flex-col gap-[3px]">
            {Array.from({ length: 10 }, (_, row) => (
              <div key={row} className="flex gap-[3px]">
                {HEATMAP.slice(row * 7, row * 7 + 7).map((l, col) => <HeatCell key={col} level={l} />)}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-[3px] mt-2.5 justify-end">
            <span className="text-[10px] text-[#9BBACF] mr-1">less</span>
            {([0, 1, 2, 3, 4] as const).map(l => <HeatCell key={l} level={l} />)}
            <span className="text-[10px] text-[#9BBACF] ml-1">more</span>
          </div>
        </div>
      </ExpandSection>

      <ExpandSection label="W3Schools learning progress">
{(me?.courseProgress ?? []).map(c => (
  <ProgressBar
    key={c.id}
    name={`${c.courseName} — ${c.lessonName}`}
    percent={100}
  />
))}

      </ExpandSection>
    </div>
  );
}

// ─── Checkpoints page ──────────────────────────────────────────────────────────

const checkpointTargets = [
  { title: "LeetCode / day", current: 2, target: 3, unit: "problems", note: "7-day avg: 2.1/day", Icon: Code2 },
  { title: "GitHub commits / day", current: 14, target: 10, unit: "commits", note: "Exceeding target", Icon: Github },
  { title: "Habit rate", current: 60, target: 75, unit: "%", note: "Aim for 5/5 daily", Icon: Activity },
  { title: "W3Schools / week", current: 3, target: 5, unit: "lessons", note: "2-lesson/week avg", Icon: BookOpen },
];

function CheckpointsPage() {
  return (
    <div className="space-y-4">
      <div className="hidden lg:block">
        <h1 className="text-2xl font-extrabold text-[#2F4156]"
          style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Daily Checkpoints</h1>
        <p className="text-sm text-[#567C8D] mt-0.5 font-medium">Targets calibrated to your speed</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {checkpointTargets.map(t => {
          const pct = Math.min(100, Math.round((t.current / t.target) * 100));
          const done = pct >= 100;
          return (
            <div key={t.title} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#F5EFEB] flex items-center justify-center flex-shrink-0">
                    <t.Icon size={14} className="text-[#567C8D]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2F4156]">{t.title}</p>
                    <p className="text-[11px] text-[#567C8D]">{t.note}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ml-2 flex-shrink-0 ${done ? "bg-emerald-100 text-emerald-700" : "bg-[#C8D9E6] text-[#2F4156]"}`}>
                  {done ? "✓" : `${pct}%`}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-extrabold text-[#2F4156]"
                  style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{t.current}</span>
                <span className="text-sm text-[#567C8D] font-medium">/ {t.target} {t.unit}</span>
              </div>
              <div className="w-full h-2 bg-[#C8D9E6] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: done ? "linear-gradient(90deg,#34d399 0%,#10b981 100%)" : "linear-gradient(90deg,#567C8D 0%,#2F4156 100%)" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Skills page ───────────────────────────────────────────────────────────────

const skillRecs = [
  { name: "TypeScript", reason: "Required in 89% of senior frontend listings", demand: "Very High", tag: "Frontend" },
  { name: "Docker & Kubernetes", reason: "Standard for backend and DevOps roles", demand: "High", tag: "DevOps" },
  { name: "System Design", reason: "Core competency tested in senior interviews", demand: "High", tag: "Architecture" },
  { name: "GraphQL", reason: "Growing adoption across full-stack teams", demand: "Medium", tag: "API" },
  { name: "Rust", reason: "Emerging systems language with salary premium", demand: "Growing", tag: "Systems" },
  { name: "AWS Cloud Practitioner", reason: "High-ROI cert for backend engineers", demand: "High", tag: "Cloud" },
];

const demandStyles: Record<string, string> = {
  "Very High": "bg-[#2F4156] text-white",
  "High": "bg-[#567C8D] text-white",
  "Medium": "bg-[#C8D9E6] text-[#2F4156]",
  "Growing": "bg-[#F5EFEB] text-[#2F4156] border border-[#C8D9E6]",
};

function SkillsPage({ me }: { me: any }) {
  return (
    <div className="space-y-4">
      <div className="px-1 pt-1 lg:pt-0 lg:px-0">
        <h1 className="text-xl lg:text-2xl font-extrabold text-[#2F4156]"
          style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Skill Recommendations</h1>
        <p className="text-xs lg:text-sm text-[#567C8D] mt-0.5 font-medium">Aligned with in-demand career roles</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
{(me?.skillRecommendations ?? []).length === 0 ? (
  <p className="text-sm text-[#567C8D] col-span-2">
    Connect more platforms to get personalized recommendations.
  </p>
) : (
  me.skillRecommendations.map((rec: string, i: number) => (
    <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
      <p className="text-sm text-[#2F4156] leading-relaxed">{rec}</p>
    </div>
  ))
)}
      </div>
    </div>
  );
}

// ─── Contact page ──────────────────────────────────────────────────────────────

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [desc, setDesc] = useState("");
  return (
    <div className="space-y-4">
      <div className="px-1 pt-1 lg:pt-0 lg:px-0">
        <h1 className="text-xl lg:text-2xl font-extrabold text-[#2F4156]"
          style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Contact & Report</h1>
        <p className="text-xs lg:text-sm text-[#567C8D] mt-0.5 font-medium">Get in touch or report an issue</p>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-sm font-bold text-[#2F4156] mb-4">Contact Info</p>
        <div className="space-y-3">
          {[
            { label: "Email", value: "support@devsynq.io" },
            { label: "Discord", value: "discord.gg/devsynq" },
            { label: "Twitter / X", value: "@devsynq" },
            { label: "GitHub", value: "github.com/devsynq" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-[#F5EFEB] last:border-0">
              <span className="text-xs text-[#9BBACF] font-semibold uppercase tracking-wide">{label}</span>
              <span className="text-sm text-[#2F4156] font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Flag size={14} className="text-[#567C8D]" />
          <p className="text-sm font-bold text-[#2F4156]">Report an Issue</p>
        </div>
        {submitted ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-3">
              <CheckCircle size={22} className="text-emerald-500" />
            </div>
            <p className="text-sm font-bold text-[#2F4156]">Report submitted</p>
            <p className="text-xs text-[#567C8D] mt-1">{"We'll follow up within 24 hours."}</p>
            <button onClick={() => { setSubmitted(false); setDesc(""); }}
              className="mt-4 text-xs font-semibold text-[#567C8D] hover:text-[#2F4156] transition-colors">
              Submit another
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[#567C8D] block mb-1.5">Issue type</label>
              <select className="w-full px-3 py-3 rounded-xl border border-[#C8D9E6] text-sm text-[#2F4156] bg-white focus:outline-none focus:ring-2 focus:ring-[#567C8D]/40 min-h-[44px]">
                <option>Bug report</option>
                <option>Data sync issue</option>
                <option>Feature request</option>
                <option>Account & billing</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#567C8D] block mb-1.5">Description</label>
              <textarea rows={4} value={desc} onChange={e => setDesc(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-[#C8D9E6] text-sm text-[#2F4156] focus:outline-none focus:ring-2 focus:ring-[#567C8D]/40 resize-none placeholder-[#C8D9E6]"
                placeholder="Describe the issue..." />
            </div>
            <button onClick={() => desc.trim() && setSubmitted(true)}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-all min-h-[48px] ${desc.trim() ? "bg-[#2F4156] text-white active:bg-[#567C8D] shadow-sm" : "bg-[#C8D9E6] text-[#9BBACF] cursor-not-allowed"}`}>
              Submit Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root Dashboard export ──────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data } = useMe();
  const me = data?.me;

  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);


  let content: React.ReactNode;
  switch (activePage) {
   case "dashboard":
  content = (
    <DashboardHome
      setActive={setActivePage}
      me={me}
    />
  );
 break;
    case "checkpoints": content = <CheckpointsPage />; break;
    case "skills":      content = <SkillsPage me={me} />; break;
    case "contact":     content = <ContactPage />; break;
  }

  return (
    <div className="min-h-screen bg-[#F5EFEB]" style={{ fontFamily: "'Inter',sans-serif" }}>
      <DesktopSidebar active={activePage} setActive={setActivePage} />
      <DesktopRightSidebar setActive={setActivePage} />
      <MobileHeader onMenuOpen={() => setDrawerOpen(true)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}
        active={activePage} setActive={setActivePage} />
      <main className="px-4 py-4 pb-24 lg:ml-[210px] lg:mr-[268px] lg:px-8 lg:py-8 lg:pb-8 min-h-screen">
        <div className="max-w-2xl lg:max-w-4xl mx-auto">{content}</div>
      </main>
      <BottomTabBar active={activePage} setActive={setActivePage} />
    </div>
  );
}