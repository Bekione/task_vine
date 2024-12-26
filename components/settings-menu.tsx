"use client";

import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTodoStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { useRef, useState } from "react";
import { ConfirmationDialog } from "./confirmation-dialog";
import { cn } from "@/lib/utils";

export function SettingsMenu() {
  const { exportData, importData, clearTodos } = useTodoStore();
  const todos = useTodoStore((state) => state.todos);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const hasTodos = todos.length > 0;

  const handleExport = () => {
    if (!hasTodos) {
      toast({
        title: "No todos to export",
        description: "Create some todos first",
        variant: "default",
      });
      return;
    }
    exportData();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importData(file);
      toast({
        title: "Data imported",
        description: "Your todos have been imported successfully",
        variant: "default",
      });
    } catch {
      toast({
        title: "Import failed",
        description: "There was an error importing your todos",
        variant: "destructive",
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearConfirm = () => {
    clearTodos();
    setShowClearConfirmation(false);
    toast({
      title: "Todos cleared",
      description: "All todos have been removed",
      variant: "destructive",
    });
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleImport}
        className="hidden"
        aria-label="Import todos from JSON file"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="border-none">
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={handleExport}
            className={!hasTodos ? "opacity-50 cursor-not-allowed" : ""}
            disabled={!hasTodos}
          >
            Export Todos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            Import Todos
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowClearConfirmation(true)}
            className={cn(
              "text-destructive focus:text-destructive",
              !hasTodos && "opacity-50 cursor-not-allowed"
            )}
            disabled={!hasTodos}
          >
            Clear All Todos
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        isOpen={showClearConfirmation}
        onClose={() => setShowClearConfirmation(false)}
        onConfirm={handleClearConfirm}
        title="Clear All Todos"
        description="Are you sure you want to clear all todos? This action cannot be undone."
      />
    </>
  );
} 