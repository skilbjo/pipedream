from <https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html#Streams.Endpoints>

## Enabling a Stream
You can enable a stream on a new table when you create it. You can also enable or disable a stream on an existing table, or change the settings of a stream. DynamoDB Streams operates asynchronously, so there is no performance impact on a table if you enable a stream.

The easiest way to manage DynamoDB Streams is by using the AWS Management Console.

1. Sign in to the AWS Management Console and open the DynamoDB console at https://console.aws.amazon.com/dynamodb/.

2. On the DynamoDB console dashboard, choose Tables.

3. On the Overview tab, choose Manage Stream.

4. In the Manage Stream window, choose the information that will be written to the stream whenever the data in the table is modified:

Keys only — Only the key attributes of the modified item.

New image — The entire item, as it appears after it was modified.

Old image — The entire item, as it appeared before it was modified.

New and old images — Both the new and the old images of the item.

When the settings are as you want them, choose Enable.

5. (Optional) To disable an existing stream, choose Manage Stream and then choose Disable.

You can also use the CreateTable or UpdateTable API operations to enable or modify a stream. The StreamSpecification parameter determines how the stream is configured:

StreamEnabled — Specifies whether a stream is enabled (true) or disabled (false) for the table.

StreamViewType — Specifies the information that will be written to the stream whenever data in the table is modified:

KEYS_ONLY — Only the key attributes of the modified item.

NEW_IMAGE — The entire item, as it appears after it was modified.

OLD_IMAGE — The entire item, as it appeared before it was modified.

NEW_AND_OLD_IMAGES — Both the new and the old images of the item.

You can enable or disable a stream at any time. However, you receive a ResourceInUseException if you try to enable a stream on a table that already has a stream. You receive a ValidationException if you try to disable a stream on a table that doesn't have a stream.

When you set StreamEnabled to true, DynamoDB creates a new stream with a unique stream descriptor assigned to it. If you disable and then re-enable a stream on the table, a new stream is created with a different stream descriptor.

Every stream is uniquely identified by an Amazon Resource Name (ARN). The following is an example ARN for a stream on a DynamoDB table named TestTable.

```
arn:aws:dynamodb:us-west-2:111122223333:table/TestTable/stream/2015-05-11T21:21:33.291
```
To determine the latest stream descriptor for a table, issue a DynamoDB DescribeTable request and look for the LatestStreamArn element in the response.
