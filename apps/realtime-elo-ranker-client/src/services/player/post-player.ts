const URL = "/api/player";

/**
 * Post a player to create it.
 * * @param {string} baseUrl The base URL of the API
 * @param {string} playerName Le nom du nouveau joueur
 */
export default function postPlayer(baseUrl: string, playerName: string): Promise<Response> {
  return fetch(baseUrl + URL, {
    method: "POST",
    body: JSON.stringify({
      name: playerName, // CHANGE ICI : on envoie "name" au lieu de "id"
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}