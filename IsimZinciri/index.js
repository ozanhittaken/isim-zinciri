const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

// GEÇERLİ İSİMLER SÖZLÜĞÜ (Rastgele harf girişini engeller)
const validNamesArray = [
  "AHMET",
  "MEHMET",
  "AYŞE",
  "FATMA",
  "MUSTAFA",
  "ALİ",
  "HÜSEYİN",
  "HASAN",
  "İBRAHİM",
  "İSMAİL",
  "OSMAN",
  "HALİL",
  "SÜLEYMAN",
  "YUSUF",
  "ÖMER",
  "TARKAN",
  "BURAK",
  "KEMAL",
  "LEYLA",
  "GİZEM",
  "ELİF",
  "ZEYNEP",
  "HATİCE",
  "EMİNE",
  "YASEMİN",
  "MERVE",
  "ESRA",
  "GÖKHAN",
  "HAKAN",
  "SERKAN",
  "VOLKAN",
  "TOLGA",
  "CAN",
  "CEM",
  "CENK",
  "BÜŞRA",
  "KÜBRA",
  "DERYA",
  "DENİZ",
  "CEREN",
  "ECE",
  "BARIŞ",
  "SAVAŞ",
  "ONUR",
  "UMUT",
  "GÜL",
  "NUR",
  "CANAN",
  "SİNEM",
  "İREM",
  "GÜRKAN",
  "ERKAN",
  "ERHAN",
  "MURAT",
  "FIRAT",
  "NİHAT",
  "SUAT",
  "FUAT",
  "MESUT",
  "YAKUP",
  "YUNUS",
  "ADEM",
  "HAVVA",
  "SELİM",
  "YAVUZ",
  "KADİR",
  "MERT",
  "METE",
  "KAAN",
  "BATUHAN",
  "OĞUZHAN",
  "DOĞUKAN",
  "AYKUT",
  "İLKER",
  "SONER",
  "TAYFUN",
  "UFUK",
  "UĞUR",
  "YASİN",
  "YALÇIN",
  "ORHAN",
  "BURHAN",
  "CİHAN",
  "ERDAL",
  "KORAY",
  "OKTAY",
  "BORA",
  "EMRE",
  "YİĞİT",
  "EFE",
  "ARDA",
  "KEREM",
  "ALP",
  "ASLI",
  "BANU",
  "BERNA",
  "BİNNUR",
  "BİRSEN",
  "CANSU",
  "ÇAĞLA",
  "ÇİĞDEM",
  "DİDEM",
  "DİLARA",
  "EBRU",
  "EDA",
  "FİLİZ",
  "FUNDA",
  "GAMZE",
  "GÜLÇİN",
  "HANDE",
  "HİLAL",
  "MELİS",
  "MİNE",
  "MÜGE",
  "NAZ",
  "NEHİR",
  "NİLAY",
  "ÖZGE",
  "ÖZLEM",
  "PELİN",
  "PINAR",
  "SANEM",
  "SEDA",
  "SELEN",
  "SELİN",
  "SEVİL",
  "SİBEL",
  "ŞEBNEM",
  "ŞEYMA",
  "TUĞBA",
];
const validNames = new Set(validNamesArray); // Hızlı arama için Set'e çevrildi
const rooms = {};

