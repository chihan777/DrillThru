"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import { Table } from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Typography from "@tiptap/extension-typography"
import Image from "@tiptap/extension-image"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
import { useState, useCallback, useEffect, useRef } from "react"
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Indent, Outdent,
  Quote, Code, Minus, Image as ImageIcon,
  Link as LinkIcon, Undo2, Redo2, Maximize, Minimize,
  Type, Palette, Highlighter, Table as TableIcon,
  ChevronDown, Loader2, Save, Eye, EyeOff, Upload,
  Video, Smile, CheckSquare, CodeSquare,
} from "lucide-react"

const lowlight = createLowlight(common)

const FONT_FAMILIES = [
  "Arial", "Helvetica", "Times New Roman", "Georgia", "Courier New",
  "Verdana", "Trebuchet MS", "Impact", "Comic Sans MS",
]

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "48px", "64px"]

const COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#B7B7B7", "#CCCCCC", "#D9D9D9", "#EFEFEF", "#F3F3F3", "#FFFFFF",
  "#980000", "#FF0000", "#FF9900", "#FFFF00", "#00FF00", "#00FFFF", "#4A86E8", "#0000FF", "#9900FF", "#FF00FF",
  "#E6B8AF", "#F4CCCC", "#FCE5CD", "#FFF2CC", "#D9EAD3", "#D0E0E3", "#C9DAF8", "#CFE2F3", "#D9D2E9", "#EAD1DC",
  "#DD7E6B", "#EA9999", "#F9CB9C", "#FFE599", "#B6D7A8", "#A2C4C9", "#A4C2F4", "#9FC5E8", "#B4A7D6", "#D5A6BD",
  "#CC4125", "#E06666", "#F6B26B", "#FFD966", "#93C47D", "#76A5AF", "#6D9EEB", "#6FA8DC", "#8E7CC3", "#C27BA0",
  "#A61C00", "#CC0000", "#E69138", "#F1C232", "#6AA84F", "#45818E", "#3C78D8", "#3D85C6", "#674EA7", "#A64D79",
  "#85200C", "#990000", "#B45F06", "#BF9000", "#38761D", "#134F5C", "#1155CC", "#0B5394", "#351C75", "#741B47",
  "#5B0F00", "#660000", "#783F04", "#7F6000", "#274E13", "#0C343D", "#1C4587", "#073763", "#20124D", "#4C1130",
]

interface Props {
  content: string
  onChange: (html: string) => void
  onSave?: () => void
  saving?: boolean
}

function isHtmlContent(text: string) {
  return /<[^>]+>/.test(text)
}

function convertMarkdownToHtml(markdown: string) {
  const normalized = markdown.replace(/\r\n?/g, "\n").trim()

  if (!normalized) return ""

  const inline = (text: string) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')

  const blocks = normalized.split(/\n{2,}/g)
  const htmlBlocks = blocks.map((block) => {
    const lines = block.split("\n")
    const headingMatch = lines[0].match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      const level = Math.min(6, headingMatch[1].length)
      return `<h${level}>${inline(headingMatch[2].trim())}</h${level}>`
    }

    if (lines.every((line) => /^>\s+/.test(line))) {
      const quote = lines.map((line) => inline(line.replace(/^>\s+/, ""))).join("<br/>")
      return `<blockquote>${quote}</blockquote>`
    }

    if (lines.every((line) => /^([-*+]\s+).+/.test(line))) {
      const items = lines.map((line) => `<li>${inline(line.replace(/^([-*+]\s+)/, ""))}</li>`).join("")
      return `<ul>${items}</ul>`
    }

    if (lines.every((line) => /^\d+\.\s+/.test(line))) {
      const items = lines.map((line) => `<li>${inline(line.replace(/^\d+\.\s+/, ""))}</li>`).join("")
      return `<ol>${items}</ol>`
    }

    return `<p>${lines.map((line) => inline(line.trim())).join("<br/>")}</p>`
  })

  return htmlBlocks.join("")
}

function Dropdown({ trigger, children, className = "" }: { trigger: React.ReactNode; children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className={`absolute top-full left-0 z-50 mt-1 min-w-[180px] rounded-lg border border-[#e2edcf] bg-white shadow-lg ${className}`} onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  )
}

