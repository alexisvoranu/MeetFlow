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

    <div v-if="eventList && eventList.length > 0" class="events-list">
      <div class="list-group">
        <EventCard
          v-for="event in eventList"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventCard from "@/components/Organizer/EventCard.vue";
import OrganizerNavbar from "@/components/Organizer/OrganizerNavbar.vue";
import { SERVER_URL } from "@/constants";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "OrganizerEvents",
  components: {
    OrganizerNavbar,
    EventCard,
  },
  setup() {
    const route = useRoute();
    const groupId = route.query.groupId;
    const userDetails = ref(null);
    const eventName = ref("");
    const eventDescription = ref("");
    const eventStartDate = ref("");
    const eventEndDate = ref("");
    const eventList = ref([]);
    const groupDetails = ref(null);

    const getUserDetailsFromLocalStorage = () => {
      const storedUserDetails = localStorage.getItem("userDetails");
      if (storedUserDetails) {
        userDetails.value = JSON.parse(storedUserDetails);
      }
    };

    const formatFirestoreTimestamp = (timestamp) => {
      if (timestamp && timestamp._seconds && timestamp._nanoseconds) {
        const date = new Date(
          timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
        );
        return date.toISOString();
      }
      return null;
    };

    const getEventsByEventGroup = async () => {
      if (groupId) {
        try {
          const res = await fetch(
            `${SERVER_URL}/events/getEventsByEventsGroup?eventGroupId=${groupId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem(
                  "firebaseToken"
                )}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await res.json();
          eventList.value = data.map((event) => ({
            ...event,
            startDate:
              event.startDate instanceof Date
                ? event.startDate.toISOString()
                : formatFirestoreTimestamp(event.startDate),
            endDate:
              event.endDate instanceof Date
                ? event.endDate.toISOString()
                : formatFirestoreTimestamp(event.endDate),
          }));
          console.log(data);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      }
    };

    const handleSaveEvent = async (event) => {
      if (!userDetails.value || !groupDetails.value) {
        console.error("User or Group details not loaded yet.");
        return;
      }

      const eventDetails = {
        eventGroupId: groupId,
        event: {
          name: eventName.value,
          description: eventDescription.value,
          startDate: new Date(eventStartDate.value).toISOString(),
          endDate: new Date(eventEndDate.value).toISOString(),
          status: "Planned",
        },
      };

      try {
        const res = await fetch(`${SERVER_URL}/events/addEventToEventGroup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("firebaseToken")}`,
          },
          body: JSON.stringify(eventDetails),
        });
        const data = await res.json();
        eventList.value.push(data);
        const modalElement = document.getElementById("addEventModal");
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
        }
        eventName.value = "";
        eventDescription.value = "";
        eventStartDate.value = "";
        eventEndDate.value = "";
      } catch (error) {
        console.error("Error creating event:", error);
      }
    };

    onMounted(() => {
      getUserDetailsFromLocalStorage();
      getEventsByEventGroup();
    });

    watch(() => userDetails.value, getEventsByEventGroup);

    watch(() => groupId, getEventsByEventGroup, { immediate: true });

    return {
      eventName,
      eventDescription,
      eventStartDate,
      eventEndDate,
      eventList,
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
  padding: 2rem;
}

.list-group {
  width: 50%;
  margin-top: 2rem;
}

.event-actions {
  display: flex;
  gap: 0.5rem;
}
</style>
