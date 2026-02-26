const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

// İsim listeni aynen buraya bırakıyorum
const validNamesArray = [
    "ABBAS", "ABDULAZİZ", "ABDULKADİR", "ABDULLAH", "ABDULMELİK", "ABDULSAMET", "ABDULSELAM", "ABDURRAHMAN", "ABDÜLSAMET", "ADEM", "ADİL", "ADNAN", "AHMAD", "AHMET", "AKIN", "AKSEL", "ALAADDİN", "ALEV", "ALEVTİNA", "ALİ", "ALİŞAN", "ALPER", "ALPEREN", "ANDAÇ", "ANIL", "ARDA", "ARİF", "ARMAN", "ARZU", "ASENA", "ASIM", "ASLI", "ASLIHAN", "ASLAN", "ASUMAN", "ATAKAN", "ATİLLA", "AYBEGÜM", "AYBÜKE", "AYCAN", "AYDEMİR", "AYDIN", "AYDOĞAN", "AYHAN", "AYKAN", "AYKUT", "AYLA", "AYLİA", "AYLİN", "AYSU", "AYSUN", "AYŞE", "AYŞEGÜL", "AYŞEN", "AYŞENUR", "AYTAÇ", "AZİZ",
    "BAHADIR", "BAHRİ", "BAKİ", "BARAN", "BARIŞ", "BAŞAK", "BATUHAN", "BAVER", "BAYRAM", "BEDRİ", "BEDREDDİN", "BEGÜM", "BELGİN", "BELMA", "BENGÜ", "BENGÜHAN", "BERAAT", "BERAY", "BERÇEM", "BERFİN", "BERKER", "BERNA", "BERRİN", "BESTE", "BETÜL", "BEYZA", "BİLAL", "BİLGE", "BİLGİ", "BİLGİN", "BİNNUR", "BİRGÜL", "BİROL", "BİRSEN", "BİŞAR", "BORA", "BUĞRA", "BULUT", "BURAK", "BURCU", "BURÇİN", "BURHAN", "BURHANETTİN", "BÜLENT", "BÜNYAMİN", "BÜŞRA",
    "CAFER", "CAHİT", "CAN", "CANAN", "CANER", "CANSEN", "CANSU", "CEBBAR", "CEBRAİL", "CELİL", "CEM", "CEMAL", "CEMİL", "CEMRE", "CENGİZ", "CENK", "CEREN", "CEVAHİR", "CEVDET", "CEYDA", "CEYHAN", "CEYHUN", "CEYLAN", "CİHAN", "COŞKUN", "CUMA", "CUMHUR", "CUNDULLAH", "CÜNEYT", "CÖMERT", "ÇAĞDAŞ", "ÇAĞLA", "ÇAĞLAR", "ÇAĞRI", "ÇAVLAN", "ÇETİN", "ÇİĞDEM", "ÇİLE",
    "DAMLA", "DAVUT", "DEMET", "DEMİR", "DENİZ", "DERAM", "DERMAN", "DERVİŞ", "DERYA", "DİANA", "DİCLE", "DİDEM", "DİLAN", "DİLARA", "DİLBER", "DİLEK", "DİLŞAH", "DOĞAN", "DURAN", "DUYGU", "DUÇEM",
    "EBRU", "ECE", "EDA", "EDİP", "EFE", "EFRUZ", "EFTAL", "EGEMEN", "EKİN", "EKREM", "ELA", "ELÇİN", "ELİF", "ELİFCAN", "ELZEM", "EMCED", "EMEL", "EMİN", "EMİNE", "EMİR", "EMİŞ", "EMRAH", "EMRE", "EMRULLAH", "ENDER", "ENES", "ENGİN", "ENNUR", "ENVER", "ERCAN", "ERDAL", "ERDEM", "ERDİNÇ", "EREM", "EREN", "ERGÜL", "ERGÜN", "ERHAN", "ERKAN", "ERKİN", "EROL", "ERSAGUN", "ERSEN", "ERSİN", "ERTAN", "ERTUNÇ", "ESEN", "ESER", "ESİN", "ESMA", "ESMERALDA", "ESRA", "ETHEM", "EVRE", "EVREN", "EVRİM", "EYLEM", "EYLÜL", "EYÜP", "EYYÜP", "EZEL", "EZGİ",
    "FADİL", "FADİME", "FAHRİ", "FAİK", "FARİS", "FARUK", "FATİH", "FATMA", "FATIMA", "FERAT", "FERAY", "FERDA", "FERDİ", "FERHAN", "FERHAT", "FERİDE", "FERİT", "FETHİ", "FETHİYE", "FEVZİYE", "FEYZA", "FEYZAHAN", "FEZA", "FIRAT", "FİKRİ", "FİLİZ", "FUAT", "FULYA", "FUNDA", "FURKAN", "FÜSUN",
    "GAMZE", "GANİM", "GİZEM", "GONCA", "GÖKAY", "GÖKÇE", "GÖKÇEN", "GÖKHAN", "GÖKMEN", "GÖKNUR", "GÖKSEL", "GÖKTEN", "GÖKTEKİN", "GÖRKEM", "GÖZDE", "GÖZDEM", "GÜL", "GÜLAY", "GÜLBAHAR", "GÜLBERAT", "GÜLCAN", "GÜLÇİN", "GÜLDEHEN", "GÜLDEN", "GÜLEN", "GÜLHANIM", "GÜLHER", "GÜLİZ", "GÜLLÜ", "GÜLNAME", "GÜLPERİ", "GÜLSEREN", "GÜLSÜM", "GÜLŞAH", "GÜLŞEN", "GÜNAY", "GÜNDEM", "GÜNEŞ", "GÜRKAN", "GÜVENÇ",
    "HABİBE", "HABİL", "HABİP", "HACER", "HACI", "HAÇÇE", "HAKAN", "HALE", "HALENUR", "HALİL", "HALİLİBRAHİM", "HALİM", "HALUK", "HAMDİ", "HAMDİYE", "HAMİT", "HAMZA", "HANDAN", "HANDE", "HANIM", "HARUN", "HASAN", "HASRET", "HATİCE", "HATİKE", "HATUN", "HAVVA", "HAYATİ", "HAYRİ", "HAYRİYE", "HAYRUNNİSA", "HAZAN", "HAZEL", "HİCRAN", "HİDİR", "HİDAYET", "HİKMET", "HİLAL", "HİLAYDA", "HİSAR", "HURİYE", "HÜLYA", "HÜMEYRA", "HÜSEYİN",
    "IRAZCA", "IRMAK", "IŞIK", "IŞIL", "IŞIN",
    "İBRAHİM", "İDRİS", "İHSAN", "İKBAL", "İKLİL", "İKRAM", "İLAYDA", "İLHAN", "İLKAY", "İLKER", "İLKNUR", "İLYAS", "İNANÇ", "İNCİ", "İPEK", "İREM", "İRFAN", "İSA", "İSHAK", "İSMAİL", "İTİBAR", "İZZET", "İZZETTİN",
    "JALE", "JÜLİDE",
    "KAAN", "KADER", "KADİR", "KALENDER", "KAMERCAN", "KAMİL", "KAMURAN", "KASIM", "KENAN", "KEREM", "KERİM", "KEZBAN", "KEZİBAN", "KIVANÇ", "KIYMET", "KONURALP", "KORAY", "KORHAN", "KUBİLAY", "KURTULUŞ", "KÜBRA", "KÜRŞAT",
    "LALE", "LATİFE", "LEMAN", "LEVENT", "LEYLA", "LEZİZ", "LÜTFİ",
    "MAHİR", "MAHPERİ", "MAHSUM", "MAHMUT", "MAKBULE", "MARİA", "MARUF", "MAZLUM", "MEDİHA", "MEHMED", "MEHMET", "MEHRİ", "MEHTAP", "MELAHAT", "MELDA", "MELEK", "MELİA", "MELİHA", "MELİKE", "MELİS", "MELTEM", "MERAL", "MERİH", "MERİÇ", "MERT", "MERVE", "MERYEM", "MESUDE", "MESUT", "METANET", "METE", "METİN", "MEVLÜT", "MEVSİM", "MİNE", "MİRAY", "MİRAÇ", "MİHRİMAH", "MUAMMER", "MUCAHİD", "MUHAMMED", "MUHAMMET", "MUHLİS", "MUHSİN", "MUKADDER", "MUKADDES", "MUMUN", "MURAT", "MUSA", "MUSTAFA", "MUTLU", "MÜBECCEL", "MÜCAHİT", "MÜCELLA", "MÜGE", "MÜJDAT", "MÜMTAZ", "MÜMÜN", "MÜMÜNE", "MÜNEVER", "MÜRSEL", "MÜRSELİN", "MÜRŞİT", "MÜŞERREF",
    "NAFİYE", "NAFİZ", "NAGİHAN", "NAİL", "NAİME", "NALAN", "NAZAN", "NAZIM", "NAZLI", "NEBİ", "NEBİL", "NECATİ", "NECİP", "NECMİYE", "NEFİSE", "NEJDET", "NERMİN", "NESLİHAN", "NESRİN", "NEŞE", "NEVAL", "NEVİN", "NEVROZ", "NEVRİYE", "NEVZAT", "NEZAKET", "NEZİH", "NEZİR", "NİHAL", "NİHAN", "NİHAT", "NİLAY", "NİLGÜN", "NİLÜFER", "NİMET", "NİZAMETTİN", "NUH", "NUMAN", "NUR", "NURAN", "NURAY", "NURCAN", "NURDAN", "NURETTİN", "NURGÜL", "NURHAN", "NURİ", "NURSEL", "NURULLAH",
    "OĞUZ", "OĞUZHAN", "OKAN", "OKTAY", "OLCAY", "ONAT", "ONUR", "ORÇUN", "ORGÜL", "ORHAN", "ORKUN", "OSMAN", "OZAN",
    "ÖKKEŞ", "ÖMER", "ÖMÜR", "ÖNDER", "ÖVGÜ", "ÖVÜNÇ", "ÖYKÜ", "ÖZCAN", "ÖZDEN", "ÖZEN", "ÖZER", "ÖZGE", "ÖZGÜL", "ÖZGÜR", "ÖZHAN", "ÖZKAN", "ÖZLEM", "ÖZNUR", "ÖZTAN",
    "PAPATYA", "PELİN", "PERVİN", "PERVER", "PETEK", "PINAR",
    "RABİA", "RAHİME", "RAHMİ", "RAMAZAN", "RASİM", "RAŞAN", "RAZİYE", "RECEP", "REFAETTİN", "REFİK", "REMZİYE", "RENGİN", "RESA", "RESUL", "REŞAT", "REŞİT", "REYHAN", "REZAN", "REZZAN", "RIDVAN", "RIFAT", "RIZA", "RUKİYE", "RUMEYSA", "RÜMEYSA", "RÜŞTÜ",
    "SAADET", "SABAHATTİN", "SABRİ", "SADIK", "SAİD", "SALİH", "SALİHA", "SALİM", "SALMAN", "SAMET", "SAMİ", "SANCAR", "SANEM", "SARE", "SAVAŞ", "SAYGIN", "SEBAHAT", "SEBİHA", "SECEM", "SEDA", "SEDAT", "SEDEF", "SEFA", "SEHER", "SELAHATTİN", "SELAMİ", "SELCAN", "SELCEN", "SELÇUK", "SELDA", "SELEN", "SELİM", "SELİN", "SELMA", "SEMA", "SEMİH", "SEMİNE", "SEMRA", "SENA", "SENAN", "SENEM", "SERAP", "SERAY", "SERÇİN", "SERDAL", "SERDAR", "SERHAN", "SERHAT", "SERKAN", "SERPİL", "SERTAÇ", "SERVET", "SEVAL", "SEVCAN", "SEVDA", "SEVDE", "SEVGİ", "SEVGÜL", "SEVİL", "SEVİNÇ", "SEYFİ", "SEYFULLAH", "SEYHAN", "SEZAİ", "SEZEN", "SEZER", "SEZGİ", "SEZGİN", "SEZİN", "SIDDIKA", "SIDIKA", "SILA", "SİBEL", "SİDAR", "SİMENDER", "SİMGE", "SİNAN", "SİNEM", "SONAY", "SONER", "SONGÜL", "SUAT", "SULTAN", "SUNA", "SUPHİ", "SÜHEYLA", "SÜLEYMAN", "SÜMEYRA", "SÜMEYYE", "SÜREYYA",
    "ŞABAN", "ŞADİ", "ŞADİYE", "ŞAFAK", "ŞAHABETTİN", "ŞAHİNDE", "ŞAHİN", "ŞAHİKA", "ŞEBNEM", "ŞEHMUS", "ŞENAY", "ŞENOL", "ŞERAFETTİN", "ŞEREF", "ŞERİF", "ŞERİFE", "ŞERMİN", "ŞEVKET", "ŞEYDA", "ŞEYHMUS", "ŞEYMA", "ŞİFA", "ŞİRİN", "ŞİRVAN", "ŞUAYIP", "ŞULE", "ŞÜKRİYE", "ŞÜKRÜ",
    "TAHA", "TAHİR", "TAHSİN", "TALHA", "TAMER", "TANER", "TANSU", "TARIK", "TARKAN", "TAYFUN", "TAYLAN", "TAYYAR", "TAYYİP", "TEKİN", "TEVFİK", "TEVHİD", "TEYFİK", "TİMUÇİN", "TİMUR", "TOLGA", "TOLGAHAN", "TOLUNAY", "TUBA", "TUFAN", "TUĞBA", "TUĞBERK", "TUĞÇE", "TUĞRA", "TUĞRUL", "TUĞSEM", "TUNA", "TUNCAY", "TURAN", "TURGAY", "TURGUT", "TURĞUT", "TÜLAY", "TÜMAY", "TÜRKER",
    "UFUK", "UĞUR", "UĞURAY", "ULAŞ", "UMUT", "URAL", "UTKU", "UYGAR", "UYSAN", "ÜBEYDULLAH", "ÜLKÜ", "ÜLKÜHAN", "ÜMİT", "ÜMMÜGÜLSÜM", "ÜMRAN", "ÜNAL", "ÜNSAL", "ÜZEYİR",
    "VAHDETTİN", "VASFİYE", "VAZİR", "VEDAT", "VEHBİ", "VELAT", "VELİ", "VELİT", "VEYSEL", "VEYSİ", "VOLKAN",
    "YAHYA", "YAKUP", "YALÇIN", "YASEMİN", "YASER", "YASİN", "YAŞAR", "YAVUZ", "YELDA", "YELİZ", "YENER", "YEŞİM", "YETKİN", "YILDIRAY", "YILDIRIM", "YILDIZ", "YILMAZ", "YİĞİT", "YUNUS", "YURDAGÜL", "YURDUN", "YUSUF", "YÜCE", "YÜCEL", "YÜKSEL",
    "ZAFER", "ZAHİDE", "ZARİFE", "ZEHRA", "ZEKERİYA", "ZEKİ", "ZEKİYE", "ZELİHA", "ZERİN", "ZERRİN", "ZEYNALABİDİN", "ZEYNEP", "ZİYA", "ZUHAL", "ZÜBEYDE", "ZÜHAL", "ZÜHRE", "ZÜHTÜ", "ZÜLFİYE", "ZÜMRÜT"
];
const validNames = new Set(validNamesArray);
const rooms = {};

