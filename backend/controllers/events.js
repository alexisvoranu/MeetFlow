import admin from "../firebase/firebase-admin.js";

export const getAllEventsForGroup = async (req, res) => {
  const id = req.query.eventGroupId;

  if (!req.query.eventGroupId) {
    return res
      .status(404)
      .send({ message: "The event group id is required" });
  }

  try {
    // Căutăm documentul organizatorului în colecția 'eventOrganizers' pe baza emailului
    const snapshot = await admin
      .firestore()
      .collection("eventOrganizers")
      .where("id", "==", id)
      .get();

    // Dacă nu există documente care corespund emailului
    if (snapshot.empty) {
      return res
        .status(404)
        .json({ message: "Event group with this id not found." });
    }

    // Dacă găsim organizatorul, extragem grupurile de evenimente
    let eventGroups = [];
    snapshot.forEach((doc) => {
      const organizerData = doc.data();

      // Verificăm dacă există grupuri de evenimente și le adăugăm în array
      if (organizerData.eventGroups && organizerData.eventGroups.length > 0) {
        eventGroups = organizerData.eventGroups;
      }
    });

    // Dacă nu sunt grupuri de evenimente
    if (eventGroups.length === 0) {
      return res
        .status(404)
        .json({ message: "No event groups found for this organizer." });
    }

    // Returnăm doar anumite atribute din grupurile de evenimente
    const selectedEvents = eventGroups.flatMap((eventGroup) =>
      eventGroup.events.map((event) => ({
        id: event.id, // Aici poți înlocui cu atributul corect
        description: event.description, // Aici poți înlocui cu atributul corect
        name: event.name, // Aici poți înlocui cu atributul corect
        startDate: event.startDate, // Aici poți înlocui cu atributul corect
        endDate: event.endDate, // Aici poți înlocui cu atributul corect
        status: event.status, // Aici poți înlocui cu atributul corect
        // Adaugă alte atribute pe care vrei să le returnezi
      }))
    );

    // Returnează doar lista de evenimente
    res.json({ events: selectedEvents });
  } catch (err) {
    console.error("Error getting event groups by email:", err);
    res.status(500).json({ message: "Failed to retrieve event groups." });
  }
};
