import type { ComponentPropsWithoutRef, CSSProperties, FC } from "react"

import { cn } from "@/lib/utils"

export interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 120,
  ...props
}) => {
  return (
    <span className={cn("relative inline-block", className)} {...props}>
      <span className="text-rta-blue">{children}</span>
      <span
        aria-hidden="true"
        style={{ "--shiny-width": `${shimmerWidth}px` } as CSSProperties}
        className={cn(
          "pointer-events-none absolute inset-0 animate-shiny-text bg-clip-text text-transparent",
          "bg-[length:var(--shiny-width)_100%] bg-no-repeat",
          "bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.92)_50%,transparent_100%)]"
        )}
      >
        {children}
      </span>
    </span>
  )
}

