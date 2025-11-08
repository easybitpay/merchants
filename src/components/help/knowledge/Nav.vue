<script setup>
const scrollToId = (id) => {
  document.getElementById(id).scrollIntoView()
}
</script>

<template>
  <div class="d-none d-md-block">
    <nav id="knowledge-nav" class="scroll-spy">
      <nav class="nav flex-column gap-2">
        <a class="nav-link" href="#item-1" @click.prevent="scrollToId('item-1')">Item 1</a>
        <nav class="nav child flex-column">
          <a class="nav-link" href="#item-1-1" @click.prevent="scrollToId('item-1-1')">
            Item 1-1
          </a>
          <a class="nav-link" href="#item-1-2" @click.prevent="scrollToId('item-1-2')">
            Item 1-2
          </a>
        </nav>
        <a class="nav-link" href="#item-2" @click.prevent="scrollToId('item-2')">Item 2</a>
        <a class="nav-link" href="#item-3" @click.prevent="scrollToId('item-3')">Item 3</a>
        <nav class="nav child flex-column">
          <a class="nav-link" href="#item-3-1" @click.prevent="scrollToId('item-3-1')">
            Item 3-1
          </a>
          <a class="nav-link" href="#item-3-2" @click.prevent="scrollToId('item-3-2')">
            Item 3-2
          </a>
        </nav>
      </nav>
    </nav>
  </div>
</template>
