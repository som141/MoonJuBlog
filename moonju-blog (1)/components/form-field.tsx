import type React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className={cn("text-sm font-medium", required && "after:content-['*'] after:text-destructive after:ml-1")}>
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function FormInput({ error, className, ...props }: FormInputProps) {
  return (
    <Input
      className={cn("transition-colors", error && "border-destructive focus-visible:ring-destructive", className)}
      {...props}
    />
  )
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function FormTextarea({ error, className, ...props }: FormTextareaProps) {
  return (
    <Textarea
      className={cn(
        "transition-colors min-h-[120px]",
        error && "border-destructive focus-visible:ring-destructive",
        className,
      )}
      {...props}
    />
  )
}
