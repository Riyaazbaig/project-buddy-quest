
/**
 * Resume parsing utility.
 * Focuses on robust name extraction, better section parsing, and sensible fallbacks.
 */

type ExperienceItem = {
  title: string
  company: string
  duration: string
  description: string
}

type EducationItem = {
  degree: string
  school: string
  year: string
}

type ProjectItem = {
  name: string
  description: string
  tech: string[]
}

export type ParsedResume = {
  name: string
  title: string
  email: string
  phone: string
  location: string
  summary: string
  skills: string[]
  experience: ExperienceItem[]
  education: EducationItem[]
  projects: ProjectItem[]
}

const COMMON_SECTION_HEADERS =
  /(skills|technical skills|experience|work experience|professional experience|education|academics|projects?|personal projects?|summary|objective)/i

const STOP_AT_NEXT_SECTION =
  /(?=\n\s*(?:SKILLS|EXPERIENCE|WORK EXPERIENCE|EDUCATION|PROJECTS|SUMMARY|OBJECTIVE)\b|\n\s*[A-Z][A-Za-z .'/&-]{2,}\s*:|$)/

const normalizeWhitespace = (text: string) =>
  text.replace(/\r/g, '').replace(/\t/g, '  ').replace(/\u00A0/g, ' ').replace(/[ ]{2,}/g, ' ').trim()

const titleCase = (s: string) =>
  s
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')

const cleanNameLike = (s: string) =>
  s
    .replace(/[^A-Za-z .,'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const normalizeFileNameToName = (fileName?: string) => {
  if (!fileName) return ''
  const base = fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b(cv|resume|curriculum vitae)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
  const cleaned = cleanNameLike(base)
  // Prefer 2-4 words as a name
  const parts = cleaned.split(' ').filter(Boolean)
  if (parts.length >= 2 && parts.length <= 5) {
    return titleCase(cleaned)
  }
  return titleCase(cleaned)
}

const looksLikeName = (line: string) => {
  const cleaned = cleanNameLike(line)
  if (!cleaned) return false
  const parts = cleaned.split(' ').filter(Boolean)
  if (parts.length < 2 || parts.length > 5) return false
  // Avoid generic words
  if (/\b(resume|curriculum|vitae|objective|summary|experience|skills|education|projects?)\b/i.test(cleaned))
    return false
  // Heuristic: most words should start uppercase
  const score = parts.reduce((acc, w) => acc + (w[0] === w[0]?.toUpperCase() ? 1 : 0), 0)
  return score >= Math.max(2, Math.ceil(parts.length * 0.6))
}

const extractSection = (text: string, headerRegex: RegExp): string | null => {
  // Find header line then capture until next section
  const re = new RegExp(
    String.raw`(?:^|\n)\s*(?:${headerRegex.source})\s*:?\s*[\n\r]+([\s\S]*?)${STOP_AT_NEXT_SECTION.source}`,
    'i'
  )
  const match = text.match(re)
  return match ? match[1].trim() : null
}

const unique = <T,>(arr: T[]) => Array.from(new Set(arr))

const parseSkills = (skillsRaw?: string | null) => {
  if (!skillsRaw) return []
  const tokens = skillsRaw
    .replace(/[•\u2022|]/g, ',')
    .replace(/\n+/g, ',')
    .split(/,|;|\//)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => s.length > 1 && s.length <= 40 && !/^\d+$/.test(s))
  return unique(tokens)
}

const parseExperience = (section?: string | null): ExperienceItem[] => {
  if (!section) return []
  return section
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .slice(0, 6)
    .map((block) => {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
      const first = lines[0] || 'Experience'
      const duration =
        (block.match(
          /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*[-–]\s*(?:Present|\d{4})\b/i
        ) || [''])[0]
      const company =
        (block.match(/\b(?:at|@)\s+([A-Za-z0-9 .,'&-]{2,})/) || [])[1] ||
        (lines[1] && !COMMON_SECTION_HEADERS.test(lines[1]) ? lines[1] : '') ||
        ''
      const description = lines.slice(1).join(' ').slice(0, 400)
      return {
        title: first.slice(0, 100),
        company: company.slice(0, 80),
        duration,
        description,
      }
    })
    .filter((x) => x.title || x.description)
}

const parseEducation = (section?: string | null): EducationItem[] => {
  if (!section) return []
  return section
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .slice(0, 4)
    .map((block) => {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
      const year = (block.match(/\b(20\d{2}|19\d{2})\b/) || [''])[0]
      const degree = lines[0] || 'Education'
      const school = (lines[1] && !COMMON_SECTION_HEADERS.test(lines[1]) ? lines[1] : '') || ''
      return { degree: degree.slice(0, 100), school: school.slice(0, 100), year }
    })
}

const parseProjects = (section?: string | null): ProjectItem[] => {
  if (!section) return []
  return section
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .slice(0, 4)
    .map((block) => {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
      const name = lines[0] || 'Project'
      const description = lines.slice(1).join(' ').slice(0, 250)
      const tech = unique((block.match(/\b[A-Za-z][A-Za-z0-9+.#-]{1,}\b/g) || []).slice(0, 8))
      return { name: name.slice(0, 80), description, tech }
    })
}

export const parseResume = (rawText: string, fileName?: string): ParsedResume => {
  const text = normalizeWhitespace(rawText || '')
  const lines = text.split('\n').map((l) => l.trim())
  const nonEmpty = lines.filter(Boolean)

  // Name detection: try content first (top few lines), else filename
  const contentName =
    nonEmpty.slice(0, 8).find(looksLikeName) ||
    nonEmpty
      .slice(0, 5)
      .map(cleanNameLike)
      .find(looksLikeName) ||
    ''
  const fallbackName = normalizeFileNameToName(fileName)
  const name = titleCase(contentName || fallbackName || 'Your Name')

  // Try to infer a professional title from the first 10 lines
  const firstLines = nonEmpty.slice(0, 10).join(' ')
  const titleMatch = firstLines.match(
    /\b(Software|Full[- ]?Stack|Frontend|Back\s?end|Backend|Data|Machine Learning|ML|AI|DevOps|Product|UI\/?UX|Mobile|Cloud)\b.*\b(Engineer|Developer|Designer|Scientist|Manager|Architect|Lead)\b/i
  )
  const title = titleMatch ? titleMatch[0] : ''

  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
  const phoneMatch = text.match(
    /(\+?\d{1,3}[\s\-.)(]*)?(\d{3}[\s\-.)(]*){2}\d{4}|\+?\d[\d\s\-().]{7,}\d/
  )
  const locationMatch =
    text.match(/\b([A-Za-z .'-]{2,}),\s*([A-Za-z .'-]{2,})\b/) ||
    text.match(/\b([A-Za-z .'-]{2,})\s*,\s*(?:[A-Z]{2}|[A-Za-z .'-]{2,})\b/)

  const summary =
    extractSection(text, /(summary|objective)/i) ||
    nonEmpty
      .slice(1, 8)
      .join(' ')
      .slice(0, 400)

  const skills = parseSkills(extractSection(text, /(skills|technical skills)/i))
  const experience = parseExperience(extractSection(text, /(experience|work experience|professional experience)/i))
  const education = parseEducation(extractSection(text, /(education|academics)/i))
  const projects = parseProjects(extractSection(text, /(projects?|personal projects?)/i))

  return {
    name,
    title,
    email: emailMatch?.[0] || '',
    phone: phoneMatch?.[0] || '',
    location: locationMatch ? `${locationMatch[1]}, ${locationMatch[2]}` : '',
    summary,
    skills,
    experience,
    education,
    projects,
  }
}
