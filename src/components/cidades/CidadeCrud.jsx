import axios from "axios";
import React, { Component } from "react";
import Main from "../template/Main";
import IconButton from "../template/iconButton";

const headerProps = {
  icon: "Cidades",
  title: "Cidades",
  subtitle: "Cadastro de cidades: Incluir, Listar, Alterar e Excluir!",
};

//const baseUrl = "http://localhost:3001/cidades";

const baseUrl = "https://6282b7eb92a6a5e46218f315.mockapi.io/cidades";

const initialState = {
  cidade: {
    id: parseInt(""),
    codCidade: parseInt(),
    nomeCidade: "",
    uF: "",
  },
  busca: {
    buscacidade: "",
  },
  list: [],
};

export default class CidadeCrud extends Component {
  state = {
    ...initialState,
    percent: 0,
    stageNew: false,
    mostraLista: true,
    mostraCadastrar: true,
    newCod: false,
  };

  componentWillMount() {
    axios(baseUrl).then((resp) => {
      this.setState({ list: resp.data });
    });
  }

  clear() {
    this.setState({ cidade: initialState.cidade });
  }

  save() {
    const cidade = this.state.cidade;
    const method = cidade.id ? "put" : "post";
    const url = cidade.id ? `${baseUrl}/${cidade.id}` : baseUrl;
    axios[method](url, cidade).then((resp) => {
      const list = this.getUpdatedList(resp.data);
      this.setState({ cidade: initialState.cidade, list });
    });
    this.setState({ stageNew: !this.state.stageNew });
    this.setState({ mostraCadastrar: !this.state.mostraCadastrar });
    this.setState({ mostraLista: !this.state.mostraLista });
  }

  getUpdatedList(cidade, add = true) {
    const list = this.state.list.filter((t) => t.id !== cidade.id);
    if (add) list.unshift(cidade);
    return list;
  }

  updateField(event) {
    const cidade = { ...this.state.cidade };
    cidade[event.target.name] = event.target.value;
    this.setState({ cidade });
  }
  updateProgress = (field, val) => {
    this.setState({ [field]: val });
  };

  save() {
    this.state.resVerifica ? this.salvaDados() : "";
  }

  salvaDados() {
    const cidade = this.state.cidade;
    const method = cidade.id ? "put" : "post";
    const url = cidade.id ? `${baseUrl}/${cidade.id}` : baseUrl;
    axios[method](url, cidade).then((resp) => {
      const list = this.getUpdatedList(resp.data);
      this.setState({ cidade: initialState.cidade, list });
    });
    this.setState({ stageNew: !this.state.stageNew });
    this.setState({ mostraCadastrar: !this.state.mostraCadastrar });
    this.setState({ mostraLista: !this.state.mostraLista });
  }

  setBusca(e) {
    const pesqCidade = e.toLowerCase();
    const listaCidades = this.state.list;

    var cidades = listaCidades;
    function buscarCidade(listaCidades) {
      if (
        listaCidades.nomeCidade.toLowerCase().includes(pesqCidade) ||
        listaCidades.codCidade.includes(pesqCidade)
      ) {
        return listaCidades;
      }
    }
    var pesquisado = cidades.filter(buscarCidade);
    this.setState({ list: pesquisado });
    if (!pesqCidade) {
      this.componentWillMount();
    }
  }

  botaoCadastro() {
    return (
      <div className="col-12 d-flex justify-content-start">
        <button
          className="btn btn-primary mx-2"
          onClick={() =>
            this.setState({
              stageNew: !this.state.stageNew,
              mostraLista: !this.state.mostraLista,
              mostraCadastrar: !this.state.mostraCadastrar,
              newCod: !this.state.newCod,
            })
          }
        >
          Cadastrar Cidade
        </button>
        <input
          type="text"
          className="form-control"
          value={this.pesqCidade}
          onChange={(e) => this.setBusca(e.target.value)}
          placeholder="Buscar nome ou código..."
        />
      </div>
    );
  }
  renderForm() {
    return (
      <div className="form">
        {this.state.mostraCadastrar ? this.botaoCadastro() : ""}

        {this.state.stageNew ? (
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label className="mx-2">Buscar cidade Já Cadastrada </label>
                <IconButton
                  style="info"
                  icon="search"
                  onClick={() =>
                    this.setState({
                      mostraLista: !this.state.mostraLista,
                      stageNew: !this.state.stageNew,
                      newCod: !this.state.newCod,
                    })
                  }
                ></IconButton>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>Código</label>

                <input
                  type="number"
                  className="form-control"
                  name="codCidade"
                  value={this.state.cidade.codCidade}
                  onChange={this.state.newCod ? (e) => this.updateField(e) : ""}
                  placeholder="Código"
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>Município</label>
                <input
                  type="text"
                  className="form-control"
                  name="nomeCidade"
                  value={this.state.cidade.nomeCidade}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite o nome..."
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>Estado</label>
                <input
                  type="text"
                  className="form-control"
                  name="uF"
                  value={this.state.cidade.uF}
                  onChange={(e) => this.updateField(e)}
                  placeholder="UF"
                />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="row">
          {this.state.stageNew ? (
            <div className="col-12 d-flex justify-content-end">
              <button
                className="btn btn-primary"
                onClick={
                  this.state.newCod
                    ? (e) => this.verificaCodigo(e)
                    : (e) => this.salvaDados(e)
                }
              >
                {this.state.newCod ? "Salvar" : "Alterar"}
              </button>

              <button
                className="btn btn-secondary ml-2"
                onClick={() => window.location.reload()}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div>{/* Código da condição */}</div>
          )}
          {this.state.mostraLista ? this.renderTable() : ""}
        </div>
      </div>
    );
  }
  verificaCodigo() {
    const novoCod = this.state.cidade.codCidade;
    const listaCidade = this.state.list;
    const resultConsultCod = [];
    for (let i = 0; i < listaCidade.length; ++i) {
      if (novoCod === listaCidade[i].codCidade) {
        this.state.resVerifica = false;
        i = listaCidade.length;
        window.alert("Existe outro cliente com esse código");
      } else this.state.resVerifica = true;
    }
    this.save();
  }

  load(cidade) {
    this.setState({ stageNew: !this.state.stageNew }),
      this.setState({ newCod: false }),
      this.setState({ mostraLista: !this.state.mostraLista }),
      this.setState({ mostraCadastrar: false }),
      this.setState({ cidade });
  }

  remove(cidade) {
    axios.delete(`${baseUrl}/${cidade.id}`).then((resp) => {
      const list = this.getUpdatedList(cidade, false);

      this.setState({ list });
    });
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Código</th>
            <th>Município</th>
            <th>Estado</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.state.list.map((cidade) => {
      return (
        <tr key={cidade.id}>
          <td onClick={() => this.load(cidade)}>{cidade.codCidade}</td>
          <td onClick={() => this.load(cidade)}>{cidade.nomeCidade}</td>
          <td onClick={() => this.load(cidade)}>{cidade.uF}</td>

          <td>
            <button
              className="btn btn-danger ml-2"
              onClick={() => this.remove(cidade)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  render() {
    return <Main {...headerProps}>{this.renderForm()}</Main>;
  }
}
