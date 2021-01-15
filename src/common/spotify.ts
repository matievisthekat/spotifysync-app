import RequestHandler from "./RequestHandler";

const redirectUri = "spotifysync://callback";
export const client = new RequestHandler({
  clientId: "416bb0c81cc142268ee15c8382b1ca79",
  redirectUri,
  scope: ["user-read-playback-state", "user-modify-playback-state", "user-read-private"],
});

client.verbose = true;
