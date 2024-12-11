import admin from "../firebase/firebase-admin.js";

export const getParticipantsForEvent = async (req, res) => {
  const { eventId } = req.query;

  if (!eventId) {
    return res.status(400).json({ message: "Event ID is required." });
  }

  try {
    const organizerSnapshot = await admin
      .firestore()
      .collection("organizers")
      .get();

    let participants = null;

    organizerSnapshot.forEach((doc) => {
      const data = doc.data();
      const groups = data.eventGroups || [];

      groups.forEach((group) => {
        const event = group.events?.find((e) => e.id === eventId);
        if (event) {
          participants = event.participants || [];
        }
      });
    });

    if (participants === null) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json(participants);
  } catch (err) {
    console.error("Error fetching participants for event:", err);
    res.status(500).json({ message: "Failed to fetch participants." });
  }
};

export const getParticipantsForEventGroup = async (req, res) => {
  const { eventGroupId } = req.query;

  if (!eventGroupId) {
    return res.status(400).json({ message: "Event Group ID is required." });
  }

  try {
    const organizerSnapshot = await admin
      .firestore()
      .collection("organizers")
      .get();

    let allParticipants = [];

    organizerSnapshot.forEach((doc) => {
      const data = doc.data();
      const groups = data.eventGroups || [];

      const group = groups.find((g) => g.id === eventGroupId);
      if (group) {
        group.events?.forEach((event) => {
          allParticipants = [...allParticipants, ...(event.participants || [])];
        });
      }
    });

    if (allParticipants.length === 0) {
      return res
        .status(404)
        .json({ message: "No participants found for the given event group." });
    }

    const uniqueParticipants = Array.from(
      new Set(allParticipants.map((p) => JSON.stringify(p)))
    ).map((e) => JSON.parse(e));

    res.status(200).json(uniqueParticipants);
  } catch (err) {
    console.error("Error fetching participants for event group:", err);
    res.status(500).json({ message: "Failed to fetch participants." });
  }
};

export const addParticipantToEvent = async (req, res) => {
  const { eventId, participantEmail } = req.body;

  if (!eventId || !participantEmail) {
    return res.status(400).json({
      message: "Event ID and participant email are required.",
    });
  }

  try {
    const participantSnapshot = await admin
      .firestore()
      .collection("participants")
      .where("email", "==", participantEmail)
      .get();

    if (participantSnapshot.empty) {
      return res.status(404).json({ message: "Participant not found." });
    }

    const participant = participantSnapshot.docs[0].data();

    const organizerSnapshot = await admin
      .firestore()
      .collection("organizers")
      .get();

    let organizerDoc = null;
    let eventGroups = null;
    let targetEvent = null;

    organizerSnapshot.forEach((doc) => {
      const data = doc.data();
      const groups = data.eventGroups || [];

      groups.forEach((group) => {
        const event = group.events?.find((e) => e.id === eventId);
        if (event) {
          organizerDoc = doc;
          eventGroups = groups;
          targetEvent = event;
        }
      });
    });

    if (!targetEvent) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (!targetEvent.participants) {
      targetEvent.participants = [];
    }

    const participantExists = targetEvent.participants.some(
      (p) => p.email === participant.email
    );

    if (participantExists) {
      return res
        .status(409)
        .json({ message: "Participant already added to this event." });
    }

    targetEvent.participants.push(participant);

    await admin
      .firestore()
      .collection("organizers")
      .doc(organizerDoc.id)
      .update({
        eventGroups,
      });

    res
      .status(200)
      .json({ message: "Participant added successfully.", participant });
  } catch (err) {
    console.error("Error adding participant to event:", err);
    res.status(500).json({ message: "Failed to add participant." });
  }
};

export const cancelRegistration = async (req, res) => {
  const { eventId, participantEmail } = req.query;

  if (!eventId || !participantEmail) {
    return res.status(400).json({
      message: "Event ID and participant email are required.",
    });
  }

  try {
    const organizerSnapshot = await admin
      .firestore()
      .collection("organizers")
      .get();

    let organizerDoc = null;
    let eventGroups = null;
    let targetEvent = null;

    organizerSnapshot.forEach((doc) => {
      const data = doc.data();
      const groups = data.eventGroups || [];

      groups.forEach((group) => {
        const event = group.events?.find((e) => e.id === eventId);
        if (event) {
          organizerDoc = doc;
          eventGroups = groups;
          targetEvent = event;
        }
      });
    });

    if (!targetEvent) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (!targetEvent.participants || targetEvent.participants.length === 0) {
      return res
        .status(404)
        .json({ message: "No participants in this event." });
    }

    const participantIndex = targetEvent.participants.findIndex(
      (p) => p.email === participantEmail
    );

    if (participantIndex === -1) {
      return res
        .status(404)
        .json({ message: "Participant not found in this event." });
    }

    targetEvent.participants.splice(participantIndex, 1);

    await admin
      .firestore()
      .collection("organizers")
      .doc(organizerDoc.id)
      .update({
        eventGroups,
      });

    res.status(200).json({ message: "Participant removed successfully." });
  } catch (err) {
    console.error("Error removing participant from event:", err);
    res.status(500).json({ message: "Failed to remove participant." });
  }
};
