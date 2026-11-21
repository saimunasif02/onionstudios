import { handleUpload } from '@vercel/blob/client';

export default async function handler(req, res) {
  try {
    const json = await handleUpload({
      body: req.body, request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (clientPayload !== process.env.ADMIN_PASSWORD) throw new Error('Unauthorized');
        return { addRandomSuffix: true }; // any file type allowed
      },
      onUploadCompleted: async () => {}
    });
    res.json(json);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}
