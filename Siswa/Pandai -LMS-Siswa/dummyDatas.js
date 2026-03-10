const DummyDataSets = [
  // =================================================================
  // 1. MATEMATIKA
  // =================================================================
  {
    id: 3,
    title: 'Matematika',
    progress: 2,
    icon: 'bg-math-icon',
    isRecommended: true,
    recommededDescription: 'Lanjutkan Bab 3 : Fungsi Komposisi dan Invers',
    chapterCount: 3,
    chapters: [
      // BAB 1: Induksi Matematika
      {
        chapterId: 1,
        chapterTitle: 'Bab 1: Induksi Matematika',
        isCompleted: true,
        status: 'sudah dipelajari',
        resources: {
          videoUrl: 'https://youtube.com/watch?v=math-induksi',
          pptUrl: 'https://docs.google.com/presentation/d/math-induksi',
        },
        sentimentAnalysis: [
          {
            id: 1,
            type: 'multiple-choice',
            question:
              'Ketika diminta membuktikan langkah basis (n=1), apa yang Anda rasakan?',
            options: [
              'Sangat mudah, tinggal substitusi angka 1.',
              'Ragu-ragu apakah hasilnya benar ruas kiri = ruas kanan.',
              'Bingung bagian mana yang harus diganti dengan 1.',
            ],
          },
          {
            id: 2,
            type: 'multiple-choice',
            question:
              'Bagaimana pendapat Anda mengenai perbedaan antara "Langkah Basis" dan "Langkah Induksi"?',
            options: [
              'Sangat jelas, Basis itu cek awal, Induksi itu efek domino.',
              'Terkadang tertukar konsepnya saat mengerjakan soal.',
              'Saya tidak mengerti mengapa harus ada dua langkah tersebut.',
            ],
          },
          {
            id: 3,
            type: 'multiple-choice',
            question:
              'Seberapa percaya diri Anda membuktikan asumsi n=k ke n=k+1?',
            options: [
              'Sangat percaya diri memanipulasi aljabarnya.',
              'Berani mencoba, tapi sering macet di tengah jalan.',
              'Tidak mau, aljabarnya terlalu rumit.',
            ],
          },
          {
            id: 4,
            type: 'text',
            question:
              'Jelaskan dengan bahasamu sendiri, kenapa jika P(1) salah, maka Induksi Matematika tidak bisa dilanjutkan?',
          },
          {
            id: 5,
            type: 'text',
            question:
              'Tuliskan satu jenis soal Induksi (misal: deret, keterbagian, atau ketidaksamaan) yang paling membuatmu pusing.',
          },
        ],
        quiz: {
          title: 'Kuis Induksi Matematika',
          deadline: '2026-02-01T23:59:00',
          maxAttempts: 3,
          totalQuestions: 20,
          passingGrade: 70,
          questions: [
            // 1-10
            {
              id: 'q1',
              text: 'Langkah pertama induksi adalah membuktikan n=...',
              options: ['1', 'k', 'k+1', '0'],
              correctAnswer: '1',
            },
            {
              id: 'q2',
              text: 'Asumsi rumus benar dilakukan pada n=...',
              options: ['k', '1', 'n', 'x'],
              correctAnswer: 'k',
            },
            {
              id: 'q3',
              text: 'Target pembuktian setelah asumsi adalah n=...',
              options: ['k+1', 'k-1', '2k', 'n'],
              correctAnswer: 'k+1',
            },
            {
              id: 'q4',
              text: 'Rumus jumlah n bilangan asli (1+2+...+n):',
              options: ['n(n+1)/2', 'n^2', '2n', 'n(n-1)'],
              correctAnswer: 'n(n+1)/2',
            },
            {
              id: 'q5',
              text: 'Induksi berlaku pada bilangan...',
              options: ['Asli', 'Real', 'Imajiner', 'Pecahan'],
              correctAnswer: 'Asli',
            },
            {
              id: 'q6',
              text: 'Jika P(n): n < 2^n, nilai P(1) adalah...',
              options: ['Benar', 'Salah', 'Ragu', 'Error'],
              correctAnswer: 'Benar',
            },
            {
              id: 'q7',
              text: 'Prinsip induksi mirip efek...',
              options: ['Domino', 'Kupu-kupu', 'Bola', 'Kaca'],
              correctAnswer: 'Domino',
            },
            {
              id: 'q8',
              text: 'Notasi n! artinya...',
              options: [
                'Perkalian 1 s.d n',
                'Jumlah 1 s.d n',
                'Pangkat',
                'Bagi',
              ],
              correctAnswer: 'Perkalian 1 s.d n',
            },
            {
              id: 'q9',
              text: 'Langkah basis gagal jika...',
              options: [
                'P(1) salah',
                'P(1) benar',
                'P(k) asumsi',
                'P(k+1) benar',
              ],
              correctAnswer: 'P(1) salah',
            },
            {
              id: 'q10',
              text: 'Validitas induksi untuk...',
              options: ['Semua n asli', 'Genap saja', 'Ganjil saja', 'Kecil'],
              correctAnswer: 'Semua n asli',
            },
            // 11-20
            {
              id: 'q11',
              text: 'Habis dibagi 3 artinya sisa pembagiannya...',
              options: ['0', '1', '2', '3'],
              correctAnswer: '0',
            },
            {
              id: 'q12',
              text: 'Jika 3^n > n, untuk n=2 maka...',
              options: ['9 > 2 (Benar)', '9 < 2', '3 > 2', 'Salah'],
              correctAnswer: '9 > 2 (Benar)',
            },
            {
              id: 'q13',
              text: 'Langkah induksi memerlukan manipulasi...',
              options: ['Aljabar', 'Geometri', 'Statistik', 'Kalkulus'],
              correctAnswer: 'Aljabar',
            },
            {
              id: 'q14',
              text: 'Substitusi k+1 ke n^2 menjadi...',
              options: ['(k+1)^2', 'k^2+1', 'k+1', '2(k+1)'],
              correctAnswer: '(k+1)^2',
            },
            {
              id: 'q15',
              text: 'Pada pembuktian keterbagian, f(k+1) sering diubah bentuknya agar memuat...',
              options: ['f(k)', 'f(1)', 'k^2', '0'],
              correctAnswer: 'f(k)',
            },
            {
              id: 'q16',
              text: 'Apakah induksi matematika bisa membuktikan rumus luas lingkaran?',
              options: ['Tidak', 'Bisa', 'Mungkin', 'Pasti'],
              correctAnswer: 'Tidak',
            },
            {
              id: 'q17',
              text: '1 + 3 + 5 + ... + (2n-1) sama dengan...',
              options: ['n^2', '2n', 'n(n+1)', 'n^3'],
              correctAnswer: 'n^2',
            },
            {
              id: 'q18',
              text: 'Basis induksi tidak harus n=1, bisa dimulai dari n=...',
              options: ['Sesuai soal', '0', '100', 'Tak hingga'],
              correctAnswer: 'Sesuai soal',
            },
            {
              id: 'q19',
              text: 'Pernyataan matematis yang belum dibuktikan disebut...',
              options: ['Hipotesis/Konjektur', 'Teorema', 'Axioma', 'Fakta'],
              correctAnswer: 'Hipotesis/Konjektur',
            },
            {
              id: 'q20',
              text: 'Kunci sukses induksi adalah...',
              options: [
                'Paham pola',
                'Hafal rumus',
                'Menebak',
                'Menghitung cepat',
              ],
              correctAnswer: 'Paham pola',
            },
          ],
        },
        minigame: {
          gameTitle: 'The Domino Logic',
          isUnlocked: true,
          storyline: [],
          questions: [
            {
              id: 'mg1',
              text: 'Apa syarat utama efek domino terjadi?',
              options: [
                'Kartu pertama jatuh & kartu k menjatuhkan k+1',
                'Kartu terakhir jatuh',
                'Semua kartu disusun acak',
                'Tidak ada syarat',
              ],
              correctAnswer: 'Kartu pertama jatuh & kartu k menjatuhkan k+1',
            },
            {
              id: 'mg2',
              text: 'Langkah basis n=1 ibarat...',
              options: [
                'Menjatuhkan kartu pertama',
                'Menyusun kartu',
                'Membeli kartu',
                'Melihat kartu',
              ],
              correctAnswer: 'Menjatuhkan kartu pertama',
            },
            {
              id: 'mg3',
              text: 'Jika kartu ke-k jatuh, maka kartu ke-(k+1) harus...',
              options: ['Jatuh juga', 'Diam', 'Terbang', 'Hilang'],
              correctAnswer: 'Jatuh juga',
            },
            {
              id: 'mg4',
              text: 'Pola 1, 3, 5, 7... bilangan selanjutnya adalah?',
              options: ['9', '8', '10', '11'],
              correctAnswer: '9',
            },
            {
              id: 'mg5',
              text: 'Induksi matematika valid untuk bilangan...',
              options: ['Asli (1, 2, 3...)', 'Pecahan', 'Negatif', 'Imajiner'],
              correctAnswer: 'Asli (1, 2, 3...)',
            },
            {
              id: 'mg6',
              text: 'Habis dibagi 5 artinya angka satuannya...',
              options: ['0 atau 5', 'Genap', 'Ganjil', '3'],
              correctAnswer: '0 atau 5',
            },
            {
              id: 'mg7',
              text: 'Pada langkah induksi, kita mengasumsikan rumus benar untuk n=...',
              options: ['k', '1', '100', 'x'],
              correctAnswer: 'k',
            },
            {
              id: 'mg8',
              text: 'Setelah asumsi n=k, kita harus membuktikan kebenaran untuk n=...',
              options: ['k + 1', 'k - 1', '2k', 'n'],
              correctAnswer: 'k + 1',
            },
            {
              id: 'mg9',
              text: 'P(n) = n < 2^n. Untuk n=3, pernyataannya adalah...',
              options: ['3 < 8 (Benar)', '3 > 8', '3 = 8', 'Salah'],
              correctAnswer: '3 < 8 (Benar)',
            },
            {
              id: 'mg10',
              text: 'Jumlah n bilangan ganjil pertama adalah...',
              options: ['n^2', '2n', 'n+1', 'n^3'],
              correctAnswer: 'n^2',
            },
          ],
        },
      },

      // BAB 2: Program Linear
      {
        chapterId: 2,
        chapterTitle: 'Bab 2: Program Linear',
        isCompleted: true,
        status: 'sudah dipelajari',
        resources: { videoUrl: 'link-yt', pptUrl: 'link-ppt' },
        sentimentAnalysis: [
          {
            id: 1,
            type: 'multiple-choice',
            question:
              'Ketika melihat soal cerita panjang tentang produksi barang, apa reaksi pertamamu?',
            options: [
              'Langsung memisalkan variabel x dan y.',
              'Membacanya berulang kali baru paham.',
              'Pusing dan ingin melewati soal itu.',
            ],
          },
          {
            id: 2,
            type: 'multiple-choice',
            question:
              'Bagaimana perasaanmu saat menggambar grafik dan menentukan Daerah Himpunan Penyelesaian (DHP)?',
            options: [
              'Menyenangkan, seperti mewarnai daerah yang benar.',
              'Sering ragu arah arsirannya ke dalam atau ke luar.',
              'Sangat membingungkan, garisnya bertumpuk-tumpuk.',
            ],
          },
          {
            id: 3,
            type: 'multiple-choice',
            question:
              'Seberapa yakin kamu bisa membedakan Fungsi Objektif (Tujuan) dan Fungsi Kendala?',
            options: [
              'Sangat yakin, Objektif itu "untung/biaya", Kendala itu "stok".',
              'Bisa membedakan kalau soalnya sederhana.',
              'Semuanya terlihat sama saja bagiku.',
            ],
          },
          {
            id: 4,
            type: 'text',
            question:
              'Mengapa syarat x >= 0 dan y >= 0 hampir selalu ada dalam masalah program linear kehidupan nyata? Jelaskan.',
          },
          {
            id: 5,
            type: 'text',
            question:
              'Bagian mana yang paling sering membuatmu teliti salah: membuat model atau menghitung titik pojok?',
          },
        ],
        quiz: {
          title: 'Kuis Program Linear',
          deadline: '2026-02-08T23:59:00',
          maxAttempts: 3,
          totalQuestions: 20,
          passingGrade: 70,
          questions: [
            // 1-10
            {
              id: 'q1',
              text: 'Langkah awal optimasi:',
              options: ['Model Matematika', 'Gambar', 'Hitung', 'Jawab'],
              correctAnswer: 'Model Matematika',
            },
            {
              id: 'q2',
              text: 'Pangkat tertinggi pertidaksamaan linear:',
              options: ['1', '2', '3', '0'],
              correctAnswer: '1',
            },
            {
              id: 'q3',
              text: 'Daerah memenuhi kendala:',
              options: ['DHP', 'Titik', 'Pusat', 'Kuadran'],
              correctAnswer: 'DHP',
            },
            {
              id: 'q4',
              text: 'Fungsi f(x,y) yang dimaksimumkan:',
              options: ['Fungsi Objektif', 'Kendala', 'Kuadrat', 'Invers'],
              correctAnswer: 'Fungsi Objektif',
            },
            {
              id: 'q5',
              text: 'Barang tidak negatif:',
              options: ['x>=0, y>=0', 'x<0', 'y<0', 'x=y'],
              correctAnswer: 'x>=0, y>=0',
            },
            {
              id: 'q6',
              text: 'Nilai maksimum biasanya di...',
              options: ['Titik Pojok', 'Tengah', 'Luar', 'X'],
              correctAnswer: 'Titik Pojok',
            },
            {
              id: 'q7',
              text: '2x + y = 4 memotong sumbu x di:',
              options: ['(2,0)', '(0,4)', '(4,0)', '(0,2)'],
              correctAnswer: '(2,0)',
            },
            {
              id: 'q8',
              text: '"Tidak lebih dari 50":',
              options: ['<= 50', '>= 50', '> 50', '= 50'],
              correctAnswer: '<= 50',
            },
            {
              id: 'q9',
              text: 'Garis Selidik untuk:',
              options: ['Nilai optimum', 'Luas', 'Panjang', 'Gradien'],
              correctAnswer: 'Nilai optimum',
            },
            {
              id: 'q10',
              text: 'Sistem membatasi...',
              options: ['Sumber daya', 'Untung', 'Rugi', 'Modal'],
              correctAnswer: 'Sumber daya',
            },
            // 11-20
            {
              id: 'q11',
              text: 'Jika 3x + 2y <= 12, titik (0,0) berada di daerah...',
              options: ['Penyelesaian', 'Bukan Penyelesaian', 'Garis', 'Luar'],
              correctAnswer: 'Penyelesaian',
            },
            {
              id: 'q12',
              text: 'Kata kunci "paling sedikit" menggunakan tanda...',
              options: ['>=', '<=', '<', '='],
              correctAnswer: '>=',
            },
            {
              id: 'q13',
              text: 'Titik potong dua garis dicari dengan metode...',
              options: [
                'Eliminasi/Substitusi',
                'Induksi',
                'Faktoran',
                'Kuadrat',
              ],
              correctAnswer: 'Eliminasi/Substitusi',
            },
            {
              id: 'q14',
              text: 'Model matematika mengubah masalah verbal menjadi...',
              options: ['Simbol matematika', 'Gambar', 'Tabel', 'Grafik'],
              correctAnswer: 'Simbol matematika',
            },
            {
              id: 'q15',
              text: 'Jika f(x,y) = 500x + 1000y, nilai di (2,1) adalah...',
              options: ['2000', '1500', '2500', '1000'],
              correctAnswer: '2000',
            },
            {
              id: 'q16',
              text: 'Garis x = 2 sejajar dengan sumbu...',
              options: ['Y', 'X', 'Z', 'Miring'],
              correctAnswer: 'Y',
            },
            {
              id: 'q17',
              text: 'Daerah penyelesaian sistem pertidaksamaan linear biasanya berbentuk...',
              options: [
                'Poligon/Segi-n',
                'Lingkaran',
                'Kurva',
                'Tak beraturan',
              ],
              correctAnswer: 'Poligon/Segi-n',
            },
            {
              id: 'q18',
              text: 'Jika kendala hanya x + y <= 10, apakah (5,5) memenuhi?',
              options: ['Ya', 'Tidak', 'Mungkin', 'Salah'],
              correctAnswer: 'Ya',
            },
            {
              id: 'q19',
              text: 'Keuntungan maksimum diperoleh dari nilai fungsi objektif yang paling...',
              options: ['Besar', 'Kecil', 'Sedang', 'Nol'],
              correctAnswer: 'Besar',
            },
            {
              id: 'q20',
              text: 'Dalam grafik, sumbu vertikal biasanya melambangkan variabel...',
              options: ['y', 'x', 'z', 't'],
              correctAnswer: 'y',
            },
          ],
        },
        minigame: {
          gameTitle: 'Factory Tycoon',
          isUnlocked: true,
          storyline: [],
          questions: [
            {
              id: 'mg1',
              text: 'Tujuan utama Factory Tycoon adalah...',
              options: [
                'Maksimumkan Untung',
                'Minimalkan Stok',
                'Bangkrut',
                'Diam saja',
              ],
              correctAnswer: 'Maksimumkan Untung',
            },
            {
              id: 'mg2',
              text: 'Bahan baku terbatas disebut...',
              options: ['Kendala', 'Bonus', 'Sampah', 'Fungsi Tujuan'],
              correctAnswer: 'Kendala',
            },
            {
              id: 'mg3',
              text: 'Di grafik, solusi terbaik biasanya ada di...',
              options: ['Titik Pojok', 'Tengah area', 'Luar area', 'Sumbu Z'],
              correctAnswer: 'Titik Pojok',
            },
            {
              id: 'mg4',
              text: 'Produksi tidak boleh negatif, ditulis...',
              options: ['x >= 0', 'x < 0', 'x = -1', 'x <= 0'],
              correctAnswer: 'x >= 0',
            },
            {
              id: 'mg5',
              text: 'Jika harga jual x naik, maka keuntungan...',
              options: ['Naik', 'Turun', 'Tetap', 'Hilang'],
              correctAnswer: 'Naik',
            },
            {
              id: 'mg6',
              text: 'Garis 2x + 3y = 12 memotong sumbu Y di titik...',
              options: ['(0, 4)', '(4, 0)', '(0, 6)', '(6, 0)'],
              correctAnswer: '(0, 4)',
            },
            {
              id: 'mg7',
              text: 'Daerah yang diarsir dan memenuhi semua syarat disebut...',
              options: ['DHP', 'DPR', 'DKI', 'DNS'],
              correctAnswer: 'DHP',
            },
            {
              id: 'mg8',
              text: 'Simbol "paling banyak" menggunakan tanda...',
              options: ['<=', '>=', '>', '='],
              correctAnswer: '<=',
            },
            {
              id: 'mg9',
              text: 'Titik (0,0) pada pertidaksamaan x + y >= 5 bernilai...',
              options: ['Salah (0 >= 5)', 'Benar', 'Mungkin', 'Ragu'],
              correctAnswer: 'Salah (0 >= 5)',
            },
            {
              id: 'mg10',
              text: 'Fungsi Z = 1000x + 500y. Jika x=1, y=2, nilai Z adalah...',
              options: ['2000', '1500', '1000', '500'],
              correctAnswer: '2000',
            },
          ],
        },
      },

      // BAB 3: Fungsi
      {
        chapterId: 3,
        chapterTitle: 'Bab 3: Fungsi Komposisi dan Invers',
        isCompleted: false,
        status: 'sedang dipelajari',
        resources: {
          videoUrl: 'https://youtube.com/watch?v=math-fungsi',
          pptUrl: 'https://docs.google.com/presentation/d/math-fungsi',
        },
        sentimentAnalysis: [
          {
            id: 1,
            type: 'multiple-choice',
            question:
              'Ketika diminta mencari (fog)(x), apa yang terlintas di pikiranmu?',
            options: [
              'Paham, fungsi g dimasukkan ke dalam fungsi f.',
              'Terbalik-balik, sering memasukkan f ke dalam g.',
              'Bingung total, hurufnya terlalu banyak.',
            ],
          },
          {
            id: 2,
            type: 'multiple-choice',
            question:
              'Bagaimana pendapatmu tentang mencari Invers Fungsi Pecahan?',
            options: [
              'Mudah, ada rumus cepatnya.',
              'Bisa, tapi butuh waktu lama untuk kali silang.',
              'Sangat sulit dan membosankan.',
            ],
          },
          {
            id: 3,
            type: 'multiple-choice',
            question: 'Seberapa percaya diri kamu menentukan Domain dan Range?',
            options: [
              'Sangat percaya diri membaca grafik atau syarat fungsi.',
              'Ragu-ragu, terutama jika ada akar atau pecahan.',
              'Tidak mengerti bedanya Domain dan Range.',
            ],
          },
          {
            id: 4,
            type: 'text',
            question:
              'Jelaskan dengan bahasamu sendiri, apa arti dari f invers (f^-1)?',
          },
          {
            id: 5,
            type: 'text',
            question:
              'Soal tipe apa di bab Fungsi yang menurutmu paling "menjebak"?',
          },
        ],
        quiz: {
          title: 'Kuis Fungsi Komposisi & Invers',
          deadline: '2026-02-15T23:59:00',
          maxAttempts: 3,
          totalQuestions: 20,
          passingGrade: 70,
          questions: [
            // 1-10
            {
              id: 'q1',
              text: 'Pemetaan domain tepat satu ke kodomain:',
              options: ['Fungsi', 'Relasi', 'Bukan Fungsi', 'Injektif'],
              correctAnswer: 'Fungsi',
            },
            {
              id: 'q2',
              text: 'f(x)=2x+1, g(x)=x-3, (fog)(x)=',
              options: ['2(x-3)+1', '2x+1-3', '(2x+1)(x-3)', 'x-3+2x'],
              correctAnswer: '2(x-3)+1',
            },
            {
              id: 'q3',
              text: 'Hasil 2(x-3)+1:',
              options: ['2x-5', '2x-6', '2x-2', '2x+4'],
              correctAnswer: '2x-5',
            },
            {
              id: 'q4',
              text: '(gof)(x) artinya fungsi ... duluan.',
              options: ['f(x)', 'g(x)', 'Sama', 'Bebas'],
              correctAnswer: 'f(x)',
            },
            {
              id: 'q5',
              text: 'Invers f(x)=x+5:',
              options: ['x-5', '5-x', 'x+5', '1/x'],
              correctAnswer: 'x-5',
            },
            {
              id: 'q6',
              text: 'Invers f(x)=2x-6:',
              options: ['(x+6)/2', '(x-6)/2', '2x+6', '6-2x'],
              correctAnswer: '(x+6)/2',
            },
            {
              id: 'q7',
              text: 'Syarat invers:',
              options: ['Bijektif', 'Injektif', 'Surjektif', 'Kuadrat'],
              correctAnswer: 'Bijektif',
            },
            {
              id: 'q8',
              text: 'f(x)=x^2 bukan bijektif karena:',
              options: [
                'Dua x beda hasil y sama',
                'Tak ada nilai',
                'Garis',
                'Pecahan',
              ],
              correctAnswer: 'Dua x beda hasil y sama',
            },
            {
              id: 'q9',
              text: 'Domain f(x)=1/(x-2):',
              options: ['x tidak 2', 'x=2', 'x>0', 'Real'],
              correctAnswer: 'x tidak 2',
            },
            {
              id: 'q10',
              text: '(f^-1 o f)(x) =',
              options: ['x', 'f(x)', '0', '1'],
              correctAnswer: 'x',
            },
            // 11-20
            {
              id: 'q11',
              text: 'Jika f(x) = 3x, maka f(2) = ...',
              options: ['6', '5', '3', '2'],
              correctAnswer: '6',
            },
            {
              id: 'q12',
              text: 'Kodomain adalah daerah...',
              options: ['Kawan', 'Asal', 'Hasil', 'Luar'],
              correctAnswer: 'Kawan',
            },
            {
              id: 'q13',
              text: 'Range adalah daerah...',
              options: ['Hasil', 'Asal', 'Kawan', 'Sisa'],
              correctAnswer: 'Hasil',
            },
            {
              id: 'q14',
              text: 'Invers dari f(x) = x adalah...',
              options: ['x', '-x', '1/x', 'x^2'],
              correctAnswer: 'x',
            },
            {
              id: 'q15',
              text: 'Jika (fog)(x) = x dan f(x) = x+1, maka g(x) = ...',
              options: ['x-1', 'x+1', '1-x', 'x'],
              correctAnswer: 'x-1',
            },
            {
              id: 'q16',
              text: 'Grafik fungsi kuadrat berbentuk...',
              options: ['Parabola', 'Garis lurus', 'Lingkaran', 'Titik'],
              correctAnswer: 'Parabola',
            },
            {
              id: 'q17',
              text: 'Fungsi Identitas dilambangkan dengan I(x) = ...',
              options: ['x', '1', '0', 'y'],
              correctAnswer: 'x',
            },
            {
              id: 'q18',
              text: 'Domain dari akar(x) adalah...',
              options: ['x >= 0', 'x < 0', 'x > 0', 'Real'],
              correctAnswer: 'x >= 0',
            },
            {
              id: 'q19',
              text: 'Sifat (fog)(x) ... (gof)(x) pada umumnya.',
              options: [
                'Tidak sama dengan',
                'Sama dengan',
                'Kurang dari',
                'Lebih dari',
              ],
              correctAnswer: 'Tidak sama dengan',
            },
            {
              id: 'q20',
              text: 'Langkah pertama mencari invers y=f(x) adalah mengubah persamaan menjadi...',
              options: ['x = f(y)', 'y = 0', 'x = 0', 'y = -x'],
              correctAnswer: 'x = f(y)',
            },
          ],
        },
        minigame: {
          gameTitle: 'The Function Machine',
          isUnlocked: false,
          storyline: [],
          questions: [
            {
              id: 'mg1',
              text: 'Mesin fungsi f(x) = 2x. Jika masuk 3, keluar...',
              options: ['6', '5', '3', '2'],
              correctAnswer: '6',
            },
            {
              id: 'mg2',
              text: 'Tombol "Undo" pada mesin adalah analogi...',
              options: ['Invers Fungsi', 'Komposisi', 'Domain', 'Kodomain'],
              correctAnswer: 'Invers Fungsi',
            },
            {
              id: 'mg3',
              text: 'Mesin g masuk ke mesin f ditulis...',
              options: ['(fog)(x)', '(gof)(x)', 'f + g', 'f - g'],
              correctAnswer: '(fog)(x)',
            },
            {
              id: 'mg4',
              text: 'Agar mesin punya invers, pemetaan harus...',
              options: [
                'Satu-satu (Bijektif)',
                'Sembarang',
                'Banyak ke satu',
                'Kosong',
              ],
              correctAnswer: 'Satu-satu (Bijektif)',
            },
            {
              id: 'mg5',
              text: 'Bahan baku yang boleh masuk mesin disebut...',
              options: ['Domain', 'Range', 'Sisa', 'Limbah'],
              correctAnswer: 'Domain',
            },
            {
              id: 'mg6',
              text: 'Jika f(x) = x + 2, maka inversnya f^-1(x) adalah...',
              options: ['x - 2', '2 - x', 'x + 2', '1/x'],
              correctAnswer: 'x - 2',
            },
            {
              id: 'mg7',
              text: '(fog)(x) bisa dibaca sebagai...',
              options: ['f bundaran g', 'f kali g', 'f bagi g', 'f tambah g'],
              correctAnswer: 'f bundaran g',
            },
            {
              id: 'mg8',
              text: 'Fungsi Identitas I(x) memetakan x ke...',
              options: ['x (dirinya sendiri)', '0', '1', '-x'],
              correctAnswer: 'x (dirinya sendiri)',
            },
            {
              id: 'mg9',
              text: 'Domain fungsi pecahan f(x) = 1/x tidak boleh...',
              options: ['0', '1', 'Negatif', 'Positif'],
              correctAnswer: '0',
            },
            {
              id: 'mg10',
              text: 'Sifat asosiatif (fo(goh)) = ((fog)oh) pada komposisi fungsi...',
              options: ['Berlaku', 'Tidak Berlaku', 'Kadang-kadang', 'Salah'],
              correctAnswer: 'Berlaku',
            },
          ],
        },
      },
    ],
  },

  // =================================================================
  // 2. BAHASA INDONESIA
  // =================================================================
  {
    id: 2,
    title: 'Bahasa Indonesia',
    progress: 3,
    icon: 'bg-ind-icon',
    isRecommended: false,
    chapterCount: 3,
    chapters: [
      {
        chapterId: 1,
        chapterTitle: 'Bab 1: Menyusun Laporan Hasil Observasi',
        isCompleted: true,
        status: 'sudah dipelajari',
      },
      {
        chapterId: 2,
        chapterTitle: 'Bab 2: Mengembangkan Pendapat dalam Eksposisi',
        isCompleted: true,
        status: 'sudah dipelajari',
      },
      {
        chapterId: 3,
        chapterTitle: 'Bab 3: Mengelola Informasi dalam Ceramah',
        isCompleted: true,
        status: 'sudah dipelajari',
      },
    ],
  },

  // =================================================================
  // 3. BAHASA INGGRIS
  // =================================================================
  {
    id: 3,
    title: 'Bahasa Inggris',
    progress: 2,
    icon: 'bg-eng-icon',
    isRecommended: false,
    chapterCount: 3,
    chapters: [
      {
        chapterId: 1,
        chapterTitle: 'Chapter 1: Offers and Suggestions',
        isCompleted: true,
        status: 'sudah dipelajari',
      },
      {
        chapterId: 2,
        chapterTitle: 'Chapter 2: Opinions and Thoughts',
        isCompleted: true,
        status: 'sudah dipelajari',
      },
      {
        chapterId: 3,
        chapterTitle: 'Chapter 3: Formal Invitations',
        isCompleted: false,
        status: 'sedang dipelajari',
      },
    ],
  },

  // =================================================================
  // 4. FISIKA
  // =================================================================
  {
    id: 4,
    title: 'Fisika',
    progress: 3,
    icon: 'bg-physc-icon',
    isRecommended: false,
    chapterCount: 3,
    chapters: [
      {
        chapterId: 1,
        chapterTitle: 'Bab 1: Dinamika Rotasi & Kesetimbangan',
        isCompleted: true,
        status: 'sudah dipelajari',
      },
      {
        chapterId: 2,
        chapterTitle: 'Bab 2: Elastisitas dan Hukum Hooke',
        isCompleted: true,
        status: 'sudah dipelajari',
      },
      {
        chapterId: 3,
        chapterTitle: 'Bab 3: Fluida Statis',
        isCompleted: true,
        status: 'sudah dipelajari',
      },
    ],
  },

  // =================================================================
  // 5. PPKN
  // =================================================================
  {
    id: 5,
    title: 'Pendidikan Pancasila dan Kewarganegaraan',
    progress: 3,
    icon: 'bg-pkn-icon',
    isRecommended: false,
    chapterCount: 3,
    chapters: [
      {
        chapterId: 1,
        chapterTitle: 'Bab 1: Harmonisasi Hak Asasi Manusia',
        isCompleted: true,
        status: 'sudah dipelajari',
      },
      {
        chapterId: 2,
        chapterTitle: 'Bab 2: Demokrasi Pancasila',
        isCompleted: true,
        status: 'sudah dipelajari',
      },
      {
        chapterId: 3,
        chapterTitle: 'Bab 3: Sistem Hukum dan Peradilan',
        isCompleted: true,
        status: 'sudah dipelajari',
      },
    ],
  },
];

export default DummyDataSets;
