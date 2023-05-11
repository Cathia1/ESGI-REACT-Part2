import { useCallback, useEffect, useState } from "react";
import {  useParams } from "react-router-dom";



import "./Note.css";

const Note = ({onSubmit}) => {
  const { id } = useParams();
  const [note, setNote] = useState ({ title: "", content: "", pinned: false });
  const [error, setError] = useState(null);
  
  const [theme, setTheme] = useState("light");
  const handleToggleTheme = () => {  
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }; /*Fonction pour changer de theme : mode jour ou mode nuit*/
  
  const handlePinNote = () => {
    setNote({ ...note, pinned: !note.pinned });
  };/*Fonction pour épingler une note*/

  const fetchNote = useCallback(async () => {
    try {
      const response = await fetch(`/notes/${id}`);
      const result = await response.json();
      setNote(result);
    } catch (error) {
      setError(error);
    }
    
  }, [id]);

  useEffect(() => {
    fetchNote();
  }, [id, fetchNote]);

  const handleSaveNote = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      });
      const result = await response.json();
      setNote(result);
    } catch (error) {
      setError(error);
    }
    onSubmit();
  }; /*Fonction pour enregistrer une note*/

  

  const handleDeleteNote = async () => {
    try {
      await fetch(`/notes/${id}`, {
        method: "DELETE",
      });
      setNote(null);
    } catch (error) {
      setError(error);
    }
    onSubmit();
  }; /*Fonction pour supprimer une note*/

  const handleCreateNote = async () => {
    try {
      const response = await fetch(`/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "Nouvelle note", content: "" }),
      });
      const result = await response.json();
      setNote(result);
    } catch (error) {
      setError(error);
    }
    onSubmit();
  }; /*Fonction pour ajputer une note*/

  if (error) {
    return <div>Erreur: {error.message}</div>;
  }

  return (
    <div className="Note">
      <form className="Form" onSubmit={handleSaveNote}>
        <input
          className="Note-editable Note-title"
          type="text"
          value={note ? note.title : ""}
          onChange={(event) => {
            setNote({ ...note, title: event.target.value });
          }}
        />    
      <textarea
        className="Note-editable Note-content"
        value={note ? note.content : ""}
        onChange={(event) => {
          setNote({ ...note, content: event.target.value });
        }}
      />
      <div className="Note-actions" >
        <button className="Theme-toggle Light-mode dark-mode" onClick={handleToggleTheme}>
          {theme === "light" ? "Dark Mode" : "Light-mode"}
        </button>
        <button className="Pin-button Note-pinned" onClick={handlePinNote}>
      {note.pinned ? "Détacher" : "Épingler"}
        </button>
        <button className="Button" type="submit">
            Enregistrer
          </button>
          {note && (
            <button className="Button" onClick={handleDeleteNote}>
              Supprimer
            </button>
          )}
          <button className="Button" onClick={handleCreateNote}>
            Ajouter une note
          </button>
        </div>
      </form>
    </div>
    
  );

};

export default Note; 
