require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN || 'localhost';

app.use(cors());
app.use(bodyParser.json());

// ========== BANCO DE DADOS EM MEMÓRIA ==========
let database = {
    bancas: {
        "default": { 
            nome: "PROSPORTE", 
            logo: "https://via.placeholder.com/180x50/1e2329/f0b90b?text=PROSPORTE", 
            cor_primaria: "#F0B90B", 
            cor_fundo: "#0B0E11" 
        },
        "flamengo": {
            nome: "FLAMENGO BETS",
            logo: "https://via.placeholder.com/180x50/1e2329/ff0000?text=FLAMENGO",
            cor_primaria: "#FF0000",
            cor_fundo: "#0B0E11"
        },
        "palmeiras": {
            nome: "PALMEIRAS BETS",
            logo: "https://via.placeholder.com/180x50/1e2329/008000?text=PALMEIRAS",
            cor_primaria: "#008000",
            cor_fundo: "#0B0E11"
        }
    },
    jogos: [
        { 
            id: 1, 
            liga: "BRASILEIRÃO SÉRIE A", 
            casa: "FLAMENGO", 
            fora: "PALMEIRAS", 
            p_casa: 1, 
            p_fora: 0, 
            status: "42'", 
            acontecendo_gol: true 
        },
        { 
            id: 2, 
            liga: "BRASILEIRÃO SÉRIE A", 
            casa: "SÃO PAULO", 
            fora: "CORINTHIANS", 
            p_casa: 0, 
            p_fora: 1, 
            status: "28'", 
            acontecendo_gol: false 
        },
        { 
            id: 3, 
            liga: "LIBERTADORES", 
            casa: "BOTAFOGO", 
            fora: "FLUMINENSE", 
            p_casa: 2, 
            p_fora: 0, 
            status: "FINALIZADO", 
            acontecendo_gol: false 
        }
    ]
};

// ====== USUÁRIOS (DB SIMPLES) ======
database.users = [
    { id: 1, name: 'Admin', email: 'admin@saasportes.com', password: 'Admin@123', role: 'ADMIN' },
    // exemplo de client
    { id: 2, name: 'Cliente Teste', email: 'cliente@teste.com', password: 'Cliente@123', role: 'CLIENT' }
];

