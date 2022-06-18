import React from "react";
import { Switch, Route, Redirect } from "react-router";

import Home from "../components/home/Home";
import ClienteCrud from "../components/clientes/ClienteCrud";
import CidadeCrud from "../components/cidades/CidadeCrud";

export default (props) => (
  <Switch>
    <Route exact path="/" component={Home} />

    <Route path="/clientes" component={ClienteCrud} />

    <Route path="/cidades" component={CidadeCrud} />

    <Redirect from="*" to="/" />
  </Switch>
);
