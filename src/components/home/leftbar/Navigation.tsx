import Link from "next/link";
import { usePathname } from "next/navigation";
import { Newspaper, Bookmark } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/feed",
      icon: Newspaper,
      label: "Feed",
    },
    {
      href: "/bookmark",
      icon: Bookmark,
      label: "Bookmarks",
    },
  ];

  return (
    <nav className="flex flex-col space-y-2 my-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex gap-2 px-4 py-2 transition-all duration-300 backdrop-blur items-center ${
              isActive
                ? "bg-blue-400/80 cursor-default"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <Icon size={20} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
