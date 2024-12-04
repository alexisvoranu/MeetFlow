<template>
  <div class="home">
    <p>{{ message }}</p>
    <button @click="changeMessage">Schimbă mesajul</button>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "HomeView",
  setup() {
    const store = useStore();
    const message = computed(() => store.getters.message);
    const changeMessage = () => {
      store.dispatch("updateMessage", "Mesaj actualizat din Home");
    };
    return { message, changeMessage };
  },
};
</script>

<style scoped>
button,
p {
  margin-top: 5rem;
}
</style>
