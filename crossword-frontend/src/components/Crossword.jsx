import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGames } from "../api";
import { saveProgress } from "../api";
import { useAuth } from "../context/authContext";
import { savePartialProgress, getProgress } from "../api";
import { FaGithub } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
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

function rcToIdx(r, c, cols) {
  return r * cols + c;
}

function getIndicesForWord(startCell, dir, length, rows, cols) {
  const startIdx = startCell - 1;
  if (startIdx < 0 || startIdx >= rows * cols) {
    throw new Error(`startCell ${startCell} fora da grade`);
  }
  const { r: startR, c: startC } = idxToRC(startIdx, cols);
  const indices = [];
  if (dir === "across") {
    if (startC + length > cols) {
      throw new Error(
        `Palavra "across" extrapola a linha: começa em coluna ${startC}`
      );
    }
    for (let offset = 0; offset < length; offset++) {
      indices.push(rcToIdx(startR, startC + offset, cols));
    }
  } else if (dir === "down") {
    if (startR + length > rows) {
      throw new Error(
        `Palavra "down" extrapola as linhas: começa em linha ${startR}`
      );
    }
    for (let offset = 0; offset < length; offset++) {
      indices.push(rcToIdx(startR + offset, startC, cols));
    }
  } else {
    throw new Error(`Direção inválida: ${dir}`);
  }
  return indices;
}

function placeWordsIntoGrid(rows, cols, words) {
  const cellCount = rows * cols;
  const grid = Array.from({ length: cellCount }).map(() => ({
    letter: "",
    solution: null,
    number: null,
    status: "default",
    isPartOfAcrossWord: false, // ADICIONA FLAG
    isPartOfDownWord: false, // ADICIONA FLAG
  }));

  const errors = [];

  (words || []).forEach((w) => {
    const answer = (w.answer || "").toUpperCase();
    try {
      const indices = getIndicesForWord(
        w.startCell,
        w.dir,
        answer.length,
        rows,
        cols
      );
      for (let i = 0; i < indices.length; i++) {
        const idx = indices[i];
        const cell = grid[idx];
        if (!cell) {
          errors.push({ word: w, reason: `Índice inválido ${idx}` });
          return;
        }
        cell.solution = answer[i];
        if (w.dir === "across") {
          cell.isPartOfAcrossWord = true;
        }
        if (w.dir === "down") {
          cell.isPartOfDownWord = true;
        }
      }
    } catch (err) {
      errors.push({ word: w, reason: `Erro: ${err.message}` });
    }
  });

  return { grid, errors };
}

