import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        data-slot="textarea"
        ref={ref}
        className={cn(
          "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input/50 flex min-h-[80px] w-full rounded-xl border bg-gray-50/50 px-3 py-2 text-base shadow-sm transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-primary/50 focus-visible:ring-primary/20 focus-visible:ring-[4px] focus-visible:bg-background focus-visible:shadow-md",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"


export { Textarea }
