import { useEffect, useState } from 'react'

const estadoInicial = {
  dataVacinacao: '',
  viaAdministracao: 'Intramuscular',
  categoriaGrupoDeVacinacao: 'Adulto',
  quantidadeAplicada: 1,
  doseVacina: {
    codigoDose: '',
    descricaoDose: '',
    loteVacina: '',
    vacina: {
      codigoVacina: '',
      siglaVacina: '',
      descricaoVacina: '',
      codigoFabricante: '',
      fabricante: ''
    }
  },
  paciente: {
    codigoPaciente: '',
    sexo: '',
    raca: '',
    municipioPaciente: '',
    paisPaciente: 'BRASIL',
    ufPaciente: '',
    nacionalidade: 'BRASILEIRA',
    status: '',
    etniaIndigena: '',
    condicaoMaternal: '',
    idade: ''
  },
  estabelecimento: {
    codigoCnes: '',
    razaoSocial: '',
    nomeFantasia: '',
    municipio: '',
    uf: ''
  }
}

function FormularioVacinacao({ aoSalvar, registroEditando, aoCancelar }) {
  const [form, setForm] = useState(estadoInicial)

  useEffect(() => {
    if (registroEditando) {
      setForm({
        ...estadoInicial,
        ...registroEditando,
        doseVacina: {
          ...estadoInicial.doseVacina,
          ...registroEditando.doseVacina,
          vacina: { ...estadoInicial.doseVacina.vacina, ...registroEditando.doseVacina?.vacina }
        },
        paciente: { ...estadoInicial.paciente, ...registroEditando.paciente },
        estabelecimento: { ...estadoInicial.estabelecimento, ...registroEditando.estabelecimento }
      })
    } else {
      setForm(estadoInicial)
    }
  }, [registroEditando])

  function alterarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  function alterarDose(campo, valor) {
    setForm((atual) => ({ ...atual, doseVacina: { ...atual.doseVacina, [campo]: valor } }))
  }

  function alterarVacina(campo, valor) {
    setForm((atual) => ({
      ...atual,
      doseVacina: { ...atual.doseVacina, vacina: { ...atual.doseVacina.vacina, [campo]: valor } }
    }))
  }

  function alterarPaciente(campo, valor) {
    setForm((atual) => ({ ...atual, paciente: { ...atual.paciente, [campo]: valor } }))
  }

  function alterarEstabelecimento(campo, valor) {
    setForm((atual) => ({ ...atual, estabelecimento: { ...atual.estabelecimento, [campo]: valor } }))
  }

  function enviarFormulario(evento) {
    evento.preventDefault()
    const registro = {
      ...form,
      id: undefined,
      quantidadeAplicada: Number(form.quantidadeAplicada || 1),
      paciente: {
        ...form.paciente,
        idade: form.paciente.idade === '' ? null : Number(form.paciente.idade)
      }
    }
    aoSalvar(registro)
    if (!registroEditando) setForm(estadoInicial)
  }

  return (
    <form className="formulario" onSubmit={enviarFormulario}>
      <h3>Dados principais</h3>
      <div className="grade">
        <div className="campo"><label>Data da vacinação</label><input type="date" value={form.dataVacinacao || ''} onChange={(e) => alterarCampo('dataVacinacao', e.target.value)} required /></div>
        <div className="campo"><label>Via de administração</label><input type="text" value={form.viaAdministracao || ''} onChange={(e) => alterarCampo('viaAdministracao', e.target.value)} /></div>
        <div className="campo"><label>Grupo de Vacinacao</label><input type="text" value={form.categoriaGrupoDeVacinacao || ''} onChange={(e) => alterarCampo('categoriaGrupoDeVacinacao', e.target.value)} placeholder="Ex: Criança, Adulto, Idoso" /></div>
        <div className="campo"><label>Quantidade aplicada</label><input type="number" min="1" value={form.quantidadeAplicada || 1} onChange={(e) => alterarCampo('quantidadeAplicada', e.target.value)} /></div>
      </div>

      <h3>Vacina e dose</h3>
      <div className="grade">
        <div className="campo"><label>Descrição da vacina</label><input type="text" value={form.doseVacina.vacina.descricaoVacina || ''} onChange={(e) => alterarVacina('descricaoVacina', e.target.value)} placeholder="Ex: Influenza" required /></div>
        <div className="campo"><label>Sigla</label><input type="text" value={form.doseVacina.vacina.siglaVacina || ''} onChange={(e) => alterarVacina('siglaVacina', e.target.value)} placeholder="Ex: BCG" /></div>
        <div className="campo"><label>Fabricante</label><input type="text" value={form.doseVacina.vacina.fabricante || ''} onChange={(e) => alterarVacina('fabricante', e.target.value)} /></div>
        <div className="campo"><label>Código vacina</label><input type="text" value={form.doseVacina.vacina.codigoVacina || ''} onChange={(e) => alterarVacina('codigoVacina', e.target.value)} /></div>
        <div className="campo"><label>Dose</label><input type="text" value={form.doseVacina.descricaoDose || ''} onChange={(e) => alterarDose('descricaoDose', e.target.value)} placeholder="Ex: 1ª Dose" /></div>
        <div className="campo"><label>Lote</label><input type="text" value={form.doseVacina.loteVacina || ''} onChange={(e) => alterarDose('loteVacina', e.target.value)} /></div>
      </div>

      <h3>Paciente</h3>
      <div className="grade">
        <div className="campo"><label>Código paciente</label><input type="text" value={form.paciente.codigoPaciente || ''} onChange={(e) => alterarPaciente('codigoPaciente', e.target.value)} /></div>
        <div className="campo"><label>Idade</label><input type="number" value={form.paciente.idade ?? ''} onChange={(e) => alterarPaciente('idade', e.target.value)} /></div>
        <div className="campo"><label>Sexo</label><input type="text" value={form.paciente.sexo || ''} onChange={(e) => alterarPaciente('sexo', e.target.value)} /></div>
        <div className="campo"><label>Raça/cor</label><input type="text" value={form.paciente.raca || ''} onChange={(e) => alterarPaciente('raca', e.target.value)} /></div>
        <div className="campo"><label>Município paciente</label><input type="text" value={form.paciente.municipioPaciente || ''} onChange={(e) => alterarPaciente('municipioPaciente', e.target.value)} /></div>
        <div className="campo"><label>UF paciente</label><input type="text" maxLength="2" value={form.paciente.ufPaciente || ''} onChange={(e) => alterarPaciente('ufPaciente', e.target.value.toUpperCase())} /></div>
        <div className="campo"><label>Gestante</label><input type="text" value={form.paciente.condicaoMaternal || ''} onChange={(e) => alterarPaciente('condicaoMaternal', e.target.value.toUpperCase())} /></div>
        <div className="campo"><label>Etnia Índigena</label><input type="text" value={form.paciente.etniaIndigena || ''} onChange={(e) => alterarPaciente('etniaIndigena', e.target.value.toUpperCase())} /></div>
      </div>

      <h3>Estabelecimento</h3>
      <div className="grade">
        <div className="campo"><label>CNES</label><input type="text" value={form.estabelecimento.codigoCnes || ''} onChange={(e) => alterarEstabelecimento('codigoCnes', e.target.value)} /></div>
        <div className="campo"><label>Razão social</label><input type="text" value={form.estabelecimento.razaoSocial || ''} onChange={(e) => alterarEstabelecimento('razaoSocial', e.target.value)} /></div>
        <div className="campo"><label>Nome fantasia</label><input type="text" value={form.estabelecimento.nomeFantasia || ''} onChange={(e) => alterarEstabelecimento('nomeFantasia', e.target.value)} /></div>
        <div className="campo"><label>Município estabelecimento</label><input type="text" value={form.estabelecimento.municipio || ''} onChange={(e) => alterarEstabelecimento('municipio', e.target.value)} required /></div>
        <div className="campo"><label>UF estabelecimento</label><input type="text" maxLength="2" value={form.estabelecimento.uf || ''} onChange={(e) => alterarEstabelecimento('uf', e.target.value.toUpperCase())} required /></div>
      </div>

      <div className="acoes-form">
        <button className="botao" type="submit">{registroEditando ? 'Salvar alterações' : 'Cadastrar vacinação'}</button>
        {registroEditando && <button className="botao secundario" type="button" onClick={aoCancelar}>Cancelar edição</button>}
      </div>
    </form>
  )
}

export default FormularioVacinacao
