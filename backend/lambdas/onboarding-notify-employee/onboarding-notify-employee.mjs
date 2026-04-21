import { SESClient, SendTemplatedEmailCommand } from "@aws-sdk/client-ses";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const REGION = process.env.REGION;
const ses = new SESClient({ region: REGION });
const ddb = new DynamoDBClient({ region: REGION });

const TEMPLATE_MAP = {
  DOCS_UPLOAD_REQUEST:   "OnboardingDocsUploadRequest",
  IT_PROVISIONING_REQUEST:   "OnboardingITProvisioning",
  POLICY_SIGNOFF_REQUEST:"OnboardingPolicySignoff",
  MANAGER_INTRO_REQUEST: "OnboardingManagerIntro",
  DOCS_UPLOAD_TIMEOUT:   "OnboardingDocsUploadReminder",
  POLICY_SIGN_TIMEOUT:   "OnboardingPolicySignReminder"
};

export const handler = async (event) => {
  const { employee_id, email, name, type } = event;

  if (!employee_id || !email || !name || !type) {
    throw new Error("Missing required fields");
  }

  const templateName = TEMPLATE_MAP[type];
  if (!templateName) {
    throw new Error(`Unknown notification type: ${type}`);
  }

  // SES SEND
  await ses.send(new SendTemplatedEmailCommand({
    Source: process.env.SES_FROM_EMAIL,
    Destination: { ToAddresses: [email] },
    Template: templateName,
    TemplateData: JSON.stringify({
      name,
      // employee_id,
      portal_link: process.env.ONBOARDING_PORTAL_URL
    })
  }));

  // Dynamo update (only reminders)
  if (type.includes("TIMEOUT") || type.includes("REMINDER")) {
    await ddb.send(new UpdateItemCommand({
      TableName: process.env.DYNAMODB_EMPLOYEES_TABLE,
      Key: { employee_id: { S: employee_id } },
      UpdateExpression: "SET reminder_sent_at = :ts",
      ExpressionAttributeValues: {
        ":ts": { S: new Date().toISOString() }
      }
    }));
  }

  return { success: true, type, employee_id };
};