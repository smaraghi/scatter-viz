import * as d3Fetch from 'd3-fetch'

const stringFields = [
  'iso',
  'country',
  'region',
]

const stringify = d => {
  for (var i in d) {
    if (!stringFields.includes(i)) {
      d[i] = +d[i]
    }
  }
  return d
}

function parseData({ src }) {
  const scatterPromise = d3Fetch.csv(src.scatter, stringify)

  let data = Promise.all([scatterPromise]).then(res => {
    let [dataset] = res

    // Remove invalid values
    dataset = dataset.filter(d => d.life_expectancy)

    return dataset
  })

  console.log(data)
  return data
}

export default parseData