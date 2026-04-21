import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="group relative w-full">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-primary/70">
            {React.cloneElement(icon as React.ReactElement<any>, {
              size: 18,
              strokeWidth: 2,
            })}
          </div>
        )}
        <input
          type={type}
          data-slot="input"
          ref={ref}
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input/50 h-11 w-full min-w-0 rounded-xl border bg-gray-50/50 px-3.5 py-1 text-base shadow-sm transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-primary/50 focus-visible:ring-primary/20 focus-visible:ring-[4px] focus-visible:bg-background focus-visible:shadow-md",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            icon && "pl-11",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"


export { Input }
