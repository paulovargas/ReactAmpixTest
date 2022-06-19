import axios from "axios";
import React, { Component, useState } from "react";
import Main from "../template/Main";
import IconButton from "../../template/iconButton";

const headerProps = {
  icon: "Clientes",
  title: "Clientes",
  subtitle: "Cadastro de clientes: Incluir, Listar, Alterar e Excluir!",
  list: [],
};

const baseUrlCidades = "https://6282b7eb92a6a5e46218f315.mockapi.io/cidades";
//const baseUrlCidades = "http://localhost:3001/cidades";

const baseUrl = "https://6282b7eb92a6a5e46218f315.mockapi.io/clientes";
//const baseUrl = "http://localhost:3001/clientes";

const initialState = {
  cliente: {
    id: parseInt(""),
    codCliente: parseInt(),
    nomeCliente: "",
    ende: "",
    numEnde: "",
    bairro: "",
    cep: "",
    cityId: "",
  },

  cidade: {
    id: parseInt(""),
    codCidade: parseInt(),
    nomeCidade: "",
    uF: "",
  },

  cidadeCliente: {
    id: parseInt(""),
    codCidade: parseInt(),
    nomeCidade: "",
    uF: "",
  },

  busca: {
    buscaCliente: "",
  },

  list: [],

  listCidades: [],
};

export default class ClienteCrud extends Component {
  state = {
    ...initialState,
    stageNew: false,
    mostraLista: true,
    mostraListaCidades: false,
    mostraCadastrar: true,
    novoCadastro: false,
    salvarDados: false,
    pesqCliente: "",
    cidadeCliente: "",
    resVerifica: false,
    newCod: false,
  };

  componentWillMount() {
    axios(baseUrl).then((resp) => {
      this.setState({ list: resp.data });
    });
    axios(baseUrlCidades).then((resp) => {
      this.setState({ listCidades: resp.data });
    });
  }

  clear() {
    this.setState({ cliente: initialState.cliente });
  }

  save() {
    this.state.resVerifica ? this.salvaDados() : "";
  }

  salvaDados() {
    const cliente = this.state.cliente;
    const method = cliente.id ? "put" : "post";
    const url = cliente.id ? `${baseUrl}/${cliente.id}` : baseUrl;
    axios[method](url, cliente).then((resp) => {
      const list = this.getUpdatedList(resp.data);
      this.setState({ cliente: initialState.cliente, list });
    });
    this.setState({ stageNew: !this.state.stageNew });
    this.setState({ mostraCadastrar: !this.state.mostraCadastrar });
    this.setState({ mostraLista: !this.state.mostraLista });
  }

  getUpdatedList(cliente, add = true) {
    const list = this.state.list.filter((t) => t.id !== cliente.id);
    if (add) list.unshift(cliente);
    return list;
  }

  updateField(event) {
    const cliente = { ...this.state.cliente };
    cliente[event.target.name] = event.target.value;
    this.setState({ cliente });
  }
  updateProgress = (field, val) => {
    this.setState({ [field]: val });
  };

  setBusca(e) {
    const pesqCliente = e.toLowerCase();
    const listaClientes = this.state.list;

    var clientes = listaClientes;
    function buscarCliente(listaClientes) {
      if (listaClientes.nomeCliente.toLowerCase().includes(pesqCliente)) {
        return listaClientes;
      }
    }
    var pesquisado = clientes.filter(buscarCliente);
    this.setState({ list: pesquisado });
    if (!pesqCliente) {
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
          Cadastrar cliente
        </button>

        <input
          type="text"
          className="form-control"
          value={this.pesqCliente}
          onChange={(e) => this.setBusca(e.target.value)}
          placeholder="Buscar nome ou código..."
        />
      </div>
    );
  }

