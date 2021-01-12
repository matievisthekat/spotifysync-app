import RequestHandler from "./RequestHandler";

const redirectUri = "tunein://callback";
export const client = new RequestHandler({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri,
  scope: ["user-read-playback-state", "user-modify-playback-state", "user-read-private"],
});

client.verbose = true;
