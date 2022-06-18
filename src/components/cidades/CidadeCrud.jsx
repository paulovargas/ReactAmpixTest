import axios from "axios";
import React, { Component, useState } from "react";
import Main from "../template/Main";
import Grid from "../../template/grid";
import IconButton from "../../template/iconButton";

const headerProps = {
  icon: "Cidades",
  title: "Cidades",
  subtitle: "Cadastro de cidades: Incluir, Listar, Alterar e Excluir!",
};

const cidadeTeste = "Santa Maria";
this.props = cidadeTeste;

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
  };

  componentWillMount() {
    console.log("Teste - componentWillMount");
    axios(baseUrl).then((resp) => {
      this.setState({ list: resp.data });
    });
  }

  listaCidades() {
    const cidadeTeste = "Santa Maria";
    console.log(cidadeTeste);
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

  search(e) {
    //console.log(this.state.cidade);
  }

  mostraLista() {}

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
            })
          }
        >
          Cadastrar Cidade
        </button>
        <input
          type="text"
          className="form-control"
          value={""}
          onChange={""}
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
                  onChange={(e) => this.updateField(e)}
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
              <button className="btn btn-primary" onClick={(e) => this.save(e)}>
                Salvar
              </button>

              <button
                className="btn btn-secondary ml-2"
                onClick={(e) => this.clear(e)}
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

  load(cidade) {
    this.setState({ stageNew: !this.state.stageNew }),
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
          </tr>
        </thead>

        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.state.list.map((cidade) => {
      return (
        <tr key={cidade.id} onClick={() => this.load(cidade)}>
          <td>{cidade.codCidade}</td>
          <td>{cidade.nomeCidade}</td>
          <td>{cidade.uF}</td>

          <td>{/* Condicão */}</td>
        </tr>
      );
    });
  }

  render() {
    return <Main {...headerProps}>{this.renderForm()}</Main>;
  }
}
