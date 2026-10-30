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
    min-height: 37px;
  }

  .name {
    width: var(--field-name-width);
    background-color: rgb(5, 5, 5);
    border-right: 1px solid var(--value-colour);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .value {
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