function ToolbarBtn({ onClick, active, disabled, children, title }: {
  onClick: () => void; active?: boolean; disabled?: boolean; children: React.ReactNode; title?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
        active ? "bg-[#84cc16] text-white" : "text-[#4a5a3c] hover:bg-[#e2edcf]"
      } ${disabled ? "opacity-40" : ""}`}
    >
      {children}
    </button>
  )
}

function ToolbarSeparator() {
  return <div className="mx-1 h-6 w-px bg-[#d4e4c0]" />
}

export function RichTextEditor({ content, onChange, onSave, saving }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showHtml, setShowHtml] = useState(false)
  const [htmlSource, setHtmlSource] = useState(content)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start writing your service content here..." }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-[#84cc16] underline cursor-pointer" } }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      HorizontalRule,
      TaskList,
      TaskItem.configure({ nested: true }),
      Typography,
      Image.configure({ inline: false, allowBase64: true }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: isHtmlContent(content) ? content : convertMarkdownToHtml(content),
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[400px] px-8 py-6 text-black",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && showHtml) {
      setHtmlSource(editor.getHTML())
    }
  }, [editor, showHtml])

  const applyTextStyle = useCallback((style: Record<string, string>) => {
    if (!editor) return
    editor.chain().focus().extendMarkRange("textStyle").setMark("textStyle", style).run()
  }, [editor])

  const setLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt("Enter URL:")
    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt("Enter image URL:")
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  const uploadImage = useCallback(async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: formData })
    const data = await res.json()
    if (data.url && editor) {
      editor.chain().focus().setImage({ src: data.url }).run()
    }
  }, [editor])

  const handleImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) uploadImage(file)
  }, [uploadImage])

  const handleImagePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) uploadImage(file)
        break
      }
    }
  }, [uploadImage])

  const addYouTube = useCallback(() => {
    if (!editor) return
    const url = window.prompt("Enter YouTube video URL:")
    if (!url) return
    let embedUrl = url
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/)
    if (match) embedUrl = `https://www.youtube.com/embed/${match[1]}`
    editor.chain().focus().insertContent(
      `<div class="video-embed"><iframe src="${embedUrl}" width="100%" height="400" frameborder="0" allowfullscreen></iframe></div>`
    ).run()
  }, [editor])

  const addTable = useCallback(() => {
    if (!editor) return
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  if (!editor) return null

  const Toolbar = () => (
    <div
      className="flex flex-wrap items-center gap-0.5 rounded-t-xl border border-b-0 border-[#e2edcf] bg-[#f7faf3] px-3 py-2"
      onDrop={handleImageDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Undo / Redo */}
      <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
        <Undo2 className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
        <Redo2 className="h-4 w-4" />
      </ToolbarBtn>

      <ToolbarSeparator />

      {/* Font Family */}
      <Dropdown
        trigger={
          <button className="flex h-8 items-center gap-1 rounded-md px-2 text-xs text-[#4a5a3c] hover:bg-[#e2edcf]">
            <Type className="h-3.5 w-3.5" />
            <ChevronDown className="h-3 w-3" />
          </button>
        }
      >
        <div className="max-h-[300px] overflow-y-auto p-1">
          {FONT_FAMILIES.map((f) => (
            <button
              key={f}
              onClick={() => editor.chain().focus().extendMarkRange("textStyle").setFontFamily(f).run()}
              className="flex w-full items-center rounded-md px-3 py-1.5 text-left text-sm hover:bg-[#e2edcf]"
              style={{ fontFamily: f }}
            >
              {f}
            </button>
          ))}
        </div>
      </Dropdown>

      {/* Font Size */}
      <Dropdown
        trigger={
          <button className="flex h-8 items-center gap-1 rounded-md px-2 text-xs text-[#4a5a3c] hover:bg-[#e2edcf]">
            A
            <ChevronDown className="h-3 w-3" />
          </button>
        }
      >
        <div className="max-h-[300px] overflow-y-auto p-1">
          {FONT_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => {
                editor.chain().focus().extendMarkRange("textStyle").setMark("textStyle", { fontSize: s }).run()
              }}
              className="flex w-full items-center rounded-md px-3 py-1.5 text-left text-sm hover:bg-[#e2edcf]"
            >
              {s}
            </button>
          ))}
        </div>
      </Dropdown>

      <ToolbarSeparator />

      {/* Text Color */}
      <Dropdown
        trigger={
          <button className="flex h-8 items-center gap-1 rounded-md px-2 text-xs text-[#4a5a3c] hover:bg-[#e2edcf]">
            <Palette className="h-3.5 w-3.5" />
            <ChevronDown className="h-3 w-3" />
          </button>
        }
      >
        <div className="grid grid-cols-10 gap-1 p-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => editor.chain().focus().extendMarkRange("textStyle").setMark("textStyle", { color: c }).run()}
              className="h-5 w-5 rounded border border-gray-200 hover:scale-125 transition-transform"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      </Dropdown>

      {/* Highlight Color */}
      <Dropdown
        trigger={
          <button className="flex h-8 items-center gap-1 rounded-md px-2 text-xs text-[#4a5a3c] hover:bg-[#e2edcf]">
            <Highlighter className="h-3.5 w-3.5" />
            <ChevronDown className="h-3 w-3" />
          </button>
        }
      >
        <div className="grid grid-cols-10 gap-1 p-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => editor.chain().focus().extendMarkRange("highlight").toggleHighlight({ color: c }).run()}
              className="h-5 w-5 rounded border border-gray-200 hover:scale-125 transition-transform"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      </Dropdown>

      <ToolbarSeparator />

      {/* Bold / Italic / Underline / Strikethrough */}
      <ToolbarBtn onClick={() => editor.chain().focus().extendMarkRange("bold").toggleBold().run()} active={editor.isActive("bold")} title="Bold">
        <Bold className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().extendMarkRange("italic").toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
        <Italic className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().extendMarkRange("underline").toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().extendMarkRange("strike").toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
        <Strikethrough className="h-4 w-4" />
      </ToolbarBtn>

      <ToolbarSeparator />

      {/* Headings */}
      <Dropdown
        trigger={
          <button className="flex h-8 items-center gap-1 rounded-md px-2 text-xs text-[#4a5a3c] hover:bg-[#e2edcf]">
            <Heading1 className="h-3.5 w-3.5" />
            <ChevronDown className="h-3 w-3" />
          </button>
        }
      >
        <div className="p-1">
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <button
              key={level}
              onClick={() => editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()}
              className={`flex w-full items-center rounded-md px-3 py-1.5 text-left text-sm hover:bg-[#e2edcf] ${editor.isActive("heading", { level }) ? "bg-[#84cc16]/10 font-bold" : ""}`}
            >
              Heading {level}
            </button>
          ))}
        </div>
      </Dropdown>

      <ToolbarSeparator />

      {/* Text Alignment */}
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left">
        <AlignLeft className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center">
        <AlignCenter className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align Right">
        <AlignRight className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify">
        <AlignJustify className="h-4 w-4" />
      </ToolbarBtn>

      <ToolbarSeparator />

      {/* Lists */}
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
        <List className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered List">
        <ListOrdered className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")} title="Task List">
        <CheckSquare className="h-4 w-4" />
      </ToolbarBtn>

      <ToolbarSeparator />

      {/* Block Elements */}
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
        <Quote className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code Block">
        <CodeSquare className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Line">
        <Minus className="h-4 w-4" />
      </ToolbarBtn>

      <ToolbarSeparator />

      {/* Link */}
      <ToolbarBtn onClick={setLink} active={editor.isActive("link")} title="Insert Link">
        <LinkIcon className="h-4 w-4" />
      </ToolbarBtn>

      {/* Image */}
      <ToolbarBtn onClick={addImage} title="Insert Image URL">
        <ImageIcon className="h-4 w-4" />
      </ToolbarBtn>

      {/* YouTube */}
      <ToolbarBtn onClick={addYouTube} title="Insert YouTube Video">
        <Video className="h-4 w-4" />
      </ToolbarBtn>

      {/* Table */}
      <ToolbarBtn onClick={addTable} title="Insert Table">
        <TableIcon className="h-4 w-4" />
      </ToolbarBtn>

      <ToolbarSeparator />

      {/* Emojis */}
      <Dropdown
        trigger={
          <button className="flex h-8 items-center gap-1 rounded-md px-2 text-xs text-[#4a5a3c] hover:bg-[#e2edcf]">
            <Smile className="h-3.5 w-3.5" />
          </button>
        }
      >
        <div className="grid grid-cols-8 gap-1 p-2">
          {["😀","😂","😍","🤔","👍","👎","🔥","💯","✅","⭐","🎉","🚀","💡","📌","🎯","💪","🤝","✨","🏆","💼","📊","📈","🎨","🔧","💻","🌐","📱","⚡","🔑","📝"].map((e) => (
            <button key={e} onClick={() => editor.chain().focus().insertContent(e).run()} className="text-lg hover:scale-125 transition-transform">
              {e}
            </button>
          ))}
        </div>
      </Dropdown>

      <div className="flex-1" />

      {/* View HTML */}
      <ToolbarBtn onClick={() => setShowHtml(!showHtml)} active={showHtml} title="View HTML Source">
        <CodeSquare className="h-4 w-4" />
      </ToolbarBtn>

      {/* Fullscreen */}
      <ToolbarBtn onClick={() => setIsFullscreen(!isFullscreen)} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
      </ToolbarBtn>
    </div>
  )

  return (
    <div
      className={`${isFullscreen ? "fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col" : ""}`}
      onPaste={handleImagePaste}
    >
      <Toolbar />

      {showHtml ? (
        <div className="flex-1 border border-[#e2edcf] border-t-0 rounded-b-xl">
          <textarea
            className="w-full h-full min-h-[400px] p-6 font-mono text-sm bg-white text-gray-900 focus:outline-none"
            value={htmlSource}
            onChange={(e) => {
              setHtmlSource(e.target.value)
              editor?.commands.setContent(e.target.value)
            }}
          />
        </div>
      ) : (
        <div className="border border-[#e2edcf] border-t-0 rounded-b-xl overflow-auto bg-white">
          <EditorContent
            editor={editor}
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#1a2e0a] prose-p:text-[#334155] prose-li:text-[#334155] prose-a:text-[#65a30d] prose-strong:text-[#1a2e0a] prose-code:text-[#65a30d] prose-blockquote:border-l-[#84cc16] prose-blockquote:text-[#4a5a3c] prose-pre:bg-[#0f172a] prose-pre:text-[#e5e7eb]"
          />
        </div>
      )}
    </div>
  )
}
