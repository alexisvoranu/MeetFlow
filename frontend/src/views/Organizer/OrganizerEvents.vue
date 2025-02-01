<template>
  <div class="main">
    <OrganizerNavbar />
    <button
      type="button"
      class="btn btn-success btn-add-group mt-5"
      data-bs-toggle="modal"
      data-bs-target="#addEventModal"
    >
      Add event
    </button>

    <div v-if="events && events.length > 0" class="events-list">
      <div class="list-group">
        <EventCard
          v-for="event in events"
          :key="event.id"
          :eventDetails="event"
        />
      </div>
    </div>
    <h3 v-else class="my-5 no-events-message" style="color: white">
      This event group has no events.
    </h3>

    <div
      class="modal fade"
      id="addEventModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Add event</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSaveEvent">
              <div class="mb-3">
                <label for="eventName" class="form-label">Event Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="eventName"
                  placeholder="Please enter a name for the event group"
                  v-model="eventName"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="eventDescription" class="form-label"
                  >Event Description</label
                >
                <textarea
                  class="form-control"
                  id="eventDescription"
                  rows="4"
                  placeholder="Please enter a description for the event group"
                  v-model="eventDescription"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="eventStartDate" class="form-label"
                  >Start Date and Time</label
                >
                <input
                  type="datetime-local"
                  class="form-control"
                  id="eventStartDate"
                  v-model="eventStartDate"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="eventEndDate" class="form-label"
                  >End Date and Time</label
                >
                <input
                  type="datetime-local"
                  class="form-control"
                  id="eventEndDate"
                  v-model="eventEndDate"
                  required
                />
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" class="btn btn-primary">
                  Save event
                </button>
              </div>
            </form>
          </div>
          <!-- Alert container -->
          <div
            v-if="alert.show"
            :class="`alert ${alert.type} d-flex align-items-center`"
            role="alert"
            style="margin: 0px 20px 20px 20px"
          >
            <div>{{ alert.message }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventCard from "@/components/Organizer/EventCard.vue";
import OrganizerNavbar from "@/components/Organizer/OrganizerNavbar.vue";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import * as bootstrap from "bootstrap";
window.Modal = bootstrap.Modal;

export default {
  name: "OrganizerEvents",
  components: {
    OrganizerNavbar,
    EventCard,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const eventName = ref("");
    const eventDescription = ref("");
    const eventStartDate = ref("");
    const eventEndDate = ref("");

    const alert = computed(() => store.getters["organizerEvents/alert"]);
    const events = computed(() => store.getters["organizerEvents/events"]);
    const groupId = route.query.groupId;

    const getUserDetailsFromLocalStorage = () => {
      const storedUserDetails = localStorage.getItem("userDetails");
      if (storedUserDetails) {
        const userDetails = JSON.parse(storedUserDetails);
      }
    };

    const fetchEvents = () => {
      store.commit("organizerEvents/SET_GROUP_ID", groupId);
      store.dispatch("organizerEvents/fetchEventsByGroup");
    };

    const handleSaveEvent = async () => {
      const newEvent = {
        name: eventName.value,
        description: eventDescription.value,
        startDate: new Date(eventStartDate.value).toISOString(),
        endDate: new Date(eventEndDate.value).toISOString(),
      };

      await store.dispatch("organizerEvents/saveEvent", newEvent);
    };

    onMounted(() => {
      getUserDetailsFromLocalStorage();
      fetchEvents();
    });

    return {
      alert,
      events,
      eventName,
      eventDescription,
      eventStartDate,
      eventEndDate,
      handleSaveEvent,
    };
  },
};
</script>

<style scoped>
.main {
  min-height: 100vh;
  background-image: linear-gradient(
    to right bottom,
    #051937,
    #033152,
    #004b6c,
    #006684,
    #0c829a
  );
  height: 100%;
}

.events-list {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  padding-bottom: 5%;
}

.event-actions {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 600px) {
  .list-group {
    width: 100%;
    margin: 0.5rem;
  }
}

@media (min-width: 601px) and (max-width: 1000px) {
  .list-group {
    width: 90%;
    margin: 1rem;
  }
}

@media (min-width: 1001px) and (max-width: 1500px) {
  .list-group {
    width: 70%;
    margin: 1rem;
  }
}

@media (min-width: 1501px) {
  .list-group {
    width: 40%;
    margin-top: 2rem;
  }
}
</style>
