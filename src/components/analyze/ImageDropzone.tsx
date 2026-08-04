'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';

export interface PreviewFile {
  file: File;
  /** Object URL for the thumbnail. Revoked when the file is removed. */
  url: string;
  id: string;
}

interface Props {
  files: PreviewFile[];
  onChange: (files: PreviewFile[]) => void;
  maxFiles?: number;
}

/**
 * HEIC is deliberately absent: the server decodes images with sharp, whose HEIF
 * support in this build covers AVIF only. Accepting HEIC here would let iPhone
 * photos through to a guaranteed server-side failure.
 */
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

/**
 * Multi-image picker with drag-and-drop and immediate previews.
 *
 * Object URLs are revoked when a file is removed and on unmount — without that,
 * every dropped image leaks until a full page reload.
 */
export default function ImageDropzone({ files, onChange, maxFiles = 10 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [rejected, setRejected] = useState<string | null>(null);

  // Revoke any still-live object URLs when the component goes away.
  const filesRef = useRef(files);
  filesRef.current = files;
  useEffect(
    () => () => {
      filesRef.current.forEach((f) => URL.revokeObjectURL(f.url));
    },
    []
  );

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming?.length) return;

      const images = Array.from(incoming).filter((f) => ACCEPTED.includes(f.type));
      const skipped = incoming.length - images.length;

      const room = maxFiles - files.length;
      const accepted = images.slice(0, room);

      setRejected(
        skipped > 0
          ? `${skipped} file${skipped === 1 ? '' : 's'} skipped — images only.`
          : images.length > room
            ? `Only ${maxFiles} images can be attached.`
            : null
      );

      if (accepted.length === 0) return;

      onChange([
        ...files,
        ...accepted.map((file) => ({
          file,
          url: URL.createObjectURL(file),
          id: `${file.name}-${file.size}-${crypto.randomUUID()}`
        }))
      ]);
    },
    [files, maxFiles, onChange]
  );

  function removeFile(id: string) {
    const target = files.find((f) => f.id === id);
    if (target) URL.revokeObjectURL(target.url);
    onChange(files.filter((f) => f.id !== id));
  }

  return (
    <div className="stack stack-sm">
      <div
        className={`dropzone ${dragging ? 'dropzone--active' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-label="Add product images"
      >
        <ImagePlus size={24} color="#0066ff" />
        <span style={{ fontSize: 14, fontWeight: 700, color: '#090d16' }}>
          {dragging ? 'Drop images here' : 'Drag images here, or click to browse'}
        </span>
        <span style={{ fontSize: 12, color: '#64748b' }}>
          JPG, PNG or WebP · up to {maxFiles} images
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            // Reset so picking the same file twice still fires onChange.
            e.target.value = '';
          }}
        />
      </div>

      {rejected && <p className="field-error">{rejected}</p>}

      {files.length > 0 && (
        <div className="thumb-grid">
          {files.map((f) => (
            <div key={f.id} className="thumb fade-up">
              {/* Local object URL preview — next/image would need a loader here. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.url} alt={f.file.name} />
              <button
                type="button"
                className="thumb-remove"
                onClick={() => removeFile(f.id)}
                aria-label={`Remove ${f.file.name}`}
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
