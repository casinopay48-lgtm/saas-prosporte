const { exec, spawn } = require("child_process");

function runCommand(cmd, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const process = spawn(cmd, args, { stdio: "inherit", shell: true, ...options });
    process.on("close", code => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });
}

async function main() {
  try {
    console.log("1️⃣ Verificando se Metro está rodando...");
    const isMetroRunning = await new Promise((resolve) => {
      const net = require("net");
      const client = new net.Socket();
      client.once("error", () => resolve(false));
      client.connect(8081, "127.0.0.1", () => {
        client.end();
        resolve(true);
      });
    });

    if (!isMetroRunning) {
      console.log("🚀 Metro não está rodando. Iniciando Metro...");
      const metro = spawn("npx react-native start", { shell: true, stdio: "inherit" });
      await new Promise(r => setTimeout(r, 5000)); // espera Metro inicializar
    } else {
      console.log("✅ Metro já está rodando.");
    }

    console.log("2️⃣ Configurando adb reverse da porta 8081...");
    await runCommand("adb", ["reverse", "tcp:8081", "tcp:8081"]);

    console.log("3️⃣ Rodando app no Android...");
    await runCommand("npx", ["react-native", "run-android"]);

    console.log("4️⃣ Capturando logs filtrados do React Native...");
    console.log("🔹 Pressione Ctrl+C para parar os logs.");
    const log = spawn("npx react-native log-android", { shell: true, stdio: "inherit" });
  } catch (err) {
    console.error("❌ Erro:", err.message);
  }
}

main();
