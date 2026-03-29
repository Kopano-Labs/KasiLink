"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";

export default function HomeFeed() {
  return (
    <div className="min-h-screen bg-white pb-32 font-sans dark:bg-zinc-900">
      {/* Top App Bar */}
      <header className="fixed top-0 z-50 w-full border-b border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-yellow-600 dark:text-yellow-400">
              location_on
            </span>
            <h1 className="text-2xl font-black tracking-tighter text-yellow-600 dark:text-yellow-400">
              KasiLink
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 hover:bg-yellow-50 dark:hover:bg-zinc-800">
              <span className="material-symbols-outlined text-3xl text-zinc-500 dark:text-zinc-400">
                notifications
              </span>
            </button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="mx-auto mt-20 max-w-2xl space-y-8 px-4">
        {/* Load-shedding Widget */}
        <section className="relative overflow-hidden rounded-full bg-zinc-900 p-6 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black tracking-widest text-yellow-400 uppercase">
                SYSTEM STATUS
              </span>
              <h2 className="text-3xl font-black tracking-tighter">
                Stage 2 Active
              </h2>
              <p className="text-sm text-zinc-400">
                Next cut in 2h 14m • Soweto Block C
              </p>
            </div>
            <div className="rounded-full bg-yellow-400 p-4 text-black">
              <span className="material-symbols-outlined text-4xl">bolt</span>
            </div>
          </div>
        </section>

        {/* Safety Alerts */}
        <section>
          <div className="mb-4 flex items-center justify-between px-1">
            <h3 className="text-xl font-black">Nearby Safety Alerts</h3>
            <span className="text-sm font-bold text-yellow-600">
              View Map →
            </span>
          </div>
          <div className="flex snap-x gap-4 overflow-x-auto pb-4">
            <div className="flex min-w-[300px] snap-center gap-4 rounded-3xl border bg-white p-5 shadow">
              <div className="rounded-2xl bg-red-100 p-3 text-red-600">
                <span className="material-symbols-outlined text-3xl">
                  warning
                </span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs">
                  <span className="font-black text-red-600">HIGH ALERT</span>
                  <span className="text-zinc-400">12m ago</span>
                </div>
                <p className="font-bold">Water Outage Reported</p>
                <p className="text-sm text-zinc-500">
                  Maintenance on Section 4 main line
                </p>
              </div>
            </div>
            <div className="flex min-w-[300px] snap-center gap-4 rounded-3xl border bg-white p-5 shadow">
              <div className="rounded-2xl bg-green-100 p-3 text-green-600">
                <span className="material-symbols-outlined text-3xl">
                  verified_user
                </span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs">
                  <span className="font-black text-green-600">COMMUNITY</span>
                  <span className="text-zinc-400">45m ago</span>
                </div>
                <p className="font-bold">SAPS Patrol Active</p>
                <p className="text-sm text-zinc-500">
                  Increased visibility around taxi rank
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Available Gigs */}
        <section>
          <h3 className="mb-4 px-1 text-xl font-black">
            Available Gigs Nearby
          </h3>
          <div className="space-y-4">
            <div className="flex gap-4 rounded-3xl border-2 border-transparent bg-zinc-100 p-4 transition-all hover:border-yellow-400 dark:bg-zinc-800">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_-7M8-1JIvCRzgH-nkAGNnuBR7P4950P3-zobHW0eQAq97SwAR8ozfGWgLIwnwjmmNJCCAwXqmfCP4ZIwAJSYUEXA7hpqyNWiCFNPGNSkEmO1uiracREXxW__PFmAw_X8cyRF0XRDwHQ0_vbezypJWim9iPrj0Jn_HBOFgfBYsz_ignzhN9RNr4x4VAZJrcX9pb3VLolMx20JxV1LLmX1nyvYqoa_6uJxV2sDPW37rIZAlm3B1qubPoPBKCrjV-sNF9JkM9IDC4-d"
                alt="Car Wash"
                className="h-16 w-16 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-bold">Express Exterior Wash</h4>
                  <span className="font-black text-yellow-600">R120</span>
                </div>
                <div className="mt-1 flex gap-4 text-xs text-zinc-500">
                  <span>0.8 km</span>
                  <span className="flex items-center gap-1">
                    ⭐ <span className="font-bold text-yellow-600">4.9</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 rounded-3xl border-2 border-transparent bg-zinc-100 p-4 transition-all hover:border-yellow-400 dark:bg-zinc-800">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6frYkPdRWX2eW0-dpTlzUcIk62fSXNDQ_G6jId_JfFxH22pMEV05ZkU8qGvU8yEngTS5d0eCPjBn0EPfO4ZyUKXPRdBI3Rc3cyKNxGh-9TKALKSDQAiPem8EE5LXkPWe91MeKKl0f4fm3NahOyTjNcx1Ggr9cdPVmGcO4sthI77SXh0tq_C6HlqIGqeV4AturbR6VgVgCvE7SWB47guxLw9O5ToRlUYPy_nVrqjpCz6zPY_6JDyIQ4aMn8TUbAo6Oc0MTuD6KgMs2"
                alt="Tutoring"
                className="h-16 w-16 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-bold">Maths Grade 10-12</h4>
                  <span className="font-black text-yellow-600">R200/hr</span>
                </div>
                <div className="mt-1 flex gap-4 text-xs text-zinc-500">
                  <span>1.2 km</span>
                  <span className="flex items-center gap-1">
                    ⭐ <span className="font-bold text-yellow-600">5.0</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Story */}
        <section className="relative h-72 overflow-hidden rounded-3xl bg-zinc-900">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7AF3YuAdPVxmT7pxef-NnpP7JIpB43g5eORIJNhL9-lbkAcUYrUBrvWmbReZuiQbcvYqGf3ldEh8Hev61konBQ1C51tMUUbqnUpu9-vzs0lsZPvKzFqn0wq3fxFS3P7lVV4OjBRYvObjoCwjqYk1jE8r_tbxeSbDu36_T0IZrXQXsZXcBYuigpeM8udXGrYwSN6XYOi8Ip_v7BUV6tHVSKIU64PSpUrrTWu3TDSoYzcr0KbQWm7zE7sxbSEgjR72IJt_ScaDrVhL1"
            alt="Success Story"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
          <div className="absolute bottom-0 p-8 text-white">
            <span className="rounded-full bg-yellow-400 px-4 py-1 text-xs font-black text-black">
              LOCAL HERO
            </span>
            <h3 className="mt-3 text-2xl leading-tight font-black">
              How Mam’ Thandi built her bakery using Gigs
            </h3>
            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-3xl bg-yellow-400 py-4 font-black text-black">
              Read Story{" "}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed right-0 bottom-0 left-0 z-50 flex h-20 items-center justify-around rounded-t-3xl border-t border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <button className="flex flex-col items-center text-yellow-600">
          <span className="material-symbols-outlined text-3xl">home</span>
          <span className="text-xs font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center text-zinc-400">
          <span className="material-symbols-outlined text-3xl">work</span>
          <span className="text-xs font-medium">Gigs</span>
        </button>
        <button className="flex flex-col items-center text-zinc-400">
          <span className="material-symbols-outlined text-3xl">warning</span>
          <span className="text-xs font-medium">Alerts</span>
        </button>
        <button className="flex flex-col items-center text-zinc-400">
          <span className="material-symbols-outlined text-3xl">chat</span>
          <span className="text-xs font-medium">Chat</span>
        </button>
        <button className="flex flex-col items-center text-zinc-400">
          <span className="material-symbols-outlined text-3xl">person</span>
          <span className="text-xs font-medium">Profile</span>
        </button>
      </nav>

      {/* FAB */}
      <button className="fixed right-6 bottom-24 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400 text-4xl text-black shadow-2xl transition-transform active:scale-95">
        +
      </button>
    </div>
  );
}
