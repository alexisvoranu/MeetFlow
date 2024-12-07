import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { faker } from "@faker-js/faker";

const addDocument = async (collectionName, data) => {
  try {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, data);
    console.log("Document adăugat cu ID-ul: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Eroare la adăugarea documentului: ", e);
    return null;
  }
};

async function generateEventOrganizers(count = 3) {
  const eventOrganizers = [];

  for (let i = 0; i < count; i++) {
    const eventGroups = [];
    const numberOfGroups = faker.number.int({ min: 1, max: 3 });

    for (let j = 0; j < numberOfGroups; j++) {
      const events = [];
      const numberOfEvents = faker.number.int({ min: 1, max: 5 });

      for (let k = 0; k < numberOfEvents; k++) {
        const participants = Array(faker.number.int({ min: 5, max: 10 }))
          .fill()
          .map(() => ({
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
          }));

        events.push({
          id: faker.string.uuid(),
          name: faker.company.name() + " Event",
          description: faker.lorem.sentence(),
          startDate: faker.date.future(),
          endDate: faker.date.future({
            refDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
          }),
          status: faker.helpers.arrayElement([
            "planned",
            "ongoing",
            "completed",
          ]),
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
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      eventGroups,
    });
  }

  return eventOrganizers;
}

export const addEventOrganizersToFirebase = async () => {
  const organizers = await generateEventOrganizers();

  for (const organizer of organizers) {
    const organizerId = await addDocument("eventOrganizers", organizer);

    if (organizerId) {
      console.log(`Organizator adăugat cu ID-ul: ${organizerId}`);
    }
  }

  console.log("Toate datele au fost adăugate în Firebase!");
};
