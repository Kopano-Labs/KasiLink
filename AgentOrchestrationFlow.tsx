import Image from "next/image";

export default function AgentOrchestrationFlow() {
  return (
    <div className="bg-background font-body text-on-background min-h-screen pb-20">
      {/* TopAppBar */}
      <header className="docked full-width sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-neutral-200 bg-white px-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-yellow-500 dark:text-yellow-400"
            data-icon="hub"
          >
            hub
          </span>
          <h1 className="font-headline text-xl font-black tracking-tight text-yellow-600 dark:text-yellow-400">
            KasiLink
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-6 md:flex">
            <a
              className="rounded-lg px-3 py-2 font-bold text-yellow-600 transition-colors hover:bg-neutral-100 dark:text-yellow-400 dark:hover:bg-neutral-800"
              href="#"
            >
              Flows
            </a>
            <a
              className="rounded-lg px-3 py-2 text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              href="#"
            >
              Agents
            </a>
            <a
              className="rounded-lg px-3 py-2 text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              href="#"
            >
              API
            </a>
          </div>
          <div className="bg-surface-container-highest border-primary-container relative h-10 w-10 overflow-hidden rounded-full border-2">
            <Image
              alt="User profile"
              data-alt="minimalist 3d avatar of a professional developer with glasses and yellow hoodie clean background"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAN6bkpAC3dcbP4riAyZ2XmROjA8rr_t-t_c4wMxRF_p1YITGOTdaL0zWLa1ETSMdFrhbWmHE0TuFrNtpm5VwsFlX1Li0YKkg-yLopUf946KLdWaer6D6azwtkS3y0Yo8ZtaCwY-sRs6wgiyh2-M_td3Svb1XKdcqQUeYERRQ4H4DPnD3lQyDfZcl4Psp-HVNUrLkDqC4jGlyap4YiACu6r002gXjnl1cLMWKJ3BUfEaDZer_CToouy289xzypcnZhzLXt9Pxjq92WB"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h2 className="font-headline text-on-surface mb-4 text-4xl font-black">
            Agent Orchestration Pipeline
          </h2>
          <p className="text-on-surface-variant font-label mx-auto max-w-2xl text-lg italic opacity-80">
            Visualizing the logical flow from command ingestion to distributed
            intelligence and processed insights.
          </p>
        </div>
        {/* Flowchart Container (Bento Style) */}
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* STEP 1: INPUT LAYER */}
          <div className="space-y-6 md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <span className="bg-primary-container text-on-primary-container flex h-8 w-8 items-center justify-center rounded-full font-bold">
                1
              </span>
              <h3 className="font-headline text-outline text-sm font-bold tracking-wider uppercase">
                Input Layer
              </h3>
            </div>
            {/* CLI Commands Node */}
            <div className="border-outline-variant hover:border-primary group rounded-xl border bg-white p-6 shadow-sm transition-all">
              <div className="mb-4 flex items-center gap-4">
                <div className="bg-primary-container flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-110">
                  <span
                    className="material-symbols-outlined text-primary"
                    data-icon="terminal"
                  >
                    terminal
                  </span>
                </div>
                <h4 className="font-bold">CLI Commands</h4>
              </div>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Direct system-level execution strings captured via secure shell.
              </p>
            </div>
            {/* Messaging Bridge Node */}
            <div className="border-outline-variant hover:border-primary group rounded-xl border bg-white p-6 shadow-sm transition-all">
              <div className="mb-4 flex items-center gap-4">
                <div className="bg-primary-container flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-110">
                  <span
                    className="material-symbols-outlined text-primary"
                    data-icon="account_tree"
                  >
                    account_tree
                  </span>
                </div>
                <h4 className="font-bold">Messaging Bridge</h4>
              </div>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                External API webhooks and cross-platform message ingestion.
              </p>
            </div>
          </div>
          {/* STEP 2: AUDIT LAYER */}
          <div className="space-y-6 md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <span className="bg-primary-container text-on-primary-container flex h-8 w-8 items-center justify-center rounded-full font-bold">
                2
              </span>
              <h3 className="font-headline text-outline text-sm font-bold tracking-wider uppercase">
                Audit Layer
              </h3>
            </div>
            <div className="bg-surface-container-low border-outline-variant relative overflow-hidden rounded-xl border-2 border-dashed p-6">
              <div className="absolute top-0 right-0 p-2">
                <span
                  className="material-symbols-outlined text-primary/20 scale-150"
                  data-icon="verified_user"
                >
                  verified_user
                </span>
              </div>
              <div className="space-y-8">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <span
                      className="material-symbols-outlined text-secondary text-sm"
                      data-icon="settings_input_component"
                    >
                      settings_input_component
                    </span>
                    <span className="text-sm font-bold">CLI Controller</span>
                  </div>
                  <div className="bg-outline-variant h-1 w-full rounded-full">
                    <div className="bg-primary h-full w-2/3 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <span
                      className="material-symbols-outlined text-secondary text-sm"
                      data-icon="receipt_long"
                    >
                      receipt_long
                    </span>
                    <span className="text-sm font-bold">Audit Logger</span>
                  </div>
                  <div className="border-outline-variant/30 rounded border bg-white/50 p-2 font-mono text-[10px]">
                    <p>&gt; REQ_ID: 9928-AX</p>
                    <p>&gt; AUTH: SUCCESS</p>
                    <p>&gt; LOGGING STATE...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* STEP 3: THE BRAIN */}
          <div className="space-y-6 md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <span className="bg-primary-container text-on-primary-container flex h-8 w-8 items-center justify-center rounded-full font-bold">
                3
              </span>
              <h3 className="font-headline text-outline text-sm font-bold tracking-wider uppercase">
                The Brain
              </h3>
            </div>
            <div className="bg-primary-container shadow-primary/10 rounded-2xl p-1 shadow-lg">
              <div className="rounded-xl bg-white p-6">
                <div className="mb-6 flex flex-col items-center">
                  <span
                    className="material-symbols-outlined text-primary mb-2 text-4xl"
                    data-icon="psychology"
                  >
                    psychology
                  </span>
                  <h4 className="text-primary text-center leading-none font-black">
                    Agent Manager
                  </h4>
                  <span className="text-outline-variant mt-1 text-[10px] font-bold tracking-widest uppercase">
                    Core Router
                  </span>
                </div>
                <div className="space-y-3">
                  {/* Gemini */}
                  <div className="bg-surface hover:bg-primary-fixed border-outline-variant/20 flex items-center justify-between rounded-lg border p-3 transition-colors">
                    <span className="text-xs font-bold">Gemini Adapter</span>
                    <span
                      className="material-symbols-outlined text-sm"
                      data-icon="star"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      star
                    </span>
                  </div>
                  {/* Grok */}
                  <div className="bg-surface hover:bg-primary-fixed border-outline-variant/20 flex items-center justify-between rounded-lg border p-3 transition-colors">
                    <span className="text-xs font-bold">Grok Adapter</span>
                    <span
                      className="material-symbols-outlined text-sm"
                      data-icon="bolt"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      bolt
                    </span>
                  </div>
                  {/* Claude */}
                  <div className="bg-surface hover:bg-primary-fixed border-outline-variant/20 flex items-center justify-between rounded-lg border p-3 transition-colors">
                    <span className="text-xs font-bold">Claude Adapter</span>
                    <span
                      className="material-symbols-outlined text-sm"
                      data-icon="auto_awesome"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      auto_awesome
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* STEP 4: OUTPUT & LEARNING */}
          <div className="space-y-6 md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <span className="bg-primary-container text-on-primary-container flex h-8 w-8 items-center justify-center rounded-full font-bold">
                4
              </span>
              <h3 className="font-headline text-outline text-sm font-bold tracking-wider uppercase">
                Output Layer
              </h3>
            </div>
            <div className="space-y-4">
              {/* Learning Engine */}
              <div className="bg-secondary rounded-xl p-6 text-white">
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-primary-container"
                    data-icon="model_training"
                  >
                    model_training
                  </span>
                  <h4 className="font-bold">Learning Engine</h4>
                </div>
                <p className="mb-4 text-[11px] leading-relaxed opacity-80">
                  Extracting recursive insights and updating behavioral weights.
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-sm"
                    data-icon="database"
                  >
                    database
                  </span>
                  <span className="font-mono text-xs">MongoDB Cluster</span>
                </div>
              </div>
              {/* Final Response */}
              <div className="border-primary-container relative rounded-xl border-4 bg-white p-6">
                <div className="bg-primary absolute -top-3 left-4 rounded px-2 py-0.5 text-[10px] font-black text-white">
                  DELIVERY
                </div>
                <div className="mb-2 flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-secondary"
                    data-icon="send"
                  >
                    send
                  </span>
                  <h4 className="font-bold">Final Response</h4>
                </div>
                <div className="space-y-1">
                  <div className="bg-outline-variant/20 h-1.5 w-full rounded"></div>
                  <div className="bg-outline-variant/20 h-1.5 w-3/4 rounded"></div>
                  <div className="bg-outline-variant/20 h-1.5 w-5/6 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative Info Cards */}
        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/50 bg-white/40 p-6 backdrop-blur-sm">
            <h5 className="font-headline text-secondary mb-2 flex items-center gap-2 font-bold">
              <span
                className="material-symbols-outlined text-lg"
                data-icon="speed"
              >
                speed
              </span>
              Latency Optimization
            </h5>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Parallel processing across model adapters ensures sub-500ms
              orchestration cycles even for complex queries.
            </p>
          </div>
          <div className="rounded-2xl border border-white/50 bg-white/40 p-6 backdrop-blur-sm">
            <h5 className="font-headline text-secondary mb-2 flex items-center gap-2 font-bold">
              <span
                className="material-symbols-outlined text-lg"
                data-icon="security"
              >
                security
              </span>
              Trust Boundaries
            </h5>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              The Audit Layer enforces strict zero-trust validation before
              requests ever reach the Agent Manager brain.
            </p>
          </div>
          <div className="rounded-2xl border border-white/50 bg-white/40 p-6 backdrop-blur-sm">
            <h5 className="font-headline text-secondary mb-2 flex items-center gap-2 font-bold">
              <span
                className="material-symbols-outlined text-lg"
                data-icon="update"
              >
                update
              </span>
              Real-time Evolution
            </h5>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Our Learning Engine maps feedback loops directly into MongoDB,
              allowing agents to evolve without redeploys.
            </p>
          </div>
        </div>
      </main>
      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-neutral-200 bg-white px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden dark:border-neutral-800 dark:bg-neutral-900">
        <a
          className="flex flex-col items-center justify-center rounded-xl bg-yellow-100 px-3 py-1 text-yellow-700 transition-all duration-200 ease-in-out dark:bg-yellow-900/30 dark:text-yellow-200"
          href="#"
        >
          <span className="material-symbols-outlined" data-icon="account_tree">
            account_tree
          </span>
          <span className="font-publicSans text-xs">Flows</span>
        </a>
        <a
          className="flex flex-col items-center justify-center px-3 py-1 text-neutral-500 transition-all duration-200 ease-in-out hover:text-yellow-600 dark:text-neutral-400 dark:hover:text-yellow-300"
          href="#"
        >
          <span className="material-symbols-outlined" data-icon="smart_toy">
            smart_toy
          </span>
          <span className="font-publicSans text-xs">Agents</span>
        </a>
        <a
          className="flex flex-col items-center justify-center px-3 py-1 text-neutral-500 transition-all duration-200 ease-in-out hover:text-yellow-600 dark:text-neutral-400 dark:hover:text-yellow-300"
          href="#"
        >
          <span className="material-symbols-outlined" data-icon="api">
            api
          </span>
          <span className="font-publicSans text-xs">API</span>
        </a>
        <a
          className="flex flex-col items-center justify-center px-3 py-1 text-neutral-500 transition-all duration-200 ease-in-out hover:text-yellow-600 dark:text-neutral-400 dark:hover:text-yellow-300"
          href="#"
        >
          <span className="material-symbols-outlined" data-icon="settings">
            settings
          </span>
          <span className="font-publicSans text-xs">Settings</span>
        </a>
      </nav>
    </div>
  );
}
