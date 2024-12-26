"use client"

import { useToast as useOriginalToast } from "@/components/ui/use-toast"
import type { ToastProps } from "@/components/ui/toast"

export function useToast() {
  const { toast, ...rest } = useOriginalToast()

  const customToast = (props: ToastProps) => {
    return toast({
      ...props,
      duration: 5000, // 5 seconds
    })
  }

  return {
    toast: customToast,
    ...rest,
  }
}
