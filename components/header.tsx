"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { SettingsMenu } from "@/components/settings-menu";

interface HeaderProps {
  onAddTodo?: () => void;
}

export function Header({ onAddTodo }: HeaderProps) {
  const router = useRouter();
  useKeyboardShortcuts();

  const handleAddTodo = () => {
    if (onAddTodo) {
      onAddTodo();
    } else {
      router.push("/?add-todo");
    }
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <Link href="/" className="flex items-center gap-4">
        <Image
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-lg w-auto h-auto transition-transform duration-500 hover:scale-x-[-1]"
        />
        <h1 className="hidden md:flex text-3xl font-space font-bold text-foreground">
          TaskVine
        </h1>
      </Link>
      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
        <SettingsMenu />
        <Button
          onClick={handleAddTodo}
          className="bg-gradient-to-r from-gradient-from to-gradient-to hover:opacity-90 text-white"
        >
          <Plus className="mr-2" /> Add <span className="hidden md:inline">New</span> Todo{" "}
          <kbd title="Ctrl + K" className="hidden md:inline-flex items-center ml-2 gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span><span>K</span>
          </kbd>
        </Button>
      </div>
    </div>
  );
} 