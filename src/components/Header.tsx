import React from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "./Button";

export default function Header() {
  const linkCls = (isActive: boolean) =>
    `font-bold rounded px-2 py-1 ${
      isActive ? "text-brand-primary" : "text-brand-ink hover:text-brand-primary"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-brand-accent/30">
      <div className="max-w-6xl mx-auto px-4 py-2">
        {/* Desktop: centered logo, links on both sides */}
        <div className="hidden lg:grid grid-cols-3 items-center">
          <nav className="flex items-center justify-center gap-6">
            <NavLink to="/" className={({ isActive }) => linkCls(isActive)}>Home</NavLink>
            <NavLink to="/faq" className={({ isActive }) => linkCls(isActive)}>FAQ</NavLink>
          </nav>
          <div className="flex justify-center">
            {/* pointer-events-none so the logo can’t block clicks if it overlaps */}
            <Link to="/" aria-label="Hotline Memories" className="pointer-events-none">
              <img
                src="/Hotline_Memories_Logo.svg"
                alt="Hotline Memories"
                className="w-24 h-24 xl:w-28 xl:h-28 drop-shadow"
              />
            </Link>
          </div>
          <nav className="flex items-center justify-center gap-6">
            <NavLink to="/contact" className={({ isActive }) => linkCls(isActive)}>Contact</NavLink>
            <Link to="/booking">
              <Button className="text-sm font-bold">Booking</Button>
            </Link>
          </nav>
        </div>

        {/* Mobile/Tablet: compact bar so nothing hides behind the logo */}
        <div className="lg:hidden flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-base">
            <NavLink to="/" className={({ isActive }) => linkCls(isActive)}>Home</NavLink>
            <NavLink to="/faq" className={({ isActive }) => linkCls(isActive)}>FAQ</NavLink>
          </div>

          {/* Small, non-interactive logo so it can’t cover links */}
          <img
            src="/Hotline_Memories_Logo.svg"
            alt=""
            className="h-10 w-10 sm:h-12 sm:w-12 pointer-events-none select-none"
          />

          <div className="flex items-center gap-3">
            <NavLink to="/contact" className={({ isActive }) => linkCls(isActive)}>Contact</NavLink>
            <Link to="/booking">
              <Button className="text-xs font-bold px-3 py-1">Booking</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}