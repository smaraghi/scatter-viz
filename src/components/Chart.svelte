<script>
  import { onMount } from 'svelte'
  import { scaleLinear, scaleSqrt } from 'd3-scale'
  import { extent, range } from 'd3-array'
  import { format } from 'd3-format'

  export let data
  console.log(data)

  const padding = { top: 20, right: 40, bottom: 40, left: 25 }
  const formatter = format('.1f')

  let figure
  let width = 500
  let height = 400

  let maxXVal = Math.ceil(Math.max(...data.map((d) => d.gdp)))
  let maxYVal = Math.ceil(Math.max(...data.map((d) => d.life_expectancy)))

  maxXVal = 1000000000000
  console.log(maxXVal, 'xVal')

  console.log(maxYVal, 'yval')

  $: xTicks = range(0, maxXVal, 200000000000)

  $: console.log(xTicks)

  $: yTicks = range(40, maxYVal + 20, 20)

  $: xScale = scaleLinear()
    .domain([0, Math.max(...xTicks)])
    .range([padding.left, width - padding.right])

  $: yScale = scaleLinear()
    .domain([0, Math.max(...yTicks)])
    .range([height - padding.bottom, padding.top])

  // Helper f(n) for formatDecimalPlaces
  function formatAmount(value) {
    if (window.innerWidth < 768) {
      return value.replace(/G/, 'B').slice(-1)[0]
    }

    if (value.includes('T')) {
      return ' trillion'
    } else if (value.includes('G')) {
      return ' billion'
    } else {
      return ' million'
    }
  }

  /* formats values up to two decimal places while maintaining 1-3 digits left of the first comma (eg 500.00B or 1.00T) */
  function formatDecimalPlaces(value) {
    let amt = formatAmount(format('.5s')(value))
    let numOne = format('$.5s')(value).split('.')[0]
    let numTwo = format('.5s')(value).split('.')[1].slice(0, 1)
    return numOne + '.' + numTwo + amt
  }

  const resize = () => {
    ;({ width, height } = figure.getBoundingClientRect())
  }

  onMount(resize)
</script>

<svelte:window on:resize="{resize}" />

<figure
  class="chart"
  bind:this="{figure}"
  bind:clientWidth="{width}"
  bind:clientHeight="{height}"
>
  <svg>
    <!-- data -->
    {#each data as country}
      <circle
        cx="{xScale(country.gdp)}px"
        cy="{yScale(country.life_expectancy)}px"
        r="5px"></circle>
    {/each}

    <!-- y axis -->
    <g class="axis y-axis">
      {#each yTicks as tick}
        <g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})">
          <line x1="{padding.left}" x2="{xScale(22)}"></line>
          <text x="{padding.left - 8}" y="+4">{tick}</text>
        </g>
      {/each}
    </g>

    <!-- x axis -->
    <g class="axis x-axis">
      {#each xTicks as tick}
        <g class="tick" transform="translate({xScale(tick)},0)">
          <line y1="{yScale(0)}" y2="{yScale(13)}"></line>
          <text y="{height - padding.bottom + 16}">{formatter(tick)}</text>
        </g>
      {/each}
    </g>
  </svg>
</figure>

<style>
  .chart {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }

  svg {
    position: relative;
    width: 100%;
    height: 400px;
  }
</style>
