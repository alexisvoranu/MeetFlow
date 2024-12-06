<template>
  <div>
    <form class="signup-form" @submit.prevent="handleSignup">
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="name"
          placeholder="Enter your full name"
          v-model="name"
          required
        />
        <label for="name">Full Name</label>
      </div>

      <div class="form-floating mb-3">
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="name@example.com"
          v-model="email"
          required
        />
        <label for="email">Email address</label>
      </div>

      <div class="form-floating">
        <input
          type="password"
          class="form-control"
          id="password"
          placeholder="Password"
          v-model="password"
          required
        />
        <label for="password">Password</label>
      </div>

      <button type="submit" class="btn btn-primary mb-3 btn-create-account">
        Create account
      </button>
    </form>

    <div
      v-if="alert.show"
      :class="`alert ${alert.type} d-flex align-items-center`"
      role="alert"
    >
      <div>
        {{ alert.message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  name: "SignupForm",
  props: {
    userRole: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const alert = ref({ show: false, type: "", message: "" });

    const signup = () => {
      const userDetails = {
        name: name.value,
        email: email.value,
        password: password.value,
      };

      let signUpURL = import.meta.env.VITE_SERVER_URL;

      if (props.userRole === "organizer") {
        signUpURL += "/eventOrganizers/save";
      } else if (props.userRole === "participant") {
        signUpURL += "/participants/create";
      }

      fetch(signUpURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      })
        .then((res) => {
          switch (res.status) {
            case 404:
              setAlert({
                show: true,
                type: "alert-warning",
                message: "Missing name, email or password!",
              });
              break;
            case 400:
              setAlert({
                show: true,
                type: "alert-danger",
                message: "Email already in use!",
              });
              break;
            case 201:
              setAlert({
                show: true,
                type: "alert-success",
                message: "Account created successfully!",
              });
              break;
          }

          setTimeout(() => {
            alert.value = { show: false, type: "", message: "" };
          }, 1000);
        })
        .catch(() => {
          setAlert({
            show: true,
            type: "alert-info",
            message: "An error occurred while creating the account!",
          });

          setTimeout(() => {
            alert.value = { show: false, type: "", message: "" };
          }, 1000);
        });
    };

    const setAlert = (newAlert) => {
      alert.value = newAlert;
    };

    const handleSignup = () => {
      signup();
    };

    return {
      name,
      email,
      password,
      alert,
      handleSignup,
    };
  },
};
</script>

<style scoped>
.signup-form {
  padding: 20px;
}

.btn-create-account {
  margin-top: 20px;
}

.form-control {
  width: 100%;
}

.alert {
  height: 7%;
  justify-content: center;
  align-items: center;
}
</style>
