<template>
  <nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
    <div class="container-fluid">
      <a class="navbar-brand" @click="navigate('/')">
        <small>MeetFlow</small>
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <button
              class="nav-link active"
              aria-current="page"
              @click="navigate('/login')"
            >
              Login
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link active"
              aria-current="page"
              @click="navigate('/signup')"
            >
              Sign up
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "HomeNavbar",
  methods: {
    navigate(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style scoped>
.navbar {
  font-size: 20px;
}

.navbar-brand {
  cursor: pointer;
  font-weight: bolder;
}
</style>
