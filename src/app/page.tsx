import Feed from "../components/home/feed/Feed";
import Header from "../components/home/header/Header";
import LeftBar from "../components/home/leftbar/LeftBar";
import RightBar from "../components/home/rightbar/RightBar";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#020617] relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#020617",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
            radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
          `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }}
      />

      <div className="relative z-10 text-white">
        <Header />
        <main className="grid grid-cols-2">
          <div className="bg-gray-400/10 backdrop-blur-sm">
            <LeftBar />
          </div>
          {/* <div className="col-span-2 bg-red-300/10 backdrop-blur-sm">
            <Feed />
          </div> */}
          <div className="bg-blue-100/10 backdrop-blur-sm">
            <RightBar />
          </div>
        </main>
      </div>
    </div>
  );
}
