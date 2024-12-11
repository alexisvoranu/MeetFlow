<template>
  <nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
    <div class="container-fluid">
      <a href="" class="navbar-brand" @click="navigate('/organizerHome')">
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
              @click="navigate('/eventGroups/all')"
            >
              Manage Events
            </button>
          </li>
        </ul>
      </div>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item" v-if="isLoggedIn">
            <button class="nav-link active mx-3">
              Bună, {{ numeUtilizator }}
            </button>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <button
              class="btn btn-warning"
              aria-current="page"
              @click="handleSignOut"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { onMounted, ref } from "vue";

export default {
  name: "ParticipantNavbar",
  setup() {
    const router = useRouter();
    const isLoggedIn = ref(false);
    const numeUtilizator = ref("");
    const auth = getAuth();

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          isLoggedIn.value = true;
          numeUtilizator.value = user.displayName || "Utilizator";
        } else {
          isLoggedIn.value = false;
          numeUtilizator.value = "";
        }
      });
    });

    const navigate = (path) => {
      router.push(path);
    };

    const handleSignOut = () => {
      localStorage.removeItem("firebaseToken");
      localStorage.removeItem("userDetails");
      signOut(auth)
        .then(() => {
          router.push("/");
        })
        .catch((error) => {
          console.error("Eroare la deconectare:", error);
        });
    };

    return { navigate, isLoggedIn, handleSignOut, numeUtilizator };
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
