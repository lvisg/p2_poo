package br.com.fatec.apiimunidata.service;

import br.com.fatec.apiimunidata.dto.RegistroVacinacaoDTO;
import br.com.fatec.apiimunidata.model.*;
import br.com.fatec.apiimunidata.repository.RegistroVacinacaoRepository;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Iterator;

@Service
public class DadosService {

    @Autowired
    private final RegistroVacinacaoRepository registroVacinacaoRepository;
    public DadosService(RegistroVacinacaoRepository registroVacinacaoRepository){
        this.registroVacinacaoRepository = registroVacinacaoRepository;
    }
    @PersistenceContext
    private EntityManager entityManager;
    @EventListener(ApplicationReadyEvent.class)
    @Transactional // Garante o controle da transação para o batching
    public void carregarDados() throws IOException {
        if (registroVacinacaoRepository.count() > 0) return;

        ClassPathResource resource = new ClassPathResource("dados/vacinacoes.csv");
        int batchSize = 5000;
        int contador = 0;

        try (Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.ISO_8859_1)) {

            CsvToBean<RegistroVacinacaoDTO> csvToBean = new CsvToBeanBuilder<RegistroVacinacaoDTO>(reader)
                    .withSeparator(';')
                    .withType(RegistroVacinacaoDTO.class)
                    .withIgnoreLeadingWhiteSpace(true)
                    .withIgnoreEmptyLine(true)
                    .build();

            // Usamos o iterator para processar LINHA POR LINHA sem carregar o arquivo todo na RAM
            Iterator<RegistroVacinacaoDTO> iterator = csvToBean.iterator();

            while (iterator.hasNext()) {
                RegistroVacinacaoDTO dto = iterator.next();
                RegistroVacinacao entidade = converte(dto);

                entityManager.persist(entidade);
                contador++;

                // A cada 5.000 registros, envia pro banco e limpa a memória
                if (contador % batchSize == 0) {
                    entityManager.flush();
                    entityManager.clear();
                    System.out.println("⏳ " + contador + " registros processados...");
                }
            }

            // Flush final para o que sobrou
            entityManager.flush();
            entityManager.clear();
            System.out.println("✅ Total de " + contador + " registros carregados com sucesso!");
        }
    }
    private RegistroVacinacao converte(RegistroVacinacaoDTO dto) {
        RegistroVacinacao r = new RegistroVacinacao();

        r.setViaAdministracao(dto.getViaAdministracao());
        r.setCategoriaGrupoDeVacinacao(dto.getCategoriaGrupoVacinacao());

        if (dto.getDataVacina() != null && !dto.getDataVacina().isBlank()) {
            String dataLimpa = dto.getDataVacina().substring(0, 10);
            r.setDataVacinacao(LocalDate.parse(dataLimpa));
        }

        Paciente paciente = new Paciente();
        paciente.setCodigoPaciente(dto.getCodigoPaciente());
        paciente.setSexo(dto.getSexoPaciente());
        paciente.setRaca(dto.getRacaPaciente());
        paciente.setMunicipio(dto.getMunicipioPaciente());
        paciente.setPaisPaciente(dto.getPaisPaciente());
        paciente.setUfPaciente(dto.getUfPaciente());
        paciente.setNacionalidade(dto.getNacionalidadePaciente());
        paciente.setCondicaoMaternal(dto.getCondicaoMaternal());
        paciente.setIdade(dto.getIdadePaciente());
        r.setPaciente(paciente);

        Estabelecimento est = new Estabelecimento();
        est.setCodigoCnes(dto.getCodigoCnes());
        est.setRazaoSocial(dto.getRazaoSocial());
        est.setNomeFantasia(dto.getNomeFantasia());
        est.setMunicipio(dto.getMunicipioEstabelecimento());
        est.setUf(dto.getUfEstabelecimento());
        r.setEstabelecimento(est);

        Vacina vacina = new Vacina();
        vacina.setCodigoVacina(dto.getCodigoVacina());
        vacina.setSiglaVacina(dto.getSiglaVacina());
        vacina.setDescricaoVacina(dto.getDescricaoVacina());
        vacina.setCodigoFabricante(dto.getCodigoFabricante());
        vacina.setFabricante(dto.getFabricante());

        DoseVacina dose = new DoseVacina();
        dose.setCodigoDose(dto.getCodigoDose());
        dose.setDescricaoDose(dto.getDescricaoDose());
        dose.setLoteVacina(dto.getLoteVacina());
        dose.setVacina(vacina);
        r.setDoseVacina(dose);

        return r;
    }
}