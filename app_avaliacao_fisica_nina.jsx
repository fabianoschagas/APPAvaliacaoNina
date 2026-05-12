import React, { useMemo, useState } from "react";

const estadoInicial = {
  nome: "",
  data: "",
  avaliador: "",
  sexo: "feminino",
  idade: "",
  altura: "",
  peso: "",
  objetivo: "",
  cintura: "",
  abdomen: "",
  quadril: "",
  gluteos: "",
  peitoralPerimetro: "",
  bracoRelaxado: "",
  bracoContraido: "",
  antebraco: "",
  coxa: "",
  panturrilha: "",
  panturrilhaPerimetro: "",
  torax: "",
  peitoralDobra: "",
  subescapular: "",
  tricipital: "",
  bicipital: "",
  suprailiaca: "",
  abdominal: "",
  coxaDobra: "",
  axilarMedia: "",
  panturrilhaDobra: "",
  observacoes: "",
  obsModelo: "",
  retencaoHidrica: false,
  flacidez: false,
  celulite: false,
  estrias: false,
  assimetria: false,
  outrosObs: "",
};

const abas = [
  { id: "identificacao", nome: "Identificação" },
  { id: "modelo", nome: "Modelo Antropométrico" },
  { id: "resumo", nome: "Resumo" },
];

function numero(valor) {
  const convertido = Number(String(valor || "").replace(",", "."));
  return Number.isFinite(convertido) ? convertido : 0;
}

function calcularResultados(dados) {
  const peso = numero(dados.peso);
  const alturaCm = numero(dados.altura);
  const alturaM = alturaCm / 100;
  const cintura = numero(dados.cintura);
  const quadril = numero(dados.quadril);
  const idade = numero(dados.idade);

  const imc = peso > 0 && alturaM > 0 ? peso / (alturaM * alturaM) : 0;
  const rcq = cintura > 0 && quadril > 0 ? cintura / quadril : 0;

  const somaDobras =
    numero(dados.peitoralDobra) +
    numero(dados.subescapular) +
    numero(dados.tricipital) +
    numero(dados.bicipital) +
    numero(dados.suprailiaca) +
    numero(dados.abdominal) +
    numero(dados.coxaDobra) +
    numero(dados.axilarMedia) +
    numero(dados.panturrilhaDobra);

  let classificacaoIMC = "";
  if (imc) {
    if (imc < 18.5) classificacaoIMC = "Baixo peso";
    else if (imc < 25) classificacaoIMC = "Eutrofia";
    else if (imc < 30) classificacaoIMC = "Sobrepeso";
    else classificacaoIMC = "Obesidade";
  }

  let riscoRCQ = "";
  if (rcq) {
    if (dados.sexo === "feminino") riscoRCQ = rcq >= 0.85 ? "Risco aumentado" : "Dentro da referência";
    else riscoRCQ = rcq >= 0.9 ? "Risco aumentado" : "Dentro da referência";
  }

  const tmb = peso > 0 && alturaCm > 0 && idade > 0
    ? dados.sexo === "feminino"
      ? 10 * peso + 6.25 * alturaCm - 5 * idade - 161
      : 10 * peso + 6.25 * alturaCm - 5 * idade + 5
    : 0;

  return { imc, classificacaoIMC, rcq, riscoRCQ, somaDobras, tmb };
}

