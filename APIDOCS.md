# API Design for Omni Chatbot

Omnis utilizes Tanstack query JS library to send API requests. This offers functionalities such as loading state, error handlers etc.

## API Flow

Whenever the user sends a prompt, it undergoes the following flow:

1. User enters their prompt.
2. The prompt is saved in the State and the Local storage as a Message object with necessary details.
3. The prompt is then sent to the API endpoint via Tanstack query.
4. While the API request is processing, The loading state is utilised to show the user that the request is processing.
5. If the request ends in success. The response(usually in markdown) is parsed and displayed to the user. The response is also saved in the State and the Local Storage.
6. If the request ends in error. The error message is displayed to the user in a toast message

## API Flow Diagram

![APIFlow](https://github.com/fosslover69/omnis-chatbot/assets/67329471/a70e15d9-863c-4b13-95f4-6b3224ddaf00)
