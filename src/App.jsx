import React, { useMemo, useState } from "react";
import logoNina from "./img/logo.png";

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

function LogoNina({ centralizada = false }) {
  return (
    <div className={centralizada ? "flex flex-col items-center text-center" : "flex items-center gap-4"}>
      <img
        src={logoNina}
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
