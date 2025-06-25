import type { NextApiRequest, NextApiResponse } from "next";
import type { Fields, Files } from "formidable";
import fs from "fs";
import path from "path";
import { chunkText } from "../../src/lib/chunkText";
import { pineconeIndex } from "../../src/lib/pinecone-client";

export const config = {
  api: {
    bodyParser: false,
  },
};

// --- Text Extraction Utility ---
async function extractText(
  filePath: string,
  mimeType: string,
  fileName: string
): Promise<string> {
  const ext = path.extname(fileName).toLowerCase();
  if (mimeType === "application/pdf" || ext === ".pdf") {
    try {
      const pdfParse = await import("pdf-parse");
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse.default(dataBuffer);
      return data.text;
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes("password")) {
        throw new Error("Password-protected PDFs are not supported.");
      }
      throw err;
    }
  } else if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ext === ".docx"
  ) {
    const mammoth = await import("mammoth");
    const data = await mammoth.extractRawText({ path: filePath });
    return data.value;
  } else if ([".txt", ".md", ".csv"].includes(ext)) {
    return fs.readFileSync(filePath, "utf8");
  } else {
    const textract = await import("textract");
    return new Promise((resolve, reject) => {
      textract.default.fromFileWithPath(
        filePath,
        {},
        (err: any, text: string) => (err ? reject(err) : resolve(text))
      );
    });
  }
}

// --- Main API Handler ---
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Request Method not allowed" });
    return;
  }
  const formidableModule = await import("formidable");
  const form = new formidableModule.IncomingForm();

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    let filePath = "";
    try {
      // --- Error Handling: Formidable ---
      if (err) {
        res
          .status(500)
          .json({ error: "File upload error", details: err.message });
        return;
      }
      const file = files.file;
      if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }
      const fileObj = Array.isArray(file) ? file[0] : file;
      filePath = fileObj.filepath;

      // --- Extract Text ---
      const text = await extractText(
        fileObj.filepath as string,
        fileObj.mimetype as string,
        fileObj.originalFilename || ""
      );

      // --- Chunk Text ---
      const chunks = chunkText(text, 1000, 200);

      // --- Prepare Metadata ---
      const userId = "demo-user"; // TODO: Replace with real user ID from auth/cookies
      const sessionId =
        fields.sessionId && typeof fields.sessionId === "string"
          ? fields.sessionId
          : "demo-session";
      const records = chunks.map((chunk, i) => ({
        _id: `${fileObj.originalFilename || "file"}-${i}`,
        text: chunk,
        fileName: fileObj.originalFilename || "file",
        chunkIndex: i,
        timestamp: Date.now(),
        userId,
        sessionId,
      }));

      // --- Upsert to Pinecone ---
      const namespace = pineconeIndex.namespace("__default__");
      await namespace.upsertRecords(records);

      // --- Respond to Client ---
      res.status(200).json({
        name: fileObj.originalFilename,
        type: fileObj.mimetype,
        size: fileObj.size,
        path: fileObj.filepath,
        chunkCount: chunks.length,
      });
    } catch (extractErr: any) {
      res.status(500).json({
        error: "Text extraction or indexing failed",
        details: extractErr.message || extractErr.toString(),
      });
    } finally {
      // --- Cleanup: Delete Temp File ---
      if (filePath && fs.existsSync(filePath)) {
        try {
          await fs.promises.unlink(filePath);
        } catch {}
      }
    }
  });
}
