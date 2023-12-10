# Chat Instances

The Chat Instances of Omnis Chatbot is handled via dynamic routing.

## Chat Instance Flow

The Chat Instances flow functions as follows:

1. Each Chat Instance has it's own unique Instance ID.
2. Whenever a User opens a Chat Instance they will be redirected to the respective page of the Chat Instance which is dynamically created using the Instance ID.
3. Then the ID is fetched from the URL slug and then the respective chats are loaded from state.
4. If the ID doesn't exist the user will be redirected to homepage.

![InstanceDesign](https://github.com/fosslover69/omnis-chatbot/assets/67329471/b463190b-114b-42c2-8e8c-b1c0d38d56b9)

## Why routing approach?

- This approach reduces state complexity.
- This approach allows users to have multiple instances opened on different tabs effortlessly.
- Since the IDs are on the URL users don't need to navigate to the Instance manually everytime.
- If the chats are stored in the cloud in future. This allows the users to share their instances to other users too.
