import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/HUD_logo.png";
import ParticleBackground from "../../components/BackgroundAnimation/ParticleBackground";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function layout({ children }: AppLayoutProps) {
  return (
    <>
      <main className="relative">
        <Link href="/" className="absolute left-5 top-4">
          <Image src={logo} alt="Logo" width={60} height={60} />
        </Link>
        <div className="min-h-screen items-center flex-1 flex justify-center pt-24 pb-10">
          <ParticleBackground />
          {children}
        </div>
      </main>
    </>
  );
}
