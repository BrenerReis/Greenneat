import React, { useState } from 'react';
import LogoQ from '../../img/logoquad.png';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import Swal from 'sweetalert2';

const validationCadastro = yup.object().shape({
  cnpj: yup.string().required('CNPJ é obrigatório').length(14, 'CPNJ inválido').matches(/^\d+$/, 'CNPJ deve conter apenas números'),
  nomeOrganizacao: yup.string().required('Nome da organização é obrigatório'),
  email: yup.string().email('Insira um e-mail válido').required('E-mail é obrigatório'),
  senha: yup.string().required('Senha é obrigatório').min(8, 'Senha deve ter 8 caracteres no mínimo'),
  confirmSenha: yup.string().required('Confirme sua senha').oneOf([yup.ref('senha'), null], 'As senhas não são iguais'),
});

function FormEstabelecimento() {
  const [reloadPage, setReloadPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickRegister = async (values, { resetForm }) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3001/registerEstabelecimento', {
        cnpj: values.cnpj,
        nomeOrganizacao: values.nomeOrganizacao,
        email: values.email,
        endereco: values.endereco,
        cidade: values.cidade,
        horariosFuncionamento: values.horariosFuncionamento,
        possuiParceiros: values.possuiParceiros,
        senha: values.senha,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Usuário registrado com sucesso',
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          setReloadPage(true);
        }, 3000);
        resetForm();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao registrar usuário',
          text: 'Algo deu errado. Tente novamente mais tarde.',
          confirmButtonColor: '#fc5d00',
        });
      }
    } catch (error) {
      console.error(error);

      let errorMessage = 'Algo deu errado. Tente novamente mais tarde.';

      if (error.response && error.response.status === 400) {
        if (error.response.data.message.includes('Email')) {
          errorMessage = 'Email já cadastrado. Por favor, escolha outro email';
        } else if (error.response.data.message.includes('CNPJ')) {
          errorMessage = 'CNPJ já cadastrado. Por favor, escolha outro CNPJ';
        }
      }

      Swal.fire({
        icon: 'error',
        text: errorMessage,
        confirmButtonColor: '#FF0000',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCEPBlur = async (cepValue, setFieldValue) => {
    try {
      const cepResponse = await axios.get(`https://viacep.com.br/ws/${cepValue}/json/`);

      if (!cepResponse.data.erro) {
        setFieldValue('endereco', `${cepResponse.data.logradouro}, ${cepResponse.data.bairro}`);
        setFieldValue('cidade', cepResponse.data.localidade);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (reloadPage) {
    window.location.reload();
  }

  function ShowLogin() {
    let formEstabelecimento = document.querySelector('#containerEstabelecimento');
    let DivisaoAnte = document.querySelector('#divisaoAnte');
    formEstabelecimento.classList.add('hide');
    DivisaoAnte.classList.remove('hide');
  }

  return (
    <>
      <div id='containerEstabelecimento' className='containerCadastro hide'>
        <img src={LogoQ} alt='LogoQ' className='logoQuad' />
        <h3>Crie sua conta como estabelecimento:</h3>
        <Formik initialValues={{}} onSubmit={handleClickRegister} validationSchema={validationCadastro}>
          {({ errors, touched, setFieldValue }) => (
            <Form className='formCadastro'>
              <div className='inputWrapper'>
                <Field type='text' name='cnpj' placeholder='CNPJ' className='form-field' />
              </div>

              <div className='inputWrapper'>
                <Field type='text' name='nomeOrganizacao' placeholder='Nome da organização' className='form-field' />
              </div>

              <div className='inputWrapper'>
                <Field type='text' name='email' placeholder='Email' className='form-field' />
              </div>

              <div className='inputWrapper'>
                <Field
                  type='text'
                  name='cep'
                  placeholder='CEP'
                  className='form-field'
                  onBlur={(e) => {
                    const cepValue = e.target.value.replace(/\D/g, ''); 
                    if (cepValue.length === 8) {
                      handleCEPBlur(cepValue, setFieldValue);
                    }
                  }}
                />
              </div>

              <div className='inputWrapper'>
                <Field type='text' name='endereco' placeholder='Endereço' className='form-field' />
              </div>

              <div className='inputWrapper'>
                <Field type='text' name='cidade' placeholder='Sua Cidade' className='form-field' />
              </div>

              <div className='inputWrapper'>
                <Field type='text' name='horariosFuncionamento' placeholder='Seus Horários e dias de funcionamento' className='form-field' />
              </div>

              <div className='inputWrapper'>
                <Field type='text' name='possuiParceiros' placeholder='Possui algum parceiro para a coleta no local?' className='form-field' />
              </div>

              <div className='inputWrapper'>
                <Field type='password' name='senha' placeholder='Defina uma senha' className='form-field' />
              </div>

              <div className='inputWrapper'>
                <Field type='password' name='confirmSenha' placeholder='Confirme sua senha' className='form-field' />
              </div>

              <ErrorMessage name='cnpj' component='span' className='form-error' />
              <ErrorMessage name='nomeOrganizacao' component='span' className='form-error' />
              <ErrorMessage name='email' component='span' className='form-error' />
              <ErrorMessage name='senha' component='span' className='form-error' />
              <ErrorMessage name='confirmSenha' component='span' className='form-error' />

              <button type='submit' disabled={loading}>
                {loading ? 'Aguarde...' : 'Criar Conta'}
              </button>
            </Form>
          )}
        </Formik>
        <h4 style={{marginTop: "5%"}}>
          Já possui uma conta?
          <button onClick={ShowLogin} className='cadastre'>
            Conecte-se
          </button>
        </h4>

       
      </div>
    </>
  );
}

export default FormEstabelecimento;