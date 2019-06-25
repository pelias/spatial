class StatsTicker {
  constructor () {
    this.running = false
    this.meta = {}
    this.state = {}
    this.operation = [
      {
        start: (meta, state) => {
          meta.time_start = new Date().getTime()
          state.elapsed_ms = 0
        },
        flush: (meta, state) => {
          meta.time_now = new Date().getTime()
          state.elapsed_ms = (meta.time_now - meta.time_start)
        }
      }
    ]
  }
  flush () {
    // run operations
    this.runOperations('flush')

    // print stats
    console.error(this.state)
  }
  runOperations (type) {
    // run operations
    this.operation.forEach(op => {
      if (op[type]) {
        op[type](this.meta, this.state)
      }
    })
  }
  start (freq) {
    if (this.running) { return }

    // run operations
    this.runOperations('start')

    // start ticker
    this.running = true
    this.frequency = freq
    this.interval = setInterval(this.flush.bind(this), freq || 1000)
  }
  stop () {
    if (!this.running) { return }

    this.running = false
    clearInterval(this.interval)

    this.flush()
  }
  addOperation (op) {
    this.operation.push(op)

    // if the ticker already started, run the start operation
    if (this.running && op.start) {
      op.start(this.meta, this.state)
    }
  }
  addIncrementOperation (field, func, perTick, perMs) {
    this.addOperation({
      start: (meta) => { meta[field] = func() },
      flush: (meta, state) => {
        let value = func()
        if (value > 0) { state[field] = value }

        if (perTick === true) {
          let perInterval = state[field] - meta[field]
          if (perInterval) {
            state[`${field}_per_tick`] = parseFloat((perInterval).toFixed(3))
          } else {
            delete state[`${field}_per_tick`]
          }
          meta[field] = value
        }

        if (perMs === true) {
          let perMilli = state[field] / state.elapsed_ms
          if (perMilli) {
            state[`${field}_avg_per_sec`] = parseFloat((perMilli * 1000).toFixed(3))
          } else {
            delete state[`${field}_avg_per_sec`]
          }
          meta[field] = value
        }
      }
    })
  }
}

const singleton = new StatsTicker()
module.exports = singleton
