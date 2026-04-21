import {
  SFNClient,
  SendTaskSuccessCommand,
  SendTaskFailureCommand
} from "@aws-sdk/client-sfn";

import {
  DynamoDBClient,
  GetItemCommand,
  DeleteItemCommand
} from "@aws-sdk/client-dynamodb";

const REGION     = process.env.REGION;
const TABLE_NAME = process.env.TOKEN_TABLE;

const sfn = new SFNClient({ region: REGION });
const ddb = new DynamoDBClient({ region: REGION });

export const handler = async (event) => {
  try {
    console.log("EVENT:", JSON.stringify(event));

    let body = {};
    try {
      body = typeof event.body === "string" ? JSON.parse(event.body) : event;
    } catch (e) {
      body = {};
    }

    const {
      employee_id,
      token_type,
      status = "SUCCESS",
      output = {}
    } = body;

    if (!employee_id || !token_type) {
      throw new Error("Missing employee_id or token_type");
    }

    const key = {
      employee_id : { S: employee_id },
      token_type  : { S: token_type }
    };

    // Fetch task token
    const result = await ddb.send(new GetItemCommand({
      TableName: TABLE_NAME,
      Key: key,
    }));

    console.log("TOKEN LOOKUP RESULT:", JSON.stringify(result));

    if (!result.Item?.task_token) {
      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "Token already processed or not found" }),
      };
    }

    const taskToken = result.Item.task_token.S;

    // Delete task token (idempotency guard)
    try {
      await ddb.send(new DeleteItemCommand({
        TableName: TABLE_NAME,
        Key: key,
        ConditionExpression: "attribute_exists(task_token)",
      }));
    } catch (err) {
      if (err.name === "ConditionalCheckFailedException") {
        return {
          statusCode: 200,
          headers: corsHeaders(),
          body: JSON.stringify({ message: "Token already consumed" }),
        };
      }
      throw err;
    }

    // Resume Step Function
    if (status === "SUCCESS") {
      await sfn.send(new SendTaskSuccessCommand({
        taskToken,
        output: JSON.stringify({ employee_id, token_type, ...output }),
      }));
    } else {
      await sfn.send(new SendTaskFailureCommand({
        taskToken,
        error: "UserActionFailed",
        cause: JSON.stringify(output),
      }));
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Workflow resumed successfully" }),
    };

  } catch (err) {
    console.error("Resume Error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: err.message }),
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