import axios from "axios";
import React, { Component, useState } from "react";
import Main from "../template/Main";
import IconButton from "../../template/iconButton";

const headerProps = {
  icon: "Clientes",
  title: "Clientes",
  subtitle: "Cadastro de clientes: Incluir, Listar, Alterar e Excluir!",
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
    percent: 0,
    stageNew: false,
    mostraLista: true,
    mostraListaCidades: false,
    mostraCadastrar: true,
    novoCadastro: false,
    salvarDados: false,
    pesqCliente: "",
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
    console.log("Receba =", e);
    this.pesqCliente = e;
    console.log("Cliente:", this.state.list);
    const pescaCliente = this.pesqCliente;
    const clientesLista = this.state.list;
    const filtroCliente = clientesLista.filter((pesq) => pesq === pescaCliente);
    console.log("Clientes:", filtroCliente);
    this.state.list = filtroCliente;
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
    console.log("Lista de cidades =", this.state.listCidades);
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
                  name="codCliente"
                  value={this.state.cliente.codCliente}
                  onChange={(e) => this.updateField(e)}
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
                  name=""
                  value={this.state.cidadeCliente.nomeCidade}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Município"
                />
                {console.log(
                  "Município :",
                  this.state.cidadeCliente.nomeCidade
                )}
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>Estado</label>

                <input
                  type="text"
                  className="form-control"
                  name="nomeCliente"
                  value={this.state.cidadeCliente.uF}
                  onChange={(e) => this.updateField(e)}
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
                {console.log("Município :", this.state.cidadeCliente.id)}
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
                onClick={(e) => this.verificaCodigo(e)}
              >
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
            <div>
              {/**/}
              {/*  */}
            </div>
          )}
          {this.state.mostraLista ? this.renderTable() : ""}
          {this.state.mostraListaCidades ? this.renderTableCidades() : ""}
        </div>
      </div>
    );
  }

  verificaCodigo() {
    console.log("Codigo Cliente:", this.state.cliente.codCliente);

    const novoCod = this.state.cliente.codCliente;

    const listaClientes = this.state.list;

    console.log("Lista cliente :", listaClientes);

    function codigoDoCliente(value) {
      if (value.codCliente === novoCod) {
        console.log("Código Value: ", value.codCliente);
        console.log("Código Novo: ", novoCod);
        window.alert("Existe outro cliente com esse código");
        return false;
      }
      value.codCliente = novoCod;
      return true;
    }
    const codiCliente = listaClientes.filter(codigoDoCliente);
    codiCliente.forEach((e) => {
      e;
      console.log("Código e: ", e);
    });
  }

  load(cliente) {
    console.log("Cidade Id", cliente.cityId);

    const listaCidades = this.state.listCidades;
    console.log("Cidade state", listaCidades);

    function cidadeDoCliente(value) {
      if (value.id == cliente.cityId) {
        console.log("Cidade Cliente", value);
        return value;
      }
    }
    const cidadeCliente = listaCidades.filter(cidadeDoCliente);
    cidadeCliente.forEach((e) => {
      e;
      console.log("Cidade Cliente", (this.state.cidadeCliente = e));
    });

    this.setState({ stageNew: !this.state.stageNew }),
      this.setState({ mostraLista: !this.state.mostraLista }),
      this.setState({ mostraCadastrar: false }),
      this.setState({ cliente });
  }

  loadCidade(cidade) {
    console.log("Cidade selecionada :", cidade);
    //this.setState({ cidadeCliente: cidade });
    this.state.cidadeCliente = cidade;
    console.log("Cidade do cliente :", this.state.cidadeCliente);
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
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.state.list.map((cliente) => {
      return (
        <tr key={cliente.id} onClick={() => this.load(cliente)}>
          <td>{cliente.codCliente}</td>
          <td>{cliente.nomeCliente}</td>

          <td></td>
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

          <td>{/* Condicão */}</td>
        </tr>
      );
    });
  }

  render() {
    return <Main {...headerProps}>{this.renderForm()}</Main>;
  }
}
