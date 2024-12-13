<template>
  <div>
    <button class="btn btn-success" style="margin-top: 5rem" @click="addData">Adaugă date</button>
  </div>
</template>

<script>
import { addEventOrganizersToFirebase } from "../../../backend/services/firestoreService";

export default {
  name: "AddDocument",
  methods: {
    async addData() {
      await addEventOrganizersToFirebase();
    },
  },
};
</script>
