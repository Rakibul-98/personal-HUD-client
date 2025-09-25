import Feed from "../../../components/home/feed/Feed";
import RightBar from "../../../components/home/rightbar/RightBar";

export default function FeedPage() {
  return (
    <div className="grid grid-cols-3">
      <div className="col-span-2">
        <Feed />
      </div>
      <div className="">
        <RightBar />
      </div>
    </div>
  );
}
