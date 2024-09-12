BeNice is a chrome extension that queries the Llama3.1 running on your local ollama server
in order to check your message for passive-aggressive messages.

# Usage

1. Install the extension
2. Start the ollama server locally, while allowing the requests from all origins with the following command

```sh
OLLAMA_ORIGINS="*" ollama serve
```

3. Now whenever you enter text into a TextArea, you should be able to see the icon next to it showing you
   if the text looks okay for posting publically

# TODO

- automatically validate the text, when some was already present before you started typing
- put server configuration in the popup
- fix the icon position... right now it can be in a very random place
