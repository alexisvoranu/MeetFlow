<template>
  <nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
    <div class="container-fluid">
      <a class="navbar-brand" @click="navigate('/participantHome')">
        <small>MeetFlow</small>
      </a>

      <div class="navbar-divider"></div>

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
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <button
              class="nav-link active"
              aria-current="page"
              @click="navigate('/participant/events/all')"
            >
              Attend Event
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "ParticipantNavbar",
  setup() {
    const router = useRouter();

    const navigate = (path) => {
      router.push(path);
    };

    return { navigate };
  },
};
</script>

<style scoped>
.navbar-text {
  font-size: 15px;
}

.navbar-divider {
  border-left: 1px solid #ffffff;
  height: 2rem;
  margin: 0 10px;
}
</style>
