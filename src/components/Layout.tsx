import React from "react";

export default function Layout({ children }: { children: React.ReactElement }) {
  return (
    <>
      <header className="bg-[#0B1120] h-20 flex items-center px-5 sticky top-0">
        <span className="text-slate-300 text-2xl font-bold">CHALET&apos;S</span>
      </header>
      {children}
    </>
  );
}