function rodarTestesBasicos() {
  const testeFeminino = calcularResultados({
    ...estadoInicial,
    sexo: "feminino",
    idade: "40",
    altura: "160",
    peso: "64",
    cintura: "80",
    quadril: "100",
    subescapular: "10",
    tricipital: "12",
    bicipital: "8",
    suprailiaca: "14",
    abdominal: "20",
    coxaDobra: "16",
  });

  console.assert(Math.abs(testeFeminino.imc - 25) < 0.01, "Teste IMC feminino falhou");
  console.assert(Math.abs(testeFeminino.rcq - 0.8) < 0.01, "Teste RCQ feminino falhou");
  console.assert(testeFeminino.somaDobras === 80, "Teste soma de dobras falhou");
  console.assert(Math.round(testeFeminino.tmb) === 1303, "Teste TMB feminino falhou");

  const testeMasculino = calcularResultados({
    ...estadoInicial,
    sexo: "masculino",
    idade: "30",
    altura: "180",
    peso: "80",
    cintura: "95",
    quadril: "100",
  });

  console.assert(Math.abs(testeMasculino.imc - 24.69) < 0.02, "Teste IMC masculino falhou");
  console.assert(testeMasculino.riscoRCQ === "Risco aumentado", "Teste RCQ masculino falhou");
  console.assert(Math.round(testeMasculino.tmb) === 1780, "Teste TMB masculino falhou");

  const testeVazio = calcularResultados(estadoInicial);
  console.assert(testeVazio.imc === 0, "Teste vazio IMC falhou");
  console.assert(testeVazio.rcq === 0, "Teste vazio RCQ falhou");
  console.assert(testeVazio.tmb === 0, "Teste vazio TMB falhou");

  const testeDobrasModelo = calcularResultados({
    ...estadoInicial,
    peitoralDobra: "5",
    abdominal: "10",
    suprailiaca: "7",
    coxaDobra: "15",
    subescapular: "8",
    axilarMedia: "6",
    tricipital: "9",
    panturrilhaDobra: "11",
  });
  console.assert(testeDobrasModelo.somaDobras === 71, "Teste soma de dobras do modelo falhou");
}

rodarTestesBasicos();

function Campo({ label, campo, dados, atualizar, tipo = "text", sufixo = "" }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type={tipo}
          value={dados[campo]}
          onChange={(e) => atualizar(campo, e.target.value)}
          className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        {sufixo ? <span className="w-10 text-xs text-zinc-500">{sufixo}</span> : null}
      </div>
    </div>
  );
}

const LOGO_NINA_BASE64 = "data:image/png;base64,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";

function LogoNina({ centralizada = false }) {
  return (
    <div className={centralizada ? "flex flex-col items-center text-center" : "flex items-center gap-4"}>
      <img
        src={LOGO_NINA_BASE64}
        alt="Logo Nina Hottes"
        className={centralizada ? "h-28 object-contain" : "h-20 object-contain"}
      />
      <div>
        <p className="text-xs font-bold tracking-[0.25em] text-blue-900">CREF: 071408-G/RJ</p>
      </div>
    </div>
  );
}

function CaixaResultado({ titulo, valor, subtitulo }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-zinc-500">{titulo}</p>
      <p className="mt-1 text-2xl font-bold text-zinc-900">{valor}</p>
      <p className="mt-1 text-xs text-zinc-500">{subtitulo}</p>
    </div>
  );
}

function BotaoAba({ ativo, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        ativo
          ? "rounded-xl bg-blue-900 px-3 py-2 text-sm font-semibold text-white shadow-sm"
          : "rounded-xl px-3 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100"
      }
    >
      {children}
    </button>
  );
}

function LinhaTabela({ nome, campos, dados, atualizar, unidade }) {
  return (
    <tr className="border-b border-zinc-300 last:border-b-0">
      <td className="border-r border-zinc-300 px-2 py-2 text-xs font-medium text-zinc-800">{nome}</td>
      {campos.map((campo) => (
        <td key={campo} className="border-r border-zinc-300 p-1 last:border-r-0">
          <input
            value={dados[campo] || ""}
            onChange={(e) => atualizar(campo, e.target.value)}
            className="h-8 w-full rounded-md border border-transparent bg-transparent px-1 text-center text-xs outline-none focus:border-blue-400 focus:bg-blue-50"
            aria-label={`${nome} ${unidade}`}
          />
        </td>
      ))}
    </tr>
  );
}