io.on("connection", (socket) => {
  socket.on("joinRoom", (data) => {
    const { roomCode, username } = data;
    if (!rooms[roomCode])
      rooms[roomCode] = {
        players: [],
        usedNames: [],
        currentLetter: "",
        turn: 0,
        turnStartTime: 0,
      };
    if (rooms[roomCode].players.length >= 2)
      return socket.emit("errorMsg", "Bu oda dolu!");

    // Oyuncuya joker haklarını da ekliyoruz
    rooms[roomCode].players.push({
      id: socket.id,
      name: username,
      score: 0,
      jokers: { freeze: 1, letter: 1, pass: 1 },
    });
    socket.join(roomCode);
    socket.emit("joined", { playerNumber: rooms[roomCode].players.length });

    if (rooms[roomCode].players.length === 2) {
      const firstWord =
        validNamesArray[Math.floor(Math.random() * validNamesArray.length)];
      rooms[roomCode].usedNames.push(firstWord);
      rooms[roomCode].currentLetter = firstWord.slice(-1);
      rooms[roomCode].turn = 0;
      rooms[roomCode].turnStartTime = Date.now();

      io.to(roomCode).emit("gameStart", {
        firstWord: firstWord,
        currentLetter: rooms[roomCode].currentLetter,
        players: rooms[roomCode].players,
        turnIndex: rooms[roomCode].turn,
      });
    }
  });

  // KELİME HAMLESİ
  socket.on("makeMove", (data) => {
    const { roomCode, word } = data;
    const room = rooms[roomCode];
    if (!room) return;

    const upperWord = word.toLocaleUpperCase("tr-TR");
    const currentPlayer = room.players[room.turn];

    if (upperWord.charAt(0) !== room.currentLetter)
      return socket.emit(
        "errorMsg",
        `Kelime "${room.currentLetter}" ile başlamalı!`
      );
    if (!validNames.has(upperWord))
      return socket.emit(
        "errorMsg",
        `Hata! "${upperWord}" veritabanında geçerli bir isim değil!`
      );
    if (room.usedNames.includes(upperWord))
      return socket.emit("errorMsg", "Bu kelime zaten kullanıldı!");

    const timeTaken = (Date.now() - room.turnStartTime) / 1000;
    let timeLeft = 10 - timeTaken;
    if (timeLeft < 0) timeLeft = 0;

    const pointsEarned = 10 + Math.floor(timeLeft * 5);
    currentPlayer.score += pointsEarned;

    room.usedNames.push(upperWord);
    room.currentLetter = upperWord.slice(-1);
    room.turn = room.turn === 0 ? 1 : 0;
    room.turnStartTime = Date.now();

    io.to(roomCode).emit("moveMade", {
      word: upperWord,
      playerId: socket.id,
      playerName: currentPlayer.name,
      pointsEarned: pointsEarned,
      nextLetter: room.currentLetter,
      players: room.players,
      nextTurnIndex: room.turn,
    });
  });

  // JOKER KULLANIMI
  socket.on("useJoker", (data) => {
    const { roomCode, type } = data;
    const room = rooms[roomCode];
    if (!room) return;

    const currentPlayer = room.players[room.turn];
    if (currentPlayer.id !== socket.id || currentPlayer.jokers[type] <= 0)
      return;

    currentPlayer.jokers[type]--; // Jokeri eksilt

    if (type === "freeze") {
      room.turnStartTime = Date.now();
      io.to(roomCode).emit("jokerEffect", {
        type: "freeze",
        playerName: currentPlayer.name,
        letter: room.currentLetter,
        nextTurnIndex: room.turn,
      });
    } else if (type === "letter") {
      const lastWord = room.usedNames[room.usedNames.length - 1];
      if (lastWord && lastWord.length >= 2) {
        room.currentLetter = lastWord.charAt(lastWord.length - 2); // Sondan ikinci harf
        io.to(roomCode).emit("jokerEffect", {
          type: "letter",
          playerName: currentPlayer.name,
          letter: room.currentLetter,
          nextTurnIndex: room.turn,
        });
      }
    } else if (type === "pass") {
      room.turn = room.turn === 0 ? 1 : 0; // Sırayı rakibe at
      room.turnStartTime = Date.now();
      io.to(roomCode).emit("jokerEffect", {
        type: "pass",
        playerName: currentPlayer.name,
        letter: room.currentLetter,
        nextTurnIndex: room.turn,
      });
    }
  });

  socket.on("timeUp", (roomCode) => {
    if (rooms[roomCode]) {
      io.to(roomCode).emit("gameOver", {
        loserId: socket.id,
        reason: "Süre doldu!",
        players: rooms[roomCode].players,
      });
      delete rooms[roomCode];
    }
  });
});

const listener = http.listen(process.env.PORT || 3000, () => {
  console.log("Sunucu çalışıyor!");
});
