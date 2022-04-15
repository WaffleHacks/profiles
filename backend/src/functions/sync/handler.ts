import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import type { DynamoDBRecord, DynamoDBStreamHandler } from 'aws-lambda';

type DynamoDBMap = { [key: string]: AttributeValue };

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

type Message = MessageWithProfile | MessageWithoutProfile;

interface MessageWithProfile {
  type: 'INSERT' | 'MODIFY';
  id: string;
  profile: User;
}

interface MessageWithoutProfile {
  type: 'REMOVE';
  id: string;
}

const buildMessage = (record: DynamoDBRecord): Message => {
  const key = unmarshall(record.dynamodb.Keys as DynamoDBMap);
  if (!key.id || typeof key.id !== 'string') throw new Error('invalid record format');
  const id = key.id;

  if (record.eventName === 'INSERT' || record.eventName === 'MODIFY') {
    const profile = unmarshall(record.dynamodb.NewImage as DynamoDBMap) as User;

    return {
      type: record.eventName,
      id,
      profile,
    };
  } else {
    return {
      type: 'REMOVE',
      id,
    };
  }
};

const TOPIC = process.env.SYNC_TOPIC || '';
const client = new SNSClient({});

export const main: DynamoDBStreamHandler = async (event) => {
  await Promise.all(
    event.Records.map((r) => buildMessage(r))
      .map((m) => new PublishCommand({ Message: JSON.stringify(m), TopicArn: TOPIC }))
      .map((c) => client.send(c)),
  );
};
