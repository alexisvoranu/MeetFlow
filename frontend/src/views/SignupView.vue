<template>
  <div class="main">
    <AppNavbar />
    <div class="sign-up-container">
      <div class="sign-up-form">
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
        <div class="form-title">Please enter your details below</div>
        <SignupForm :user-role="role" />
      </div>
    </div>
  </div>
</template>

<script>
import SignupForm from "@/components/Auth/SignupForm.vue";
import { ref } from "vue";

export default {
  name: "SignupView",
  components: {
    SignupForm,
  },
  setup() {
    const role = ref("participant");

    const handleRoleChange = (newRole) => {
      role.value = newRole;
    };

    return {
      role,
      handleRoleChange,
    };
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

.sign-up-container {
  display: flex;
  height: 92vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
}

.sign-up-form {
  width: 50%;
  background-color: lightskyblue;
  border-radius: 25px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border: 1px solid #ccc;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.sign-up-form:hover {
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

@media screen and (max-width: 700px) {
  .sign-up-form {
    width: 100%;
  }
  .form-title {
    font-size: 15px;
  }
  .role-selection-title {
    font-size: 15px;
  }
  .sign-up-container {
    height: 100vh;
  }
}
</style>
