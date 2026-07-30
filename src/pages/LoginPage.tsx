import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Auth helper ────────────────────────────────────────────────────────────

async function oauthSignIn(provider: "github" | "google") {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/csrf`, {
  credentials: "include",
});
  const { csrfToken } = await res.json();

  const form = document.createElement("form");
  form.method = "POST";
  form.action = `${import.meta.env.VITE_BACKEND_URL}/auth/signin/${provider}`;

  const csrfInput = document.createElement("input");
  csrfInput.type = "hidden";
  csrfInput.name = "csrfToken";
  csrfInput.value = csrfToken;
  form.appendChild(csrfInput);

  const callbackInput = document.createElement("input");
  callbackInput.type = "hidden";
  callbackInput.name = "callbackUrl";
  callbackInput.value = `${window.location.origin}/setup`;
  form.appendChild(callbackInput);

  document.body.appendChild(form);
  form.submit();
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function GitHubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.745 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function LeetCodeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  );
}

function W3Icon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.888 0l2.869 10.232.052.23L7.68 0H9.3l2.87 10.47.052-.232L14.997 0h1.811L13.26 14.885h-1.63L8.99 4.71l-2.64 10.175H4.72L1.033 0zm20.38 11.785c0 1.755-1.42 3.172-3.172 3.172a3.173 3.173 0 0 1-3.172-3.172 3.172 3.172 0 0 1 6.343 0z" />
    </svg>
  );
}

function CheckCircleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function FlameIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
    </svg>
  );
}

function ZapIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function TargetIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function EyeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ─── Reusable Components ─────────────────────────────────────────────────────

function AppLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-[#2F4156] flex items-center justify-center">
        <ZapIcon className="w-4 h-4 text-[#C8D9E6]" />
      </div>
      <span className="font-bold text-[#2F4156] text-lg tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        DevSync
      </span>
    </div>
  );
}

function OAuthButton({
  icon,
  label,
  primary = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
        primary
          ? "bg-[#2F4156] text-white hover:bg-[#3a5068] shadow-md hover:shadow-lg active:scale-[0.99]"
          : "bg-white text-[#2F4156] border border-[rgba(47,65,86,0.15)] hover:bg-[#f0f6fa] shadow-sm hover:shadow-md active:scale-[0.99]"
      }`}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {icon}
      {label}
    </button>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 h-px bg-[rgba(47,65,86,0.1)]" />
      <span className="text-xs text-[#567C8D] font-medium tracking-wide" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        or
      </span>
      <div className="flex-1 h-px bg-[rgba(47,65,86,0.1)]" />
    </div>
  );
}

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  helpText,
  optional = false,
  showPasswordToggle = false,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  helpText?: string;
  optional?: boolean;
  showPasswordToggle?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#2F4156] tracking-wide uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {label}
        </label>
        {optional && (
          <span className="text-xs text-[#567C8D]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Optional
          </span>
        )}
      </div>
      <div className="relative">
        <input
          type={showPasswordToggle && show ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-[#f0f6fa] border border-[rgba(47,65,86,0.12)] rounded-xl px-4 py-3 text-sm text-[#2F4156] placeholder-[#567C8D]/60 outline-none focus:border-[#567C8D] focus:ring-2 focus:ring-[#567C8D]/20 transition-all duration-200"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#567C8D] hover:text-[#2F4156] transition-colors"
            onClick={() => setShow(!show)}
          >
            {show ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {helpText && (
        <p className="text-xs text-[#567C8D] leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {helpText}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  options,
  value,
  onChange,
  helpText,
}: {
  label: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (v: string) => void;
  helpText?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#2F4156] tracking-wide uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-[#f0f6fa] border border-[rgba(47,65,86,0.12)] rounded-xl px-4 py-3 text-sm text-[#2F4156] outline-none focus:border-[#567C8D] focus:ring-2 focus:ring-[#567C8D]/20 transition-all duration-200 appearance-none cursor-pointer"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {helpText && (
        <p className="text-xs text-[#567C8D] leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {helpText}
        </p>
      )}
    </div>
  );
}

function TextareaField({
  label,
  placeholder,
  value,
  onChange,
  optional = false,
}: {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  optional?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#2F4156] tracking-wide uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {label}
        </label>
        {optional && (
          <span className="text-xs text-[#567C8D]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Optional
          </span>
        )}
      </div>
      <textarea
        rows={3}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-[#f0f6fa] border border-[rgba(47,65,86,0.12)] rounded-xl px-4 py-3 text-sm text-[#2F4156] placeholder-[#567C8D]/60 outline-none focus:border-[#567C8D] focus:ring-2 focus:ring-[#567C8D]/20 transition-all duration-200 resize-none"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      />
    </div>
  );
}

function PrimaryButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#567C8D] hover:bg-[#4a6c7c] text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {label}
    </button>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  icon,
  value,
  label,
  accent = false,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-sm backdrop-blur-sm ${
        accent ? "bg-[#2F4156] text-white" : "bg-white/80 text-[#2F4156]"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
          accent ? "bg-white/15" : "bg-[#C8D9E6]"
        }`}
      >
        {icon}
      </div>
      <div>
        <div className="font-bold text-sm leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {value}
        </div>
        <div
          className={`text-xs leading-tight mt-0.5 ${accent ? "text-[#C8D9E6]" : "text-[#567C8D]"}`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

// ─── Platform Badge ───────────────────────────────────────────────────────────

function PlatformBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-white/60 px-3 py-1.5 rounded-full shadow-sm">
      <span className="text-[#567C8D]">{icon}</span>
      <span className="text-xs font-semibold text-[#2F4156]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {label}
      </span>
    </div>
  );
}

// ─── Left Panel ───────────────────────────────────────────────────────────────

function LeftPanel() {
  return (
    <div
      className="hidden lg:flex flex-col justify-between relative overflow-hidden"
      style={{ background: "linear-gradient(145deg, #C8D9E6 0%, #a8c4d8 40%, #567C8D 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20" style={{ background: "#2F4156" }} />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full opacity-15" style={{ background: "#2F4156" }} />
        <div className="absolute -bottom-20 left-1/4 w-64 h-64 rounded-full opacity-20" style={{ background: "#ffffff" }} />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 p-10 pt-12">
        <AppLogo />
      </div>

      <div className="relative z-10 px-10 flex flex-col gap-6">
        <div>
          <h2 className="text-[#2F4156] font-bold text-4xl leading-tight tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            One dashboard.
            <br />
            Every metric
            <br />
            that matters.
          </h2>
          <p className="text-[#2F4156]/70 text-sm mt-3 leading-relaxed max-w-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Connect GitHub, LeetCode, your habit tracker, and W3Schools in a single unified view.
          </p>
        </div>

        <div className="flex flex-col gap-3 max-w-xs">
          <StatCard icon={<GitHubIcon className="w-4 h-4 text-[#2F4156]" />} value="5 commits today" label="across 3 repositories" />
          <StatCard icon={<LeetCodeIcon className="w-4 h-4 text-[#2F4156]" />} value="3 problems solved" label="daily target: 2 · exceeded" accent />
          <StatCard icon={<FlameIcon className="w-4 h-4 text-[#2F4156]" />} value="7-day streak" label="personal best: 24 days" />
        </div>
      </div>

      <div className="relative z-10 px-10 pb-10">
        <div className="flex flex-wrap gap-2 mb-6">
          <PlatformBadge icon={<GitHubIcon className="w-3.5 h-3.5" />} label="GitHub" />
          <PlatformBadge icon={<LeetCodeIcon className="w-3.5 h-3.5" />} label="LeetCode" />
          <PlatformBadge icon={<TargetIcon className="w-3.5 h-3.5" />} label="Habits" />
          <PlatformBadge icon={<W3Icon className="w-3.5 h-3.5" />} label="W3Schools" />
        </div>
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-12 bg-[#f0f6fa] overflow-y-auto">
      <div className="lg:hidden mb-8">
        <AppLogo />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2F4156] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Welcome back
          </h1>
          <p className="text-sm text-[#567C8D] mt-1.5 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Track your coding consistency and daily targets across all your platforms.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <OAuthButton
            primary
            icon={<GitHubIcon className="w-5 h-5" />}
            label="Continue with GitHub"
            onClick={() => oauthSignIn("github")}
          />
          <p className="text-center text-xs text-[#567C8D]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Use GitHub to import your profile automatically
          </p>
          <OAuthButton
            icon={<GoogleIcon className="w-5 h-5" />}
            label="Continue with Google"
            onClick={() => oauthSignIn("google")}
          />
        </div>

        <Divider />

        <div className="flex flex-col gap-4">
          <InputField label="Email address" type="email" placeholder="you@example.com" />
          <InputField label="Password" type="password" placeholder="••••••••" showPasswordToggle />

          <div className="flex items-center justify-between mt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-[rgba(47,65,86,0.2)] accent-[#567C8D]" />
              <span className="text-xs text-[#567C8D]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Remember me
              </span>
            </label>
            <button className="text-xs text-[#567C8D] hover:text-[#2F4156] transition-colors underline underline-offset-2 cursor-pointer" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Forgot password?
            </button>
          </div>

          <PrimaryButton label="Sign in" />
        </div>

        <div className="mt-4 p-3 rounded-xl bg-[#C8D9E6]/50 border border-[rgba(47,65,86,0.08)]">
          <div className="flex items-start gap-2.5">
            <CheckCircleIcon className="w-4 h-4 text-[#567C8D] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#567C8D] leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              GitHub sign-in automatically syncs your repos, contributions, and profile picture.
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-[#567C8D] mt-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Don&apos;t have an account?{" "}
          <button onClick={onSwitch} className="text-[#2F4156] font-semibold hover:underline underline-offset-2 cursor-pointer">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── Registration Page ────────────────────────────────────────────────────────

const TIMEZONES = [
  { value: "", label: "Select timezone…" },
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Berlin", label: "Central European Time (CET)" },
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
];

function RegisterPage({ onSwitch }: { onSwitch: () => void }) {
  const [timezone, setTimezone] = useState("");

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-12 bg-[#f0f6fa] overflow-y-auto">
      <div className="lg:hidden mb-8">
        <AppLogo />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-[#2F4156] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Create your account
          </h1>
          <p className="text-sm text-[#567C8D] mt-1.5 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Connect your coding platforms and set daily goals to stay consistent.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <OAuthButton
            primary
            icon={<GitHubIcon className="w-5 h-5" />}
            label="Continue with GitHub"
            onClick={() => oauthSignIn("github")}
          />
          <OAuthButton
            icon={<GoogleIcon className="w-5 h-5" />}
            label="Continue with Google"
            onClick={() => oauthSignIn("google")}
          />
        </div>

        <div className="mt-3 p-3 rounded-xl bg-[#C8D9E6]/50 border border-[rgba(47,65,86,0.08)]">
          <div className="flex items-start gap-2.5">
            <GitHubIcon className="w-4 h-4 text-[#567C8D] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#567C8D] leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              GitHub sign-up auto-fills your name, email, username, and profile picture.
            </p>
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-4">
          <InputField label="Display name" placeholder="Alex Johnson" optional />
          <InputField
            label="LeetCode username"
            placeholder="alexj_codes"
            helpText="We'll sync your solved problems and contest stats."
          />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Daily problems" type="number" placeholder="3" helpText="Target per day" />
            <InputField label="Weekly commits" type="number" placeholder="10" helpText="Target per week" />
          </div>
          <SelectField
            label="Timezone"
            options={TIMEZONES}
            value={timezone}
            onChange={setTimezone}
            helpText="Used for daily streak resets and goal tracking windows."
          />
          <TextareaField
            label="Short bio"
            placeholder="Full-stack dev focused on DSA and shipping side projects…"
            optional
          />

          <PrimaryButton label="Create account" />
        </div>

        <p className="text-center text-sm text-[#567C8D] mt-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Already have an account?{" "}
          <button onClick={onSwitch} className="text-[#2F4156] font-semibold hover:underline underline-offset-2 cursor-pointer">
            Log in
          </button>
        </p>

        <p className="text-center text-xs text-[#567C8D]/60 mt-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          By creating an account, you agree to our{" "}
          <span className="underline underline-offset-2 cursor-pointer hover:text-[#567C8D]">Terms</span> and{" "}
          <span className="underline underline-offset-2 cursor-pointer hover:text-[#567C8D]">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [page, setPage] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen w-full lg:grid" style={{ gridTemplateColumns: "1fr 1fr", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <LeftPanel />
      {page === "login" ? (
        <LoginForm onSwitch={() => setPage("register")} />
      ) : (
        <RegisterPage onSwitch={() => setPage("login")} />
      )}
    </div>
  );
}