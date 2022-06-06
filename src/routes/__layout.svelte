<slot />

<style>
  :global(*) {
    position: relative;
    box-sizing: border-box;
  }

  :global(:root) {
    --color-primary: #41a9f3;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: hsl(0 0% 98%);
    background-color: hsl(220 20% 14%);
  }

  :global(#box[data-state='idle']) {
    transition: all 0.3s ease-in-out;
  }
</style>
