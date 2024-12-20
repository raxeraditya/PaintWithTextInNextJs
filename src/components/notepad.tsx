"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash, Plus, Save } from "lucide-react";
import type { Note } from "../types/canvas";
import { supabase } from "../lib/supabase";
import { getUserId } from "../lib/user";

interface NotepadProps {
  initialNotes: Note[];
}

export function Notepad({ initialNotes }: NotepadProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userId = getUserId();

  useEffect(() => {
    if (notes.length > 0 && !activeNoteId) {
      setActiveNoteId(notes[0].id);
    }
  }, [notes, activeNoteId]);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error);
    } else {
      setNotes(data || []);
    }
    setIsLoading(false);
  }, [userId]);

  // useEffect(() => {
  //   fetchNotes();
  // }, [fetchNotes]);

  const addNote = useCallback(async () => {
    const newNote: Omit<Note, "id"> = {
      user_id: userId,
      title: "New Note",
      content: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("notes")
      .insert([newNote])
      .select();

    if (error) {
      console.error("Error adding note:", error);
    } else if (data) {
      setNotes((prev) => [data[0], ...prev]);
      setActiveNoteId(data[0].id);
    }
  }, [userId]);

  const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    const { error } = await supabase
      .from("notes")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error updating note:", error);
    } else {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? { ...note, ...updates, updated_at: new Date().toISOString() }
            : note
        )
      );
    }
  }, []);

  const deleteNote = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", id);

      if (error) {
        console.error("Error deleting note:", error);
      } else {
        setNotes((prev) => prev.filter((note) => note.id !== id));
        if (activeNoteId === id) {
          setActiveNoteId(notes.length > 1 ? notes[0].id : null);
        }
      }
    },
    [activeNoteId, notes]
  );

  const searchNotes = useCallback(
    async (term: string) => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .or(`title.ilike.%${term}%,content.ilike.%${term}%`)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error searching notes:", error);
      } else {
        setNotes(data || []);
      }
      setIsLoading(false);
    },
    [userId]
  );

  useEffect(() => {
    if (searchTerm) {
      searchNotes(searchTerm);
    } else {
      fetchNotes();
    }
  }, [searchTerm, searchNotes, fetchNotes]);

  const activeNote = notes.find((note) => note.id === activeNoteId);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            // Save functionality is automatic now
            console.log("Notes are saved automatically");
            break;
          case "n":
            e.preventDefault();
            addNote();
            break;
        }
      }
    },
    [addNote]
  );

  return (
    <div
      className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-sm h-full"
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Notes</h2>
        <Button onClick={addNote} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>
      <Input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="flex gap-4 h-[calc(100vh-12rem)]">
        <div className="w-1/3 overflow-y-auto pr-4 border-r">
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <AnimatePresence>
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="mb-2"
                >
                  <Button
                    variant={activeNoteId === note.id ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => setActiveNoteId(note.id)}
                  >
                    <div>
                      <div className="font-medium truncate">{note.title}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {new Date(note.updated_at).toLocaleString()}
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
        <div className="w-2/3 flex flex-col">
          {activeNote && (
            <motion.div
              key={activeNote.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              <Input
                value={activeNote.title}
                onChange={(e) =>
                  updateNote(activeNote.id, { title: e.target.value })
                }
                className="mb-4 text-xl font-semibold"
                placeholder="Note Title"
              />
              <Textarea
                value={activeNote.content}
                onChange={(e) =>
                  updateNote(activeNote.id, { content: e.target.value })
                }
                className="flex-grow mb-4 resize-none"
                placeholder="Type your note here..."
              />
              <div className="flex justify-between items-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteNote(activeNote.id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Note
                </Button>
                <div className="text-sm text-gray-500">
                  Last updated:{" "}
                  {new Date(activeNote.updated_at).toLocaleString()}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
