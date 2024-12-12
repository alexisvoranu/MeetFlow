<template>
  <div class="card">
    <div class="card-header">{{ groupName }}</div>
    <div class="card-body">
      <p class="card-text">{{ description }}</p>
      <div class="card-actions">
        <button type="button" class="btn btn-danger" @click="deleteEventGroup">
          Delete
        </button>
        <button class="btn btn-primary" @click="handleSeeEventsClick">
          See events
        </button>
        <button
          type="button"
          class="btn btn-success"
          @click="downloadXlsForEventGroup"
        >
          Download XLS
        </button>
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

    const getUserDetailsFromLocalStorage = () => {
      const storedUserDetails = localStorage.getItem("userDetails");
      if (storedUserDetails) {
        userDetails.value = JSON.parse(storedUserDetails);
      }
    };

    const formatDate = (dateString) => {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString("ro-RO", options);
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
        console.log(data);
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
        const eventsResponse = await fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/events/getEventsByEventsGroup?groupId=${props.id}`
        );
        const events = await eventsResponse.json();

        for (const event of events) {
          if (event.status === "OPEN") {
            const participantsResponse = await fetch(
              `${
                import.meta.env.VITE_SERVER_URL
              }/participants/getByEvent?eventId=${event.id}`
            );
            const participants = await participantsResponse.json();
            const confirmationDetails = participants.map((p) => ({
              Name: p.participant.name,
              Email: p.participant.email,
              RegistrationTime: formatDate(p.registrationTime),
            }));

            const worksheet = XLSX.utils.json_to_sheet(confirmationDetails);
            XLSX.utils.book_append_sheet(workbook, worksheet, event.groupName);
          }
        }

        XLSX.writeFile(
          workbook,
          `Participants - Event_Group_${props.groupName}.xlsx`
        );
      } catch (error) {
        console.error(
          "Error while generating the xls file for the event group:",
          error
        );
      }
    };

    getUserDetailsFromLocalStorage();

    return {
      deleteEventGroup,
      userDetails,
      handleSeeEventsClick,
      downloadXlsForEventGroup,
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
  gap: 0.5rem;
}
</style>
