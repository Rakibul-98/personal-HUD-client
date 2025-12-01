"use client";
import React from "react";
import Header from "../../components/home/header/Header";
import LeftBar from "../../components/home/leftbar/LeftBar";
import RightBar from "../../components/home/rightbar/RightBar";
import BottomNavigationBar from "../../components/home/bottombar/BottomNavigationBar";
import ProtectedRoute from "../../components/auth/ProtectedRoutes";
import { usePathname } from "next/navigation";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  const isFeedPage = pathname === "/feed";
  const isBookmarkPage = pathname === "/bookmark";

  return (
    <ProtectedRoute>
      <div className="h-16 md:h-20 flex items-center">
        <Header />
      </div>
      <main
        className={`grid grid-cols-1 md:grid-cols-4 
          ${isFeedPage ? "lg:grid-cols-6" : "lg:grid-cols-5"}
          relative h-[calc(100vh-9rem)] md:h-[calc(100vh-5rem)]`}
      >
        <div className="hidden lg:block lg:col-span-1">
          <LeftBar />
        </div>

        <div className="col-span-1 md:col-span-4 h-full overflow-hidden">
          {children}
        </div>

        {isFeedPage && !isBookmarkPage && (
          <div className="hidden lg:block lg:col-span-1">
            <RightBar />
          </div>
        )}
      </main>

      <BottomNavigationBar />
    </ProtectedRoute>
  );
}
