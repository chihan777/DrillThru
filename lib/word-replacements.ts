export interface WordReplacement {
  find: string
  replace: string
  enabled: boolean
}

export function applyWordReplacements(text: string, replacementsJson: string): string {
  if (!text || !replacementsJson) return text

  let replacements: WordReplacement[]
  try {
    replacements = JSON.parse(replacementsJson)
  } catch {
    return text
  }

  if (!Array.isArray(replacements) || replacements.length === 0) return text

  let result = text
  for (const r of replacements) {
    if (!r.enabled || !r.find) continue
    const escaped = r.find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    result = result.replace(new RegExp(escaped, "gi"), r.replace)
  }

  return result
}
