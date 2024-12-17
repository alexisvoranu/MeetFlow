<template>
  <div class="main-container-participant-events">
    <ParticipantNavbar />

    <button
      type="button"
      class="btn btn-success btn-attend-event"
      data-bs-toggle="modal"
      data-bs-target="#attendEventModal"
    >
      Attend new event
    </button>

    <div v-if="events && events.length > 0" class="events-list">
      <div class="list-group">
        <ParticipantEventCard
          v-for="event in events.slice().reverse()"
          :key="event.id"
          :eventDetails="event"
        />
      </div>
    </div>
    <h3 v-else class="my-5 no-events-message" style="color: white">
      You have not attended any events yet.
    </h3>

    <!-- Modal -->
    <div
      class="modal fade modal-insert-access-token"
      id="attendEventModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Event access token
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <form
              v-if="modalContent === 'token'"
              class="access-token-form"
              @submit.prevent="handleTokenSubmit"
            >
              <input
                type="text"
                class="form-control"
                placeholder="Enter access token"
                v-model="accessToken"
                required
              />
              <button
                type="submit"
                class="btn btn-primary btn-submit-access-token"
              >
                Submit Token
              </button>
            </form>
          </div>

          <!-- Alert container -->
          <div
            v-if="alert.show"
            :class="`alert ${alert.type} d-flex align-items-center`"
            role="alert"
            style="margin: 20px"
          >
            <div>{{ alert.message }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ParticipantEventCard from "@/components/Participant/ParticipantEventCard.vue";
import ParticipantNavbar from "@/components/Participant/ParticipantNavbar.vue";
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  name: "ParticipantEvents",
  components: { ParticipantNavbar, ParticipantEventCard },
  setup() {
    const store = useStore();
    const modalContent = ref("token");
    const accessToken = ref("");
    const userDetails = ref(null);

    const alert = computed(() => store.getters["events/alert"]);
    const events = computed(() => store.getters["events/events"]);

    const fetchEvents = () => {
      if (userDetails.value && userDetails.value.email) {
        store.dispatch("events/fetchEvents", userDetails.value.email);
      }
    };

    const handleTokenSubmit = () => {
      if (accessToken.value && userDetails.value.email) {
        store.dispatch("events/handleTokenSubmit", {
          eventId: accessToken.value,
          email: userDetails.value.email,
        });
      }
    };

    const formatDate = (dateString) => {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      };
      return new Date(dateString).toLocaleString("ro-RO", options);
    };

    const setModalContent = (content) => {
      modalContent.value = content;
    };

    onMounted(() => {
      const storedUserDetails = localStorage.getItem("userDetails");
      if (storedUserDetails) {
        userDetails.value = JSON.parse(storedUserDetails);
        fetchEvents();
      }
    });

    return {
      modalContent,
      accessToken,
      alert,
      events,
      setModalContent,
      handleTokenSubmit,
      formatDate,
    };
  },
};
</script>

<style scoped>
.main-container-participant-events {
  display: flex;
  flex-direction: column;
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

.btn-attend-event {
  width: 12rem;
  height: 3rem;
  margin-top: 2rem;
  align-self: center;
}

.access-token-form {
  width: 100%;
}

.btn-submit-access-token {
  margin-top: 2rem;
}

.events-list {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
}

.list-group {
  width: 35%;
  margin-top: 2rem;
}
</style>
