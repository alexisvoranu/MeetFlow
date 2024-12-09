import admin from "../firebase/firebase-admin.js";

export const getParticipantsByEvent = async (req, res) => {
  const eventId = req.query.eventId;

  if (!eventId) {
    return res.status(404).send({ message: "The event id is required" });
  }

  try {
    // Căutăm documentul organizatorului în colecția 'eventOrganizers'
    const snapshot = await admin
      .firestore()
      .collection("eventOrganizers")
      .get(); // Obținem toate documentele

    // Dacă nu există documente în colecția 'eventOrganizers'
    if (snapshot.empty) {
      return res.status(404).json({ message: "No event organizers found." });
    }

    let participants = [];

    // Iterăm prin fiecare document pentru a găsi evenimentul specific
    snapshot.forEach((doc) => {
      const organizerData = doc.data();

      // Verificăm dacă există grupuri de evenimente
      if (organizerData.eventGroups && organizerData.eventGroups.length > 0) {
        // Iterăm prin grupurile de evenimente
        organizerData.eventGroups.forEach((eventGroup) => {
          // Verificăm fiecare eveniment din grup
          eventGroup.events.forEach((event) => {
            if (event.id === eventId) { // Căutăm evenimentul specific
              // Extragem participanții pentru evenimentul găsit
              participants = event.participants.map((participant) => ({
                id: participant.id, // Aici poți înlocui cu atributul corect
                email: participant.email, // Aici poți înlocui cu atributul corect
                name: participant.name, // Aici poți înlocui cu atributul corect
                // Adaugă alte atribute pe care vrei să le returnezi
              }));
            }
          });
        });
      }
    });

    // Dacă nu am găsit participanți pentru evenimentul specificat
    if (participants.length === 0) {
      return res.status(404).json({ message: "No participants found for this event." });
    }

    // Returnează lista de participanți
    res.json({ participants });
    
  } catch (err) {
    console.error("Error getting participants by event id:", err);
    res.status(500).json({ message: "Failed to retrieve participants." });
  }
};