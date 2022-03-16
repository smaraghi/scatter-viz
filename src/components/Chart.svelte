<script>
  import { onMount } from 'svelte'
  import { scaleLinear, scaleSqrt } from 'd3-scale'
  import { extent, range } from 'd3-array'
  import { format } from 'd3-format'

  export let data

  const padding = { top: 20, right: 40, bottom: 40, left: 25 }
  const formatter = format('.2s')

  let figure
  let width = 600
  let height = 600

  let maxXVal = Math.ceil(Math.max(...data.map((d) => d.health_expenditure)))
  let maxYVal = Math.ceil(Math.max(...data.map((d) => d.life_expectancy)))

  console.log(maxXVal, 'xVal')

  console.log(maxYVal, 'yval')

  $: xTicks = range(0, maxXVal, 1500)

  $: console.log(xTicks)

  $: yTicks = range(40, maxYVal + 10, 10)

  $: xScale = scaleLinear()
    .domain([0, Math.max(...xTicks)])
    .range([padding.left, width - padding.right])

  $: yScale = scaleLinear()
    .domain([40, Math.max(...yTicks)])
    .range([height - padding.bottom, padding.top])

  $: rScale = scaleSqrt()
    .domain(extent(data, (d) => d.gdp))
    .range([4, 25])

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
        cx="{xScale(country.health_expenditure)}px"
        cy="{yScale(country.life_expectancy)}px"
        r="{rScale(country.gdp)}"
      >
      </circle>
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
    <text
      class="interactive__subheading subheading-x"
      stroke="black"
      fill="currentColor"
    >
      Vaccine Diplomacy Index
    </text>
  </svg>
</figure>

<style type="text/scss" global>
  .chart {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  svg {
    position: relative;
    width: 100%;
    height: 450px;
  }
</style>
