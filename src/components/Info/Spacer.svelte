<div class="spacer"></div>

<style>
  div {
    position: relative;

    height: var(--border-width);
    background-color: var(--value-colour);
    width: 100%;
  }

  div::before,
  div::after {
    --height: 10px;
    --width: 5px;

    content: '';
    position: absolute;
    top: 0;

    width: var(--width);
    height: var(--height);

    background-color: var(--value-colour);
    margin-top: calc(-1 * var(--height) / 2.5);
  }

  div::before {
    left: 0;
    clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
  }

  div::after {
    right: 0;
    clip-path: polygon(100% 0%, 100% 100%, 0% 50%);
  }
</style>
