<div class="container">
  <div class="image">
    <label for="image-upload">
      <span>Choose a profile picture: </span>
      <input type="file" id="image-upload" name="image" accept="image/*" />
    </label>
  </div>
</div>

<style>
  .container {
    flex: 1;
    height: 100%;
    display: grid;
    place-content: center;
  }
  .image {
    max-width: 700px;
    max-height: 1000px;
    width: 100%;
    height: 100%;

    background-color: rgb(27, 27, 27);
    border-radius: var(--radius);
    border: 1px solid var(--border);
  }
</style>
