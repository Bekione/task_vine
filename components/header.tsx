"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  onAddTodo?: () => void;
}

export function Header({ onAddTodo }: HeaderProps) {
  const router = useRouter();

  const handleAddTodo = () => {
    if (onAddTodo) {
      onAddTodo();
    } else {
      router.push("/?add-todo");
    }
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Image
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-lg w-auto h-auto"
        />
        <h1 className="hidden md:flex text-3xl font-space font-bold text-foreground">
          TaskVine
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button
          onClick={handleAddTodo}
          className="bg-gradient-to-r from-[#3dc6ee] to-[#75d7f1] hover:opacity-90 text-white"
        >
          <Plus className="mr-2" /> Add New Todo
        </Button>
      </div>
    </div>
  );
} 