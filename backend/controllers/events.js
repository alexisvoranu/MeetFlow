import admin from "../firebase/firebase-admin.js";

export const getAllEvents = async (req, res) => {
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

    if (allEvents.length === 0) {
      return res
        .status(404)
        .json({ message: "No events found across all organizers." });
    }

    res.status(200).json(allEvents);
  } catch (err) {
    console.error("Error fetching events from all organizers:", err);
    res.status(500).json({ message: "Failed to fetch events." });
  }
};

export const getAllEventsForGroup = async (req, res) => {
  const id = req.query.eventGroupId;

  if (!id) {
    return res.status(400).json({ message: "Event group ID is required." });
  }

  try {
    const snapshot = await admin.firestore().collection("organizers").get();

    let events = null;

    snapshot.forEach((doc) => {
      const organizerData = doc.data();
      const eventGroups = organizerData.eventGroups || [];

      const matchingGroup = eventGroups.find((group) => group.id === id);

      if (matchingGroup) {
        events = matchingGroup.events || [];
      }
    });

    if (events === null) {
      return res.status(404).json({ message: "Event group not found." });
    }

    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events for event group:", err);
    res.status(500).json({ message: "Failed to fetch events." });
  }
};

export const getAllEventsForOrganizer = async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const snapshot = await admin.firestore().collection("organizers").get();

    let events = [];

    snapshot.forEach((doc) => {
      const organizerData = doc.data();

      if (organizerData.email === email) {
        const eventGroups = organizerData.eventGroups || [];

        eventGroups.forEach((group) => {
          group.events.forEach((event) => {
            const { id, name, startDate, endDate, description, status } = event;
            events.push({ id, name, startDate, endDate, description, status });
          });
        });
      }
    });

    if (events.length === 0) {
      return res
        .status(404)
        .json({ message: "No events found for this organizer." });
    }

    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events for organizer:", err);
    res.status(500).json({ message: "Failed to fetch events." });
  }
};

export const getEventsForParticipant = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const organizerSnapshot = await admin
      .firestore()
      .collection("organizers")
      .get();

    let eventsForParticipant = [];

    organizerSnapshot.forEach((doc) => {
      const organizerData = doc.data();
      const organizerName = organizerData.name;
      const organizerEmail = organizerData.email;
      const groups = organizerData.eventGroups || [];

      groups.forEach((group) => {
        group.events?.forEach((event) => {
          const participants = event.participants || [];
          const participant = participants.find((p) => p.email === email);
          if (participant) {
            eventsForParticipant.push({
              organizerName: organizerName,
              organizerEmail: organizerEmail,
              eventGroupName: group.groupName,
              eventGroupId: group.id,
              eventId: event.id,
              eventName: event.name,
              eventStartDate: event.startDate,
              eventEndDate: event.endDate,
              eventDescription: event.description,
              eventStatus: event.status,
            });
          }
        });
      });
    });

    if (eventsForParticipant.length === 0) {
      return res
        .status(404)
        .json({ message: "No events found for this participant." });
    }

    res.status(200).json(eventsForParticipant);
  } catch (err) {
    console.error("Error fetching events for participant:", err);
    res.status(500).json({ message: "Failed to fetch events." });
  }
};

export const getEventsByStatus = async (req, res) => {
  const email = req.query.email;
  const status = req.query.status;

  if (!email || !status) {
    return res.status(400).json({ message: "Email and status are required." });
  }

  try {
    const snapshot = await admin.firestore().collection("organizers").get();

    let events = [];

    snapshot.forEach((doc) => {
      const organizerData = doc.data();

      if (organizerData.email === email) {
        const eventGroups = organizerData.eventGroups || [];

        eventGroups.forEach((group) => {
          group.events.forEach((event) => {
            if (event.status === status) {
              const { id, name, startDate, endDate, description, status } =
                event;
              events.push({
                id,
                name,
                startDate,
                endDate,
                description,
                status,
              });
            }
          });
        });
      }
    });

    if (events.length === 0) {
      return res.status(404).json({
        message: `No events found for status ${status} for this organizer.`,
      });
    }

    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events by status for organizer:", err);
    res.status(500).json({ message: "Failed to fetch events by status." });
  }
};

