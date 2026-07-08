"use client"

import DOMPurify from "dompurify"
import { useEffect, useState } from "react"

interface Props {
  html: string
  className?: string
}

export function SanitizedHTML({ html, className = "" }: Props) {
  const [clean, setClean] = useState("")

  useEffect(() => {
    setClean(DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr",
        "strong", "em", "u", "s", "del", "ins", "mark", "sub", "sup",
        "ul", "ol", "li", "dl", "dt", "dd",
        "blockquote", "pre", "code", "kbd", "samp",
        "table", "thead", "tbody", "tfoot", "tr", "td", "th", "caption", "colgroup", "col",
        "div", "span", "section", "article", "aside", "header", "footer", "nav", "main",
        "a", "img", "figure", "figcaption",
        "iframe",
        "input", "label",
        "details", "summary",
      ],
      ALLOWED_ATTR: [
        "class", "id", "style", "title", "alt", "src", "href", "target", "rel",
        "width", "height", "border", "frameborder", "allowfullscreen",
        "colspan", "rowspan", "scope", "align", "valign",
        "start", "type", "checked", "disabled", "placeholder",
        "data-*", "draggable",
      ],
      ALLOW_DATA_ATTR: true,
    }))
  }, [html])

  return (
    <div
      className={`prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-12 prose-h2:text-2xl prose-h2:md:text-3xl prose-h3:text-xl prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-[#84cc16] prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-[#84cc16] prose-pre:bg-card prose-pre:border prose-pre:border-border ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}
