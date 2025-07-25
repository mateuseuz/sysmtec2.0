import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import '../../styles/Clientes.css';

function ListaOrcamentos() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarOrcamentos();
  }, []);

  const carregarOrcamentos = async () => {
    setIsLoading(true);
    try {
      const data = await api.listarOrcamentos();
      setOrcamentos(data);
    } catch (error) {
      toast.error('Erro ao carregar orçamentos: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      try {
        await api.deletarOrcamento(id);
        toast.success('Orçamento excluído com sucesso!');
        carregarOrcamentos();
      } catch (error) {
        toast.error(error.response?.data?.error || 'Erro ao excluir orçamento');
      }
    }
  };

  return (
    <div className="sysmtec-container">
      <header className="sysmtec-header">
        <h1>SYSMTEC</h1>
      </header>

      <div className="sysmtec-sidebar">
        <nav>
          <ul>
            <li><Link to="/agenda"><span>🗓️</span>Agenda</Link></li>
            <li><Link to="/clientes"><span>👥</span>Clientes</Link></li>
            <li><Link to="/ordens-servico"><span>🛠️</span>Ordens de Serviço</Link></li>
            <li className="active"><Link to="/orcamentos"><span>📄</span>Orçamentos</Link></li>
            <li><Link to="/log"><span>📋</span>Log de alterações</Link></li>
          </ul>
        </nav>
      </div>

      <main className="sysmtec-main">
        <div className="clientes-header">
          <Link to="/orcamentos/novo" className="add-client-link">
            + ADICIONAR NOVO ORÇAMENTO
          </Link>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando orçamentos...</p>
          </div>
        ) : orcamentos.length === 0 ? (
          <div className="no-results">
            <p>Nenhum orçamento cadastrado ainda</p>
          </div>
        ) : (
          <div className="clientes-table-container">
            <table className="clientes-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {orcamentos.map(orcamento => (
                  <tr key={orcamento.id_orcamento}>
                    <td>{orcamento.id_orcamento}</td>
                    <td>{orcamento.descricao}</td>
                    <td>{orcamento.valor}</td>
                    <td className="actions-cell">
                      <Link
                        to={`/orcamentos/visualizar/${orcamento.id_orcamento}`}
                        className="view-button"
                        title="Visualizar orçamento"
                      >
                        🔎
                      </Link>
                      <Link 
                        to={`/orcamentos/editar/${orcamento.id_orcamento}`} 
                        className="edit-button"
                        title="Editar orçamento"
                      >
                        ✏️
                      </Link>
                      <button 
                        onClick={() => handleExcluir(orcamento.id_orcamento)}
                        className="delete-button"
                        title="Excluir orçamento"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default ListaOrcamentos;
