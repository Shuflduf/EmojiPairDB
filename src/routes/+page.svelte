<script lang="ts">
  import { Client, Databases, ID } from "appwrite";

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("679855a20001624a7a0b");

  const databases = new Databases(client);

  async function createDocument() {
    const result = await databases.createDocument(
      "main",
      "users",
      ID.unique(),
      {
        username: "JOSHUA",
        emojis: "🐔🐴",
      }
    );

    console.log(result);
  }

  createDocument();
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
  documentation
</p>
