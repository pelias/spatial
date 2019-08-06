const fs = require('fs')
const tty = require('tty')
const options = { highWaterMark: 512 * 1024 }

module.exports = (filename) => {
  // handle aliases for stdin
  if (filename === '-' || filename === 'stdin') {
    filename = '/dev/stdin'
  }

  // stdin
  if (filename === '/dev/stdin') {
    if (process.stdin.isTTY || tty.isatty(process.stdin)) {
      console.error(`no data piped to ${filename}`)
      process.exit(1)
    }
    return process.stdin
  }

  // file
  try {
    fs.lstatSync(filename)
  } catch (e) {
    console.error(`failed to open file: ${filename}`)
    process.exit(1)
  }

  return fs.createReadStream(filename, options)
}
