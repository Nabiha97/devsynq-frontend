// ─── Setup page ────────────────────────────────────────────────────────────────
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useMe } from "../hooks/useMe";
import { Zap, Sparkles, Github, User, Link2, Code2, Activity, BookOpen, Plus, CheckCircle, ArrowRight } from "lucide-react";
type SetupStatus = "idle" | "connected" | "skipped";

interface SetupState {
  leetcode: string;
  leetcodeStatus: SetupStatus;
  habitStatus: SetupStatus;
  w3Status: SetupStatus;
}

function SetupBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
      <CheckCircle size={11} />{label}
    </span>
  );
}

function SetupCard({ icon, iconBg, title, subtitle, tag, children, status }: {
  icon: React.ReactNode; iconBg: string; title: string; subtitle: string;
  tag?: string; children: React.ReactNode; status?: SetupStatus;
}) {
  const done = status === "connected" || status === "skipped";
  return (
    <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 ${done ? "border-emerald-200/60" : "border-[#C8D9E6]/40"}`}>
      <div className="flex items-start gap-4 px-5 pt-5 pb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg }}>{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-[#2F4156]"
              style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{title}</span>
            {tag && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F5EFEB] text-[#567C8D] border border-[#C8D9E6]/60 uppercase tracking-wide">{tag}</span>
            )}
            {done && status === "connected" && <SetupBadge label="Connected" />}
            {done && status === "skipped" && (
              <span className="text-[10px] font-semibold text-[#9BBACF]">Skipped</span>
            )}
          </div>
          <p className="text-xs text-[#567C8D] mt-0.5 font-medium leading-snug">{subtitle}</p>
        </div>
      </div>
      <div className="h-px bg-[#F5EFEB] mx-5" />
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}
const CREATE_HABIT = gql`
  mutation CreateHabit($name: String!, $targetFrequency: Int!) {
    createHabit(name: $name, targetFrequency: $targetFrequency) {
      id
      name
    }
  }
`;

const CONNECT_LEETCODE = gql`
  mutation ConnectLeetcode($username: String!) {
    connectLeetcode(username: $username) {
      id
      leetcodeUsername
    }
  }
`;

const ADD_COURSE = gql`
  mutation AddCourse($courseName: String!, $lessonName: String!) {
    completeLesson(courseName: $courseName, lessonName: $lessonName) {
      id
      courseName
      lessonName
    }
  }
`;

function SetupPage({ onComplete }: { onComplete: () => void }) {
    const navigate = useNavigate();
  const [setup, setSetup] = useState<SetupState>({
    leetcode: "", leetcodeStatus: "idle", habitStatus: "idle", w3Status: "idle",
  });
  const { data } = useMe();

  const githubConnected = data?.me?.githubConnected ?? false;
  // const userName = data?.me?.name ?? "there";
  const [habitName, setHabitName] = useState("Daily Coding");
  const [courseName, setCourseName] = useState("JavaScript Advanced");
const [addCourse] = useMutation(ADD_COURSE);
  const patch = (partial: Partial<SetupState>) => setSetup(s => ({ ...s, ...partial }));
  const [createHabit] = useMutation(CREATE_HABIT);
  const [connectLeetcode] = useMutation(CONNECT_LEETCODE);

  const completedCount = [
    githubConnected,
    setup.leetcodeStatus === "connected",
    setup.habitStatus !== "idle",
    setup.w3Status !== "idle",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F5EFEB] flex flex-col" style={{ fontFamily: "'Inter',sans-serif" }}>
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-[#C8D9E6]/40 bg-[#F5EFEB]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#567C8D] flex items-center justify-center">
            <Zap size={13} className="text-white" />
          </div>
          <span className="text-[#2F4156] font-extrabold text-base"
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>DevSynq</span>
        </div>
        <button onClick={onComplete}
          className="text-xs font-semibold text-[#9BBACF] hover:text-[#567C8D] transition-colors">
          Skip for now
        </button>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-10 lg:py-16">
        <div className="w-full max-w-xl">
          <div className="mb-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C8D9E6]/50 border border-[#C8D9E6] mb-4">
              <Sparkles size={12} className="text-[#567C8D]" />
              <span className="text-xs font-bold text-[#567C8D] uppercase tracking-wide">Step 1 of 1</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#2F4156] leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Set up your learning workspace
            </h1>
            <p className="text-sm text-[#567C8D] mt-2 font-medium leading-relaxed">
              Connect your tools so DevSynq can aggregate your progress in one place. You can add or change these any time from settings.
            </p>
            <div className="flex items-center gap-3 mt-5 justify-center lg:justify-start">
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i < completedCount ? "bg-[#2F4156] w-5" : "bg-[#C8D9E6] w-3"}`} />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#567C8D]">{completedCount} of 4 configured</span>
            </div>
          </div>

          <div className="space-y-3">
            {/* GitHub */}
            <SetupCard icon={<Github size={18} className="text-white" />} iconBg="#2F4156"
              title="GitHub" subtitle="Track commits, repos, and coding activity"
              tag="Integration" status={githubConnected ? "connected" : undefined}>
              {githubConnected ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C8D9E6] flex items-center justify-center flex-shrink-0">
                    <User size={13} className="text-[#2F4156]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2F4156]">Connected via sign-in</p>
                    <p className="text-xs text-[#567C8D]">{data?.me?.email}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-[#9BBACF] hover:text-[#567C8D] cursor-pointer transition-colors">
                    <Link2 size={12} />Change
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <p className="text-xs text-[#567C8D] flex-1">Authorize DevSynq to read your GitHub activity.</p>
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2F4156] text-white text-xs font-bold hover:bg-[#3a5168] transition-colors shadow-sm flex-shrink-0 min-h-[40px]">
                    <Github size={13} />Connect GitHub
                  </button>
                </div>
              )}
            </SetupCard>

            {/* LeetCode */}
            <SetupCard icon={<Code2 size={18} className="text-white" />} iconBg="#567C8D"
              title="LeetCode" subtitle="Sync problems solved, streaks, and difficulty breakdown"
              tag="Integration" status={setup.leetcodeStatus}>
              {setup.leetcodeStatus === "connected" ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C8D9E6] flex items-center justify-center flex-shrink-0">
                    <Code2 size={13} className="text-[#2F4156]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2F4156]">{setup.leetcode}</p>
                    <p className="text-xs text-[#567C8D]">LeetCode · username linked</p>
                  </div>
                  <button onClick={() => patch({ leetcodeStatus: "idle" })}
                    className="ml-auto text-xs font-semibold text-[#9BBACF] hover:text-[#567C8D] transition-colors">Edit</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input type="text" placeholder="Your LeetCode username" value={setup.leetcode}
                    onChange={e => patch({ leetcode: e.target.value })}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-[#C8D9E6] bg-[#F5EFEB] text-sm text-[#2F4156] placeholder-[#9BBACF] focus:outline-none focus:ring-2 focus:ring-[#567C8D]/40 focus:border-[#567C8D] min-h-[44px] transition-colors"
                    onKeyDown={async e => {
  if (e.key === "Enter" && setup.leetcode.trim()) {
    await connectLeetcode({ variables: { username: setup.leetcode } });
    patch({ leetcodeStatus: "connected" });
  }
}} />
                  <button
  onClick={async () => {
    if (setup.leetcode.trim()) {
      await connectLeetcode({ variables: { username: setup.leetcode } });
      patch({ leetcodeStatus: "connected" });
    }
  }}
  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm min-h-[44px] flex-shrink-0 ${setup.leetcode.trim() ? "bg-[#567C8D] text-white hover:bg-[#2F4156]" : "bg-[#C8D9E6] text-[#9BBACF] cursor-not-allowed"}`}>
  Connect
</button>
                </div>
              )}
            </SetupCard>

            {/* Habit Tracker */}
            <SetupCard icon={<Activity size={18} className="text-[#2F4156]" />} iconBg="#C8D9E6"
              title="Habit Tracker" subtitle="Start tracking habits to see your daily completion rate on the dashboard"
              tag="Built-in" status={setup.habitStatus}>
              {setup.habitStatus === "connected" ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={14} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2F4156]">First habit created</p>
                    <p className="text-xs text-[#567C8D]">Daily Coding · tracking starts today</p>
                  </div>
                  <button onClick={() => patch({ habitStatus: "idle" })}
                    className="ml-auto text-xs font-semibold text-[#9BBACF] hover:text-[#567C8D] transition-colors">Edit</button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-[#567C8D] leading-relaxed">
                    No third-party connection needed — create habits directly in DevSynq and track your streaks from the dashboard.
                  </p>
                  <input
  type="text"
  value={habitName}
  onChange={(e) => setHabitName(e.target.value)}
  placeholder="Habit name"
  className="flex-1 px-3 py-2 rounded-xl border border-[#C8D9E6]"
/>

                  <button
  onClick={async () => {
    await createHabit({
      variables: {
        name: habitName,
        targetFrequency: 1,
      },
    });

    patch({ habitStatus: "connected" });
  }}
  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#C8D9E6] bg-white text-xs font-bold text-[#2F4156] hover:bg-[#F5EFEB] hover:border-[#567C8D]/40 transition-all shadow-sm flex-shrink-0 min-h-[44px] whitespace-nowrap"
>
  <Plus size={13} />
  Create First Habit
</button>

                </div>
              )}
            </SetupCard>

            {/* W3Schools */}
            <SetupCard icon={<BookOpen size={18} className="text-[#2F4156]" />} iconBg="#C8D9E6"
              title="W3Schools" subtitle="Track your course progress and see learning momentum on the dashboard"
              tag="Built-in" status={setup.w3Status}>
              {setup.w3Status === "connected" ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={14} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2F4156]">First course added</p>
                    <p className="text-xs text-[#567C8D]">JavaScript Advanced · 0% complete</p>
                  </div>
                  <button onClick={() => patch({ w3Status: "idle" })}
                    className="ml-auto text-xs font-semibold text-[#9BBACF] hover:text-[#567C8D] transition-colors">Edit</button>
                </div>
              ) : (
<div className="flex items-center justify-between gap-4">
  <p className="text-xs text-[#567C8D] leading-relaxed">
    Add courses you are actively working through and DevSynq will show your progress over time.
  </p>
  <input
    type="text"
    value={courseName}
    onChange={(e) => setCourseName(e.target.value)}
    placeholder="Course name"
    className="flex-1 px-3 py-2 rounded-xl border border-[#C8D9E6]"
  />
  <button
    onClick={async () => {
      await addCourse({ variables: { courseName, lessonName: "Intro" } });
      patch({ w3Status: "connected" });
    }}
    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#C8D9E6] bg-white text-xs font-bold text-[#2F4156] hover:bg-[#F5EFEB] hover:border-[#567C8D]/40 transition-all shadow-sm flex-shrink-0 min-h-[44px] whitespace-nowrap">
    <Plus size={13} />Add a course
  </button>
</div>
              )}
            </SetupCard>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#2F4156] text-white text-sm font-bold hover:bg-[#3a5168] active:bg-[#567C8D] transition-colors shadow-sm min-h-[52px]"
              style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Continue to dashboard <ArrowRight size={16} />
            </button>
            <p className="text-xs text-[#9BBACF] font-medium text-center sm:text-left">
              You can finish setup later from{" "}
              <span className="text-[#567C8D] font-semibold">Settings → Integrations</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SetupPage;