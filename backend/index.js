import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Input validation helper
const validateBrewPayload = (body) => {
  const { beans, method, coffee_grams, water_grams, rating, tasting_notes } = body;
  
  if (
    !beans || typeof beans !== 'string' || !beans.trim() ||
    !method || typeof method !== 'string' || !method.trim() ||
    coffee_grams == null || isNaN(Number(coffee_grams)) ||
    water_grams == null || isNaN(Number(water_grams)) ||
    rating == null || isNaN(Number(rating)) ||
    !tasting_notes || typeof tasting_notes !== 'string' || !tasting_notes.trim()
  ) {
    return false;
  }
  return true;
};

// 1. GET /api/brews 
app.get('/api/brews', async (req, res) => {
  try {
    const { method } = req.query;
    const whereClause = method && method !== 'All' ? { method } : {};
    
    const brews = await prisma.brew.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(brews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve brews.' });
  }
});

// 2. POST /api/brews (Create)
app.post('/api/brews', async (req, res) => {
  if (!validateBrewPayload(req.body)) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newBrew = await prisma.brew.create({
      data: {
        beans: req.body.beans.trim(),
        method: req.body.method.trim(),
        coffee_grams: parseFloat(req.body.coffee_grams),
        water_grams: parseFloat(req.body.water_grams),
        rating: parseInt(req.body.rating, 10),
        tasting_notes: req.body.tasting_notes.trim(),
      }
    });

    res.status(201).json(newBrew);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create brew record.' });
  }
});

// 3. PUT /api/brews/:id (Update)
app.put('/api/brews/:id', async (req, res) => {
  const { id } = req.params;

  if (!validateBrewPayload(req.body)) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const updatedBrew = await prisma.brew.update({
      where: { id: parseInt(id, 10) },
      data: {
        beans: req.body.beans.trim(),
        method: req.body.method.trim(),
        coffee_grams: parseFloat(req.body.coffee_grams),
        water_grams: parseFloat(req.body.water_grams),
        rating: parseInt(req.body.rating, 10),
        tasting_notes: req.body.tasting_notes.trim(),
      }
    });

    res.status(200).json(updatedBrew);
  } catch (error) {
    res.status(404).json({ error: 'Brew entry not found.' });
  }
});

// 4. DELETE /api/brews/:id (Delete)
app.delete('/api/brews/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.brew.delete({
      where: { id: parseInt(id, 10) }
    });

    res.status(200).json({ message: 'Brew deleted successfully.' });
  } catch (error) {
    res.status(404).json({ error: 'Brew entry not found.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});