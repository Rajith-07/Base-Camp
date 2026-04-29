import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  DeleteCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "ap-south-1" });
const ddb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "hrms-employees-v3";

export const handler = async () => {
  console.log("Started deletion job");

  const now = new Date();
  const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const data = await ddb.send(new ScanCommand({
    TableName: TABLE_NAME
  }));

  const items = data.Items || [];

  console.log("TOTAL ITEMS:", items.length);

  for (const item of items) {
    console.log("CHECKING:", item.status, item.created_at);

    if (
      item.status &&
      item.status.toLowerCase().trim() === "rejected" &&
      new Date(item.created_at) < cutoff
    ) {
      console.log("Deleting:", item.employee_id);

      await ddb.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          employee_id: item.employee_id
        }
      }));
    }
  }

  console.log("Finished");
};