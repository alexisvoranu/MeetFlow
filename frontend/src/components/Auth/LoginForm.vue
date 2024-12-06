<template>
  <div>
    <form class="login-form-fields" @submit.prevent="handleLogin">
      <div class="form-floating mb-3">
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="name@example.com"
          required
          v-model="email"
        />
        <label for="email">Email address</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="password"
          class="form-control"
          id="password"
          placeholder="Password"
          required
          v-model="password"
        />
        <label for="password">Password</label>
      </div>
      <button type="submit" class="btn btn-primary mb-3 btn-login">
        Login
      </button>
    </form>

    <div
      v-if="alert.show"
      :class="`alert ${alert.type} d-flex align-items-center`"
      role="alert"
    >
      <div>{{ alert.message }}</div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { SERVER_URL } from "@/constants";

export default {
  name: "LoginForm",
  props: {
    userRole: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const alert = ref({ show: false, type: "", message: "" });

    const handleLogin = () => {
      const userDetails = {
        email: email.value,
        password: password.value,
      };

      let loginURL = SERVER_URL;

      if (props.userRole === "organizer") {
        loginURL += "/eventOrganizers/login";
      } else if (props.userRole === "participant") {
        loginURL += "/participants/login";
      }

      fetch(loginURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      })
        .then(async (res) => {
          const data = await res.json();
          if (res.ok) {
            localStorage.setItem("userDetails", JSON.stringify(data));
            if (props.userRole === "organizer") {
              router.push("/organizerHome");
            } else if (props.userRole === "participant") {
              router.push("/participantHome");
            }
          } else {
            throw new Error(
              data.message ||
                "An error occurred while trying to authenticate you!"
            );
          }
        })
        .catch((error) => {
          alert.value = {
            show: true,
            type: "alert-danger",
            message: error.message,
          };
          setTimeout(() => {
            alert.value = { show: false, type: "", message: "" };
          }, 1000);
        });
    };

    return {
      email,
      password,
      alert,
      handleLogin,
    };
  },
};
</script>

<style scoped>
.login-form-fields {
  padding: 20px;
}

.btn-login {
  margin-top: 20px;
}
</style>
