import React, { useEffect, useState, useRef } from "react";
import Crossword from "@jaredreisinger/react-crossword";
import { useNavigate } from "react-router-dom";
import { fetchGames } from "../api";
import { saveProgress } from "../api";
import { savePartialProgress, getProgress } from "../api";
import "./crossword.css";

// Declara a função manual para decodificar JWT
const decodeTokenManualmente = (token) => {
  try {
    const base64Url = token.split(".")[1]; // Segmento do payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Ajusta caracteres
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    // Retorna o conteúdo do payload como objeto JSON decodificado
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erro ao decodificar token manualmente:", error);
    return null; // Retorna null caso não consiga decodificar
  }
};

function idxToRC(idx, cols) {
  return { r: Math.floor(idx / cols), c: idx % cols };
}

// Função para adaptar seu array "words" ao formato do react-crossword
function convertWordsToCrosswordData(words = [], cols = 11) {
  const data = { across: {}, down: {} };
  for (const w of words) {
    if (!w.dir || !w.startCell || !w.answer) continue;
    const key = w.startCell; // pode personalizar caso precise chave única diferente
    const rc = idxToRC(w.startCell - 1, cols);
    const entry = {
      clue: w.clue || "Enigma",
      answer: (w.answer || "").toUpperCase(),
      row: rc.r,
      col: rc.c,
    };
    if (w.dir === "across") {
      data.across[key] = entry;
    }
    if (w.dir === "down") {
      data.down[key] = entry;
    }
  }
  return data;
}

export default function Teste({ rows = 11, cols = 11 }) {
  // Estados
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [isAllCorrect, setIsAllCorrect] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const congratsAudioRef = useRef(new Audio("./audios/congratulation.mp3"));
  const audioRef = useRef(null); // Inicializa a referência para o <audio>

  const getUserId = () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Token não encontrado. O usuário precisa fazer login.");
      }

      // Agora usamos decodeTokenManualmente
      const decodedToken = decodeTokenManualmente(token);

      // Verifica se o token contém o userId
      if (!decodedToken?.id) {
        throw new Error("Token não contém userId válido");
      }

      return decodedToken.id; // Retorna o userId do payload
    } catch (error) {
      console.error("Erro ao obter userId:", error.message);
      return null; // Retorna null caso não consiga decodificar
    }
  };

  const handleSaveProgress = async (customIdx) => {
    try {
      setIsSaving(true);

      const userId = getUserId();
      if (!userId) {
        alert(
          "Não foi possível salvar o progresso. O usuário não está autenticado."
        );
        return;
      }

      // ⬇️ Salva usando o índice passado, ou o atual se nada for passado
      const idxToSave =
        typeof customIdx === "number" ? customIdx : currentLevelIdx;
      const completedPuzzle = levels[idxToSave]?.level;
      const token = localStorage.getItem("authToken");

      // DEBUG LOG:
      console.log(
        "Salvando índice:",
        idxToSave,
        "completedPuzzle:",
        completedPuzzle
      );

      const response = await saveProgress(userId, completedPuzzle, token);

      console.log("Resposta do servidor:", response);
      alert("Progresso salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar progresso:", error.message);
      alert(
        error.message || "Erro ao salvar progresso. Por favor, tente novamente."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const loadLevels = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const data = await fetchGames();
        setLevels(data);
      } catch (err) {
        setError(err.message || "Erro ao carregar níveis");
      } finally {
        setLoading(false);
      }
    };

    loadLevels();
  }, [rows, cols]);

  useEffect(() => {
    const loadProgress = async () => {
      const token = localStorage.getItem("authToken");
      const userId = getUserId();

      if (!userId || !token) {
        console.error("Erro: usuário ou token não existem");
        return;
      }

      const progress = await getProgress(userId, token);

      const idx = levels.findIndex(
        (level) =>
          level.level.trim().toLowerCase() ===
          progress.currentLevel.trim().toLowerCase()
      );

      if (progress?.currentLevel && levels.length > 0) {
        if (idx !== -1) {
          setCurrentLevelIdx(idx); // Atualiza o nível
        } else {
          console.warn("Nível não encontrado:", progress.currentLevel);
        }
      }
    };

    if (levels.length > 0) loadProgress();
  }, [levels]);

  useEffect(() => {
    // Verifica se há níveis carregados e se o nível atual é válido
    if (levels[currentLevelIdx]) {
      const currentLevel = levels[currentLevelIdx];
      if (currentLevel.slug && audioRef.current) {
        // Atualiza o src do <audio> dinamicamente com base no slug do nível atual
        audioRef.current.src = `/audios/${currentLevel.slug}.mp3`;
        audioRef.current.load(); // Recarrega o novo áudio
      }
    }
  }, [currentLevelIdx, levels]); // Reexecuta quando currentLevelIdx ou levels mudarem

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  return (
    <div id="grid-crossword" className="crossword">
      <header className="header">Crossword</header>
      <div className="section-crossword">
        <h3 className="level-crossword">
          {levels[currentLevelIdx]?.level || "Nível desconhecido"}
        </h3>

        <audio controls ref={audioRef}></audio>
        <button
          className={`next-crossword ${isAllCorrect ? "correct" : ""}`}
          onClick={async () => {
            const nextIdx = (currentLevelIdx + 1) % levels.length;
            setCurrentLevelIdx(nextIdx);
            setTimeout(() => {
              handleSaveProgress(nextIdx); // <-- aqui passa O INDICE DO NOVO LEVEL!
            }, 0);
          }}
          disabled={!isAllCorrect || isSaving}
        >
          {isSaving ? "Salvando..." : "Next"}
        </button>
      </div>
      <main className="main-crossword">
        <div className="grid-teste">
          <Crossword
            data={convertWordsToCrosswordData(
              levels[currentLevelIdx]?.words || [],
              cols
            )}
            theme={{
              gridBackground: "transparent", // cor do fundo do grid inteiro
              cellBackground: "#c2e6ff", // fundo das células ativas
              cellCompletedBackground: "#0c700cff", // verde claro quando completa, etc
              // ... explore outros temas na doc oficial!
            }}
            onCrosswordCorrect={() => {
              setIsAllCorrect(true);
              if (congratsAudioRef.current) {
                congratsAudioRef.current.play().catch(console.error);
              }
            }}
            onCrosswordIncorrect={() => setIsAllCorrect(false)}
          />
        </div>
      </main>
      <footer className="footer">Crossword</footer>
    </div>
  );
}
