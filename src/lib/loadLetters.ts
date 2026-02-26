import matter from "gray-matter"
import { marked } from "marked"

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

export function loadLetters(): Letter[] {
  const modules = import.meta.glob("../data/letters/*.md", {
    eager: true,
    as: "raw",
  })

  const letters: Letter[] = []

  for (const path in modules) {
    const raw = modules[path] as string
    const { data, content } = matter(raw)

    letters.push({
      id: path.split("/").pop()?.replace(".md", "") || "",
      title: data.title || "Untitled",
      date: data.date || "",
      theme: data.theme,
      occasion: data.occasion,
      preview: data.preview,
      audio: data.audio,
      coverImage: data.coverImage,
      content: marked.parse(content),
    })
  }

  return letters.sort((a, b) => b.date.localeCompare(a.date))
}