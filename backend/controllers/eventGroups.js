import admin from "../firebase/firebase-admin.js";
import { addDocument } from "../services/firestoreService.js";
import { generateEvents } from "../services/firestoreService.js";

export const getAllForOrganizer = async (req, res) => {
  const email = req.query.email;

  if (!req.query.email) {
    return res.status(404).send({ message: "The email is required" });
  }

  try {
    const snapshot = await admin
      .firestore()
      .collection("organizers")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ message: "Event organizer with this email not found." });
    }

    let eventGroups = [];
    snapshot.forEach((doc) => {
      const organizerData = doc.data();

      if (organizerData.eventGroups && organizerData.eventGroups.length > 0) {
        eventGroups = organizerData.eventGroups;
      }
    });

    if (eventGroups.length === 0) {
      return res
        .status(404)
        .json({ message: "No event groups found for this organizer." });
    }

    const selectedAttributes = eventGroups.map((group) => ({
      id: group.id,
      groupName: group.groupName,
      description: group.description,
    }));

    res.json({ eventGroups: selectedAttributes });
  } catch (err) {
    console.error("Error getting event groups by email:", err);
    res.status(500).json({ message: "Failed to retrieve event groups." });
  }
};

export const addEventGroupForOrganizer = async (req, res) => {
  const email = req.body.email;
  const { groupName, description } = req.body.eventGroup;

  if (!email || !groupName || !description) {
    return res
      .status(400)
      .json({ message: "Email, groupName, and description are required." });
  }

  try {
    const snapshot = await admin
      .firestore()
      .collection("organizers")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ message: "Event organizer with this email not found." });
    }

    const newEventGroupId = admin
      .firestore()
      .collection("eventGroups")
      .doc().id;
    const newEventGroup = {
      id: newEventGroupId,
      groupName,
      description,
    };

    const organizerDoc = snapshot.docs[0];
    const organizerData = organizerDoc.data();

    const updatedEventGroups = organizerData.eventGroups || [];

    const groupExists = updatedEventGroups.some(
      (group) => group.groupName === newEventGroup.groupName
    );

    if (groupExists) {
      return res
        .status(409)
        .json({ message: "Event group with this name already exists." });
    }

    updatedEventGroups.push(newEventGroup);

    await admin
      .firestore()
      .collection("organizers")
      .doc(organizerDoc.id)
      .update({
        eventGroups: updatedEventGroups,
      });

    res.status(200).json({
      message: "Event group added successfully.",
      eventGroup: newEventGroup,
    });
  } catch (err) {
    console.error("Error adding event group by email:", err);
    res.status(500).json({ message: "Failed to add event group." });
  }
};

export const generateData = async (req, res) => {
  const count = 10;

  try {
    const { eventOrganizers, uniqueParticipants } = await generateEvents(count);

    for (const organizer of eventOrganizers) {
      const organizerId = await addDocument("organizers", organizer);

      if (organizerId) {
        console.log(`Organizers added with ID: ${organizerId}`);
      }
    }

    for (const participant of uniqueParticipants) {
      const participantId = await addDocument("participants", participant);

      if (participantId) {
        console.log(`Participant added with ID: ${participantId}`);
      }
    }

    return res
      .status(200)
      .json({ message: "The data has been added to Firebase!" });
  } catch (e) {
    console.error("Error at generating and adding data: ", e);
    return res
      .status(500)
      .json({ message: "Error at generating and adding data." });
  }
};

export const updateEventGroupForOrganizer = async (req, res) => {
  const email = req.body.email;
  const eventGroupId = req.body.eventGroupId;
  const { groupName, description } = req.body;

  if (!email || !eventGroupId) {
    return res
      .status(400)
      .json({ message: "Email and eventGroupId are required." });
  }

  try {
    const snapshot = await admin
      .firestore()
      .collection("organizers")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ message: "Event organizer with this email not found." });
    }

    const organizerDoc = snapshot.docs[0];
    const organizerData = organizerDoc.data();

    if (!organizerData.eventGroups || organizerData.eventGroups.length === 0) {
      return res
        .status(404)
        .json({ message: "No event groups found for this organizer." });
    }

    const updatedEventGroups = organizerData.eventGroups.map((group) => {
      if (group.id === eventGroupId) {
        if (groupName) group.groupName = groupName;
        if (description) group.description = description;
      }
      return group;
    });

    const updatedGroup = updatedEventGroups.find(
      (group) => group.id === eventGroupId
    );
    if (!updatedGroup) {
      return res
        .status(404)
        .json({ message: "Event group with this ID not found." });
    }

    await admin
      .firestore()
      .collection("organizers")
      .doc(organizerDoc.id)
      .update({
        eventGroups: updatedEventGroups,
      });

    res.status(200).json({
      message: "Event group updated successfully.",
      eventGroup: updatedGroup,
    });
  } catch (err) {
    console.error("Error updating event group by ID:", err);
    res.status(500).json({ message: "Failed to update event group." });
  }
};

export const deleteEventGroupForOrganizer = async (req, res) => {
  const email = req.query.email;
  const eventGroupId = req.query.eventGroupId;

  if (!email || !eventGroupId) {
    return res
      .status(400)
      .json({ message: "Email and eventGroupId are required." });
  }

  try {
    const snapshot = await admin
      .firestore()
      .collection("organizers")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ message: "Event organizer with this email not found." });
    }

    const organizerDoc = snapshot.docs[0];
    const organizerData = organizerDoc.data();

    if (!organizerData.eventGroups || organizerData.eventGroups.length === 0) {
      return res
        .status(404)
        .json({ message: "No event groups found for this organizer." });
    }

    const updatedEventGroups = organizerData.eventGroups.filter(
      (group) => group.id !== eventGroupId
    );

    if (updatedEventGroups.length === organizerData.eventGroups.length) {
      return res
        .status(404)
        .json({ message: "Event group with this ID not found." });
    }

    await admin
      .firestore()
      .collection("organizers")
      .doc(organizerDoc.id)
      .update({
        eventGroups: updatedEventGroups,
      });

    res.status(200).json({ message: "Event group deleted successfully." });
  } catch (err) {
    console.error("Error deleting event group by ID:", err);
    res.status(500).json({ message: "Failed to delete event group." });
  }
};
