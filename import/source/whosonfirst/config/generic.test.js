const tap = require('tap')
const { abbreviation } = require('./generic')

// abbreviation
tap.test('abbreviation', (t) => {
  t.equal(abbreviation({}), undefined)

  // prefer shortcode
  t.equal(abbreviation({
    'wof:shortcode': 'wof:shortcode',
    'wof:abbreviation': 'wof:abbreviation'
  }), 'wof:shortcode')

  // else use abbreviation
  t.equal(abbreviation({
    'wof:abbreviation': 'wof:abbreviation'
  }), 'wof:abbreviation')

  // country OR dependecy
  for (const placetype of ['country', 'dependency']) {
    // prefer country_alpha3
    t.equal(abbreviation({
      'wof:placetype': placetype,
      'wof:country_alpha3': 'wof:country_alpha3',
      'qs:adm0_a3': 'qs:adm0_a3',
      'ne:adm0_a3': 'ne:adm0_a3',
      'wof:shortcode': 'wof:shortcode',
      'wof:abbreviation': 'wof:abbreviation'
    }), 'wof:country_alpha3')

    // prefer qs:adm0_a3
    t.equal(abbreviation({
      'wof:placetype': placetype,
      'qs:adm0_a3': 'qs:adm0_a3',
      'ne:adm0_a3': 'ne:adm0_a3',
      'wof:shortcode': 'wof:shortcode',
      'wof:abbreviation': 'wof:abbreviation'
    }), 'qs:adm0_a3')

    // prefer ne:adm0_a3
    t.equal(abbreviation({
      'wof:placetype': placetype,
      'ne:adm0_a3': 'ne:adm0_a3',
      'wof:shortcode': 'wof:shortcode',
      'wof:abbreviation': 'wof:abbreviation'
    }), 'ne:adm0_a3')
  }

  // dependency fallback to country_alpha3
  t.equal(abbreviation({
    'wof:placetype': 'dependency',
    'wof:country': 'wof:country'
  }), 'wof:country')

  t.end()
})
