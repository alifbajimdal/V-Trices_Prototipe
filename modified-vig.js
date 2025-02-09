// Pendefinisian Variasi Karakter
const computerKeyboard  = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
const handphoneKeyboard = "\u00a1\u00a2\u00a3\u00a5\u00a7\u00a9\u00ab\u00ae\u00b0\u00b1\u00b6\u00b7\u00bb\u00bf\u00d7\u00f7\u03a0\u03a9\u03bc\u03c0\u2013\u2014\u2018\u2019\u201a\u201c\u201d\u201e\u2020\u2021\u2022\u2030\u2039\u203a\u203d\u20ac\u20b1\u20b9\u2105\u2116\u2122\u2205\u2206\u221a\u221e\u2248\u2260\u2264\u2265\u2605\u266a\u2713\u27e8\u27e9";
const Zp = computerKeyboard + handphoneKeyboard;
const _p = Zp.length;

// Fungsi GCD and LCM
function gcd(a,b) { return b === 0 ? a : gcd(b, a % b); }
function lcm(a,b) { return (a * b) / gcd(a,b); }

// Konversi Antara Karakter dan Kode Numerik
function charToCode(char) { return char.split('').map(x => Zp.indexOf(x)); }
function codeToChar(code) { return code.map(x => Zp[x % _p]).join(''); }

// -- PENYUSUNAN MATRIKS --
function buildMatrix(k_input, q_input) {
  // Penghitungan Nilai Theta dan t
  const theta    = Math.min(k_input.length, q_input.length) - 1;
  const notTheta = Math.max(k_input.length, q_input.length);
  const t        = lcm(theta + 1, (notTheta / gcd(notTheta, theta)));

  // Menyusun Matriks Nr
  function create_Nr(k_input, q_input) {
    const k = charToCode(k_input);
    const q = charToCode(q_input);
    
    const matrix = [];
    
    for (let r = 1; r <= t; r++) {
      const N = [
        new Array(theta),
        new Array(theta)
      ];
      
      for (let j = 0; j < theta; j++) {
        N[0][j] = k[((r-1) * theta + j) % k_input.length];
        N[1][j] = q[((r-1) * theta + j) % q_input.length];
      }
      matrix.push(N);
    }
    return matrix;
  }
  
  // Tampilkan Matriks Nr
  const matrices_Nr = create_Nr(k_input, q_input);
  console.log("Generate Matrices Nr:", matrices_Nr);
  
  // Menyusun Matrix Mr
  function create_Mr(k_input, q_input) {
    const matrix = [];
  
    for (let r = 1; r <= t; r++) {
      const M = [
        new Array(2)
      ];
    
      M[0][0] = ((r * theta) - 1) % q_input.length + 1;
      M[0][1] = ((r * theta) - 1) % k_input.length + 1;
      matrix.push(M);     
    }
    return matrix;
  }

  // Tampilkan Matriks Mr
  const matrices_Mr = create_Mr(k_input, q_input);
  console.log("Generate Matrices Mr:", matrices_Mr);

  // Menyusun Matriks Kr = Mr x Nr
  function multiplyMatrices(Mr, Nr) {
    const K = new Array(theta).fill(0);
  
    for (let j = 0; j < theta; j++) {
      K[j] = (Mr[0][0] * Nr[0][j] + Mr[0][1] * Nr[1][j]) % _p;
    }
    return K;
  }

  // Tampilkan Matriks Kr
  const matrices_Kr = matrices_Mr.map((Mr,r) => multiplyMatrices(Mr, matrices_Nr[r]));
  console.log("Multiply Result (Kr):", matrices_Kr);

  // Menggabungkan Semua Kr Menjadi Satu Matriks Baris Y
  const matrixY = matrices_Kr.flat();
  console.log("Partition Matrix Y:", matrixY);

  // Konversi Kembali Menjadi Karakter
  const modify = codeToChar(matrixY);
  console.log("Modified Key: ", modify);

  return modify;
}

// -- ENKRIPSI DAN DEKRIPSI --
// Proses Enkripsi Modifikasi
function encryptMod(v_input, modifiedKeys) { 
  let c_output = "";
  if (!modifiedKeys) { modifiedKeys = " ";}

  for (let i = 0; i < v_input.length; i++) {
    const v_char  = v_input[i];
    const v_index = Zp.indexOf(v_char);
    
    if (v_index !== -1) {
      const keyChar     = modifiedKeys[i % modifiedKeys.length];
      const keyIndex    = Zp.indexOf(keyChar);
      let c_outputIndex = (v_index + keyIndex) % _p;
      c_output += Zp[c_outputIndex];
    }

    else { c_output += v_char; }
  }
  return c_output;
}


// Untuk Tombol Enkripsi
function encryptingModButton() {
  const v_input = document.getElementById("plaintext-input").value;
  const k_input = document.getElementById("key1-input").value;
  const q_input = document.getElementById("key2-input").value;

  const modifiedKeys = buildMatrix(k_input, q_input);
  const c_output     = encryptMod(v_input, modifiedKeys);
  document.getElementById("key-pattern").value       = modifiedKeys;
  document.getElementById("ciphertext-result").value = c_output;
}

// Proses Dekripsi Modifikasi
function decryptMod(c_input, modifiedKeys) {
  let v_output = "";
  if (!modifiedKeys) { modifiedKeys = " ";}

  for (let i = 0; i < c_input.length; i++) {
    const c_char  = c_input[i];
    const c_index = Zp.indexOf(c_char);
    
    if (c_index !== -1) {
      const keyChar     = modifiedKeys[i % modifiedKeys.length];
      const keyIndex    = Zp.indexOf(keyChar);
      let v_outputIndex = (c_index - keyIndex + _p) % _p;
      v_output += Zp[v_outputIndex];
    }

    else { v_output += c_char; }
  }
  return v_output;
}

// Untuk Tombol Dekripsi
function decryptingModButton() {
  const c_input = document.getElementById("ciphertext-result").value;
  const k_input = document.getElementById("key1-input").value;
  const q_input = document.getElementById("key2-input").value;

  const modifiedKeys = buildMatrix(k_input, q_input);
  const v_output     = decryptMod(c_input, modifiedKeys);
  document.getElementById("plaintext-return").value = v_output;
}

// Perhitungan Entropi Shannon
function ShannonEntropy(x) {
  // Hitung Jumlah Kemunculan Setiap Karakter dalam Kunci
  const frequency = {};
  for (const char of x) { frequency[char] = (frequency[char] || 0) + 1; }

  // Hitung Probabilitas Setiap Karakter
  const probabilities = Object.values(frequency).map(count => count / x.length);

  // Hitung Entropi Menggunakan Rumus Shannon
  const entropy = probabilities.reduce((sum, p) => sum - p * Math.log2(p), 0);
  
  return entropy;
}

// Untuk Tombol Hitung Entropi
function InfoButton() {
  const key = document.getElementById("key-pattern").value;
  const keyEntropy = ShannonEntropy(key);
  const DataInfo = `
Message Length: ${document.getElementById("plaintext-input").value.length}
Key 1 Length  : ${document.getElementById("key1-input").value.length}
Key 2 Length  : ${document.getElementById("key2-input").value.length}
Modified Key Length : ${key.length}
Modified Key Entropy: ${keyEntropy}
  `;
  document.getElementById("data-info").value = DataInfo.trim();
}