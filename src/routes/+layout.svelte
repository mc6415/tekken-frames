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

  <footer></footer>
</body>

<style lang="postcss">
  body {
    @apply bg-teal-800 font-mono text-white;
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  nav {
    height: 50px;
    width: 100%;
    display: flex;
    background-color: red;
  }

  footer {
    height: 50px;
    width: 100%;
    display: flex;
    background: blue;
  }

  main {
    width: 100%;
    flex: 1;
    height: 100%;
  }
</style>