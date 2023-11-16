import Navbar from '../../Components/navbar/navbarEstabelecimento';
import React, {useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import LogoQ from '../../img/logoquad.png';
import { FaKiwiBird } from 'react-icons/fa';
import { Formik, Form, Field } from 'formik';

function Creditos() {


  useEffect(() => {
    // Verificar se há um usuário logado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = 'http://localhost:3000/';
    }
  }, []);

  const handleClickAdicionarCredito = (values) => {
    axios.post("http://localhost:3001/oleoDisponivel", {
      email: localStorage.email,
      oleo: parseFloat(values.oleo),
      tipo: values.tipo,
    })
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Crédito adicionado com sucesso.',
        });
        console.log("Resposta do servidor:", response.data);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Erro ao adicionar crédito.',
        });
        console.error("Erro ao fazer a requisição:", error);
        if (error.response && error.response.data) {
          console.error("Mensagem de erro do servidor:", error.response.data.error);
        }
      });
  };


  return (
    <>
      <Navbar activeLink="/ComprarCredito" />
      <body>
        <div className='containerLogin'>
          <div className="boxDivisao">
            <img src={LogoQ} alt="LogoQ" className="logoQuadDivi" />
            <h2>Comprar Créditos</h2>
            <Formik
              initialValues={{
                tipo: 'novo',
                oleo: '',
              }}
              onSubmit={handleClickAdicionarCredito}
            >
              <Form className="formLogin">
                <div className="inputWrapper">
                  <i><FaKiwiBird /></i>
                  <Field
                    name="oleo"
                    type="number"
                    placeholder='OleoDisponivel'
                    className="form-field"
                  />
                </div>
                <div className="inputWrapper">
                  <Field as="select" name="tipo" className="form-field">
                    <option value="novo">Óleo Virgem</option>
                    <option value="usado">Óleo Usado</option>
                  </Field>
                </div>
                <button type="submit">Adicionar Crédito</button>
              </Form>
            </Formik>
          </div>
        </div>
      </body>
    </>
  );
}

export default Creditos;
