import { Bookmark, TrendingUp } from "lucide-react";
import Link from "next/link";
export default function HomePage() {
  const previewItems = [
    {
      id: 1,
      title: "OpenAI admits AI hallucinations are mathematically inevitable",
      source: "# Reddit",
      category: "Technology",
      popularityScore: 1290,
    },
    {
      id: 2,
      title: "The future of HUD dashboards for devs",
      source: "# HackerNews",
      category: "Dev",
      popularityScore: 1100,
    },
  ];

  return (
    <div className="w-[95%] mx-auto">
      <main className="relative flex min-h-screen items-center justify-center">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full px-6">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-6xl lg:text-8xl  font-extrabold ">
              Own Your <br className="hidden md:block" /> Focus
            </h1>
            <p className="mt-4 text-xl">
              Real-time feeds tailored to your focus.
            </p>

            <div className="mt-8">
              <Link
                href="/feed"
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 shadow-lg shadow-blue-500/40 hover:opacity-90 transition"
              >
                Get Started
              </Link>
              <Link href="/registration">Registration</Link>
              <Link href="/login">Login</Link>
            </div>
          </div>

          <div className="flex-1 mt-12 md:mt-0 flex justify-center">
            <div className="relative w-[420px] rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-2xl border border-gray-700">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-40 blur-xl" />

              <div className="relative z-10 space-y-4">
                <h2 className="text-xl font-semibold text-white">
                  Feed Preview
                </h2>
                {previewItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg bg-gray-800 p-4 text-xs text-gray-300"
                  >
                    <p className="font-medium mb-1 text-sm">
                      OpenAI admits AI hallucinations are mathematically
                      inevitable
                    </p>
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-xs text-gray-400">
                        {item.source} · {item.category}
                      </p>
                      <p className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{item.popularityScore}</span>
                      </p>
                      <Bookmark className="h-3 w-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
