import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const REGION = process.env.REGION
const ddb = new DynamoDBClient({ region: REGION });

export const handler = async (event) => {
  const { employee_id, stage } = event;

  if (!employee_id || !stage) {
    throw new Error("Missing employee_id or stage");
  }

  const stageTimestampMap = {
    DOCS_UPLOAD:      "docs_upload_started_at",
    IT_PROVISIONING:  "it_provisioning_started_at",
    POLICY_SIGNOFF:   "policy_signoff_started_at",
    MANAGER_INTRO:    "manager_intro_started_at",
    COMPLETED:        "completed_at"
  };

  const timestampField = stageTimestampMap[stage];

  if (!timestampField) {
    throw new Error(`Invalid stage: ${stage}`);
  }

  await ddb.send(new UpdateItemCommand({
    TableName: process.env.DYNAMODB_EMPLOYEES_TABLE,
    Key: { employee_id: { S: employee_id } },
    UpdateExpression: `SET onboarding_stage = :stage, ${timestampField} = :ts`,
    ExpressionAttributeValues: {
      ":stage": { S: stage },
      ":ts":    { S: new Date().toISOString() }
    }
  }));

  return { success: true, employee_id, stage };
};