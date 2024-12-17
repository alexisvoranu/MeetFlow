import { SERVER_URL } from "@/constants";

export default {
  namespaced: true,
  state: () => ({
    events: [],
    groupId: null,
    alert: {
      show: false,
      type: "",
      message: "",
    },
  }),
  mutations: {
    SET_EVENTS(state, events) {
      state.events = events;
    },
    ADD_EVENT(state, event) {
      state.events.push(event);
    },
    SET_GROUP_ID(state, groupId) {
      state.groupId = groupId;
    },
    SET_ALERT(state, { show, type, message }) {
      state.alert = { show, type, message };
    },
  },
  actions: {
    async fetchEventsByGroup({ commit, state }) {
      if (!state.groupId) return;

      try {
        const res = await fetch(
          `${SERVER_URL}/events/getEventsByEventsGroup?eventGroupId=${state.groupId}`,
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
            errorData.message || `HTTP error! status: ${res.status}`
          );
        }

        const data = await res.json();
        commit("SET_EVENTS", data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    },
    async saveEvent({ commit, state }, eventDetails) {
      if (!state.groupId) {
        console.error("Group ID not set.");
        return;
      }

      const payload = {
        eventGroupId: state.groupId,
        event: {
          ...eventDetails,
          status: "Open",
        },
      };

      try {
        const res = await fetch(`${SERVER_URL}/events/addEventToEventGroup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("firebaseToken")}`,
          },
          body: JSON.stringify(payload),
        });

        const newEvent = await res.json();
        if (res.ok) {
          commit("ADD_EVENT", newEvent);
          window.location.reload();
        } else {
          commit("SET_ALERT", {
            show: true,
            type: "alert-danger",
            message: newEvent.errors[0].msg,
          });
        }

        setTimeout(() => {
          commit("SET_ALERT", { show: false, type: "", message: "" });
        }, 3000);
      } catch (error) {
        console.error("Error saving event:", error);
      }
    },
  },
  getters: {
    events: (state) => state.events,
    groupId: (state) => state.groupId,
    alert: (state) => state.alert,
  },
};