function CorpoAntropometrico() {
  const linhas = [42, 75, 108, 141, 174, 207, 240];
  return (
    <div className="grid grid-cols-2 gap-6 rounded-2xl border border-zinc-300 bg-white p-4">
      {["FRENTE", "COSTAS"].map((lado) => (
        <div key={lado} className="relative flex flex-col items-center">
          <span className="mb-2 rounded-lg border border-zinc-400 px-4 py-1 text-xs font-bold">{lado}</span>
          <svg viewBox="0 0 180 360" className="h-[430px] w-full max-w-[260px]">
            {linhas.map((y) => (
              <line key={y} x1="8" x2="172" y1={y} y2={y} stroke="#777" strokeDasharray="5 4" strokeWidth="1" />
            ))}
            <line x1="90" x2="90" y1="22" y2="330" stroke="#777" strokeDasharray="5 4" strokeWidth="1" />
            <circle cx="90" cy="35" r="18" fill="none" stroke="#111" strokeWidth="2" />
            <path d="M72 54 C64 73 58 99 55 130 C51 166 43 200 36 229" fill="none" stroke="#111" strokeWidth="2" />
            <path d="M108 54 C116 73 122 99 125 130 C129 166 137 200 144 229" fill="none" stroke="#111" strokeWidth="2" />
            <path d="M70 55 C78 65 102 65 110 55" fill="none" stroke="#111" strokeWidth="2" />
            <path d="M59 96 C68 92 76 92 83 98" fill="none" stroke="#111" strokeWidth="1.5" />
            <path d="M121 96 C112 92 104 92 97 98" fill="none" stroke="#111" strokeWidth="1.5" />
            <path d="M55 130 C65 158 70 188 76 220" fill="none" stroke="#111" strokeWidth="2" />
            <path d="M125 130 C115 158 110 188 104 220" fill="none" stroke="#111" strokeWidth="2" />
            <path d="M76 220 C74 260 69 304 65 338" fill="none" stroke="#111" strokeWidth="2" />
            <path d="M104 220 C106 260 111 304 115 338" fill="none" stroke="#111" strokeWidth="2" />
            <path d="M76 220 C82 240 84 280 86 338" fill="none" stroke="#111" strokeWidth="2" />
            <path d="M104 220 C98 240 96 280 94 338" fill="none" stroke="#111" strokeWidth="2" />
            <path d="M65 338 C72 345 82 345 86 338" fill="none" stroke="#111" strokeWidth="2" />
            <path d="M94 338 C98 345 108 345 115 338" fill="none" stroke="#111" strokeWidth="2" />
            {lado === "COSTAS" && <path d="M64 196 C78 210 102 210 116 196" fill="none" stroke="#111" strokeWidth="2" />}
          </svg>
        </div>
      ))}
    </div>
  );
}

function CheckboxModelo({ label, campo, dados, atualizar }) {
  return (
    <label className="flex items-center gap-2 text-xs text-zinc-800">
      <input
        type="checkbox"
        checked={Boolean(dados[campo])}
        onChange={(e) => atualizar(campo, e.target.checked)}
        className="h-4 w-4 rounded border-zinc-400"
      />
      {label}
    </label>
  );
}

