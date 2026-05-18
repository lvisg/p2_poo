import { useEffect, useMemo, useState } from 'react'
import {
  atualizarRegistro,
  buscarPorId,
  cadastrarRegistro,
  contarRegistros,
  excluirRegistro,
  listarRegistros
} from './api/vacinacaoApi'

import Filtros from './components/Filtros'
import FormularioVacinacao from './components/FormularioVacinacao'
import GraficoResumo from './components/GraficoResumo'
import TabelaVacinacao from './components/TabelaVacinacao'

function App() {
  const [registros, setRegistros] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [totalBanco, setTotalBanco] = useState(0)

  const [paginaAtual, setPaginaAtual] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [totalElementos, setTotalElementos] = useState(0)

  const [busca, setBusca] = useState('')
  const [filtroVacina, setFiltroVacina] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroFaixaEtaria, setFiltroFaixaEtaria] = useState('')

  const [registroEditando, setRegistroEditando] = useState(null)
  const [idBusca, setIdBusca] = useState('')

  useEffect(() => {
    contarRegistros().then(setTotalBanco).catch(() => {})
  }, [])


  async function carregarDados(page = 0) {
    try {
      setCarregando(true)
      setErro('')

      if (busca) {
        try {
          const registro = await buscarPorId(busca)
          setRegistros([registro])
          setTotalPaginas(1)
          setTotalElementos(1)
          setPaginaAtual(0)
        } catch (err) {
          setRegistros([])
          setTotalPaginas(0)
          setTotalElementos(0)
          setPaginaAtual(0)
          if (err.response?.status !== 404) {
            setErro('registro pelo ID.')
          }
        }
        return
      }
      const dados = await listarRegistros(
          { vacina: filtroVacina, estado: filtroEstado, faixaEtaria: filtroFaixaEtaria },
          page
      )

      setRegistros(Array.isArray(dados.content) ? dados.content : [])
      setTotalPaginas(dados.totalPages || 0)
      setTotalElementos(dados.totalElements || 0)
      setPaginaAtual(dados.number || 0)

    } catch (error) {
      setErro('Erro ao carregar dados. Verifique se a API Spring Boot está rodando em http://localhost:8080.')
      setRegistros([])
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    const tempo = setTimeout(() => carregarDados(0), 350)
    return () => clearTimeout(tempo)
  }, [busca, filtroVacina, filtroEstado, filtroFaixaEtaria])

  const totais = useMemo(() => {
    const estados = new Set()
    const vacinas = new Set()
    let quantidade = 0
    registros.forEach((registro) => {
      const uf = registro?.estabelecimento?.uf
      const vacina = registro?.doseVacina?.vacina?.descricaoVacina
      const qtd = registro?.quantidadeAplicada || 1
      quantidade += qtd
      if (uf) estados.add(uf)
      if (vacina) vacinas.add(vacina)
    })
    return { total: registros.length, estados: estados.size, vacinas: vacinas.size, quantidade }
  }, [registros])

  async function salvarRegistro(registro) {
    try {
      setErro('')
      setMensagem('')
      if (registroEditando) {
        await atualizarRegistro(registroEditando.id, registro)
        setMensagem('Registro atualizado com sucesso.')
        setRegistroEditando(null)
      } else {
        await cadastrarRegistro(registro)
        setMensagem('Registro cadastrado com sucesso.')
      }
      await carregarDados(paginaAtual)
      contarRegistros().then(setTotalBanco).catch(() => {})
    } catch (error) {
      setErro('Erro ao salvar registro. Verifique se todos os campos obrigatórios foram preenchidos.')
    }
  }

  async function deletarRegistro(id) {
    const confirmar = window.confirm(`Deseja excluir o registro ID ${id}?`)
    if (!confirmar) return
    try {
      setErro('')
      setMensagem('')
      await excluirRegistro(id)
      setMensagem('Registro excluído com sucesso.')
      await carregarDados(paginaAtual)
      contarRegistros().then(setTotalBanco).catch(() => {})
    } catch (error) {
      setErro('Erro ao excluir registro.')
    }
  }

  function editarRegistro(registro) {
    setRegistroEditando(registro)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function limparFiltros() {
    setBusca('')
    setFiltroVacina('')
    setFiltroEstado('')
    setFiltroFaixaEtaria('')
  }

  async function testar404() {
    try {
      setErro('')
      setMensagem('')
      if (!idBusca) { setErro('Digite um ID para buscar.'); return }
      const registro = await buscarPorId(idBusca)
      setMensagem(`Registro encontrado: ID ${registro.id}`)
    } catch (error) {
      if (error.response?.status === 404) {
        setErro(`404 Not Found: não existe registro com ID ${idBusca}.`)
      } else {
        setErro('Erro ao buscar registro por ID.')
      }
    }
  }

  return (
      <div className="app">
        <header className="topo">
          <div>
            <h1>ImuniData</h1>
            <p>Dashboard de vacinação com React + Spring Boot</p>
          </div>
          <div className="topo-acoes">
            <button className="botao secundario" onClick={() => carregarDados(paginaAtual)}>Atualizar dados</button>
          </div>
        </header>

        {erro && <div className="alerta erro">{erro}</div>}
        {mensagem && <div className="alerta sucesso">{mensagem}</div>}

        <section className="cards">
          <div className="card"><span>Total no banco</span><strong>{totalBanco.toLocaleString('pt-BR')}</strong></div>
          <div className="card"><span>Exibidos (página)</span><strong>{registros.length}</strong></div>
          <div className="card"><span>Aplicações</span><strong>{totais.quantidade}</strong></div>
          <div className="card"><span>Estados</span><strong>{totais.estados}</strong></div>
          <div className="card"><span>Tipos de vacina</span><strong>{totais.vacinas}</strong></div>
        </section>

        <section className="painel">
          <h2>{registroEditando ? 'Editar registro' : 'Cadastrar nova vacinação'}</h2>
          <FormularioVacinacao
              aoSalvar={salvarRegistro}
              registroEditando={registroEditando}
              aoCancelar={() => setRegistroEditando(null)}
          />
        </section>

        <GraficoResumo />

        <section className="painel">
          <h2>Teste de erro 404</h2>
          <div className="linha">
            <input
                type="number"
                placeholder="Digite um ID inexistente. Ex: 99999"
                value={idBusca}
                onChange={(e) => setIdBusca(e.target.value)}
            />
            <button className="botao" onClick={testar404}>Buscar ID</button>
          </div>
        </section>
        <section className="painel">
          <h2>Filtros em tempo real pela API</h2>
          <Filtros
              busca={busca} setBusca={setBusca}
              filtroVacina={filtroVacina} setFiltroVacina={setFiltroVacina}
              filtroEstado={filtroEstado} setFiltroEstado={setFiltroEstado}
              filtroFaixaEtaria={filtroFaixaEtaria} setFiltroFaixaEtaria={setFiltroFaixaEtaria}
              limparFiltros={limparFiltros}
          />
        </section>

        <section className="painel">
          <h2>Histórico de vacinação</h2>
          {carregando ? <p>Carregando registros...</p> : (
              <TabelaVacinacao
                  registros={registros}
                  aoEditar={editarRegistro}
                  aoExcluir={deletarRegistro}
                  paginaAtual={paginaAtual}
                  totalPaginas={totalPaginas}
                  totalElementos={totalElementos}
                  aoMudarPagina={(p) => carregarDados(p)}
              />
          )}
        </section>


      </div>
  )
}

export default App