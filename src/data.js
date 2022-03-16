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
  const expectancyPromise = d3Fetch.csv(src.expectancy, stringify)
  const expenditurePromise = d3Fetch.csv(src.expenditure, stringify)

  let data = Promise.all([expectancyPromise, expenditurePromise]).then(res => {
    let [dataset] = res

    dataset = res[0].reduce((acc, country) => {

      if (country.life_expectancy && (country.gdp || country.gdp === 0)) {
        const expCountry = res[1].find(e => e.country === country.country)

        if (expCountry && expCountry.health_expenditure) {
          return [...acc, { ...country, health_expenditure: expCountry.health_expenditure }]
        } else {
          return [...acc, country]
        }

      } else {
        return acc
      }
    }, [])

    console.log(dataset)

    return dataset
  })

  return data
}

export default parseData