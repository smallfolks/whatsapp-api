// ../lib/whatsapp-client.js
let client; // pastikan ini variabel client whatsapp-web.js kamu

async function logoutClient() {
  try {
    if (!client) {
      return false; // client belum diinisialisasi
    }
    if (client.info && client.info.isConnected) {
      await client.logout();
      return true;
    } else {
      // Sudah disconnect, anggap logout berhasil
      return true;
    }
  } catch (error) {
    if (error.message.includes('Session closed')) {
      // Session sudah tertutup, anggap logout berhasil
      return true;
    }
    throw error; // error lain dilempar ke atas
  }
}

module.exports = { logoutClient, setClient: (c) => (client = c) };
