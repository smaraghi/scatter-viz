<script>
  import parseData from './data.js'
  import Chart from './components/Chart.svelte'
  import Legend from './components/Legend.svelte'

  const dataSrc = {
    expectancy:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vQvNMW8VRNwnRHTFZbpF9OKsfBSntgbAVOJBsAXApg4QRqei69MV5Nnf-lpQWHtRdCXjMI3j6tzggWj/pub?output=csv',

    expenditure:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vR9aTw3tUrAAEk1z-Ppz_c-o_KafnZ3H0JcS4HqgpmD3on7Bp12Abf-4GG8BscYG8DK1y2f6g4ndq95/pub?output=csv',
  }

  const data = loadData()

  async function loadData() {
    let res = await parseData({
      src: dataSrc,
    })
    return res
  }

  const init = () => {
    resize(mq)
  }

  let isMobile = false
  let mq = window.matchMedia('(max-width: 48em)')

  function resize(mediaQueryList) {
    if (mediaQueryList.matches) {
      isMobile = true
    } else {
      isMobile = false
    }
  }

  try {
    // Chrome & Firefox
    mq.addEventListener('change', (e) => {
      resize(e)
    })
  } catch (e1) {
    try {
      // Safari, because it doesn't support addEventListener...
      mq.addListener((e) => {
        resize(e)
      })
    } catch (e2) {
      console.error(e2)
    }
  }

  window.addEventListener('DOMContentLoaded', init)
</script>

<main class="interactive">
  <header class="interactive__header">
    <h1>Chart Title</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </p>
  </header>

  {#await data}
    <!-- <div class="loading-container">
    <div class="loading"></div>
  </div> -->
  {:then allData}
    <!-- <Options allData="{allData}" /> -->
    <Chart data="{allData}" isMobile="{isMobile}" />

    <!-- <div class="interactive__legend-container">
      <Legend />
    </div> -->

    <!-- <footer class="interactive__source">
      <a href="https://loremipsum.csis.org" class="source-holder"
        ><img
          src="./images/logo.svg"
          target="_blank"
          alt="Project Title"
          title="Project Title"
          width="300"
          height="31"
        /></a
      >
    </footer> -->
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</main>

<style type="text/scss" global>
  // @import './scss/components/_utilities.scss';
  // @import './scss/layout/_base.scss';
  // @import './scss/layout/_layout.scss';
  // @import './scss/components/_header.scss';
  // @import './scss/components/_source.scss';
  // @import './scss/components/_loading.scss';
</style>