export const addEventToEventGroup = async (req, res) => {
  const { eventGroupId, event } = req.body;

  if (
    !eventGroupId ||
    !event.name ||
    !event.description ||
    !event.startDate ||
    !event.endDate ||
    !event.status
  ) {
    return res.status(400).json({
      message:
        "Event group ID and all event details (name, description, startDate, endDate, status) are required.",
    });
  }

  try {
    const snapshot = await admin.firestore().collection("organizers").get();

    let organizerDoc = null;
    let eventGroups = null;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const group = data.eventGroups?.find((g) => g.id === eventGroupId);
      if (group) {
        organizerDoc = doc;
        eventGroups = data.eventGroups;
      }
    });

    if (!organizerDoc) {
      return res.status(404).json({ message: "Event group not found." });
    }

    const targetGroup = eventGroups.find((g) => g.id === eventGroupId);

    if (!targetGroup.events) {
      targetGroup.events = [];
    }

    const newEventId = admin.firestore().collection("events").doc().id;

    const newEvent = {
      id: newEventId,
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      status: event.status,
    };

    targetGroup.events.push(newEvent);

    await admin
      .firestore()
      .collection("organizers")
      .doc(organizerDoc.id)
      .update({
        eventGroups,
      });

    res
      .status(200)
      .json({ message: "Event added successfully.", event: newEvent });
  } catch (err) {
    console.error("Error adding event to event group:", err);
    res.status(500).json({ message: "Failed to add event." });
  }
};

export const updateEventInEventGroup = async (req, res) => {
  const { eventId, email, name, description, startDate, endDate } = req.body;

  if (!eventId || !email) {
    return res.status(400).json({
      message: "Event ID and organizer email are required.",
    });
  }

  try {
    const snapshot = await admin.firestore().collection("organizers").get();

    let organizerDoc = null;
    let eventGroups = null;
    let targetGroup = null;

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.email === email) {
        data.eventGroups?.forEach((group) => {
          const event = group.events?.find((e) => e.id === eventId);
          if (event) {
            organizerDoc = doc;
            eventGroups = data.eventGroups;
            targetGroup = group;
          }
        });
      }
    });

    if (!organizerDoc || !targetGroup) {
      return res.status(404).json({ message: "Event or organizer not found." });
    }

    const event = targetGroup.events.find((e) => e.id === eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (name) event.name = name;
    if (description) event.description = description;
    if (startDate) event.startDate = startDate;
    if (endDate) event.endDate = endDate;

    await admin
      .firestore()
      .collection("organizers")
      .doc(organizerDoc.id)
      .update({
        eventGroups,
      });

    res.status(200).json({ message: "Event updated successfully.", event });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: "Failed to update event." });
  }
};

export const deleteEventFromEventGroup = async (req, res) => {
  const { eventId, email } = req.query;

  if (!eventId || !email) {
    return res.status(400).json({
      message: "Both event ID and organizer email are required.",
    });
  }

  try {
    const snapshot = await admin.firestore().collection("organizers").get();

    let organizerDoc = null;
    let eventGroups = null;
    let targetGroup = null;

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.email === email) {
        data.eventGroups?.forEach((group) => {
          const event = group.events?.find((e) => e.id === eventId);
          if (event) {
            organizerDoc = doc;
            eventGroups = data.eventGroups;
            targetGroup = group;
          }
        });
      }
    });

    if (!organizerDoc || !targetGroup) {
      return res.status(404).json({ message: "Event or organizer not found." });
    }

    const eventIndex = targetGroup.events.findIndex((e) => e.id === eventId);

    if (eventIndex === -1) {
      return res.status(404).json({ message: "Event not found." });
    }

    targetGroup.events.splice(eventIndex, 1);

    await admin
      .firestore()
      .collection("organizers")
      .doc(organizerDoc.id)
      .update({
        eventGroups,
      });

    res.status(200).json({ message: "Event deleted successfully." });
  } catch (err) {
    console.error("Error deleting event from event group:", err);
    res.status(500).json({ message: "Failed to delete event." });
  }
};
