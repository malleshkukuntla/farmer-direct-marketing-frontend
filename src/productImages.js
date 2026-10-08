// Finds a real photo for ANY product name using the free Wikipedia API.
// Known names use an exact page; other names are looked up by search.
// Order matters: "pineapple" must come before "apple".
const TITLES = [
  ['pineapple', 'Pineapple'],
  ['watermelon', 'Watermelon'],
  ['mango', 'Mango'],
  ['tomato', 'Tomato'],
  ['potato', 'Potato'],
  ['onion', 'Onion'],
  ['banana', 'Banana'],
  ['apple', 'Apple'],
  ['orange', 'Orange_(fruit)'],
  ['grape', 'Grape'],
  ['papaya', 'Papaya'],
  ['carrot', 'Carrot'],
  ['paddy', 'Rice'],
  ['rice', 'Rice'],
  ['maize', 'Maize'],
  ['corn', 'Maize'],
  ['wheat', 'Wheat'],
  ['chilli', 'Chili_pepper'],
  ['chili', 'Chili_pepper'],
  ['spinach', 'Spinach'],
  ['cauliflower', 'Cauliflower'],
  ['cabbage', 'Cabbage'],
]

function findTitle(name) {
  const n = name.toLowerCase()
  for (const [word, title] of TITLES) {
    if (n.includes(word)) return title
  }
  return null
}

// Photo from one exact Wikipedia page (redirects like Brinjal -> Eggplant work)
async function fromSummary(title) {
  const page = title.charAt(0).toUpperCase() + title.slice(1)
  const res = await fetch(
    'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(page.replace(/ /g, '_'))
  )
  if (!res.ok) return null
  const data = await res.json()
  if (data.type === 'disambiguation') return null
  return data.thumbnail ? data.thumbnail.source : null
}

// Photo from the best search result that has a picture
async function fromSearch(term) {
  const url =
    'https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=' +
    encodeURIComponent(term) +
    '&gsrlimit=5&prop=pageimages&piprop=thumbnail&pithumbsize=500&format=json&origin=*'
  const res = await fetch(url)
  if (!res.ok) return null
  const data = await res.json()
  const pages = data.query ? Object.values(data.query.pages) : []
  pages.sort((a, b) => a.index - b.index)
  for (const p of pages) {
    if (p.thumbnail) return p.thumbnail.source
  }
  return null
}

async function fetchPhoto(name) {
  const key = 'photo-url:' + name.toLowerCase()
  try {
    const saved = localStorage.getItem(key)
    if (saved) return saved
  } catch {
    // ignore storage problems
  }

  let url = null
  try {
    const mapped = findTitle(name)
    if (mapped) url = await fromSummary(mapped)
    if (!url) url = await fromSummary(name)
    if (!url) url = await fromSearch(name + ' plant food')
  } catch {
    url = null
  }

  if (url) {
    try {
      localStorage.setItem(key, url)
    } catch {
      // ignore storage problems
    }
  }
  return url
}

const pending = {}

// Returns a photo URL for the product name, or null if none is found
export function loadPhoto(name) {
  const clean = (name || '').trim()
  if (!clean) return Promise.resolve(null)
  const id = clean.toLowerCase()
  if (!pending[id]) {
    pending[id] = fetchPhoto(clean).then((url) => {
      if (!url) delete pending[id] // try again next time if nothing was found
      return url
    })
  }
  return pending[id]
}