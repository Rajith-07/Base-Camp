import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.REGION });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_EMPLOYEES_TABLE;

export const handler = async (event) => {
  const employeeId = event.queryStringParameters?.employee_id;

  if (!employeeId) {
    return response(400, { message: "Missing employee_id parameter" });
  }

  try {
    // CASE 1: FETCH ALL (*)
    if (employeeId === "*") {
      let items = [];
      let lastKey = undefined;

      do {
        const result = await docClient.send(new ScanCommand({
          TableName: TABLE_NAME,
          ProjectionExpression: "employee_id, onboarding_stage, task_type",
          ExclusiveStartKey: lastKey
        }));

        items = items.concat(result.Items || []);
        lastKey = result.LastEvaluatedKey;

      } while (lastKey);

      // Normalize output (safe defaults)
      const records = items.map(item => ({
        employee_id: item.employee_id,
        onboarding_stage: item.onboarding_stage || "NOT_STARTED",
        task_type: item.task_type || null
      }));

      return response(200, {
        count: records.length,
        records
      });
    }

    // CASE 2: SINGLE EMPLOYEE
    const result = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { employee_id: employeeId },
      ProjectionExpression: "employee_id, onboarding_stage, task_type"
    }));

    if (!result.Item) {
      return response(404, { message: "Employee not found" });
    }

    return response(200, {
      employee_id: result.Item.employee_id,
      onboarding_stage: result.Item.onboarding_stage || "NOT_STARTED",
      task_type: result.Item.task_type || null
    });

  } catch (error) {
    console.error("ERROR:", error);
    return response(500, {
      error: "Internal Server Error",
      details: error.message
    });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders(),
    body: JSON.stringify(body)
  };
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": process.env.CORS_ALLOW_ORIGIN,
    "Access-Control-Allow-Headers": process.env.CORS_ALLOW_HEADERS,
    "Access-Control-Allow-Methods": process.env.CORS_ALLOW_METHODS
  };
}