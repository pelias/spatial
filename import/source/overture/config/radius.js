// function returns the buffer radius for Overture division theme Point geometries
// based on the cartography.prominence value
// prominence typically ranges from ~20 (small localities) to ~90 (major cities)
const DEFAULT_PROMINENCE = 30

function radius (prominence) {
  const p = prominence || DEFAULT_PROMINENCE

  // scale prominence to reasonable buffer sizes
  // high prominence (80+): ~0.10 degrees (major cities like Auckland)
  // medium prominence (50-80): 0.03-0.10 degrees (towns/cities)
  // low prominence (<50): 0.01-0.03 degrees (small localities)
  if (p >= 80) {
    return 0.05 + ((p - 80) / 200) // 0.05 to 0.10+ for major cities
  } else if (p >= 50) {
    return 0.02 + ((p - 50) / 100) // 0.02 to 0.05 for cities/towns
  } else if (p >= 30) {
    return 0.01 + ((p - 30) / 200) // 0.01 to 0.02 for localities
  } else {
    return 0.01 // minimum 0.01 degrees
  }
}

module.exports = radius
