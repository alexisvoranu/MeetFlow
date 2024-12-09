import admin from "../firebase/firebase-admin.js";

export const getAllForOrganizer = async (req, res) => {
  const email = req.query.email;

  if (!req.query.email) {
    return res.status(404).send({ message: "The email is required" });
  }

  try {
    const snapshot = await admin
      .firestore()
      .collection("eventOrganizers")
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
