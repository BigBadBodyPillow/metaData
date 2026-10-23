<script lang="ts">
  let { name, value = '' } = $props();
</script>

<div class="field">
  <div class="name">{name}</div>
  <div class="value">{value}</div>
</div>

<style>
  .field {
    display: flex;
    overflow: hidden;
  }

  .field > div {
    padding: var(--spacing-8);
  }

  .name {
    width: var(--field-name-width);
    background-color: rgb(5, 5, 5);
    border-right: 1px solid var(--value-colour);
  }

  .value {
    flex: 1;
  }
</style>
