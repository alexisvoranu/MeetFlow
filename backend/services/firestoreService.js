import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import { faker } from "@faker-js/faker";

export const addDocument = async (collectionName, data) => {
  try {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, data);
    console.log("Document added with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Eroare at document adding: ", e);
    return null;
  }
};

export async function generateEvents(count) {
  const eventOrganizers = [];
  const participantsCollection = new Set();

  for (let i = 0; i < count; i++) {
    const eventGroups = [];
    const numberOfGroups = faker.number.int({ min: 2, max: 4 });

    for (let j = 0; j < numberOfGroups; j++) {
      const events = [];
      const numberOfEvents = faker.number.int({ min: 2, max: 6 });

      for (let k = 0; k < numberOfEvents; k++) {
        const participants = Array(faker.number.int({ min: 5, max: 30 }))
          .fill()
          .map(() => {
            const participant = {
              name: faker.person.fullName(),
              email: faker.internet.email(),
            };

            participantsCollection.add(JSON.stringify(participant));

            return participant;
          });

        events.push({
          id: faker.string.uuid(),
          name: faker.company.name() + " Event",
          description: faker.lorem.sentence(),
          startDate: faker.date.future().toISOString(),
          endDate: (function () {
            let start = new Date(faker.date.future());
            let end = new Date(start.getTime() + 1000 * 60 * 60 * 178);

            if (end <= start) {
              end = new Date(start.getTime() + 1000 * 600 * 60);
            }

            return end.toISOString();
          })(),
          status: (function () {
            const currentDate = new Date();
            const startDate = new Date(faker.date.future());

            if (startDate < currentDate) {
              return "Closed";
            } else {
              return faker.helpers.arrayElement(["Open", "Closed"]);
            }
          })(),
          participants,
        });
      }

      eventGroups.push({
        id: faker.string.uuid(),
        groupName: faker.word.adjective() + " " + faker.word.noun(),
        description: faker.lorem.sentences(2),
        events,
      });
    }

    eventOrganizers.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      eventGroups,
    });
  }

  const uniqueParticipants = Array.from(participantsCollection)
    .map((participant) => JSON.parse(participant))
    .slice(0, 40);

  return { eventOrganizers, uniqueParticipants };
}

export const addEventOrganizersToFirebase = async () => {
  const organizers = await generateEventOrganizers();

  for (const organizer of organizers) {
    const organizerId = await addDocument("organizers", organizer);

    if (organizerId) {
      console.log(`Organizator adăugat cu ID-ul: ${organizerId}`);
    }
  }

  console.log("The data has been added to Firebase!");
};
