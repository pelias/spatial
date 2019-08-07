// function returns the preferred buffer radius for a rank
const DEFAULT_RADIUS = 0.02

// https://github.com/openstreetmap/Nominatim/blob/511204c158d4e218d2c2ca83e03b308b26487aa0/sql/functions.sql#L673
function radius (rank) {
  if (rank.address === 0) {
    return DEFAULT_RADIUS
  } else if (rank.search <= 14) {
    return 1.2
  } else if (rank.search <= 15) {
    return 1
  } else if (rank.search <= 16) {
    return 0.5
  } else if (rank.search <= 17) {
    return 0.2
  } else if (rank.search <= 21) {
    return 0.05
  } else if (rank.search === 25) {
    return 0.005
  }

  return DEFAULT_RADIUS
}

module.exports = radius
