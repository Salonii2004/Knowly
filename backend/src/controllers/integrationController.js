import Integration from '../models/Integration.js';
import { testIntegration } from '../services/integrationService.js';

export const getIntegrations = async (req, res) => {
  const integrations = await Integration.find();
  res.json(integrations);
};

export const addIntegration = async (req, res) => {
  try {
    const { type, config } = req.body;
    const newIntegration = await Integration.create({ type, config });
    res.status(201).json(newIntegration);
  } catch (err) {
    console.error('Add integration error:', err);
    res.status(500).json({ message: 'Failed to add integration' });
  }
};

export const testIntegrationController = async (req, res) => {
  try {
    const { id } = req.params;
    const integration = await Integration.findById(id);
    if (!integration) return res.status(404).json({ message: 'Integration not found' });

    const status = await testIntegration(integration);
    integration.status = status;
    await integration.save();

    res.json({ status });
  } catch (err) {
    console.error('Test integration error:', err);
    res.status(500).json({ message: 'Failed to test integration' });
  }
};
