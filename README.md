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

# Development

Start the local server with `npm run dev`.

- [http://localhost:5173/popup](http://localhost:5173/popup) - contains the page of the popup that opens when you click on the extension icon
- [http://localhost:5173/examples/script](http://localhost:5173/examples/script) - contains a simple page with a lot of text boxes that
  can be dynamically added or removed. The content-script is applied to it. This makes it easy to validate that the conten-script actually does
  what it is intended to

# TODO

- automatically validate the text, when some was already present before you started typing
- fix the icon position... right now it can be in a very random place
- text validation should not be a boolean, but rather a probability percentage that this is offensive. Right now this is too sensitive.
