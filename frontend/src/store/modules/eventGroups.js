import { SERVER_URL } from "@/constants";

export default {
  namespaced: true,
  state: () => ({
    eventGroups: [],
    organizerEmail: null,
    alert: {
      show: false,
      type: "",
      message: "",
    },
  }),
  mutations: {
    SET_EVENT_GROUPS(state, eventGroups) {
      state.eventGroups = eventGroups;
    },
    ADD_EVENT_GROUP(state, eventGroup) {
      state.eventGroups.push(eventGroup);
    },
    SET_ORGANIZER_EMAIL(state, email) {
      state.organizerEmail = email;
    },
    SET_ALERT(state, { show, type, message }) {
      state.alert = { show, type, message };
    },
  },
  actions: {
    async fetchEventGroups({ commit, state }) {
      if (!state.organizerEmail) return;

      try {
        const res = await fetch(
          `${SERVER_URL}/eventGroups/getAllEventGroupsForOrganizer?email=${state.organizerEmail}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("firebaseToken")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${res.status}`
          );
        }

        const data = await res.json();
        commit("SET_EVENT_GROUPS", data.eventGroups);
      } catch (error) {
        console.error("Error fetching event groups:", error);
      }
    },
    async saveEventGroup({ commit, state }, eventGroupDetails) {
      if (!state.organizerEmail) {
        console.error("Organizer email not set.");
        return;
      }

      const payload = {
        email: state.organizerEmail,
        eventGroup: eventGroupDetails,
      };

      try {
        const res = await fetch(
          `${SERVER_URL}/eventGroups/addEventGroupToOrganizer`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("firebaseToken")}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const newEventGroup = await res.json();

        if (res.ok) {
          commit("ADD_EVENT_GROUP", newEventGroup);
          window.location.reload();
        } else {
          commit("SET_ALERT", {
            show: true,
            type: "alert-danger",
            message: newEventGroup.errors[0].msg,
          });
        }

        setTimeout(() => {
          commit("SET_ALERT", { show: false, type: "", message: "" });
        }, 3000);
      } catch (error) {
        console.error("Error saving event group:", error);
      }
    },
  },
  getters: {
    eventGroups: (state) => state.eventGroups,
    organizerEmail: (state) => state.organizerEmail,
    alert: (state) => state.alert,
  },
};
