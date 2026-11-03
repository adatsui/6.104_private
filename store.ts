const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is not set. Run step 2 of Part 0 to set it.");
  process.exit(1);
}

const shelf = [
  { item: "Twix", size: "fun size, bag of 20", price: 5.49 },
  { item: "Kit Kat", size: "fun size, bag of 20", price: 5.49 },
  { item: "Milky Way", size: "fun size, bag of 20", price: 4.99 },
];
// Bags in stock. searchCatalog returns only each item's name, size, and price.
const stock: Record<string, number> = { "Twix": 3, "Kit Kat": 0, "Milky Way": 2 };
const cart: Record<string, number> = {};

function searchCatalog(args: { query: string }) {
  const hits = shelf.filter((e) => e.item.toLowerCase().includes(args.query.toLowerCase()));
  return { items: hits.length > 0 ? hits : shelf };
}

function addToCart(args: { item: string; quantity: number }) {
  const entry = shelf.find((e) => e.item.toLowerCase() === args.item.toLowerCase());
  if (!entry) return { error: "NO_SUCH_ITEM" };
  if (stock[entry.item] < args.quantity) return { error: "OUT_OF_STOCK", item: entry.item, inStock: stock[entry.item] };
  stock[entry.item] -= args.quantity;
  cart[entry.item] = (cart[entry.item] ?? 0) + args.quantity;
  return { cart };
}

const message = process.argv[2] ?? "Add 2 Twix to my cart.";
const tools: Record<string, (args: any) => object> = { searchCatalog, addToCart };

const request: any = {
  system_instruction: { parts: [{ text: "You are the shopping assistant for an online Halloween candy store. Help customers find candy and manage their cart." }] },
  contents: [{ role: "user", parts: [{ text: message }] }],
  tools: [{
    functionDeclarations: [
      {
        name: "searchCatalog",
        description: "Searches the store's catalog. Returns matching items with their size and price.",
        parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
      },
      {
        name: "addToCart",
        description: "Adds an item to the customer's cart.",
        parameters: {
          type: "object",
          properties: { item: { type: "string", description: "An item name from searchCatalog" }, quantity: { type: "integer", minimum: 1 } },
          required: ["item", "quantity"],
        },
      },
    ],
  }],
};

for (let n = 1; n <= 5; n++) {
  const response = await fetch(URL, {
    method: "POST",
    headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  const reply = await response.json();
  if (reply.error) throw new Error(reply.error.message);

  const turn = reply.candidates[0].content;
  const calls = turn.parts.filter((part: any) => part.functionCall).map((part: any) => part.functionCall);
  if (calls.length === 0) {
    console.log(`Request ${n} → text: ${turn.parts.map((part: any) => part.text ?? "").join("")}`);
    console.log("Cart:", cart);
    break;
  }

  const results = calls.map((call: any) => {
    const result = tools[call.name](call.args);
    console.log(`Request ${n} → call ${call.name}(${JSON.stringify(call.args)}), result ${JSON.stringify(result)}`);
    return { functionResponse: { id: call.id, name: call.name, response: result } };
  });
  // The API returns an error for a function call sent back without its thoughtSignature, so the script sends the model's turn back unchanged.
  request.contents.push(turn, { role: "user", parts: results });
}