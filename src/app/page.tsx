import Image from "next/image";
import Login from "./../components/auth/Login";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Login />
    </main>
  );
}