io.on('connection', (socket) => {
    socket.on('joinRoom', (data) => {
        const { roomCode, username, mode } = data;
        
        // Eğer oda yeni kuruluyorsa, modu odayı kuran belirler
        if (!rooms[roomCode]) {
            rooms[roomCode] = { players: [], usedNames: [], currentLetter: '', turn: 0, turnStartTime: 0, mode: mode || 'classic', playAgainVotes: new Set() };
        }
        
        if (rooms[roomCode].players.length >= 2) return socket.emit('errorMsg', 'Bu oda dolu!');
        
        // jokerCooldowns: 0 demek henüz cooldown yok demek (Kullanılabilir).
        rooms[roomCode].players.push({ id: socket.id, name: username, score: 0, jokerCooldowns: { freeze: 0, letter: 0, pass: 0 } });
        socket.join(roomCode);
        socket.emit('joined', { playerNumber: rooms[roomCode].players.length });

        if (rooms[roomCode].players.length === 2) {
            startGame(roomCode);
        }
    });

    function startGame(roomCode) {
        const room = rooms[roomCode];
        const firstWord = validNamesArray[Math.floor(Math.random() * validNamesArray.length)];
        
        room.usedNames = [firstWord];
        room.turn = 0;
        room.turnStartTime = Date.now();
        room.playAgainVotes.clear(); // Yeni oyun başladığında onayları sıfırla

        // MOD KONTROLÜ: İlk harfi belirleme
        if (room.mode === 'random') {
            const validChars = firstWord.split('').filter(c => c !== 'J' && c !== 'Ğ');
            room.currentLetter = validChars.length > 0 ? validChars[Math.floor(Math.random() * validChars.length)] : firstWord.slice(-1);
        } else {
            room.currentLetter = firstWord.slice(-1);
        }

        room.players.forEach(p => {
            p.score = 0;
            p.jokerCooldowns = { freeze: 0, letter: 0, pass: 0 };
        });

        io.to(roomCode).emit('gameStart', {
            firstWord: firstWord, currentLetter: room.currentLetter, players: room.players, turnIndex: room.turn, mode: room.mode
        });
    }

    socket.on('makeMove', (data) => {
        const { roomCode, word } = data;
        const room = rooms[roomCode];
        if (!room) return;
        
        const upperWord = word.toLocaleUpperCase('tr-TR');
        const currentPlayer = room.players[room.turn];

        if (upperWord.charAt(0) !== room.currentLetter) return socket.emit('errorMsg', `Kelime "${room.currentLetter}" ile başlamalı!`);
        if (!validNames.has(upperWord)) return socket.emit('errorMsg', `Hata! "${upperWord}" veritabanında geçerli bir isim değil!`);
        if (room.usedNames.includes(upperWord)) return socket.emit('errorMsg', 'Bu kelime zaten kullanıldı!');
        
        const timeTaken = (Date.now() - room.turnStartTime) / 1000;
        let timeLeft = 10 - timeTaken;
        if (timeLeft < 0) timeLeft = 0;
        
        const pointsEarned = 10 + Math.floor(timeLeft * 5);
        currentPlayer.score += pointsEarned;

        room.usedNames.push(upperWord);
        
        // MOD KONTROLÜ: Sonraki Harfi Belirleme
        if (room.mode === 'random') {
            const validChars = upperWord.split('').filter(c => c !== 'J' && c !== 'Ğ');
            room.currentLetter = validChars.length > 0 ? validChars[Math.floor(Math.random() * validChars.length)] : upperWord.slice(-1);
        } else {
            room.currentLetter = upperWord.slice(-1);
        }

        room.turn = room.turn === 0 ? 1 : 0;
        room.turnStartTime = Date.now(); // Sıra geçtiğinde zamanı kusursuz sıfırla
        
        io.to(roomCode).emit('moveMade', {
            word: upperWord, playerId: socket.id, playerName: currentPlayer.name, pointsEarned: pointsEarned, nextLetter: room.currentLetter, players: room.players, nextTurnIndex: room.turn
        });
    });

    socket.on('useJoker', (data) => {
        const { roomCode, type } = data;
        const room = rooms[roomCode];
        if (!room) return;
        
        const currentPlayer = room.players[room.turn];
        if (currentPlayer.id !== socket.id) return;
        
        const now = Date.now();
        if (currentPlayer.jokerCooldowns[type] > now) return; // 30 saniye dolmamışsa engelle
        
        // Cooldown süresini 30 saniye sonrasına ayarla
        currentPlayer.jokerCooldowns[type] = now + 30000; 

        if (type === 'freeze') {
            room.turnStartTime = Date.now();
            io.to(roomCode).emit('jokerEffect', { type: 'freeze', playerId: currentPlayer.id, playerName: currentPlayer.name, letter: room.currentLetter, nextTurnIndex: room.turn });
        } else if (type === 'letter') {
            const lastWord = room.usedNames[room.usedNames.length - 1];
            if (lastWord && lastWord.length >= 2) {
                // Eğer mod random ise ve harf jokeri kullanılırsa başka bir rastgele harf verelim
                if (room.mode === 'random') {
                    const validChars = lastWord.split('').filter(c => c !== 'J' && c !== 'Ğ' && c !== room.currentLetter);
                    room.currentLetter = validChars.length > 0 ? validChars[Math.floor(Math.random() * validChars.length)] : lastWord.charAt(lastWord.length - 2);
                } else {
                    room.currentLetter = lastWord.charAt(lastWord.length - 2); 
                }
                io.to(roomCode).emit('jokerEffect', { type: 'letter', playerId: currentPlayer.id, playerName: currentPlayer.name, letter: room.currentLetter, nextTurnIndex: room.turn });
            }
        } else if (type === 'pass') {
            room.turn = room.turn === 0 ? 1 : 0; 
            room.turnStartTime = Date.now();
            io.to(roomCode).emit('jokerEffect', { type: 'pass', playerId: currentPlayer.id, playerName: currentPlayer.name, letter: room.currentLetter, nextTurnIndex: room.turn });
        }
    });

    // ÇİFT TARAFLI TEKRAR OYNA SİSTEMİ
    socket.on('playAgainVote', (roomCode) => {
        const room = rooms[roomCode];
        if (room && room.players.length === 2) {
            room.playAgainVotes.add(socket.id);
            if (room.playAgainVotes.size === 2) {
                startGame(roomCode); // İkisi de onaylarsa başlat
            } else {
                socket.to(roomCode).emit('opponentVotedPlayAgain'); // Diğerine haber ver
            }
        }
    });

    socket.on('timeUp', (roomCode) => {
        if (rooms[roomCode]) {
            io.to(roomCode).emit('gameOver', { loserId: socket.id, reason: 'Süre doldu!', players: rooms[roomCode].players });
        }
    });

    socket.on('disconnect', () => {
        for (let code in rooms) {
            if (rooms[code].players.some(p => p.id === socket.id)) {
                io.to(code).emit('gameOver', { loserId: socket.id, reason: 'Rakip oyundan çıktı!', players: rooms[code].players });
                delete rooms[code]; 
            }
        }
    });
});

const listener = http.listen(process.env.PORT || 3000, () => { console.log("Sunucu çalışıyor!"); });
