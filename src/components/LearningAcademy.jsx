import React, { useState } from 'react';
import { 
  GraduationCap, CheckCircle2, ChevronRight, GitBranch, Terminal, Search, 
  ShieldCheck, Sparkles, Award, RotateCcw, Rocket, AlertTriangle
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function LearningAcademy() {
  const [activeLessonId, setActiveLessonId] = useLocalStorage('osp_active_lesson', 'codebase-navigation');
  const [completedLessons, setCompletedLessons] = useLocalStorage('osp_completed_lessons', []);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState({});

  const lessons = [
    {
      id: 'codebase-navigation',
      title: 'Reading & Navigating Massive Codebases',
      icon: Search, badge: 'Architecture', readTime: '6 min',
      content: {
        summary: 'You only need to understand ~2% of a codebase to make a high-impact contribution. Here is how to find that 2%.',
        sections: [
          { heading: '1. The 3 Architectural Entry Points', body: `Every repo has a front door:\n- **CLI Tools** (uv, gum, fzf): \`src/main.rs\`, \`cmd/root.go\`, or \`bin/\`. Follow arg parsing → subcommand dispatch.\n- **Web Libraries** (React Query, Zustand): \`src/index.ts\` or \`package.json#exports\`. Trace what's public vs internal.\n- **Backend Frameworks** (FastAPI, Caddy): Route registration table, middleware pipeline, plugin lifecycle hooks.` },
          { heading: '2. Tests as Living Specifications', body: `Docs go stale, but **unit tests never lie**.\n1. Search \`tests/\` or \`__tests__/\` for the function you need to modify.\n2. Study how maintainers set up fixtures, invoke, and assert.\n3. Write a failing test *before* changing implementation. Green = done!` },
          { heading: '3. The Breadcrumb Search Technique', body: `Don't read file-by-file. Instead:\n- Grep for exact error strings or CLI flags from the issue.\n- Use **Go to Definition (F12)** and **Find All References (Shift+F12)**.\n- Add temporary debug logs and run only the targeted test file.` },
        ],
        quiz: {
          question: 'What is the most effective way to understand expected behavior in an open source codebase?',
          options: ['Read all commit history from the first commit', 'Look at test files to see real inputs, mocks, and asserted outputs', 'Rewrite the module from scratch', 'Ask the maintainer to explain everything'],
          correctIdx: 1, explanation: 'Tests demonstrate exact contracts, inputs, and edge cases. They are executable specifications.'
        }
      }
    },
    {
      id: 'git-rebase-flow',
      title: 'Git Contribution Engine: Upstream Sync & Rebase',
      icon: GitBranch, badge: 'Git Mastery', readTime: '8 min',
      content: {
        summary: 'Contributing requires two remotes: "origin" (your fork) and "upstream" (main repo). Mastering rebase keeps your PR clean.',
        sections: [
          { heading: '1. Two-Remote Topology', body: `When you fork:\n- \`origin\` = Your fork (write access)\n- \`upstream\` = Original repo (read only)\n\n\`\`\`bash\ngit remote add upstream https://github.com/org/repo.git\ngit remote -v\n\`\`\`` },
          { heading: '2. Rebase vs Merge', body: `**Merge** creates messy "Merge branch 'main'..." commits.\n**Rebase** lifts your commits, pulls latest upstream, replays yours on top — clean linear history.\n\nMaintainers prefer rebase because it preserves git bisect accuracy.` },
          { heading: '3. Conflict Resolution', body: `\`\`\`bash\ngit fetch upstream\ngit rebase upstream/main\n# Resolve conflicts in files\ngit add <resolved-file>\ngit rebase --continue\ngit push --force-with-lease origin feature-branch\n\`\`\`` },
        ],
        quiz: {
          question: 'Why is `git push --force-with-lease` preferred over `git push --force`?',
          options: ['Prevents overwriting remote work if someone else pushed to that branch', 'Automatically merges upstream PRs', 'Bypasses CI pipelines', 'Deletes upstream master'],
          correctIdx: 0, explanation: '--force-with-lease verifies your local ref matches remote before overwriting, preventing accidental data loss.'
        }
      }
    },
    {
      id: 'maintainer-psychology',
      title: 'Maintainer Psychology & PR Acceptance',
      icon: ShieldCheck, badge: 'Etiquette', readTime: '5 min',
      content: {
        summary: 'Most maintainers are unpaid volunteers. When you make their job easy, your PRs get reviewed and merged fast.',
        sections: [
          { heading: '1. The 5 Reasons PRs Get Rejected', body: `1. **Scope Creep**: Fixing a typo AND refactoring 15 unrelated files.\n2. **No Tests**: Maintainers can't manually verify every PR.\n3. **Breaking APIs**: Changing signatures without deprecation.\n4. **Massive Diffs**: 50-line PR = 10min review. 1,500-line PR = 3 months.\n5. **No Context**: Empty description, title "Update file.ts".` },
          { heading: '2. Irresistible PR Descriptions', body: `Answer 3 questions in 30 seconds:\n- **What**: Bug fixed / feature added?\n- **Why**: Why this approach? Alternatives considered?\n- **Verify**: Exact commands or screenshots for before/after.\n- Always include \`Closes #123\`.` },
          { heading: '3. Licenses in 60 Seconds', body: `- **MIT / Apache 2.0** (Permissive): Use freely, even commercially.\n- **GPL v3 / AGPL** (Copyleft): Your project must also be open-source.\n- **No License**: All rights reserved — don't copy.` },
        ],
        quiz: {
          question: 'What is the best way to get your PR merged quickly?',
          options: ['Bundle multiple fixes into one massive PR', 'Keep it small, focused, with tests and clear description', 'Tag every maintainer on social media', 'Delete the test suite so CI passes faster'],
          correctIdx: 1, explanation: 'Small, atomic PRs with tests reduce reviewer cognitive load and regression risk.'
        }
      }
    },
    {
      id: 'tests-and-ci',
      title: 'Conquering Tests & CI/CD Pipelines',
      icon: Terminal, badge: 'Testing & CI', readTime: '7 min',
      content: {
        summary: 'CI is the automated guardian of every modern repo. Learn to run checks locally and debug pipeline failures.',
        sections: [
          { heading: '1. The Test Pyramid', body: `- **Unit Tests**: Fast, isolated (\`cargo test\`, \`pytest\`, \`npm test\`, \`go test\`).\n- **Integration Tests**: Multiple components together (DB client + mock Redis).\n- **Snapshot Tests**: Verifies serialized/rendered output matches approved baseline.` },
          { heading: '2. Pre-Commit Linters', body: `Run before committing:\n- **Node.js**: \`npm run lint && npm run format\`\n- **Python**: \`ruff check . && black .\`\n- **Rust**: \`cargo clippy && cargo fmt --check\`\n- **Go**: \`golangci-lint run && go fmt ./...\`` },
          { heading: '3. Reading CI Logs', body: `When GitHub Actions shows ❌:\n1. Click **Details** on the failing check.\n2. Scroll to the bottom — that's where the error is.\n3. Watch for OS-specific matrix failures (Windows \`\\\` vs Linux \`/\`).` },
        ],
        quiz: {
          question: 'What should you do before pushing to ensure CI passes?',
          options: ['Run local test and lint commands', 'Disable all linters', 'Let CI report failures and fix later', 'Delete the workflows directory'],
          correctIdx: 0, explanation: 'Running tests locally takes seconds and prevents simple lint errors from breaking remote CI.'
        }
      }
    },
    {
      id: 'first-pr-walkthrough',
      title: 'Your First PR — A Complete Walkthrough',
      icon: Rocket, badge: 'Practical', readTime: '10 min',
      content: {
        summary: 'A real-world end-to-end walkthrough from finding an issue to seeing your code merged into a major project.',
        sections: [
          { heading: '1. Finding the Right Issue', body: `Use OpenSource Pilot's Discover tab or manually search:\n\`\`\`\nis:open is:issue label:"good first issue" no:assignee comments:0..2 stars:100..5000\n\`\`\`\n\nLook for issues with:\n- Clear reproduction steps or specification\n- Maintainer response within 48 hours\n- File locations mentioned in the description` },
          { heading: '2. Claiming and Investigating', body: `Post a comment:\n> "Hi @maintainer, I'd like to work on this. My plan: [brief approach]. May I be assigned?"\n\nThen:\n1. Fork the repo and clone your fork.\n2. Read \`CONTRIBUTING.md\` and \`.github/PULL_REQUEST_TEMPLATE.md\`.\n3. Set up the dev environment exactly as documented.\n4. Find the relevant code using the Breadcrumb Search technique from Module 1.` },
          { heading: '3. Writing the Fix', body: `1. Create a branch: \`git checkout -b fix/issue-123-short-desc upstream/main\`\n2. Write a failing test first (TDD approach).\n3. Implement the smallest possible fix.\n4. Run the full test suite locally.\n5. Commit with Conventional Commits: \`fix: validate port range (closes #123)\`` },
          { heading: '4. Opening the PR', body: `1. Push: \`git push -u origin fix/issue-123-short-desc\`\n2. Click the link GitHub prints in your terminal.\n3. Fill in the PR template: What, Why, How to Verify.\n4. Request review if the repo uses CODEOWNERS.\n5. **Be patient** — most PRs take 2-7 days for first review.\n6. Address feedback promptly and push fixup commits.` },
        ],
        quiz: {
          question: 'After claiming an issue, what is the very first thing you should do before writing code?',
          options: ['Start implementing immediately', 'Read CONTRIBUTING.md, set up dev environment, and find the relevant code', 'Open a blank PR as a placeholder', 'Rewrite the entire module'],
          correctIdx: 1, explanation: 'Reading contribution guidelines and properly setting up the dev environment prevents most first-timer mistakes.'
        }
      }
    },
    {
      id: 'debugging-ci',
      title: 'Debugging CI Failures & Error Logs',
      icon: AlertTriangle, badge: 'Debugging', readTime: '6 min',
      content: {
        summary: 'Your code passes locally but CI shows red. Here is how to diagnose and fix the most common GitHub Actions failures.',
        sections: [
          { heading: '1. The 5 Most Common CI Failures', body: `1. **Lint / Format**: Your code style doesn't match repo standards. Fix: run the formatter.\n2. **Type Errors**: TypeScript / mypy strict mode catches more than your IDE. Fix: run type checker locally.\n3. **OS Matrix Failures**: Path separators (\`/\` vs \`\\\`), line endings (\\n vs \\r\\n). Fix: use \`path.join()\`.\n4. **Dependency Resolution**: lockfile out of sync. Fix: delete \`node_modules\` and reinstall.\n5. **Flaky Tests**: Tests pass locally but fail intermittently in CI. Fix: check for race conditions, time-dependent assertions, or missing test isolation.` },
          { heading: '2. Reading GitHub Actions Workflow Files', body: `\`\`\`yaml\n# .github/workflows/ci.yml\njobs:\n  test:\n    strategy:\n      matrix:\n        os: [ubuntu-latest, windows-latest]\n        node: [18, 20]\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n      - run: npm ci\n      - run: npm test\n\`\`\`\n\nKey: the \`matrix\` creates multiple job combinations. Your PR must pass ALL of them.` },
          { heading: '3. Reproducing CI Locally', body: `1. Match the exact Node/Python/Go version from the matrix.\n2. Use a clean checkout: \`git stash && rm -rf node_modules && npm ci\`.\n3. Run the exact commands from the workflow's \`run:\` steps.\n4. For Docker-based CI, use \`act\` to run GitHub Actions locally.` },
        ],
        quiz: {
          question: 'Your tests pass locally but fail in CI on Windows. What is the most likely cause?',
          options: ['File path separators (/ vs \\)', 'Your GitHub token expired', 'The test framework is different on Windows', 'Windows CI runners are always broken'],
          correctIdx: 0, explanation: 'Path separator differences between Unix (/) and Windows (\\) are the #1 cause of OS-matrix CI failures. Use path.join() or equivalent.'
        }
      }
    },
  ];

  const currentLesson = lessons.find(l => l.id === activeLessonId) || lessons[0];

  const handleSelectQuiz = (optIdx) => { setQuizAnswers({ ...quizAnswers, [currentLesson.id]: optIdx }); };

  const handleSubmitQuiz = () => {
    setQuizSubmitted({ ...quizSubmitted, [currentLesson.id]: true });
    if (quizAnswers[currentLesson.id] === currentLesson.content.quiz.correctIdx) {
      if (!completedLessons.includes(currentLesson.id)) {
        setCompletedLessons([...completedLessons, currentLesson.id]);
      }
    }
  };

  const handleRetryQuiz = () => {
    const copy = { ...quizSubmitted }; delete copy[currentLesson.id];
    setQuizSubmitted(copy);
    const copyA = { ...quizAnswers }; delete copyA[currentLesson.id];
    setQuizAnswers(copyA);
  };

  const handleNext = () => {
    const idx = lessons.findIndex(l => l.id === currentLesson.id);
    if (idx < lessons.length - 1) setActiveLessonId(lessons[idx + 1].id);
  };

  const handleResetProgress = () => { setCompletedLessons([]); setQuizAnswers({}); setQuizSubmitted({}); };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold mb-2">
            <GraduationCap className="w-3 h-3 text-emerald-400" /> Mastering Open Source
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">Deep-Dive Learning Academy</h2>
          <p className="text-[11px] text-slate-400 mt-1">Learn and understand deeply: architecture, git, etiquette, CI/CD, and real-world workflows.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <Award className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[11px] font-bold text-white">{completedLessons.length}/{lessons.length} Complete</div>
              <div className="w-24 bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }} />
              </div>
            </div>
          </div>
          <button onClick={handleResetProgress} className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition" title="Reset progress">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile: Horizontal pill bar for lesson selection */}
      <div className="lg:hidden scroll-fade-x-wrapper">
        <div className="scroll-fade-x flex items-center gap-1.5 pb-1">
          {lessons.map((lesson, idx) => {
            const isActive = lesson.id === currentLesson.id;
            const isComplete = completedLessons.includes(lesson.id);
            return (
              <button key={lesson.id} onClick={() => setActiveLessonId(lesson.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap shrink-0 border transition ${
                  isActive ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}>
                {isComplete && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                <span>M{idx + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* Desktop sidebar */}
        <div className="hidden lg:block space-y-1.5">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">Curriculum</h3>
          {lessons.map((lesson, idx) => {
            const Icon = lesson.icon;
            const isActive = lesson.id === currentLesson.id;
            const isComplete = completedLessons.includes(lesson.id);
            return (
              <button key={lesson.id} onClick={() => setActiveLessonId(lesson.id)}
                className={`w-full flex items-start gap-2.5 p-3 rounded-xl text-left transition border ${
                  isActive ? 'bg-indigo-600/20 border-indigo-500/60 text-white' : 'bg-slate-900/70 border-slate-800/80 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                }`}>
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[9px] text-indigo-400 uppercase font-semibold tracking-wider">Module {idx + 1}</span>
                    {isComplete && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-200 line-clamp-2 leading-snug">{lesson.title}</h4>
                  <span className="text-[9px] text-slate-500">{lesson.readTime}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Lesson Content */}
        <div className="lg:col-span-3 space-y-4 page-enter">
          
          {/* Lesson Header */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-semibold text-[11px] border border-indigo-500/30">{currentLesson.badge}</span>
              <span className="text-[11px] text-slate-400">{currentLesson.readTime}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">{currentLesson.title}</h1>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-indigo-200 leading-relaxed">
              💡 {currentLesson.content.summary}
            </div>
          </div>

          {/* Sections */}
          {currentLesson.content.sections.map((section, idx) => (
            <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-cyan-300">{section.heading}</h3>
              <div className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap">{section.body}</div>
            </div>
          ))}

          {/* Quiz */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Knowledge Check
            </div>
            <h3 className="text-xs font-bold text-white">{currentLesson.content.quiz.question}</h3>
            <div className="space-y-1.5">
              {currentLesson.content.quiz.options.map((opt, optIdx) => {
                const isSelected = quizAnswers[currentLesson.id] === optIdx;
                const isSubmitted = quizSubmitted[currentLesson.id];
                const isCorrect = optIdx === currentLesson.content.quiz.correctIdx;
                let style = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';
                if (isSubmitted) {
                  if (isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                  else if (isSelected) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
                } else if (isSelected) style = 'bg-indigo-600/30 border-indigo-500 text-white font-semibold';

                return (
                  <div key={optIdx} onClick={() => !isSubmitted && handleSelectQuiz(optIdx)}
                    className={`p-3 rounded-xl border text-[11px] cursor-pointer transition flex items-center gap-2.5 ${style}`}>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] shrink-0 ${isSelected ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-slate-600'}`}>
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <span>{opt}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
              {!quizSubmitted[currentLesson.id] ? (
                <button onClick={handleSubmitQuiz} disabled={quizAnswers[currentLesson.id] === undefined}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs transition">
                  Verify
                </button>
              ) : (
                <div className="w-full space-y-2.5">
                  <div className={`p-3 rounded-xl text-[11px] ${
                    quizAnswers[currentLesson.id] === currentLesson.content.quiz.correctIdx
                      ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/50 border border-rose-500/40 text-rose-200'
                  }`}>
                    <div className="font-bold mb-1">
                      {quizAnswers[currentLesson.id] === currentLesson.content.quiz.correctIdx ? '🎉 Correct!' : '❌ Not quite.'}
                    </div>
                    <p className="text-slate-300">{currentLesson.content.quiz.explanation}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    {quizAnswers[currentLesson.id] !== currentLesson.content.quiz.correctIdx && (
                      <button onClick={handleRetryQuiz} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800 transition">
                        <RotateCcw className="w-3 h-3" /> Try Again
                      </button>
                    )}
                    <button onClick={handleNext} className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition ml-auto">
                      Next Module <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
