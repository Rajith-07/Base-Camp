import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const BUCKET = process.env.UPLOAD_BUCKET;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const ONBOARDING_PORTAL_FRONTEND = process.env.ONBOARDING_PORTAL;
const REGION = process.env.REGION;

if (!BUCKET || !ONBOARDING_PORTAL_FRONTEND || !REGION) {
  throw new Error("Missing required environment variables");
}

const s3 = new S3Client({ region: REGION });

export const handler = async (event) => {
  try {
    const body = typeof event.body === "string"
      ? JSON.parse(event.body)
      : event.body ?? event;

    const { employee_id, file_name, content_type, document_type } = body;

    if (!document_type) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "Missing document_type" })
      };
    }

    if (!employee_id || !file_name || !content_type) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "Missing employee_id, file_name, or content_type" })
      };
    }

    if (!ALLOWED_TYPES.includes(content_type)) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: `Unsupported file type: ${content_type}` })
      };
    }

    // Sanitizing Filename
    const safeName = file_name.replace(/[^a-zA-Z0-9._\-]/g, "_");
    const extension = content_type === "application/pdf" ? "pdf" : "jpg";
    const key = `employees/${employee_id}/${document_type}.${extension}`; 

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: content_type
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ uploadUrl, key })
    };

  } catch (err) {
    console.error("Generate URL Error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: err.message })
    };
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": process.env.CORS_ALLOW_ORIGIN,
    "Access-Control-Allow-Headers": process.env.CORS_ALLOW_HEADERS,
    "Access-Control-Allow-Methods": process.env.CORS_ALLOW_METHODS
  };
}