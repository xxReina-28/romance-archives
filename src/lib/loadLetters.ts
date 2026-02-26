import fm from "front-matter"
import fm from "front-matter"
import { marked } from "marked"

marked.setOptions({ breaks: true })

export type Letter = {
  id: string
  title: string
  date: string
  theme?: string
  occasion?: string
  preview?: string
  audio?: string
  coverImage?: string
  content: string
}

type Attrs = {
  title?: string
  date?: string
  theme?: string
  occasion?: string
  preview?: string
  audio?: string
  coverImage?: string
}

export function loadLetters(): Letter[] {
  const modules = import.meta.glob("../data/letters/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  })

  const letters: Letter[] = []

  for (const path in modules) {
    const raw = modules[path] as string
    if (!raw) continue

    const parsed = fm<Attrs>(raw)
    const a = parsed.attributes || {}

    letters.push({
      id: path.split("/").pop()?.replace(".md", "") || "",
      title: a.title || "Untitled",
      date: a.date || "",
      theme: a.theme,
      occasion: a.occasion,
      preview: a.preview,
      audio: a.audio,
      coverImage: a.coverImage,
      content: marked.parse(parsed.body || ""),
    })
  }

  // Sort newest first. ISO dates sort correctly as strings (YYYY-MM-DD)
  return letters.sort((x, y) =>
  String(y.date ?? "").localeCompare(String(x.date ?? ""))
)
}