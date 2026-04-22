import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { products, combos } from './src/data/products.js';
import fs from 'fs';

const configStr = fs.readFileSync('./firebase-applet-config.json', 'utf8');
const config = JSON.parse(configStr);

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function seed() {
  console.log('Starting seed...');
  
  // Check if already seeded
  const productsSnap = await getDocs(collection(db, 'products'));
  if (!productsSnap.empty) {
    console.log('Database already has products. Skipping seed.');
    process.exit(0);
  }

  console.log(`Adding ${products.length} products...`);
  for (const product of products) {
    const { id, ...data } = product;
    await addDoc(collection(db, 'products'), data);
  }

  console.log(`Adding ${combos.length} combos...`);
  for (const combo of combos) {
    const { id, ...data } = combo;
    await addDoc(collection(db, 'combos'), data);
  }

  console.log('Seed complete!');
  process.exit(0);
}

seed().catch(console.error);
