<script lang="ts">
  import { Client, Databases, ID, Query, type Models } from "appwrite";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  let users: Models.Document[] = $state([]);
  let filteredUsers: Models.Document[] = $state([]);
  let username = $state("");
  let emojis = $state("");
  let emojiError = $state(false);
  let errorMessage = $state("");
  let searchQuery = $state("");

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("679855a20001624a7a0b");

  const databases = new Databases(client);

  async function updateDocuments() {
    const listResult = await databases.listDocuments("main", "users");
    users = listResult.documents.reverse();
    filterUsers();
  }

  function validateEmojis(value: string) {
    const emojiRegex =
      /^(?:[\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|[\u0023-\u0039]\uFE0F?|[\u200D\u20E3\uFE0F\uD83C\uDFFB-\uDFFF])+$/;
    const emojiCount = Array.from(value).length;
    emojiError = emojiCount !== 2 || !emojiRegex.test(value);
  }

  function canSubmit() {
    validateEmojis(emojis);
    if (emojiError) {
      errorMessage = "Invalid emojis / Must have exactly 2 emojis";
      return false;
    }
    if (username.length === 0) {
      errorMessage = "Username cannot be empty";
      return false;
    }
    if (username.length > 40) {
      errorMessage = "Username cannot be longer than 40 characters";
      return false;
    }
    return true;
  }

  async function submitUser() {
    if (!canSubmit()) {
      return;
    }
    const listResult = await databases.listDocuments("main", "users", [
      Query.equal("username", username),
    ]);
    console.log(listResult);
    if (listResult.total > 0) {
      console.log("User already exists");
      errorMessage = "User already exists";
      return;
    }
    const result = await databases.createDocument(
      "main",
      "users",
      ID.unique(),
      {
        username,
        emojis,
      }
    );
    errorMessage = "";
    username = "";
    emojis = "";
    updateDocuments();
  }

  function filterUsers() {
    filteredUsers = users.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  $effect(() => {
    filterUsers();
  });

  onMount(() => {
    updateDocuments();
  });
</script>

<div class="p-4 bg-yellow-50 text-gray-900">
  <div class="mb-4 flex space-x-4 items-center">
    <input
      type="text"
      placeholder="Username"
      bind:value={username}
      class="p-2 rounded w-auto outline-none bg-yellow-100 focus:outline-yellow-400 shadow-md transition-shadow hover:shadow-lg"
    />
    <input
      type="text"
      placeholder="Emojis"
      class="p-2 rounded w-auto outline-none bg-yellow-100 {emojiError
        ? 'outline-red-500'
        : 'focus:outline-yellow-400'} shadow-md transition-shadow hover:shadow-lg"
      bind:value={emojis}
      oninput={(e) => {
        if (e.target) {
          validateEmojis((e.target as HTMLInputElement).value);
        }
      }}
    />
    <input
      type="button"
      value="Add User"
      onclick={submitUser}
      class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer shadow-md transition-shadow hover:shadow-lg"
    />
    {#if errorMessage}
      <p class="text-red-500 flex items-center">
        {errorMessage}
      </p>
    {/if}
    <div class="flex-grow"></div>
    <input
      type="text"
      placeholder="Search"
      bind:value={searchQuery}
      class="place-self-end p-2 rounded w-auto outline-none bg-yellow-100 focus:outline-yellow-400 shadow-md transition-shadow hover:shadow-lg"
    />
  </div>
</div>

<div class="max-w-full px-4 grid grid-cols-4 gap-4">
  {#each filteredUsers as user}
    <div
      class="p-4 border rounded shadow-md bg-yellow-100 transition-shadow hover:shadow-lg"
    >
      <p class="text-lg font-bold text-center text-wrap break-all">
        {user.username}
      </p>
      <p class="text-4xl text-center">{user.emojis}</p>
    </div>
  {/each}
</div>

<style>
  :global(body) {
    background-color: #fffde7;
  }
</style>
