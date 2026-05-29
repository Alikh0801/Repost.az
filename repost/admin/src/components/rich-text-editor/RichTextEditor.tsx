import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { uploadImage } from "../../api/media";
import { ApiError } from "../../api/client";
import { resolveMediaUrl } from "../../lib/resolve-media-url";
import "./rich-text-editor.css";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  localeLabel: string;
  required?: boolean;
  onUploadStateChange?: (uploading: boolean) => void;
  onError?: (message: string) => void;
};

type ToolbarButtonProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
};

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={`rte-toolbar__btn${active ? " rte-toolbar__btn--active" : ""}`}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="rte-toolbar__divider" aria-hidden />;
}

export function RichTextEditor({
  value,
  onChange,
  localeLabel,
  required,
  onUploadStateChange,
  onError,
}: RichTextEditorProps) {
  const [revision, setRevision] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Youtube.configure({
        width: 640,
        height: 360,
        nocookie: true,
      }),
      Placeholder.configure({
        placeholder: "Xəbər mətnini yazın...",
      }),
    ],
    content: value,
    onUpdate: ({ editor: ed }) => {
      setRevision((n) => n + 1);
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rte-editor__content",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [editor, value]);

  const stats = useMemo(() => {
    if (!editor) return { words: 0, chars: 0 };
    const text = editor.getText().trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    return { words, chars: text.length };
  }, [editor, revision]);

  async function handleImageUpload() {
    if (!editor) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp,image/gif";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      void (async () => {
        onUploadStateChange?.(true);
        try {
          const { url } = await uploadImage(file);
          editor
            .chain()
            .focus()
            .setImage({ src: resolveMediaUrl(url), alt: "" })
            .run();
        } catch (err) {
          onError?.(
            err instanceof ApiError ? err.message : "Şəkil yüklənmədi",
          );
        } finally {
          onUploadStateChange?.(false);
        }
      })();
    };
    input.click();
  }

  function handleLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  }

  function handleVideo() {
    if (!editor) return;
    const url = window.prompt("YouTube video URL");
    if (!url?.trim()) return;
    editor.commands.setYoutubeVideo({ src: url.trim() });
  }

  if (!editor) {
    return <div className="rte rte--loading">Redaktor yüklənir...</div>;
  }

  return (
    <div className="rte">
      <div className="rte__header">
        <span className="rte__title">
          <span className="rte__title-icon" aria-hidden>
            ✎
          </span>
          Məzmun
          {required ? " *" : ""}
        </span>
        <span className="rte__locale">{localeLabel}</span>
      </div>

      <div className="rte-toolbar" role="toolbar" aria-label="Mətn alətləri">
        <ToolbarButton
          label="Qalın"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          label="Maili"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          label="Alt xətt"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <span className="rte-toolbar__underline">U</span>
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          label="Marker siyahı"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          label="Nömrəli siyahı"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M10 6h11M10 12h11M10 18h11M4 6h1v4H4V6zm0 6h1v4H4v-4zm0 6h1v4H4v-4z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          label="Sitat"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M7 7h3v7H6V9H5V7h2zm9 0h3v7h-4V9h-1V7h2z" />
          </svg>
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          label="Link"
          active={editor.isActive("link")}
          onClick={handleLink}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
          </svg>
        </ToolbarButton>
        <ToolbarButton label="Şəkil" onClick={() => void handleImageUpload()}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M4 5h16v14H4V5zm2 2v10h12V7H6zm2 8 2.5-3 2 2.5 1.5-2L16 15H8z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton label="Video" onClick={handleVideo}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M10 8l6 4-6 4V8zM5 5h14v14H5V5z" />
          </svg>
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          label="Geri al"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M7 11h8a4 4 0 0 1 0 8H9M7 11l-3-3M7 11l-3 3" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          label="Təkrarla"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M17 11H9a4 4 0 0 0 0 8h6M17 11l3-3M17 11l3 3" />
          </svg>
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} className="rte-editor" />

      <div className="rte__footer">
        <span>
          {stats.words} söz · {stats.chars} simvol
        </span>
      </div>
    </div>
  );
}
