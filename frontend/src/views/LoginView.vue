<template>
  <div class="main">
    <div class="login-container">
      <div class="login-form">
        <div class="role-selection">
          <div class="role-selection-title">Please select your role</div>
          <div
            class="btn-group"
            role="group"
            aria-label="Basic radio toggle button group"
          >
            <input
              type="radio"
              class="btn-check"
              name="btnradio"
              id="btnradio1"
              autocomplete="off"
              @change="handleRoleChange('organizer')"
              :checked="role === 'organizer'"
            />
            <label class="btn btn-outline-primary" for="btnradio1"
              >Event Organizer</label
            >

            <input
              type="radio"
              class="btn-check"
              name="btnradio"
              id="btnradio2"
              autocomplete="off"
              @change="handleRoleChange('participant')"
              :checked="role === 'participant'"
            />
            <label class="btn btn-outline-primary" for="btnradio2"
              >Participant</label
            >
          </div>
        </div>
        <div class="form-title mb-3">Please enter your credentials</div>
        <LoginForm :userRole="role" />
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/Auth/LoginForm.vue";

export default {
  name: "LoginView",
  components: {
    LoginForm,
  },
  data() {
    return {
      role: "participant",
    };
  },
  methods: {
    handleRoleChange(newRole) {
      this.role = newRole;
    },
  },
};
</script>

<style scoped>
.main {
  min-height: 100vh;
  height: 100%;
  background-image: linear-gradient(
    to right bottom,
    #051937,
    #033152,
    #004b6c,
    #006684,
    #0c829a
  );
}

.login-container {
  display: flex;
  height: 92vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
}

.login-form {
  width: 50%;
  background-color: lightskyblue;
  border-radius: 25px;
  padding: 20px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border: 1px solid #ccc;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.login-form:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 16px 0 rgba(0, 0, 0, 0.24),
    0 14px 28px 0 rgba(0, 0, 0, 0.22);
}

.form-title {
  font-size: 20px;
  font-weight: bold;
  margin-top: 40px;
}

.role-selection-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

@media screen and (max-width: 900px) {
  .login-container {
    padding: 15px;
  }
  .login-form {
    width: 100%;
  }
  .form-title {
    font-size: 15px;
  }
  .role-selection-title {
    font-size: 15px;
  }
  .login-container {
    height: 100vh;
  }
}
</style>
