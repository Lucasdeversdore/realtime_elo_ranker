import React, { FC, useState } from "react";

interface PlayerFormProps {
  callback: (playerName: string) => Promise<Response>;
}

const PlayerForm: FC<PlayerFormProps> = (props) => {
  const { callback } = props;
  const [playerName, setPlayerName] = useState("");

  const resetForm = () => {
    setPlayerName("");
  };

  return (
    <form
      data-testid="MatchForm"
      className="flex flex-col justify-center mb-4 gap-4 p-2 border border-gray-300 rounded-md"
      onSubmit={(evt) => {
        evt.preventDefault();
        
        callback(playerName).then(async (res) => {
          if (res.ok) {
            // Succès : on vide le champ
            resetForm();
          } else {
            // Erreur : on extrait le message JSON du serveur (NestJS)
            try {
              const errorData = await res.json();
              // Affiche le message "Le joueur existe déjà" ou "Le nom est vide"
              alert(errorData.message || "Une erreur est survenue");
            } catch (e) {
              // Au cas où la réponse n'est pas du JSON
              alert("Erreur lors de la création du joueur");
            }
            console.error("Error while posting player", res.status);
          }
        });
      }}
    >
      <span className="text-xl">Nom du joueur</span>
      <input
        type="text"
        className="border border-gray-300 rounded-md p-2"
        value={playerName}
        onChange={(evt) => setPlayerName(evt.target.value)}
        placeholder="Ex: Zidane"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition-colors"
      >
        Déclarer le joueur
      </button>
    </form>
  );
};

export default PlayerForm;