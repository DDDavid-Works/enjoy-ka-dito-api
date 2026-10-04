// Proper-case a name when it was typed entirely in lower or upper case
// ("maria santos" / "MARIA SANTOS" -> "Maria Santos"). Text that already mixes
// cases ("Maria dela Cruz", "McDonald") is left exactly as typed.
export function toProperCase(value: string): string {
  const trimmed = value.trim().replace(/\s+/g, ' ')
  const hasMixedCase = trimmed !== trimmed.toLowerCase() && trimmed !== trimmed.toUpperCase()
  if (hasMixedCase) return trimmed

  return trimmed.toLowerCase().replace(/(^|[\s\-'’.])([a-zà-ÿ])/g, (_, boundary: string, letter: string) => {
    return boundary + letter.toUpperCase()
  })
}