  buscaCidade() {
    this.setState({
      stageNew: !this.state.stageNew,
      mostraListaCidades: !this.state.mostraListaCidades,
    });
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
          </tr>
        </thead>

        <tbody>{this.renderRows()}</tbody>
      </table>
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
                <label className="mx-2">Buscar Cliente Já Cadastrado </label>
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

            <div className="col-12 col-md-6" id="formulario" name="formulario">
              <div className="form-group">
                <label>Código</label>
                <input
                  type="number"
                  className="form-control"
                  name="codCliente"
                  value={this.state.cliente.codCliente}
                  onChange={this.state.newCod ? (e) => this.updateField(e) : ""}
                  placeholder="Código"
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>Nome</label>

                <input
                  type="text"
                  className="form-control"
                  name="nomeCliente"
                  value={this.state.cliente.nomeCliente}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite o nome..."
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>Endereço</label>

                <input
                  type="text"
                  className="form-control"
                  name="ende"
                  value={this.state.cliente.ende}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Endereço"
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>N°</label>
                <input
                  type="text"
                  className="form-control"
                  name="numEnde"
                  value={this.state.cliente.numEnde}
                  onChange={(e) => this.updateField(e)}
                  placeholder="N°"
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>Bairro</label>

                <input
                  type="text"
                  className="form-control"
                  name="bairro"
                  value={this.state.cliente.bairro}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite o bairro..."
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>CEP</label>

                <input
                  type="text"
                  className="form-control"
                  name="cep"
                  value={this.state.cliente.cep}
                  onChange={(e) => this.updateField(e)}
                  placeholder="CEP"
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label className="mx-2">Município</label>
                <IconButton
                  style="info"
                  icon="search"
                  onClick={() => this.buscaCidade()}
                ></IconButton>
                <input
                  icon="search"
                  type="text"
                  className="form-control"
                  value={this.state.cidadeCliente.nomeCidade}
                  placeholder="Município"
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>Estado</label>

                <input
                  type="text"
                  className="form-control"
                  value={this.state.cidadeCliente.uF}
                  placeholder="Estado"
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <input
                  type="hidden"
                  className="form-control"
                  name="cityId"
                  value={this.state.cidadeCliente.id}
                  onChange={
                    (this.state.cliente.cityId = this.state.cidadeCliente.id)
                  }
                  placeholder={this.state.cidadeCliente.id}
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
                onClick={(e) => this.clear(e)}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div></div>
          )}
          {this.state.mostraLista ? this.renderTable() : ""}
          {this.state.mostraListaCidades ? this.renderTableCidades() : ""}
        </div>
      </div>
    );
  }

  verificaCodigo() {
    const novoCod = this.state.cliente.codCliente;
    const listaClientes = this.state.list;
    const resultConsultCod = [];
    for (let i = 0; i < listaClientes.length; ++i) {
      if (novoCod === listaClientes[i].codCliente) {
        this.state.resVerifica = false;
        i = listaClientes.length;
        window.alert("Existe outro cliente com esse código");
      } else this.state.resVerifica = true;
    }
    this.save();
  }

  load(cliente) {
    const listaCidades = this.state.listCidades;

    function cidadeDoCliente(value) {
      if (value.id == cliente.cityId) {
        return value;
      }
    }
    const cidadeCliente = listaCidades.filter(cidadeDoCliente);
    cidadeCliente.forEach((e) => {
      e;
      this.state.cidadeCliente = e;
    });

    this.setState({ stageNew: !this.state.stageNew }),
      this.setState({ newCod: false }),
      this.setState({ mostraLista: !this.state.mostraLista }),
      this.setState({ mostraCadastrar: false }),
      this.setState({ cliente });
  }

  loadCidade(cidade) {
    this.state.cidadeCliente = cidade;
    this.setState({
      stageNew: !this.state.stageNew,
      mostraListaCidades: !this.state.mostraListaCidades,
    });
  }

  remove(cliente) {
    axios.delete(`${baseUrl}/${cliente.id}`).then((resp) => {
      const list = this.getUpdatedList(cliente, false);

      this.setState({ list });
    });
  }

  renderTableCidades() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Código</th>
            <th>Município</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>{this.renderRowsCidade()}</tbody>
      </table>
    );
  }
  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.state.list.map((cliente) => {
      return (
        <tr key={cliente.id}>
          <td onClick={() => this.load(cliente)}>{cliente.codCliente}</td>
          <td onClick={() => this.load(cliente)}>{cliente.nomeCliente}</td>

          <td>
            <button
              className="btn btn-danger ml-2"
              onClick={() => this.remove(cliente)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  renderRowsCidade() {
    return this.state.listCidades.map((cidade) => {
      return (
        <tr key={cidade.id} onClick={() => this.loadCidade(cidade)}>
          <td>{cidade.codCidade}</td>
          <td>{cidade.nomeCidade}</td>
          <td>{cidade.uF}</td>
        </tr>
      );
    });
  }

  render() {
    return <Main {...headerProps}>{this.renderForm()}</Main>;
  }
}