// Note: This mock uses JWTs signed with JWT_SECRET. In production use a persistent DB and hashed passwords.
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
if (!process.env.JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET is not set. Using development fallback. Set process.env.JWT_SECRET in production.');
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

// ========== VISÃO WEB (LAYOUT ROP DINÂMICO) ==========
app.get('/', (req, res) => {
    const host = req.headers.host.split('.')[0] || 'default';
    const banca = database.bancas[host] || database.bancas["default"];

    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${banca.nome}</title>
            <style>
                :root { 
                    --primary: ${banca.cor_primaria}; 
                    --bg: ${banca.cor_fundo}; 
                }
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body { 
                    background: var(--bg); 
                    color: #fff; 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                    padding: 10px;
                }
                .header { 
                    background: #1E2329; 
                    height: 65px; 
                    display: flex; 
                    align-items: center; 
                    padding: 0 15px; 
                    border-bottom: 3px solid var(--primary);
                    border-radius: 8px;
                    margin-bottom: 15px;
                }
                .logo { 
                    height: 35px; 
                }
                .league { 
                    background: #2B3139; 
                    padding: 8px 15px; 
                    font-size: 11px; 
                    color: #848E9C; 
                    font-weight: bold; 
                    margin-top: 10px;
                    border-radius: 4px;
                }
                .match { 
                    background: #1E2329; 
                    height: 75px; 
                    display: flex; 
                    align-items: center; 
                    border-left: 4px solid var(--primary); 
                    border-bottom: 1px solid #2B3139;
                    padding: 10px;
                    gap: 15px;
                }
                .team { 
                    flex: 1; 
                    text-align: center; 
                    font-size: 13px; 
                    font-weight: bold;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .score-container { 
                    width: 100px; 
                    text-align: center; 
                }
                .score { 
                    font-size: 20px; 
                    font-weight: 900; 
                    color: var(--primary);
                }
                .status-time {
                    font-size: 10px; 
                    color: #848E9C;
                    margin-top: 4px;
                }
                .goal-indicator { 
                    width: 8px; 
                    height: 8px; 
                    background: #00ff00; 
                    border-radius: 50%; 
                    display: inline-block; 
                    box-shadow: 0 0 10px #00ff00; 
                    animation: pulse-gol 0.8s infinite;
                    margin-left: 6px;
                }
                @keyframes pulse-gol { 
                    0%, 100% { 
                        opacity: 1; 
                        transform: scale(1);
                    } 
                    50% { 
                        opacity: 0.3; 
                        transform: scale(1.2);
                    } 
                }
                .info-bar {
                    background: #2B3139;
                    padding: 10px 15px;
                    border-radius: 4px;
                    font-size: 12px;
                    color: #848E9C;
                    margin-top: 20px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <img src="${banca.logo}" class="logo" alt="${banca.nome}">
            </div>
            <div id="content" style="min-height: 200px;">
                <div class="info-bar">Carregando...</div>
            </div>
            <div class="info-bar">
                🔄 Atualizando a cada 5 segundos | API: /api/v1/sync
            </div>
            <script>
                async function sync() {
                    try {
                        const r = await fetch('/api/v1/sync');
                        const d = await r.json();
                        document.getElementById('content').innerHTML = d.jogos.map(j => \`
                            <div class="league">\${j.liga}</div>
                            <div class="match">
                                <div class="team">\${j.casa}</div>
                                <div class="score-container">
                                    <div class="score">\${j.p_casa} - \${j.p_fora}</div>
                                    <div class="status-time">
                                        \${j.status}
                                        \${j.acontecendo_gol ? '<span class="goal-indicator"></span>' : ''}
                                    </div>
                                </div>
                                <div class="team">\${j.fora}</div>
                            </div>
                        \`).join('');
                    } catch(e) {
                        console.error('Erro ao sincronizar:', e);
                    }
                }
                setInterval(sync, 5000);
                sync();
            </script>
        </body>
        </html>
    `);
});

// ========== API PARA ANDROID E WEB ==========
app.get('/api/v1/sync', (req, res) => {
    const host = req.headers.host.split('.')[0] || 'default';
    const banca = database.bancas[host] || database.bancas["default"];
    
    res.json({ 
        status: "success",
        banca: { 
            nome: banca.nome, 
            logo: banca.logo, 
            cor: banca.cor_primaria 
        },
        jogos: database.jogos,
        timestamp: new Date().toISOString()
    });
});

// ========== AUTH: REGISTER / LOGIN / ME (JWT) ==========

function signTokenForUser(user) {
    const payload = { id: user.id, email: user.email, role: user.role };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Middleware: validate JWT and inject req.user
function authMiddleware(req, res, next) {
    const auth = req.headers.authorization || '';
    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Authorization inválido' });
    const token = parts[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload; // { id, email, role, iat, exp }
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}

// Middleware: role-based access. allowedRoles is array of uppercase role strings
function roleMiddleware(allowedRoles = []) {
    return (req, res, next) => {
        const user = req.user;
        if (!user) return res.status(401).json({ message: 'Autenticação requerida' });
        const userRole = String(user.role || '').toUpperCase();
        const allowed = allowedRoles.map(r => String(r).toUpperCase());
        if (!allowed.includes(userRole)) return res.status(403).json({ message: 'Acesso negado' });
        next();
    };
}

// POST /api/v1/auth/register
app.post('/api/v1/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Campos obrigatórios: name, email, password' });
    }
    const exists = database.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (exists) return res.status(409).json({ message: 'Email já cadastrado' });

    const id = database.users.length ? Math.max(...database.users.map(u => u.id)) + 1 : 1;
    const user = { id, name, email, password, role: 'CLIENT' };
    database.users.push(user);
    const token = signTokenForUser(user);
    return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

// POST /api/v1/auth/login
app.post('/api/v1/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email e password são obrigatórios' });
    const u = database.users.find(x => x.email.toLowerCase() === String(email).toLowerCase() && x.password === password);
    if (!u) return res.status(401).json({ message: 'Credenciais inválidas' });
    const token = signTokenForUser(u);
    return res.json({ token, user: { id: u.id, email: u.email, role: u.role } });
});

// GET /api/v1/auth/me (protected)
app.get('/api/v1/auth/me', authMiddleware, (req, res) => {
    const u = req.user;
    return res.json({ id: u.id, email: u.email, role: u.role });
});

// Protect admin routes: require auth and disallow CLIENT
// Protege rotas administrativas: apenas usuários com role ADMIN
app.use('/api/admin', authMiddleware, roleMiddleware(['ADMIN']));

// ========== PAINEL ADMIN (CADASTRO DE BANCAS) ==========
app.post('/api/admin/banca', (req, res) => {
    const { slug, nome, logo, cor } = req.body;
    
    if (!slug || !nome || !logo || !cor) {
        return res.status(400).json({ 
            success: false, 
            message: "Campos obrigatórios: slug, nome, logo, cor" 
        });
    }
    
    database.bancas[slug] = { 
        nome, 
        logo, 
        cor_primaria: cor, 
        cor_fundo: "#0B0E11" 
    };
    
    res.json({ 
        success: true, 
        message: `Banca '${nome}' criada com sucesso!`,
        banca: database.bancas[slug]
    });
});

// ========== ATUALIZAR JOGOS ==========
app.post('/api/admin/jogos', (req, res) => {
    const { jogos } = req.body;
    
    if (!Array.isArray(jogos)) {
        return res.status(400).json({ 
            success: false, 
            message: "Envie um array de jogos" 
        });
    }
    
    database.jogos = jogos;
    
    res.json({ 
        success: true, 
        message: `${jogos.length} jogos atualizados!`,
        jogos: database.jogos
    });
});

// ========== ATUALIZAR JOGO INDIVIDUAL ==========
app.post('/api/admin/jogo/:id', (req, res) => {
    const { id } = req.params;
    const update = req.body;
    
    const jogo = database.jogos.find(j => j.id == id);
    if (!jogo) {
        return res.status(404).json({ 
            success: false, 
            message: "Jogo não encontrado" 
        });
    }
    
    Object.assign(jogo, update);
    
    res.json({ 
        success: true, 
        message: "Jogo atualizado!",
        jogo
    });
});

// ========== LISTAR BANCAS ==========
app.get('/api/admin/bancas', (req, res) => {
    res.json({
        success: true,
        bancas: database.bancas
    });
});

// ========== HEALTH CHECK ==========
app.get('/health', (req, res) => {
    res.json({
        status: "UP",
        timestamp: new Date().toISOString(),
        jogos_count: database.jogos.length,
        bancas_count: Object.keys(database.bancas).length
    });
});

// ========== INICIAR SERVIDOR ==========
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                  🚀 HUB PROSPORTE ATIVO                        ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  🌍 Web:     http://localhost:${PORT}                        ║
║  📱 API:     http://localhost:${PORT}/api/v1/sync           ║
║  ⚙️  Admin:   http://localhost:${PORT}/api/admin/bancas     ║
║  ❤️  Health:  http://localhost:${PORT}/health               ║
║                                                                ║
╠════════════════════════════════════════════════════════════════╣
║  Subdomínios Suportados (use /etc/hosts ou DNS):              ║
║  • localhost (default)                                        ║
║  • flamengo.localhost                                         ║
║  • palmeiras.localhost                                        ║
║                                                                ║
║  Novo campo implementado: "acontecendo_gol"                  ║
║  ✅ Backend enviando bolinha verde ao vivo                    ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
