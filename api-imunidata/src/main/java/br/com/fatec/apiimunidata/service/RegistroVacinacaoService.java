package br.com.fatec.apiimunidata.service;

import br.com.fatec.apiimunidata.model.RegistroVacinacao;
import br.com.fatec.apiimunidata.repository.RegistroVacinacaoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RegistroVacinacaoService {
    private final RegistroVacinacaoRepository registroVacinacaoRepository;
    public RegistroVacinacaoService(RegistroVacinacaoRepository registroVacinacaoRepository){
        this.registroVacinacaoRepository=registroVacinacaoRepository;
    }
    public Page<RegistroVacinacao> listar(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return registroVacinacaoRepository.findAll(pageable);
    }
    public Optional<RegistroVacinacao> carregarId(Integer id){
        return this.registroVacinacaoRepository.findById(id);
    }
    public void deletar(Integer id){
        this.registroVacinacaoRepository.deleteById(id);
    }
    public RegistroVacinacao salvar(RegistroVacinacao registroVacinacao){
        return this.registroVacinacaoRepository.save(registroVacinacao);
    }
    public Optional<RegistroVacinacao> alterar(RegistroVacinacao registroVacinacao, Integer id){
        return registroVacinacaoRepository.findById(id).map(obj->{
            obj.setDataVacinacao(registroVacinacao.getDataVacinacao());
            obj.setDoseVacina(registroVacinacao.getDoseVacina());
            obj.setPaciente(registroVacinacao.getPaciente());
            obj.setEstabelecimento(registroVacinacao.getEstabelecimento());
            obj.setCategoriaGrupoDeVacinacao(registroVacinacao.getCategoriaGrupoDeVacinacao());
            obj.setViaAdministracao(registroVacinacao.getViaAdministracao());
            return registroVacinacaoRepository.save(obj);
        });
    }
    public Page<RegistroVacinacao> buscaPorUf(String uf, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return registroVacinacaoRepository.findRegistroVacinacaoByUf(uf, pageable);
    }
    public Page<RegistroVacinacao> buscaPorFaixaEtaria(String faixaEtaria, int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        if(faixaEtaria.equals("Criança")){
            return registroVacinacaoRepository.findRegistroVacinacaoByFaixaEtaria(0,12, pageable);
        } else if (faixaEtaria.equals("Adolescente")) {
            return registroVacinacaoRepository.findRegistroVacinacaoByFaixaEtaria(12,18, pageable);
        }else if (faixaEtaria.equals("Adulto")){
            return registroVacinacaoRepository.findRegistroVacinacaoByFaixaEtaria(18,65, pageable);
        }
        return registroVacinacaoRepository.findRegistroVacinacaoByFaixaEtaria(65,999, pageable);
    }
}

