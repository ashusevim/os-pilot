export const CURATED_ISSUES = [
  {
    id: 101, title: "Add dark mode toggle support in Documentation portal",
    html_url: "https://github.com/astral-sh/uv/issues/1042", repository_url: "https://api.github.com/repos/astral-sh/uv",
    repo_name: "astral-sh/uv", repo_stars: 41200, repo_description: "An extremely fast Python package and project manager, written in Rust.",
    language: "Rust", created_at: "2025-02-10T14:20:00Z", updated_at: "2025-02-14T09:12:00Z", comments: 2, state: "open",
    user: { login: "charliermarsh", avatar_url: "https://avatars.githubusercontent.com/u/1309177?v=4" },
    labels: [{ name: "good first issue", color: "7057ff" }, { name: "documentation", color: "0075ca" }, { name: "help wanted", color: "008672" }],
    assignees: [], body: "### Description\nThe current documentation site does not support system-preference dark mode switching.\n\n### Scope\n- Update VitePress theme configuration.\n- Add CSS variables for dark theme.\n\n### Where to look\nCheck `docs/theme.config.tsx` and `docs/styles/main.css`.",
    viabilityScore: 96, difficulty: "Beginner", estimatedTime: "1-2 hours", whyGood: "Clear scope, self-contained docs styling, high maintainer responsiveness.", category: "docs"
  },
  {
    id: 102, title: "CLI: Add `--json` flag to `status` command for CI parsing",
    html_url: "https://github.com/charmbracelet/gum/issues/845", repository_url: "https://api.github.com/repos/charmbracelet/gum",
    repo_name: "charmbracelet/gum", repo_stars: 18500, repo_description: "A tool for glamorous shell scripts 🎀",
    language: "Go", created_at: "2025-02-11T16:40:00Z", updated_at: "2025-02-15T11:05:00Z", comments: 1, state: "open",
    user: { login: "meowgorithm", avatar_url: "https://avatars.githubusercontent.com/u/25087?v=4" },
    labels: [{ name: "good first issue", color: "7057ff" }, { name: "enhancement", color: "a2eeef" }],
    assignees: [], body: "### Feature Request\nAdd `--json` flag to `gum status` for machine-readable output.\n\n### Files to touch\n- `status/options.go`\n- `status/main.go`\n- `status/main_test.go`",
    viabilityScore: 94, difficulty: "Beginner", estimatedTime: "2-3 hours", whyGood: "Small self-contained Go CLI flag with existing test fixtures.", category: "cli-devtools"
  },
  {
    id: 103, title: "Provide TypeScript generics for `useQueryClient` hook",
    html_url: "https://github.com/TanStack/query/issues/6890", repository_url: "https://api.github.com/repos/TanStack/query",
    repo_name: "TanStack/query", repo_stars: 43000, repo_description: "🤖 Powerful asynchronous state management for the web.",
    language: "TypeScript", created_at: "2025-02-12T10:00:00Z", updated_at: "2025-02-15T14:30:00Z", comments: 3, state: "open",
    user: { login: "TkDodo", avatar_url: "https://avatars.githubusercontent.com/u/1021430?v=4" },
    labels: [{ name: "good first issue", color: "7057ff" }, { name: "typescript", color: "2b7489" }],
    assignees: [], body: "### Type Improvement\n`useQueryClient()` should forward generic TClient parameter.\n\n### Location\n`packages/react-query/src/useQueryClient.ts`",
    viabilityScore: 92, difficulty: "Intermediate", estimatedTime: "1-2 hours", whyGood: "Direct type-level enhancement, quick Vitest feedback.", category: "good-first-issue"
  },
  {
    id: 104, title: "Support streaming token callback in Ollama LLM adapter",
    html_url: "https://github.com/langchain-ai/langchainjs/issues/4912", repository_url: "https://api.github.com/repos/langchain-ai/langchainjs",
    repo_name: "langchain-ai/langchainjs", repo_stars: 14800, repo_description: "🦜🔗 Build context-aware reasoning applications in JS/TS",
    language: "TypeScript", created_at: "2025-02-13T08:15:00Z", updated_at: "2025-02-15T18:00:00Z", comments: 2, state: "open",
    user: { login: "jacoblee93", avatar_url: "https://avatars.githubusercontent.com/u/3820256?v=4" },
    labels: [{ name: "good first issue", color: "7057ff" }, { name: "ai", color: "fbca04" }],
    assignees: [], body: "### Context\nStreaming from Ollama `/api/generate` should trigger `handleLLMNewToken` callback.\n\n### Steps\n1. Check `libs/langchain-community/src/llms/ollama.ts`\n2. Verify callback invocation\n3. Add test in `ollama.int.test.ts`",
    viabilityScore: 90, difficulty: "Intermediate", estimatedTime: "2-3 hours", whyGood: "Modern AI stack, great learning for async iterators.", category: "ai-ml"
  },
  {
    id: 105, title: "Fix broken markdown table in Contributing Guidelines",
    html_url: "https://github.com/fastapi/fastapi/issues/11290", repository_url: "https://api.github.com/repos/fastapi/fastapi",
    repo_name: "fastapi/fastapi", repo_stars: 79000, repo_description: "FastAPI framework, high performance, ready for production",
    language: "Python", created_at: "2025-02-14T11:20:00Z", updated_at: "2025-02-15T09:40:00Z", comments: 0, state: "open",
    user: { login: "tiangolo", avatar_url: "https://avatars.githubusercontent.com/u/1326112?v=4" },
    labels: [{ name: "documentation", color: "0075ca" }, { name: "good first issue", color: "7057ff" }],
    assignees: [], body: "### Issue\nUnescaped pipe `|` in row 4 of `docs/en/docs/contributing.md` breaks the table render.\n\n### Fix\nEscape with `\\|` or wrap in backticks. Verify with `mkdocs serve`.",
    viabilityScore: 98, difficulty: "Beginner", estimatedTime: "30 mins", whyGood: "Extremely low barrier, quick victory on a 79k+ star repo!", category: "docs"
  },
  {
    id: 106, title: "Add validation for negative port numbers in proxy config",
    html_url: "https://github.com/caddyserver/caddy/issues/6204", repository_url: "https://api.github.com/repos/caddyserver/caddy",
    repo_name: "caddyserver/caddy", repo_stars: 57000, repo_description: "Fast HTTP/1-2-3 web server with automatic HTTPS",
    language: "Go", created_at: "2025-02-13T19:30:00Z", updated_at: "2025-02-14T22:15:00Z", comments: 1, state: "open",
    user: { login: "mholt", avatar_url: "https://avatars.githubusercontent.com/u/1128849?v=4" },
    labels: [{ name: "bug", color: "d73a4a" }, { name: "good first issue", color: "7057ff" }],
    assignees: [], body: "### Bug\nNegative port `reverse_proxy localhost:-8080` crashes on dial instead of validation error.\n\n### Code\n`modules/caddyhttp/reverseproxy/caddyfile.go` in `parseUpstream`.",
    viabilityScore: 95, difficulty: "Beginner", estimatedTime: "1-2 hours", whyGood: "Clear reproduction, simple range check, clean Go codebase.", category: "bug-fixes"
  },
  {
    id: 107, title: "Implement LRU Cache TTL expiration event listener",
    html_url: "https://github.com/redis/node-redis/issues/2890", repository_url: "https://api.github.com/repos/redis/node-redis",
    repo_name: "redis/node-redis", repo_stars: 16500, repo_description: "High-performance Node.js Redis client",
    language: "JavaScript", created_at: "2025-02-14T07:10:00Z", updated_at: "2025-02-15T15:20:00Z", comments: 1, state: "open",
    user: { login: "leibale", avatar_url: "https://avatars.githubusercontent.com/u/1487834?v=4" },
    labels: [{ name: "help wanted", color: "008672" }, { name: "good first issue", color: "7057ff" }],
    assignees: [], body: "### Description\nEmit `cache:expire` event when TTL expires.\n\n### Acceptance\n- Emit in timer callback\n- Add test verifying event fires",
    viabilityScore: 91, difficulty: "Intermediate", estimatedTime: "2 hours", whyGood: "EventEmitter pattern practice, practical backend utility.", category: "help-wanted"
  },
  {
    id: 108, title: "Collapse left margin in side-by-side diff when line numbers disabled",
    html_url: "https://github.com/dandavison/delta/issues/1532", repository_url: "https://api.github.com/repos/dandavison/delta",
    repo_name: "dandavison/delta", repo_stars: 24000, repo_description: "A syntax-highlighting pager for git, diff, and grep output",
    language: "Rust", created_at: "2025-02-15T02:00:00Z", updated_at: "2025-02-15T16:45:00Z", comments: 0, state: "open",
    user: { login: "dandavison", avatar_url: "https://avatars.githubusercontent.com/u/52205?v=4" },
    labels: [{ name: "good first issue", color: "7057ff" }, { name: "cli", color: "1d76db" }],
    assignees: [], body: "### Feature\nWhen `--line-numbers=false`, collapse left padding.\n\n### Guidance\nCheck `src/paint.rs` and `src/draw.rs` — `compute_line_number_width`.",
    viabilityScore: 93, difficulty: "Intermediate", estimatedTime: "2-3 hours", whyGood: "Well organized Rust repo with snapshot testing.", category: "cli-devtools"
  },
  // ── NEW ISSUES ─────────────────────────────────────────────────
  {
    id: 109, title: "Add type-safe route params to SvelteKit load functions",
    html_url: "https://github.com/sveltejs/kit/issues/12801", repository_url: "https://api.github.com/repos/sveltejs/kit",
    repo_name: "sveltejs/kit", repo_stars: 18700, repo_description: "web development, streamlined",
    language: "TypeScript", created_at: "2025-03-10T09:00:00Z", updated_at: "2025-03-14T11:30:00Z", comments: 2, state: "open",
    user: { login: "Rich-Harris", avatar_url: "https://avatars.githubusercontent.com/u/1162160?v=4" },
    labels: [{ name: "good first issue", color: "7057ff" }, { name: "types", color: "2b7489" }],
    assignees: [], body: "### Context\nRoute params in `+page.server.ts` load functions lack proper generic inference.\n\n### Location\n`packages/kit/src/types/private.d.ts`",
    viabilityScore: 91, difficulty: "Intermediate", estimatedTime: "2-3 hours", whyGood: "Type-level work in a major web framework.", category: "good-first-issue"
  },
  {
    id: 110, title: "Add shell completion for `bun install --save-exact`",
    html_url: "https://github.com/oven-sh/bun/issues/9421", repository_url: "https://api.github.com/repos/oven-sh/bun",
    repo_name: "oven-sh/bun", repo_stars: 75000, repo_description: "Incredibly fast JavaScript runtime, bundler, test runner",
    language: "Zig", created_at: "2025-03-05T14:00:00Z", updated_at: "2025-03-12T08:00:00Z", comments: 1, state: "open",
    user: { login: "Jarred-Sumner", avatar_url: "https://avatars.githubusercontent.com/u/709451?v=4" },
    labels: [{ name: "good first issue", color: "7057ff" }, { name: "cli", color: "1d76db" }],
    assignees: [], body: "### Feature\nAdd `--save-exact` to `bun install` shell completions for bash/zsh/fish.\n\n### Location\n`completions/` directory.",
    viabilityScore: 95, difficulty: "Beginner", estimatedTime: "1 hour", whyGood: "Extremely focused scope — just shell completions.", category: "cli-devtools"
  },
  {
    id: 111, title: "Improve error message when Pydantic model has duplicate field names",
    html_url: "https://github.com/pydantic/pydantic/issues/9102", repository_url: "https://api.github.com/repos/pydantic/pydantic",
    repo_name: "pydantic/pydantic", repo_stars: 21000, repo_description: "Data validation using Python type annotations",
    language: "Python", created_at: "2025-03-08T10:00:00Z", updated_at: "2025-03-13T16:00:00Z", comments: 0, state: "open",
    user: { login: "samuelcolvin", avatar_url: "https://avatars.githubusercontent.com/u/4039449?v=4" },
    labels: [{ name: "good first issue", color: "7057ff" }, { name: "bug", color: "d73a4a" }],
    assignees: [], body: "### Bug\nDuplicate field names produce a cryptic `TypeError`. Should raise `PydanticUserError` with field name.\n\n### Location\n`pydantic/_internal/_fields.py`",
    viabilityScore: 94, difficulty: "Beginner", estimatedTime: "1-2 hours", whyGood: "Clear error handling improvement in trending Python lib.", category: "bug-fixes"
  },
  {
    id: 112, title: "Add dark mode support to Tauri app scaffold templates",
    html_url: "https://github.com/tauri-apps/tauri/issues/10415", repository_url: "https://api.github.com/repos/tauri-apps/tauri",
    repo_name: "tauri-apps/tauri", repo_stars: 85000, repo_description: "Build smaller, faster, secure desktop & mobile apps with web frontends",
    language: "Rust", created_at: "2025-03-11T13:00:00Z", updated_at: "2025-03-15T09:00:00Z", comments: 3, state: "open",
    user: { login: "FabianLars", avatar_url: "https://avatars.githubusercontent.com/u/16854784?v=4" },
    labels: [{ name: "good first issue", color: "7057ff" }, { name: "documentation", color: "0075ca" }],
    assignees: [], body: "### Feature\nScaffold templates (`create-tauri-app`) should include CSS `prefers-color-scheme` media query.\n\n### Location\n`packages/create-tauri-app/templates/`",
    viabilityScore: 93, difficulty: "Beginner", estimatedTime: "1 hour", whyGood: "Template CSS work on 85k star cross-platform framework.", category: "docs"
  },
  {
    id: 113, title: "Add retry mechanism for flaky HTTP health checks in Spring Boot Actuator",
    html_url: "https://github.com/spring-projects/spring-boot/issues/39201", repository_url: "https://api.github.com/repos/spring-projects/spring-boot",
    repo_name: "spring-projects/spring-boot", repo_stars: 75000, repo_description: "Spring Boot helps create Spring-powered apps with minimal effort",
    language: "Java", created_at: "2025-03-09T11:00:00Z", updated_at: "2025-03-14T14:00:00Z", comments: 2, state: "open",
    user: { login: "wilkinsona", avatar_url: "https://avatars.githubusercontent.com/u/914682?v=4" },
    labels: [{ name: "good first issue", color: "7057ff" }, { name: "enhancement", color: "a2eeef" }],
    assignees: [], body: "### Feature\nAdd configurable retry for `ReactiveHealthIndicator` HTTP checks.\n\n### Location\n`spring-boot-actuator/src/main/java/org/springframework/boot/actuate/health/`",
    viabilityScore: 88, difficulty: "Intermediate", estimatedTime: "3-4 hours", whyGood: "Enterprise-grade Java contribution on the biggest Spring project.", category: "help-wanted"
  },
  {
    id: 114, title: "Fix PHP 8.3 deprecation warnings in Eloquent query scopes",
    html_url: "https://github.com/laravel/framework/issues/50123", repository_url: "https://api.github.com/repos/laravel/framework",
    repo_name: "laravel/framework", repo_stars: 33000, repo_description: "The PHP Framework for Web Artisans",
    language: "PHP", created_at: "2025-03-07T08:00:00Z", updated_at: "2025-03-13T12:00:00Z", comments: 1, state: "open",
    user: { login: "taylorotwell", avatar_url: "https://avatars.githubusercontent.com/u/463230?v=4" },
    labels: [{ name: "good first issue", color: "7057ff" }, { name: "bug", color: "d73a4a" }],
    assignees: [], body: "### Bug\nPHP 8.3 deprecation of `${var}` interpolation in query scopes.\n\n### Fix\nReplace with `{$var}` syntax in `src/Illuminate/Database/Eloquent/`.",
    viabilityScore: 96, difficulty: "Beginner", estimatedTime: "1 hour", whyGood: "Simple string syntax fix across Laravel's most popular package.", category: "bug-fixes"
  },
  {
    id: 115, title: "Add Kotlin DSL example to Ktor authentication documentation",
    html_url: "https://github.com/ktorio/ktor/issues/4210", repository_url: "https://api.github.com/repos/ktorio/ktor",
    repo_name: "ktorio/ktor", repo_stars: 13000, repo_description: "Framework for quickly creating connected applications in Kotlin",
    language: "Kotlin", created_at: "2025-03-06T15:00:00Z", updated_at: "2025-03-12T10:00:00Z", comments: 0, state: "open",
    user: { login: "e5l", avatar_url: "https://avatars.githubusercontent.com/u/6065162?v=4" },
    labels: [{ name: "documentation", color: "0075ca" }, { name: "good first issue", color: "7057ff" }],
    assignees: [], body: "### Task\nAdd Kotlin DSL code examples for JWT auth in `ktor-documentation/codeSnippets/snippets/auth-jwt/`.\n\n### Guidance\nFollow existing patterns in `auth-basic/` snippet.",
    viabilityScore: 94, difficulty: "Beginner", estimatedTime: "1-2 hours", whyGood: "Documentation example for Kotlin server framework.", category: "docs"
  },
  {
    id: 116, title: "Add `--format=table` output to Ruff linter CLI",
    html_url: "https://github.com/astral-sh/ruff/issues/14320", repository_url: "https://api.github.com/repos/astral-sh/ruff",
    repo_name: "astral-sh/ruff", repo_stars: 35000, repo_description: "An extremely fast Python linter and code formatter, written in Rust.",
    language: "Rust", created_at: "2025-03-12T08:00:00Z", updated_at: "2025-03-15T14:00:00Z", comments: 1, state: "open",
    user: { login: "charliermarsh", avatar_url: "https://avatars.githubusercontent.com/u/1309177?v=4" },
    labels: [{ name: "good first issue", color: "7057ff" }, { name: "enhancement", color: "a2eeef" }],
    assignees: [], body: "### Feature\nAdd `--format=table` to display lint violations as aligned ASCII table.\n\n### Location\n`crates/ruff_cli/src/printer.rs`",
    viabilityScore: 91, difficulty: "Intermediate", estimatedTime: "2-3 hours", whyGood: "High-impact Rust CLI feature on a trending 35k star project.", category: "cli-devtools"
  },
];
