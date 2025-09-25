import React from "react";
import Header from "../../components/home/header/Header";
import LeftBar from "../../components/home/leftbar/LeftBar";
import ProtectedRoute from "../../components/auth/ProtectedRoutes";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function layout({ children }: AppLayoutProps) {
  return (
    <ProtectedRoute>
      <Header />
      <main className="grid grid-cols-4">
        <div className="bg-gray-400/5 backdrop-blur-sm">
          <LeftBar />
        </div>
        <div className="col-span-3">{children}</div>
      </main>
    </ProtectedRoute>
  );
}
