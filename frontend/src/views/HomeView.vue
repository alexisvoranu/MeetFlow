<template>
  <div class="home">
    <HomeNavbar />
    <AddDocument />
  </div>
</template>

<script>
// @ is an alias to /src
import AddDocument from "@/components/AddDocument.vue";
import HomeNavbar from "@/components/HomeNavbar.vue";

export default {
  name: "HomeView",
  components: {
    HomeNavbar,
    AddDocument,
  },
  setup() {},
};
</script>

<style scoped>
button,
p {
  margin-top: 5rem;
}
</style>
