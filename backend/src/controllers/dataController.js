import { ingestData } from '../services/dataIngestionService.js';

export const uploadData = async (req, res) => {
  try {
    const { documents } = req.body; // array of {title, content, source}
    const result = await ingestData(documents);
    res.json({ message: 'Data ingested', result });
  } catch (err) {
    console.error('Data ingestion error:', err);
    res.status(500).json({ message: 'Data ingestion failed' });
  }
};
