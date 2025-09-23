import Feed from "../components/home/feed/Feed";
import Header from "../components/home/header/Header";
import LeftBar from "../components/home/leftbar/LeftBar";
import RightBar from "../components/home/rightbar/RightBar";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="h-screen grid grid-cols-4">
        <div className="bg-gray-400">
          <LeftBar />
        </div>
        <div className="col-span-2 bg-red-300">
          <Feed />
        </div>
        <div className="bg-blue-100">
          <RightBar />
        </div>
      </main>
    </div>
  );
}
