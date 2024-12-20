// "use client";
import { Notepad } from "@/components/notepad";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getUserId } from "@/lib/user";

export const revalidate = 0; // disable cache for this route

export default async function NotesPage() {
  const userId = getUserId();
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Notepad initialNotes={notes || []} />
      </div>
      <div className="fixed bottom-4 right-4">
        <Link href="/draw">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Pencil className="w-4 h-4 mr-2" />
            Drawing Board
          </Button>
        </Link>
      </div>
    </main>
  );
}
