import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const table = process.env.USERS_TABLE;

const dynamodb = new DynamoDB({});
const documents = DynamoDBDocumentClient.from(dynamodb, {
  marshallOptions: {
    convertEmptyValues: false,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

class User {
  readonly id: string;
  email: string;
  firstName: string;
  lastName: string;

  protected constructor(data: Record<string, unknown>) {
    // Ensure correct data types
    if (data.id && typeof data.id === 'string') this.id = data.id;
    if (data.email && typeof data.email === 'string') this.email = data.email;
    if (data.firstName && typeof data.firstName === 'string') this.firstName = data.firstName;
    if (data.lastName && typeof data.lastName === 'string') this.lastName = data.lastName;

    if (!(this.id && this.email && this.firstName && this.lastName)) throw new Error('malformed database response');
  }

  /**
   * Get a user by their ID
   */
  static async get(id: string): Promise<User | undefined> {
    const result = await documents.send(new GetCommand({ TableName: table, Key: { id } }));

    if (result.Item) return new User(result.Item);
  }

  /**
   * Delete a user by their ID
   */
  static async delete(id: string) {
    await documents.send(new DeleteCommand({ TableName: table, Key: { id } }));
  }

  /**
   * Save any changes made to the user
   */
  async save() {
    await documents.send(
      new UpdateCommand({
        TableName: table,
        Key: { id: this.id },
        AttributeUpdates: {
          email: { Value: this.email },
          firstName: { Value: this.firstName },
          lastName: { Value: this.lastName },
        },
      }),
    );
  }
}

export default User;
