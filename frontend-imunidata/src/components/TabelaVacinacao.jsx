function TabelaVacinacao({ registros, aoEditar, aoExcluir, paginaAtual, totalPaginas, totalElementos, aoMudarPagina }) {

  const inicio = paginaAtual * 30 + 1
  const fim = Math.min(inicio + registros.length - 1, totalElementos)

  return (
      <div className="tabela-container">
        <table>
          <thead>
          <tr>
            <th>ID</th><th>Data</th><th>Vacina</th><th>Dose</th><th>Qtd.</th>
            <th>Idade</th><th>Grupo</th><th>Município</th><th>UF</th><th>Via</th><th>Ações</th>
          </tr>
          </thead>
          <tbody>
          {registros.length === 0 && (
              <tr><td colSpan="11" className="sem-dados">Nenhum registro encontrado.</td></tr>
          )}
          {registros.map((registro) => (
              <tr key={registro.id}>
                <td>{registro.id}</td>
                <td>{registro.dataVacinacao || '-'}</td>
                <td>{registro?.doseVacina?.vacina?.descricaoVacina || '-'}</td>
                <td>{registro?.doseVacina?.descricaoDose || '-'}</td>
                <td>{registro?.quantidadeAplicada || 1}</td>
                <td>{registro?.paciente?.idade ?? '-'}</td>
                <td>{registro?.categoriaGrupoDeVacinacao || '-'}</td>
                <td>{registro?.estabelecimento?.municipio || '-'}</td>
                <td>{registro?.estabelecimento?.uf || '-'}</td>
                <td>{registro?.viaAdministracao || '-'}</td>
                <td>
                  <div className="acoes">
                    <button className="botao pequeno" onClick={() => aoEditar(registro)}>Editar</button>
                    <button className="botao pequeno perigo" onClick={() => aoExcluir(registro.id)}>Excluir</button>
                  </div>
                </td>
              </tr>
          ))}
          </tbody>
        </table>

        {totalPaginas > 1 && (
            <div className="paginacao">
              <button className="botao secundario pequeno" onClick={() => aoMudarPagina(0)} disabled={paginaAtual === 0}>«</button>
              <button className="botao secundario pequeno" onClick={() => aoMudarPagina(paginaAtual - 1)} disabled={paginaAtual === 0}>‹</button>

              <span className="pagina-info">
            {inicio}–{fim} de {totalElementos.toLocaleString('pt-BR')} registros
          </span>

              <button className="botao secundario pequeno" onClick={() => aoMudarPagina(paginaAtual + 1)} disabled={paginaAtual + 1 >= totalPaginas}>›</button>
              <button className="botao secundario pequeno" onClick={() => aoMudarPagina(totalPaginas - 1)} disabled={paginaAtual + 1 >= totalPaginas}>»</button>
            </div>
        )}
      </div>
  )
}

export default TabelaVacinacao