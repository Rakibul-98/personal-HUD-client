import Link from "next/link";
export default function HomePage() {
  return (
    <div>
      <h3>Welcome to the homepage</h3>
      <Link href="/feed">Feed</Link>
    </div>
  );
}
