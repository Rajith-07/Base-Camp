import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand
} from "@aws-sdk/client-dynamodb";

const REGION = process.env.REGION;
const ddb = new DynamoDBClient({ region: REGION });

const TOKEN_TABLE = process.env.TOKEN_TABLE;
const EMPLOYEES_TABLE = process.env.EMPLOYEES_TABLE;

export const handler = async (event) => {
  try {
    const { employee_id, task_token, stage, token_type } = event;

    if (!employee_id || !task_token || !stage || !token_type) {
      throw new Error("Missing required fields");
    }

    const now = new Date().toISOString();


    // token save
    await ddb.send(
      new PutItemCommand({
        TableName: TOKEN_TABLE,
        Item: {
          employee_id: { S: employee_id },   // PK
          token_type:  { S: token_type },    // SK
          task_token:  { S: task_token },
          stage:       { S: stage },
          created_at:  { S: now }
        }
      })
    );

    // task_type field update in employees table
    await ddb.send(
      new UpdateItemCommand({
        TableName: EMPLOYEES_TABLE,
        Key: {
          employee_id: { S: employee_id }
        },
        UpdateExpression: `
          SET onboarding_stage = :stage,
              task_type = :task_type
        `,
        ExpressionAttributeValues: {
          ":stage": { S: stage },
          ":task_type": { S: token_type }
        },

        // Prevent accidental creation of partial employee records
        ConditionExpression: "attribute_exists(employee_id)"
      })
    );

    //Success Response
    return {
      success: true,
      employee_id,
      token_type,
      onboarding_stage: stage
    };

  } catch (err) {
    console.error("Save Token Error:", err);
    throw err;
  }
};