function ModeloAntropometrico({ dados, atualizar }) {
  const camposTabela = ["direita", "esquerda", "media"];

  const dobras = [
    ["Peitoral", ["peitoralDobra", "peitoralDobraEsq", "peitoralDobraMedia"]],
    ["Abdômen", ["abdominal", "abdominalEsq", "abdominalMedia"]],
    ["Supra-ilíaca", ["suprailiaca", "suprailiacaEsq", "suprailiacaMedia"]],
    ["Coxa", ["coxaDobra", "coxaDobraEsq", "coxaDobraMedia"]],
    ["Subescapular", ["subescapular", "subescapularEsq", "subescapularMedia"]],
    ["Axilar média", ["axilarMedia", "axilarMediaEsq", "axilarMediaMedia"]],
    ["Tricipital", ["tricipital", "tricipitalEsq", "tricipitalMedia"]],
    ["Panturrilha", ["panturrilhaDobra", "panturrilhaDobraEsq", "panturrilhaDobraMedia"]],
  ];

  const perimetros = [
    ["Peitoral", ["peitoralPerimetro", "peitoralPerimetroEsq", "peitoralPerimetroMedia"]],
    ["Braço (relaxado)", ["bracoRelaxado", "bracoRelaxadoEsq", "bracoRelaxadoMedia"]],
    ["Braço (contraído)", ["bracoContraido", "bracoContraidoEsq", "bracoContraidoMedia"]],
    ["Cintura", ["cintura", "cinturaEsq", "cinturaMedia"]],
    ["Abdômen (umbigo)", ["abdomen", "abdomenEsq", "abdomenMedia"]],
    ["Quadril (maior circunferência)", ["quadril", "quadrilEsq", "quadrilMedia"]],
    ["Glúteos (maior projeção)", ["gluteos", "gluteosEsq", "gluteosMedia"]],
    ["Panturrilha (maior circunferência)", ["panturrilhaPerimetro", "panturrilhaPerimetroEsq", "panturrilhaPerimetroMedia"]],
  ];

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm print:p-2">
      <div className="mb-4 grid gap-3 md:grid-cols-[260px_1fr_260px] md:items-start">
        <div>
          <LogoNina />
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-black uppercase tracking-wide text-blue-900 md:text-5xl">Avaliação Antropométrica</h2>
          <div className="mt-2 flex items-center justify-center gap-4">
            <span className="h-px w-24 bg-green-700" />
            <p className="text-lg font-black uppercase tracking-widest text-green-700 md:text-2xl">Dobras Cutâneas e Perímetros</p>
            <span className="h-px w-24 bg-green-700" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[330px_1fr_390px]">
        <aside className="space-y-4">
          <div className="rounded-xl border border-zinc-500 p-4">
            <div className="space-y-3 text-sm font-bold">
              <label className="flex items-center gap-2">NOME:<input value={dados.nome} onChange={(e) => atualizar("nome", e.target.value)} className="flex-1 border-b border-zinc-500 outline-none" /></label>
              <label className="flex items-center gap-2">DATA:<input type="date" value={dados.data} onChange={(e) => atualizar("data", e.target.value)} className="flex-1 border-b border-zinc-500 outline-none" /></label>
              <label className="flex items-center gap-2">IDADE:<input value={dados.idade} onChange={(e) => atualizar("idade", e.target.value)} className="w-20 border-b border-zinc-500 outline-none" /></label>
              <label className="flex items-center gap-2">AVALIADOR(A):<input value={dados.avaliador} onChange={(e) => atualizar("avaliador", e.target.value)} className="flex-1 border-b border-zinc-500 outline-none" /></label>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-500 p-4">
            <h3 className="mb-3 text-sm font-black uppercase">Observações Gerais</h3>
            <textarea
              value={dados.observacoes}
              onChange={(e) => atualizar("observacoes", e.target.value)}
              className="h-[520px] w-full resize-none rounded-lg border border-zinc-200 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_31px,#d4d4d8_32px)] p-2 text-sm outline-none"
            />
          </div>
        </aside>

        <main className="space-y-3">
          <CorpoAntropometrico />
          <div className="rounded-xl border border-zinc-500 p-3">
            <h3 className="mb-2 text-center text-sm font-black uppercase">Observações</h3>
            <textarea
              value={dados.obsModelo}
              onChange={(e) => atualizar("obsModelo", e.target.value)}
              className="h-24 w-full resize-none rounded-lg border border-zinc-200 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_23px,#d4d4d8_24px)] p-2 text-sm outline-none"
            />
          </div>
        </main>

        <aside className="space-y-4">
          <div>
            <h3 className="mb-2 text-center text-lg font-black uppercase text-green-700">Dobras Cutâneas <span className="text-xs">(mm)</span></h3>
            <table className="w-full border-collapse overflow-hidden rounded-xl border border-zinc-500 text-sm">
              <thead className="bg-zinc-50 text-xs uppercase">
                <tr>
                  <th className="border border-zinc-400 px-2 py-2">Região</th>
                  <th className="border border-zinc-400 px-2 py-2">Direita</th>
                  <th className="border border-zinc-400 px-2 py-2">Esquerda</th>
                  <th className="border border-zinc-400 px-2 py-2">Média</th>
                </tr>
              </thead>
              <tbody>
                {dobras.map(([nome, campos]) => <LinhaTabela key={nome} nome={nome} campos={campos} dados={dados} atualizar={atualizar} unidade="mm" />)}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="mb-2 text-center text-lg font-black uppercase text-green-700">Perímetros <span className="text-xs">(cm)</span></h3>
            <table className="w-full border-collapse overflow-hidden rounded-xl border border-zinc-500 text-sm">
              <thead className="bg-zinc-50 text-xs uppercase">
                <tr>
                  <th className="border border-zinc-400 px-2 py-2">Região</th>
                  <th className="border border-zinc-400 px-2 py-2">Direita</th>
                  <th className="border border-zinc-400 px-2 py-2">Esquerda</th>
                  <th className="border border-zinc-400 px-2 py-2">Média</th>
                </tr>
              </thead>
              <tbody>
                {perimetros.map(([nome, campos]) => <LinhaTabela key={nome} nome={nome} campos={campos} dados={dados} atualizar={atualizar} unidade="cm" />)}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-zinc-500 p-4">
            <h3 className="mb-3 text-sm font-black uppercase text-green-700">Outras Observações</h3>
            <div className="grid grid-cols-2 gap-3">
              <CheckboxModelo label="Retenção hídrica" campo="retencaoHidrica" dados={dados} atualizar={atualizar} />
              <CheckboxModelo label="Flacidez" campo="flacidez" dados={dados} atualizar={atualizar} />
              <CheckboxModelo label="Celulite" campo="celulite" dados={dados} atualizar={atualizar} />
              <CheckboxModelo label="Estrias" campo="estrias" dados={dados} atualizar={atualizar} />
              <CheckboxModelo label="Assimetria" campo="assimetria" dados={dados} atualizar={atualizar} />
              <label className="flex items-center gap-2 text-xs text-zinc-800">Outros:<input value={dados.outrosObs} onChange={(e) => atualizar("outrosObs", e.target.value)} className="min-w-0 flex-1 border-b border-zinc-500 outline-none" /></label>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default function AppAvaliacaoFisica() {
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nina_usuario_logado")) || null;
    } catch {
      return null;
    }
  });

  const [modoLogin, setModoLogin] = useState("login");
  const [loginForm, setLoginForm] = useState({ nome: "", email: "", senha: "" });
  const [alunos, setAlunos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nina_alunos")) || [];
    } catch {
      return [];
    }
  });
  const [avaliacoes, setAvaliacoes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nina_avaliacoes")) || [];
    } catch {
      return [];
    }
  });

  const [dados, setDados] = useState(estadoInicial);
  const [abaAtual, setAbaAtual] = useState("identificacao");
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState("");

  const atualizar = (campo, valor) => setDados((prev) => ({ ...prev, [campo]: valor }));
  const resultados = useMemo(() => calcularResultados(dados), [dados]);
  const limpar = () => setDados(estadoInicial);

  const salvarLocal = (chave, valor) => {
    localStorage.setItem(chave, JSON.stringify(valor));
  };

  const entrar = () => {
    const usuarios = JSON.parse(localStorage.getItem("nina_usuarios") || "[]");
    const usuario = usuarios.find((u) => u.email === loginForm.email && u.senha === loginForm.senha);

    if (!usuario) {
      alert("E-mail ou senha inválidos.");
      return;
    }

    setUsuarioLogado(usuario);
    salvarLocal("nina_usuario_logado", usuario);
  };

  const cadastrarUsuario = () => {
    if (!loginForm.nome || !loginForm.email || !loginForm.senha) {
      alert("Preencha nome, e-mail e senha.");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("nina_usuarios") || "[]");
    const jaExiste = usuarios.some((u) => u.email === loginForm.email);

    if (jaExiste) {
      alert("Este e-mail já está cadastrado.");
      return;
    }

    const novoUsuario = {
      id: crypto.randomUUID(),
      nome: loginForm.nome,
      email: loginForm.email,
      senha: loginForm.senha,
      criadoEm: new Date().toISOString(),
    };

    const atualizados = [...usuarios, novoUsuario];
    salvarLocal("nina_usuarios", atualizados);
    setUsuarioLogado(novoUsuario);
    salvarLocal("nina_usuario_logado", novoUsuario);
  };

  const sair = () => {
    localStorage.removeItem("nina_usuario_logado");
    setUsuarioLogado(null);
  };

  const salvarAluno = () => {
    if (!dados.nome) {
      alert("Informe o nome do aluno.");
      return;
    }

    const alunoExistente = alunoSelecionadoId ? alunos.find((a) => a.id === alunoSelecionadoId) : null;
    const aluno = {
      id: alunoExistente?.id || crypto.randomUUID(),
      nome: dados.nome,
      idade: dados.idade,
      sexo: dados.sexo,
      objetivo: dados.objetivo,
      criadoEm: alunoExistente?.criadoEm || new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    const atualizados = alunoExistente
      ? alunos.map((a) => (a.id === aluno.id ? aluno : a))
      : [...alunos, aluno];

    setAlunos(atualizados);
    salvarLocal("nina_alunos", atualizados);
    setAlunoSelecionadoId(aluno.id);
    alert("Aluno salvo com sucesso.");
  };

  const carregarAluno = (id) => {
    setAlunoSelecionadoId(id);
    const aluno = alunos.find((a) => a.id === id);
    if (!aluno) return;

    setDados((prev) => ({
      ...prev,
      nome: aluno.nome,
      idade: aluno.idade || "",
      sexo: aluno.sexo || "feminino",
      objetivo: aluno.objetivo || "",
    }));
  };

  const salvarAvaliacao = () => {
    if (!dados.nome) {
      alert("Informe o nome do aluno antes de salvar a avaliação.");
      return;
    }

    let alunoId = alunoSelecionadoId;

    if (!alunoId) {
      const novoAluno = {
        id: crypto.randomUUID(),
        nome: dados.nome,
        idade: dados.idade,
        sexo: dados.sexo,
        objetivo: dados.objetivo,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      };
      const alunosAtualizados = [...alunos, novoAluno];
      setAlunos(alunosAtualizados);
      salvarLocal("nina_alunos", alunosAtualizados);
      alunoId = novoAluno.id;
      setAlunoSelecionadoId(alunoId);
    }

    const novaAvaliacao = {
      id: crypto.randomUUID(),
      alunoId,
      alunoNome: dados.nome,
      data: dados.data || new Date().toISOString().slice(0, 10),
      dados,
      resultados,
      criadoEm: new Date().toISOString(),
    };

    const atualizadas = [novaAvaliacao, ...avaliacoes];
    setAvaliacoes(atualizadas);
    salvarLocal("nina_avaliacoes", atualizadas);
    alert("Avaliação salva com sucesso.");
  };

  const carregarAvaliacao = (avaliacao) => {
    setDados(avaliacao.dados);
    setAlunoSelecionadoId(avaliacao.alunoId);
    setAbaAtual("modelo");
  };

  if (!usuarioLogado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-zinc-50 p-4 text-zinc-900 md:p-8">
        <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
          <section className="w-full rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex justify-center">
              <LogoNina centralizada />
            </div>

            <h1 className="text-center text-2xl font-black text-blue-900">
              {modoLogin === "login" ? "Entrar no app" : "Criar conta"}
            </h1>
            <p className="mt-2 text-center text-sm text-zinc-500">
              Sistema de avaliação física com cadastro de alunos e histórico de avaliações.
            </p>

            <div className="mt-6 space-y-3">
              {modoLogin === "cadastro" && (
                <input
                  value={loginForm.nome}
                  onChange={(e) => setLoginForm((p) => ({ ...p, nome: e.target.value }))}
                  placeholder="Seu nome"
                  className="w-full rounded-2xl border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />
              )}
              <input
                value={loginForm.email}
                onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="E-mail"
                type="email"
                className="w-full rounded-2xl border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
              />
              <input
                value={loginForm.senha}
                onChange={(e) => setLoginForm((p) => ({ ...p, senha: e.target.value }))}
                placeholder="Senha"
                type="password"
                className="w-full rounded-2xl border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={modoLogin === "login" ? entrar : cadastrarUsuario}
              className="mt-5 w-full rounded-2xl bg-blue-900 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800"
            >
              {modoLogin === "login" ? "Entrar" : "Cadastrar"}
            </button>

            <button
              type="button"
              onClick={() => setModoLogin(modoLogin === "login" ? "cadastro" : "login")}
              className="mt-3 w-full text-sm font-semibold text-green-700"
            >
              {modoLogin === "login" ? "Não tenho conta. Cadastrar agora." : "Já tenho conta. Entrar."}
            </button>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-blue-50 p-4 text-zinc-900 md:p-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-7xl print:max-w-none">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between print:hidden">
          <div>
            <LogoNina />
            <h1 className="mt-2 text-3xl font-black text-blue-900 md:text-5xl">Avaliação Física</h1>
            <p className="mt-2 max-w-2xl text-zinc-600">
              Ficha digital com login, cadastro de alunos e histórico de avaliações.
            </p>
            <p className="mt-1 text-xs font-semibold text-zinc-500">Usuário: {usuarioLogado.nome}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={salvarAluno} className="rounded-2xl bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800">
              Salvar aluno
            </button>
            <button type="button" onClick={salvarAvaliacao} className="rounded-2xl bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800">
              Salvar avaliação
            </button>
            <button type="button" onClick={() => typeof window !== "undefined" && window.print()} className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800">
              Imprimir
            </button>
            <button type="button" onClick={limpar} className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50">
              Limpar
            </button>
            <button type="button" onClick={sair} className="rounded-2xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-50">
              Sair
            </button>
          </div>
        </header>

        <section className="mb-4 grid gap-4 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm md:grid-cols-2 print:hidden">
          <div>
            <label className="text-sm font-bold text-zinc-700">Selecionar aluno cadastrado</label>
            <select
              value={alunoSelecionadoId}
              onChange={(e) => carregarAluno(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Novo aluno</option>
              {alunos.map((aluno) => (
                <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
              ))}
            </select>
            <p className="mt-2 text-xs text-zinc-500">Alunos cadastrados: {alunos.length}</p>
          </div>

          <div>
            <label className="text-sm font-bold text-zinc-700">Histórico de avaliações</label>
            <div className="mt-1 max-h-28 overflow-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-2">
              {avaliacoes.length === 0 ? (
                <p className="text-xs text-zinc-500">Nenhuma avaliação salva ainda.</p>
              ) : (
                avaliacoes.map((avaliacao) => (
                  <button
                    key={avaliacao.id}
                    type="button"
                    onClick={() => carregarAvaliacao(avaliacao)}
                    className="mb-1 block w-full rounded-xl bg-white px-3 py-2 text-left text-xs hover:bg-blue-50"
                  >
                    <strong>{avaliacao.alunoNome}</strong> — {avaliacao.data} — IMC: {avaliacao.resultados?.imc ? avaliacao.resultados.imc.toFixed(1) : "—"}
                  </button>
                ))
              )}
            </div>
          </div>
        </section>

        <nav className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-white p-2 shadow-sm md:grid-cols-3 print:hidden">
          {abas.map((aba, index) => (
            <BotaoAba key={aba.id} ativo={abaAtual === aba.id} onClick={() => setAbaAtual(aba.id)}>
              {index + 1}. {aba.nome}
            </BotaoAba>
          ))}
        </nav>

        {abaAtual === "identificacao" && (
          <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">
              <Campo label="Nome completo" campo="nome" dados={dados} atualizar={atualizar} />
              <Campo label="Data da avaliação" campo="data" tipo="date" dados={dados} atualizar={atualizar} />
              <Campo label="Avaliador(a)" campo="avaliador" dados={dados} atualizar={atualizar} />

              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700">Sexo</label>
                <select value={dados.sexo} onChange={(e) => atualizar("sexo", e.target.value)} className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                </select>
              </div>

              <Campo label="Idade" campo="idade" sufixo="anos" dados={dados} atualizar={atualizar} />
              <Campo label="Altura" campo="altura" sufixo="cm" dados={dados} atualizar={atualizar} />
              <Campo label="Peso" campo="peso" sufixo="kg" dados={dados} atualizar={atualizar} />

              <div className="space-y-1 md:col-span-3">
                <label className="text-sm font-medium text-zinc-700">Objetivo principal</label>
                <input value={dados.objetivo} onChange={(e) => atualizar("objetivo", e.target.value)} placeholder="Ex.: emagrecimento, hipertrofia, saúde, condicionamento..." className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </div>
            </div>
          </section>
        )}

        {abaAtual === "modelo" && <ModeloAntropometrico dados={dados} atualizar={atualizar} />}

        {abaAtual === "resumo" && (
          <section>
            <div className="mb-4 grid gap-4 md:grid-cols-4">
              <CaixaResultado titulo="IMC" valor={resultados.imc ? resultados.imc.toFixed(1) : "—"} subtitulo={resultados.classificacaoIMC || "Preencha peso e altura"} />
              <CaixaResultado titulo="RCQ" valor={resultados.rcq ? resultados.rcq.toFixed(2) : "—"} subtitulo={resultados.riscoRCQ || "Preencha cintura e quadril"} />
              <CaixaResultado titulo="Soma de dobras" valor={resultados.somaDobras ? `${resultados.somaDobras.toFixed(1)} mm` : "—"} subtitulo="Controle comparativo" />
              <CaixaResultado titulo="TMB estimada" valor={resultados.tmb ? `${Math.round(resultados.tmb)} kcal` : "—"} subtitulo="Fórmula Mifflin-St Jeor" />
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-col items-center justify-between gap-4 border-b border-zinc-200 pb-4 md:flex-row">
                <LogoNina />
                <div className="text-right text-xs font-bold tracking-[0.2em] text-blue-900">CREF: 071408-G/RJ</div>
              </div>
              <h2 className="mb-3 text-xl font-bold">Resumo da avaliação</h2>
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <p><strong>Aluno(a):</strong> {dados.nome || "—"}</p>
                <p><strong>Data:</strong> {dados.data || "—"}</p>
                <p><strong>Avaliador(a):</strong> {dados.avaliador || "—"}</p>
                <p><strong>Objetivo:</strong> {dados.objetivo || "—"}</p>
                <p><strong>Peso/altura:</strong> {dados.peso || "—"} kg / {dados.altura || "—"} cm</p>
                <p><strong>Cintura/quadril:</strong> {dados.cintura || "—"} cm / {dados.quadril || "—"} cm</p>
                <p><strong>Classificação:</strong> {resultados.classificacaoIMC || "—"}</p>
              </div>

              <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-zinc-700">
                <strong>Observação profissional:</strong>
                <p className="mt-1 whitespace-pre-line">{dados.observacoes || "Sem observações registradas."}</p>
              </div>

              <p className="mt-4 text-xs text-zinc-500">
                Atenção: este app organiza dados de avaliação física e cálculos estimativos. Para banco de dados real, o próximo passo é conectar ao Supabase.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
