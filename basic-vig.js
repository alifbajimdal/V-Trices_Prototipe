// Pendefinisian Variasi Karakter 
const computerKeyboard  = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
const handphoneKeyboard = "\u00a1\u00a2\u00a3\u00a5\u00a7\u00a9\u00ab\u00ae\u00b0\u00b1\u00b6\u00b7\u00bb\u00bf\u00d7\u00f7\u03a0\u03a9\u03bc\u03c0\u2013\u2014\u2018\u2019\u201a\u201c\u201d\u201e\u2020\u2021\u2022\u2030\u2039\u203a\u203d\u20ac\u20b1\u20b9\u2105\u2116\u2122\u2205\u2206\u221a\u221e\u2248\u2260\u2264\u2265\u2605\u266a\u2713\u27e8\u27e9";
const Zp = computerKeyboard + handphoneKeyboard;
const _p = Zp.length;

// Fungsi GCD dan LCM
function gcd(a,b) { return b === 0 ? a : gcd(b, a % b); }
function lcm(a,b) { return (a * b) / gcd(a,b); }

// Mencari Pola Kunci Kombinasi 
function keyPattern(k_input, q_input) {
  let keyOutput = "";
  if (!k_input) { k_input = " "; }
  if (!q_input) { q_input = " "; }

  const patternLength = lcm(k_input.length, q_input.length);
  const repeater_k = k_input
  const repeater_q = q_input;

  const k_times = patternLength / k_input.length;
  const q_times = patternLength / q_input.length;

  for (let i = 1; i < k_times; i++) { k_input += repeater_k; }
  for (let i = 1; i < q_times; i++) { q_input += repeater_q; }

  for (let j = 0; j < patternLength; j++) {
    const k_index = Zp.indexOf(k_input[j]);

    if (k_index !== -1) {
      const q_index = Zp.indexOf(q_input[j]);
      let keyCombination = (k_index + q_index) % _p;
      keyOutput += Zp[keyCombination];
    }
  }
  return keyOutput;
}

// Proses Enkripsi Dasar
function encryptSimple(v_input, keyOutput) {
  let c_output = "";
  if (!keyOutput) { keyOutput = " "; }

  for (let i = 0; i < v_input.length; i++) {
    const v_char  = v_input[i];
    const v_index = Zp.indexOf(v_char);
    
    if (v_index !== -1) {
      const keyChar     = keyOutput[i % keyOutput.length];
      const keyIndex    = Zp.indexOf(keyChar);
      let c_outputIndex = (v_index + keyIndex) % _p;
      c_output += Zp[c_outputIndex];
    }

    else { c_output += v_char; }
  }
  return c_output;
}

// Untuk Tombol Enkripsi
function encryptingButton() {
  const v_input = document.getElementById("plaintext-input").value;
  const k_input = document.getElementById("key1-input").value;
  const q_input = document.getElementById("key2-input").value;

  const keyOutput = keyPattern(k_input, q_input);
  const c_output  = encryptSimple(v_input, keyOutput);
  document.getElementById("key-pattern").value       = keyOutput;
  document.getElementById("ciphertext-result").value = c_output;
}

// Proses Dekripsi Dasar
function decryptSimple(c_input, keyOutput) {
  let v_output = "";
  if (!keyOutput) { keyOutput = " "; }

  for (let i = 0; i < c_input.length; i++) {
    const c_char  = c_input[i];
    const c_index = Zp.indexOf(c_char);

    if (c_index !== -1) {
      const keyChar     = keyOutput[i % keyOutput.length];
      const keyIndex    = Zp.indexOf(keyChar); 
      let v_outputIndex = (c_index - keyIndex + _p) % _p;
      v_output += Zp[v_outputIndex];
    }

    else { v_output += c_char; }
  }
  return v_output;
}  

// Untuk Tombol Dekripsi
function decryptingButton() {
  const c_input = document.getElementById("ciphertext-result").value;
  const k_input = document.getElementById("key1-input").value;
  const q_input = document.getElementById("key2-input").value;

  const keyOutput = keyPattern(k_input, q_input);
  const v_output  = decryptSimple(c_input, keyOutput);
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
  document.getElementById("data-info").value  = DataInfo.trim();
}