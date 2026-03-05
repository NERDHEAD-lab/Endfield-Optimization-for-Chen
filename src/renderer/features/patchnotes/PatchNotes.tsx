import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { ReleaseNote } from "../../../shared/types";
import { IFeatureComponentProps } from "../feature.types";
import "./PatchNotes.css"; // We will create this or use existing styles

interface PatchNotesProps extends IFeatureComponentProps {
  initialNotes?: ReleaseNote[];
}

const PatchNotes: React.FC<PatchNotesProps> = ({ initialNotes }) => {
  const { t } = useTranslation();
  const [notes, setNotes] = useState<ReleaseNote[]>(initialNotes || []);
  const [loading, setLoading] = useState(!initialNotes);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we already have notes passed via props, we don't need to fetch immediately.
    // However, we might want to listen for updates or if initialNotes was empty.
    if (initialNotes && initialNotes.length > 0) {
      return;
    }

    // Handler for data
    const handleData = (data: unknown) => {
      console.log("[PatchNotes] Received data:", data);
      setNotes(data as ReleaseNote[]);
      setLoading(false);
    };

    // Handler for error
    const handleError = (err: unknown) => {
      console.error("Patch Notes Error:", err);
      setError("Failed to load patch notes.");
      setLoading(false);
    };

    // Register listeners
    globalThis.electronAPI.on("patch-notes-data", handleData);
    globalThis.electronAPI.on("patch-notes-error", handleError);

    // Request data
    globalThis.electronAPI.send("UI_PATCH_NOTES_REQUEST");

    // Cleanup
    return () => {
      globalThis.electronAPI.off("patch-notes-data", handleData);
      globalThis.electronAPI.off("patch-notes-error", handleError);
    };
  }, [initialNotes]);

  if (loading) {
    return (
      <div className="patch-notes-page loading">
        <p>{t("patchnotes.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patch-notes-page error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="patch-notes-page">
      <div className="patch-notes-container">
        {notes.length === 0 ? (
          <div className="empty-notes">
            <p>No patch notes available.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.version} className="patch-note-card">
              <div className="patch-note-header">
                <span className="version-badge">v{note.version}</span>
                <span className="release-date">{note.date}</span>
                <a
                  href={note.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="github-link"
                >
                  {t("patchnotes.view_github")}
                  <span className="material-symbols-outlined">open_in_new</span>
                </a>
              </div>
              <div className="patch-note-body markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {note.body}
                </ReactMarkdown>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatchNotes;