export default function Teste({ rows = 11, cols = 11 }) {
  const { user } = useAuth();
  // Estados
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gridCells, setGridCells] = useState([]);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [isAllCorrect, setIsAllCorrect] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [inputDirection, setInputDirection] = useState("across"); // ou "down"

  const inputRefs = useRef([]);
  const congratsAudioRef = useRef(new Audio("./audios/congratulation.mp3"));
  const audioRef = useRef(null); // Inicializa a referência para o <audio>

  // Função moveFocus para mover o foco entre células
  const moveFocus = (currentIdx, directionCallback) => {
    let nextIndex = currentIdx;

    while (true) {
      // Decide o próximo índice com base na função callback passada
      nextIndex = directionCallback(nextIndex);

      // Verifica limites da grade
      if (nextIndex < 0 || nextIndex >= gridCells.length) {
        return; // Sai da função caso o índice esteja fora dos limites
      }

      // Verifica se a célula é interativa e NÃO está correta
      if (
        gridCells[nextIndex]?.solution !== null &&
        gridCells[nextIndex]?.status !== "correct"
      ) {
        inputRefs.current[nextIndex]?.focus(); // Move o foco para o próximo input correto
        return;
      }
    }
  };

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

      await saveProgress(userId, completedPuzzle, token);
    } catch (error) {
      console.error("Erro ao salvar progresso:", error.message);
      alert(
        error.message || "Erro ao salvar progresso. Por favor, tente novamente."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoSave = async () => {
    const token = localStorage.getItem("authToken");
    const userId = getUserId();

    const currentState = gridCells; // ou o estado que guarda as letras digitadas
    const currentLevel = levels[currentLevelIdx]?.level;

    await savePartialProgress(userId, currentLevel, currentState, token);
  };

  useEffect(() => {
    // Verifica se todas as células da grade estão devidamente preenchidas
    const allCorrect = gridCells.every(
      (cell) => !cell.solution || cell.status === "correct" // Apenas células que têm solução devem estar "correct"
    );

    // Atualiza o estado isAllCorrect
    setIsAllCorrect(allCorrect);

    // Toca o áudio APENAS quando todas as respostas estiverem certas e o estado mudar para "true"
    if (allCorrect && congratsAudioRef.current) {
      congratsAudioRef.current.play().catch((error) => {
        console.error(
          "Erro ao tentar reproduzir o áudio de congratulação:",
          error
        );
      });
    }
  }, [gridCells]); // Observar mudanças nas células da grade

  const navigate = useNavigate();

  useEffect(() => {
    const loadLevels = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login"); // Redireciona imediatamente se não houver token
        return;
      }
      try {
        const data = await fetchGames();
        setLevels(data); // Armazena os níveis no estado
        if (data.length > 0) {
          const { grid } = placeWordsIntoGrid(rows, cols, data[0].words);
          setGridCells(grid); // Inicializa o grid
        }
      } catch (err) {
        setError(err.message || "Erro ao carregar níveis");
      } finally {
        setLoading(false);
      }
    };

    loadLevels();
  }, [rows, cols, navigate]);

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

  useEffect(() => {
    if (!levels.length) return;

    const level = levels[currentLevelIdx];
    if (!level) return;

    const { grid } = placeWordsIntoGrid(rows, cols, level.words);
    setGridCells(grid);
  }, [currentLevelIdx, levels, rows, cols]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  const handleKeyboardNavigation = (idx, e) => {
    if (!gridCells[idx]?.solution) return;

    if (e.key === "ArrowRight") {
      moveFocus(idx, (i) => i + 1);
    }

    if (e.key === "ArrowLeft") {
      moveFocus(idx, (i) => i - 1);
    }

    if (e.key === "ArrowDown") {
      moveFocus(idx, (i) => i + cols);
    }

    if (e.key === "ArrowUp") {
      moveFocus(idx, (i) => i - cols);
    }
  };

  const handleKeyboardAndBackspace = (idx, e) => {
    // Se célula atual estiver correta, ignora backspace
    if (gridCells[idx]?.status === "correct") {
      e.preventDefault();
      return;
    }

    if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
      handleKeyboardNavigation(idx, e);
      return;
    }

    if (e.key === "Backspace") {
      const valorAtual = gridCells[idx]?.letter;
      // Se está vazio, pula na direção correta APAGANDO célula anterior só se não for "correct"
      if (!valorAtual) {
        let prevIdx;
        if (inputDirection === "down") {
          // vai para cima
          prevIdx = idx - cols;
          // Pula qualquer célula sem solução ou já correta!
          while (
            prevIdx >= 0 &&
            (!gridCells[prevIdx]?.solution ||
              gridCells[prevIdx].status === "correct")
          ) {
            prevIdx -= cols;
          }
        } else {
          // padrão horizontal (esquerda)
          prevIdx = idx - 1;
          while (
            prevIdx >= 0 &&
            (!gridCells[prevIdx]?.solution ||
              gridCells[prevIdx].status === "correct")
          ) {
            prevIdx--;
          }
        }

        if (prevIdx >= 0) {
          const newGrid = [...gridCells];
          newGrid[prevIdx].letter = "";
          newGrid[prevIdx].status = "default";
          setGridCells(newGrid);
          inputRefs.current[prevIdx]?.focus();
          e.preventDefault();
        }
      }
    }
  };

  return (
    <div id="grid-crossword">
      <header className="header-crossword">
        <div className="user-log">
          <p>
            <FaUserCircle className="user-icon" />
          </p>
          <p>{user ? user.name : "usuário"}</p>
        </div>

        <a href="/logout">Sair</a>
      </header>
      <div className="d-flex main-master">
        <section className="section-crossword">
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
        </section>
        <main className="main-crossword">
          <div
            className="crossword-grid"
            role="grid"
            aria-label={`Palavras cruzadas ${rows}x${cols}`}
          >
            {gridCells.map((cell, idx) => {
              const cls = [
                "cell",
                cell.solution ? "in-word" : "",
                cell.status === "correct" ? "correct" : "",
                cell.status === "wrong" ? "wrong" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div key={idx} data-cell={idx} className={cls}>
                  {cell.status === "correct" ? (
                    // Ao acertar, SÓ EXIBE A LETRA. NÃO TEM MAIS INPUT!
                    <span className="cell-letter">{cell.letter}</span>
                  ) : cell.solution ? (
                    <input
                      type="text"
                      maxLength={1}
                      className="cell-input"
                      value={cell.letter}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      onKeyDown={(e) => handleKeyboardAndBackspace(idx, e)}
                      onClick={() => {
                        if (cell.isPartOfAcrossWord) {
                          setInputDirection("across");
                        } else if (cell.isPartOfDownWord) {
                          setInputDirection("down");
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        const newGrid = [...gridCells];

                        newGrid[idx].letter = value;

                        if (value === cell.solution) {
                          newGrid[idx].status = "correct";
                        } else if (value !== "") {
                          newGrid[idx].status = "wrong";
                        } else {
                          newGrid[idx].status = "default";
                        }

                        setGridCells(newGrid);

                        if (value !== "") {
                          // Direção agora depende do estado inputDirection!
                          if (inputDirection === "down") {
                            moveFocus(idx, (idx) => idx + cols);
                          } else {
                            moveFocus(idx, (idx) => idx + 1);
                          }
                        }

                        handleAutoSave();
                      }}
                    />
                  ) : (
                    cell.letter
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
      <footer className="footer-crossword">
        <div className="dev-info">
          <p>
            <FaGithub className="git-icon" />
          </p>
          <p className="">JoãoP Dev</p>
        </div>
      </footer>
    </div>
  );
}
