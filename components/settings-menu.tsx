"use client";

import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTodoStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";

export function SettingsMenu() {
  const { exportData, importData } = useTodoStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    } catch (error) {
      toast({
        title: "Import failed",
        description: "There was an error importing your todos",
        variant: "destructive",
      });
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          <DropdownMenuItem onClick={exportData}>
            Export Todos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            Import Todos
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
} 