"use client"

import type * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className,
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 flex flex-col w-full max-w-2xl h-[80vh] translate-x-[-50%] translate-y-[-50%] rounded-lg border shadow-lg duration-200",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left flex-shrink-0 p-6 pb-0", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col items-center space-y-3 pt-4 border-t bg-white p-6 flex-shrink-0", className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function DialogScrollableContent({
  className,
  children,
  showScrollIndicator = false,
  onScrollToBottom,
  ...props
}: React.ComponentProps<"div"> & {
  showScrollIndicator?: boolean
  onScrollToBottom?: () => void
}) {
  return (
    <div className="flex-1 relative overflow-hidden">
      <div className={cn("overflow-y-auto pr-4 space-y-4 text-sm text-gray-700 h-full p-6 pt-0", className)} {...props}>
        {children}
      </div>
      {showScrollIndicator && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <div className="h-8 bg-gradient-to-t from-white/90 to-transparent" />
          <div className="flex justify-center pb-2">
            <button
              onClick={onScrollToBottom}
              className="pointer-events-auto bg-[#d8e6fd] hover:bg-[#c5d9fc] rounded-full shadow-sm border px-3 py-1 flex items-center gap-1 text-xs text-gray-600 transition-colors"
            >
              <ChevronDownIcon className="w-3 h-3" />
              Scroll to continue
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function DialogActionButton({ className, disabled, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed w-full max-w-xs text-white py-2 px-4 rounded-md font-medium transition-colors",
        className,
      )}
      disabled={disabled}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogScrollableContent,
  DialogTitle,
  DialogTrigger,
  DialogActionButton,
}
