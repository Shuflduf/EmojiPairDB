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
    // const emojiRegex =
    //   /^(?:[\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|[\u0023-\u0039]\uFE0F?|[\u200D\u20E3\uFE0F\uD83C\uDFFB-\uDFFF])+$/;
    const emojiRegex =
      /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;
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
  <div
    class="mb-4 flex flex-wrap md:flex-nowrap space-y-4 md:space-y-0 md:space-x-4 items-center"
  >
    <input
      type="text"
      placeholder="Username"
      bind:value={username}
      class="p-2 rounded w-full md:w-auto outline-none bg-yellow-100 focus:outline-yellow-400 shadow-md transition-shadow hover:shadow-lg"
    />
    <input
      type="text"
      placeholder="Emojis"
      class="p-2 rounded w-full md:w-auto outline-none bg-yellow-100 {emojiError
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
      class="p-2 bg-blue-500 text-white rounded w-full md:w-auto hover:bg-blue-600 cursor-pointer shadow-md transition-shadow hover:shadow-lg"
    />
    {#if errorMessage}
      <p class="text-red-500 flex items-center w-full md:w-auto">
        {errorMessage}
      </p>
    {/if}
    <div class="flex-grow"></div>
    <input
      type="text"
      placeholder="Search"
      bind:value={searchQuery}
      class="place-self-end p-2 rounded w-full md:w-auto outline-none bg-yellow-100 focus:outline-yellow-400 shadow-md transition-shadow hover:shadow-lg"
    />
  </div>
</div>

<div
  class="max-w-full px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
>
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
