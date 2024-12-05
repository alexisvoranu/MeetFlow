<template>
    <div>
      <h1 style="margin-top: 5rem;">Adaugă Document</h1>
      <button @click="addData">Adaugă date</button>
    </div>
  </template>
  
  <script>
  import { addDocument } from '../../../backend/services/firestoreService';
  
  export default {
    name: 'AddDocument',
    methods: {
      async addData() {
        const data = { nume: "Exemplu", descriere: "Date adăugate în Firestore" };
        await addDocument('colectia-mea', data);
      },
    },
  };
  </script>
  