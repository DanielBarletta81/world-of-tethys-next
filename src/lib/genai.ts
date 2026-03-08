import { GoogleGenAI } from '@google/genai';
import { existsSync } from 'node:fs';

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
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credentialsPath && !existsSync(credentialsPath)) {
    console.warn(
      `[Vertex] GOOGLE_APPLICATION_CREDENTIALS does not exist at "${credentialsPath}". Falling back to non-AI oracle response.`
    );
    return null;
  }
  return new GoogleGenAI({
    vertexai: true,
    project: config.project,
    location: config.location,
  });
}
