// 1. Atualiza isAllCorrect e toca áudio de congratulação — só frontend/renderização
useEffect(() => {
  const allCorrect = gridCells.every(
    (cell) => !cell.solution || cell.status === "correct"
  );
  setIsAllCorrect(allCorrect);

  if (allCorrect && congratsAudioRef.current) {
    congratsAudioRef.current.play().catch((error) => {
      console.error(
        "Erro ao tentar reproduzir o áudio de congratulação:",
        error
      );
    });
  }
}, [gridCells]);

// 2. Atualiza o áudio com base no nível atual — só frontend/renderização
useEffect(() => {
  if (levels[currentLevelIdx]) {
    const currentLevel = levels[currentLevelIdx];
    if (currentLevel.slug && audioRef.current) {
      audioRef.current.src = `/audios/${currentLevel.slug}.mp3`;
      audioRef.current.load();
    }
  }
}, [currentLevelIdx, levels]);

// 3. Renderiza o grid do crossword conforme o nível atual — só frontend/renderização
useEffect(() => {
  if (!levels.length) return;

  const level = levels[currentLevelIdx];
  if (!level) return;

  const { grid } = placeWordsIntoGrid(rows, cols, level.words);
  setGridCells(grid);
}, [currentLevelIdx, levels, rows, cols]);
