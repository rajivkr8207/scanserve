/**
 * Generates a URL-safe slug from a given string.
 * "My Restaurant! (2024)" → "my-restaurant-2024"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // remove special chars
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-+/g, '-')             // collapse multiple hyphens
    .replace(/^-|-$/g, '')           // trim leading/trailing hyphens
}

/**
 * Appends a random suffix to make slugs unique when a base slug is taken.
 * "my-restaurant" → "my-restaurant-a3f9"
 */
export function generateUniqueSlug(name: string): string {
  const base = generateSlug(name)
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base}-${suffix}`
}
