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
      <Header />
      <main
        className={`grid grid-cols-1 md:grid-cols-4 
          ${isFeedPage ? "lg:grid-cols-6" : "lg:grid-cols-5"}
          relative`}
      >
        <div className="hidden lg:block lg:col-span-1">
          <LeftBar />
        </div>

        <div className="col-span-1 md:col-span-4 lg:col-span-4">{children}</div>

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
