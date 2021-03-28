import { PubSub } from '@google-cloud/pubsub';

/**
 * Function that publishes to any pubsub given channel name and data
 * @param data
 * @param channelName
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function publishToPubsub(data: any, channelName: string): Promise<string> {
  console.log(`Publishing to ${channelName}`);
  const pubsub = new PubSub();
  const topic = pubsub.topic(channelName).publisher;

  const b64Data = Buffer.from(JSON.stringify(data));
  const handlerId = await topic.publish(b64Data);

  return handlerId;
}
