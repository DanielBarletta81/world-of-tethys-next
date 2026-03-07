import { GoogleGenAI } from '@google/genai';

type VertexConfig = {
  project: string;
  location: string;
};

export function getVertexConfig(): VertexConfig | null {
  const project = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
  if (!project) return null;
  const location = process.env.GOOGLE_CLOUD_LOCATION || process.env.GCLOUD_LOCATION || 'global';
  return { project, location };
}

export function getVertexClient(): GoogleGenAI | null {
  const config = getVertexConfig();
  if (!config) return null;
  return new GoogleGenAI({
    vertexai: true,
    project: config.project,
    location: config.location,
  });
}

