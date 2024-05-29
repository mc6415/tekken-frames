<script>
  import './app.css'
  import './layout.css'
</script>

<body>
  <header>
  </header>

  <main>
    <slot><!-- optional fallback --></slot>
  </main>

  <footer>
    <span
      class="flex w-full h-full justify-center items-center"
    >
      Created by Michael Coombes
    </span>
  </footer>
</body>

<style lang="postcss">
  body {
    @apply bg-lilac-500 text-white;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  nav {
    height: 50px;
    width: 100%;
    display: flex;
    background-color: red;
  }

  footer {
    @apply mt-6 bg-lilac-700;
    height: 50px;
    width: 100%;
    display: flex;
  }

  main {
    width: 100%;
    flex: 1;
    height: 100%;
  }
</style>