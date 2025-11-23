import { ChevronRightIcon } from '@heroicons/react/20/solid';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gray-50 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-8 lg:items-center">
          
          {/* LEFT COLUMN: Text Content */}
          <div className="max-w-lg lg:max-w-none">
            {/* Logo Placeholder */}
            {/* <div className="mb-8">
              <svg
                className="h-10 w-auto text-blue-600"
                viewBox="0 0 50 50"
                fill="currentColor"
              >
                <path d="M25 2C12.299 2 2 12.299 2 25s10.299 23 23 23 23-10.299 23-23S37.701 2 25 2zm0 42C14.514 42 6 33.486 6 23S14.514 4 25 4s19 8.514 19 19-8.514 19-19 19z" />
                <path d="M25 10c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15s15-6.716 15-15c0-8.284-6.716-15-15-15zm0 26c-6.075 0-11-4.925-11-11s4.925-11 11-11 11 4.925 11 11-4.925 11-11 11z" />
              </svg>
            </div> */}

            {/* Notification Badge */}
            <div className="flex items-center space-x-2 mb-8">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/20">
                What's new
              </span>
              <span className="inline-flex items-center text-sm font-medium text-gray-500">
                Just shipped v1.0
                <ChevronRightIcon className="ml-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Simply Track Your Jobs!
            </h1>

            {/* Subtext */}
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Applyo is a lightweight browser extension and web dashboard that helps you stay organized throughout your job hunt. Capture job listings instantly with an all in one clean, modern interface.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex items-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
              >
                Documentation
              </a>
              <a
                href="#"
                className="flex items-center text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
              >
                View on GitHub <span aria-hidden="true" className="ml-2">→</span>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Code Illustration */}
          <div className="relative mt-10 lg:mt-0 lg:col-span-1">
            
            {/* The Blue Glow/Background Shape - Changed from Indigo/Purple to Blue/Cyan */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-3xl opacity-20 blur-2xl lg:opacity-30"></div>
            
            {/* The Code Window Container - Kept dark for contrast, but borders refined */}
            <div className="relative rounded-xl bg-gray-900 shadow-2xl ring-1 ring-gray-900/10">
              
              {/* Window Header / Tabs */}
              <div className="flex border-b border-white/10 bg-gray-800/50 rounded-t-xl">
                <div className="flex items-center px-4 py-3 border-b-2 border-blue-500 bg-gray-800">
                  <span className="text-sm font-medium text-gray-200">NotificationSetting.jsx</span>
                </div>
                <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-white/5">
                  <span className="text-sm font-medium text-gray-500">App.jsx</span>
                </div>
              </div>

              {/* Code Content */}
              <div className="px-6 py-6 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed text-gray-300">
                  <code className="block">
                    <span className="text-blue-400">import</span>{" "}
                    <span className="text-white">{`{ useState }`}</span>{" "}
                    <span className="text-blue-400">from</span>{" "}
                    <span className="text-green-400">'react'</span>
                  </code>
                  <code className="block">
                    <span className="text-blue-400">import</span>{" "}
                    <span className="text-white">{`{ Switch }`}</span>{" "}
                    <span className="text-blue-400">from</span>{" "}
                    <span className="text-green-400">'@headlessui/react'</span>
                  </code>
                  <code className="block h-4"></code>
                  <code className="block">
                    <span className="text-purple-400">function</span>{" "}
                    <span className="text-yellow-200">Example</span>() {"{"}
                  </code>
                  <code className="block pl-4">
                    <span className="text-purple-400">const</span> [enabled, setEnabled] ={" "}
                    <span className="text-purple-400">useState</span>(
                    <span className="text-blue-300">true</span>)
                  </code>
                  <code className="block h-4"></code>
                  <code className="block pl-4">
                    <span className="text-blue-400">return</span> (
                  </code>
                  <code className="block pl-8">
                    &lt;<span className="text-pink-400">form</span> action="/notification-settings" method="post"&gt;
                  </code>
                  <code className="block pl-12">
                    &lt;<span className="text-yellow-200">Switch</span> checked={"{enabled}"} onChange={"{setEnabled}"} name="notifications"&gt;
                  </code>
                  <code className="block pl-16 text-gray-500">
                    {/* ... */}
                  </code>
                  <code className="block pl-12">
                    &lt;/<span className="text-yellow-200">Switch</span>&gt;
                  </code>
                  <code className="block pl-12">
                    &lt;<span className="text-pink-400">button</span>&gt;Submit&lt;/<span className="text-pink-400">button</span>&gt;
                  </code>
                  <code className="block pl-8">
                    &lt;/<span className="text-pink-400">form</span>&gt;
                  </code>
                  <code className="block pl-4">)</code>
                  <code className="block">{"}"}</code>
                </pre>
              </div>
            </div>

            {/* Optional background decoration circle - Changed to Blue */}
            <div className="absolute -bottom-10 -right-10 -z-10 h-72 w-72 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
          </div>
          
        </div>
      </div>
    </div>
  );
}