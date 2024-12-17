<template>
  <OrganizerNavbar />
  <div class="main">
    <button
      type="button"
      class="btn btn-success btn-add-group"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
    >
      Add event group
    </button>
    <div class="event-groups-cards">
      <div id="card" v-if="eventGroupsList.length > 0">
        <EventGroupCard
          v-for="eventGroup in eventGroupsList"
          :key="eventGroup.id"
          v-bind="eventGroup"
        />
      </div>
      <p v-else style="color: white" class="no-events-message mt-3">
        You have not created any event groups.
      </p>
    </div>

    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Add event group
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSaveEventGroup">
              <div class="mb-3">
                <label for="eventGroupName" class="form-label"
                  >Event Group Name</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="eventGroupName"
                  placeholder="Please enter a name for the event group"
                  v-model="eventGroupName"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="eventGroupDescription" class="form-label"
                  >Event group Description</label
                >
                <textarea
                  class="form-control"
                  id="eventGroupDescription"
                  rows="4"
                  placeholder="Please enter a description for the event group"
                  v-model="eventGroupDescription"
                  required
                ></textarea>
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
                  Save event group
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
import EventGroupCard from "@/components/Organizer/EventGroupCard.vue";
import OrganizerNavbar from "@/components/Organizer/OrganizerNavbar.vue";
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import * as bootstrap from "bootstrap";
window.Modal = bootstrap.Modal;

export default {
  name: "OrganizerEventGroups",
  components: {
    EventGroupCard,
    OrganizerNavbar,
  },
  setup() {
    const store = useStore();

    const eventGroupName = ref("");
    const eventGroupDescription = ref("");

    const eventGroupsList = computed(
      () => store.getters["eventGroups/eventGroups"]
    );
    const alert = computed(() => store.getters["eventGroups/alert"]);

    const fetchEventGroups = () => {
      const storedUserDetails = localStorage.getItem("userDetails");
      if (storedUserDetails) {
        const userDetails = JSON.parse(storedUserDetails);
        store.commit("eventGroups/SET_ORGANIZER_EMAIL", userDetails.email);
        store.dispatch("eventGroups/fetchEventGroups");
      }
    };

    const handleSaveEventGroup = async () => {
      if (!eventGroupName.value || !eventGroupDescription.value) {
        alert("Please fill in all fields.");
        return;
      }

      const eventGroupDetails = {
        groupName: eventGroupName.value,
        description: eventGroupDescription.value,
      };

      await store.dispatch("eventGroups/saveEventGroup", eventGroupDetails);
    };

    onMounted(fetchEventGroups);

    return {
      alert,
      eventGroupName,
      eventGroupDescription,
      eventGroupsList,
      handleSaveEventGroup,
    };
  },
};
</script>

<style scoped>
.main {
  background-image: linear-gradient(
    to right bottom,
    #051937,
    #033152,
    #004b6c,
    #006684,
    #0c829a
  );
  width: 100%;
  height: 93.25vh;
}

.event-groups-cards {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
}

.event-group-card {
  flex: 1 1 300px;
  margin: 0.5rem;
}

@media (max-width: 600px) {
  .event-group-card {
    flex-basis: 100%;
  }
}

@media (min-width: 601px) and (max-width: 1000px) {
  .event-group-card {
    flex-basis: calc(50% - 1rem);
  }
}

@media (min-width: 1001px) {
  .event-group-card {
    flex-basis: calc(33.33% - 1rem);
  }
}

.no-events-message {
  font-size: 2rem;
}

.main-container {
  display: flex;
  flex-direction: column;
}

.btn-add-group {
  width: 10rem;
  height: 3rem;
  margin-top: 2rem;
  margin-right: 2rem;
  align-self: flex-end;
}

#card {
  width: 35%;
}
</style>
