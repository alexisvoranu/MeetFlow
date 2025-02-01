<template>
  <div class="card">
    <div class="card-header">{{ groupName }}</div>
    <div class="card-body">
      <p class="card-text">{{ description }}</p>
      <div class="card-actions">
        <button class="btn btn-primary" @click="handleSeeEventsClick">
          See events
        </button>

        <button
          type="button"
          class="btn btn-success"
          @click="downloadXlsForEventGroup"
        >
          Download XLSX
        </button>

        <button class="btn btn-warning" @click="openUpdateModal">Update</button>

        <button type="button" class="btn btn-danger" @click="deleteEventGroup">
          Delete
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="isModalOpen"
      class="modal fade show"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-modal="true"
      style="display: block"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Update event group
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="closeUpdateModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateEventGroup">
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
                  >Event Group Description</label
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
                  @click="closeUpdateModal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  class="btn btn-success"
                  :disabled="isUpdating"
                >
                  {{ isUpdating ? "Updating..." : "Update" }}
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
import { SERVER_URL } from "@/constants";
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as XLSX from "xlsx";

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    groupName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const userDetails = ref(null);
    const isModalOpen = ref(false);
    const eventGroupName = ref(props.groupName);
    const eventGroupDescription = ref(props.description);
    const isUpdating = ref(false);

    const getUserDetailsFromLocalStorage = () => {
      const storedUserDetails = localStorage.getItem("userDetails");
      if (storedUserDetails) {
        userDetails.value = JSON.parse(storedUserDetails);
      }
    };

    const deleteEventGroup = async () => {
      try {
        const res = await fetch(
          `${SERVER_URL}/eventGroups/deleteEventGroupForOrganizer?eventGroupId=${props.id}&email=${userDetails.value.email}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("firebaseToken")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    };

    const handleSeeEventsClick = () => {
      router.push({
        name: "allEventsForOrganizer",
        query: {
          groupId: props.id,
        },
      });
    };

    const downloadXlsForEventGroup = async () => {
      const workbook = XLSX.utils.book_new();

      try {
        const participantsResponse = await fetch(
          `${SERVER_URL}/participants/getParticipantsForEventGroup?eventGroupId=${props.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("firebaseToken")}`,
              "Content-Type": "application/json",
            },
          }
        );
        const participants = await participantsResponse.json();

        const formattedParticipants = participants.map((participant) => ({
          Name: participant.name,
          Email: participant.email,
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedParticipants);

        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          props.groupName || "Participants"
        );

        XLSX.writeFile(
          workbook,
          `Participants - Event_Group_${props.groupName || "Unnamed"}.xlsx`
        );
      } catch (error) {
        console.error(
          "Error while generating the xls file for the event group:",
          error
        );
      }
    };

    const openUpdateModal = () => {
      isModalOpen.value = true;
    };

    const closeUpdateModal = () => {
      isModalOpen.value = false;
    };

    const updateEventGroup = async () => {
      isUpdating.value = true;
      try {
        const res = await fetch(
          `${SERVER_URL}/eventGroups/updateEventGroupForOrganizer`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("firebaseToken")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userDetails.value.email,
              eventGroupId: props.id,
              groupName: eventGroupName.value,
              description: eventGroupDescription.value,
            }),
          }
        );
        if (res.ok) {
          closeUpdateModal();
          window.location.reload();
        } else {
          const errorData = await res.json();
          if (errorData.errors) {
            errorData.errors.forEach((error) => {
              alert(error.msg);
            });
          }
        }
      } catch (error) {
        console.error("Error updating event group:", error);
      } finally {
        isUpdating.value = false;
      }
    };

    getUserDetailsFromLocalStorage();

    return {
      deleteEventGroup,
      userDetails,
      handleSeeEventsClick,
      downloadXlsForEventGroup,
      openUpdateModal,
      closeUpdateModal,
      updateEventGroup,
      isModalOpen,
      eventGroupName,
      eventGroupDescription,
      isUpdating,
    };
  },
};
</script>

<style scoped>
.card {
  margin: 2rem;
}

.card-header {
  text-align: left;
}

.card-body {
  display: flex;
  flex-direction: column;
}

.card-title {
  text-align: left;
}

.card-text {
  text-align: left;
}

.card-actions {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
