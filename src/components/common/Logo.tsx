import React from "react";
import { Leaf } from "lucide-react";
import { cn } from "../../lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function Logo({ className, iconClassName, textClassName }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center justify-center bg-brand-600 rounded-lg p-2 shadow-sm">
        <Leaf className={cn("w-6 h-6", iconClassName)} color={iconClassName ? undefined : "white"} />
      </div>
      <span className={cn("font-bold text-xl tracking-tight text-slate-900", textClassName)}>
        Logic<span className="text-brand-600">Lawns</span>
      </span>
    </div>
  );
}