import admin from "../firebase/firebase-admin.js";

export const getAllEvents = async () => {
  try {
    const snapshot = await admin.firestore().collection("organizers").get();

    let allEvents = [];

    snapshot.forEach((doc) => {
      const organizerData = doc.data();
      const eventGroups = organizerData.eventGroups || [];

      eventGroups.forEach((group) => {
        group.events.forEach((event) => {
          const { id, name, startDate, endDate, description, status } = event;
          allEvents.push({ id, name, startDate, endDate, description, status });
        });
      });
    });

    return allEvents;
  } catch (err) {
    console.error("Error fetching events from all organizers:", err);
    throw new Error("Failed to fetch events.");
  }
};

export const changeEventStatus = async (eventId, status) => {
  if (!eventId) {
    throw new Error("Event ID is required.");
  }

  try {
    const snapshot = await admin.firestore().collection("organizers").get();

    let organizerDoc = null;
    let eventGroups = null;
    let targetGroup = null;

    snapshot.forEach((doc) => {
      const data = doc.data();
      data.eventGroups?.forEach((group) => {
        const event = group.events?.find((e) => e.id === eventId);
        if (event) {
          organizerDoc = doc;
          eventGroups = data.eventGroups;
          targetGroup = group;
        }
      });
    });

    if (!organizerDoc || !targetGroup) {
      throw new Error("Event not found.");
    }

    const event = targetGroup.events.find((e) => e.id === eventId);

    if (!event) {
      throw new Error("Event not found.");
    }

    event.status = status;

    await admin
      .firestore()
      .collection("organizers")
      .doc(organizerDoc.id)
      .update({
        eventGroups,
      });

    return { message: "Event status updated to Closed successfully." };
  } catch (error) {
    console.error("Error closing event:", error);
    throw new Error("Failed to update event status.");
  }
};
