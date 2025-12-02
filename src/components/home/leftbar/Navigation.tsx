import Link from "next/link";
import { usePathname } from "next/navigation";
import { Newspaper, Bookmark, BarChart3, Settings } from "lucide-react";
import { useTheme } from "../../ThemeProvider/ThemeProvider";

export default function Navigation() {
  const pathname = usePathname();
  const { isDarkMode } = useTheme();

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
    {
      href: "/analytics",
      icon: BarChart3,
      label: "Analytics",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
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
                ? isDarkMode
                  ? "bg-blue-400/80 cursor-default"
                  : "bg-blue-400/80 cursor-default text-white"
                : isDarkMode
                ? "bg-white/5 hover:bg-white/10"
                : "bg-gray-100/50 hover:bg-gray-200"
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
