"use client"

import { useToast as useOriginalToast } from "@/components/ui/use-toast"
import type { ToastProps } from "@/components/ui/toast"

interface CustomToastProps extends ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  const { toast, ...rest } = useOriginalToast()

  const customToast = (props: CustomToastProps) => {
    return toast({
      ...props,
      duration: 4000, // 4 seconds
    })
  }

  return {
    toast: customToast,
    ...rest,
  }
}
