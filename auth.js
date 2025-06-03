// Define o e-mail fixo do administrador
const ADMIN_EMAIL = 'admin@msvisual.com';
// Define a senha fixa do administrador
// Atenção: em ambientes reais, nunca deixe a senha hardcoded no código por questões de segurança!
const ADMIN_SENHA = '123456';

// Função que recebe email e senha e verifica se são iguais aos dados do administrador
function autenticar(email, senha) {
  // Retorna true se o email e senha coincidirem com os valores definidos, senão false
  return email === ADMIN_EMAIL && senha === ADMIN_SENHA;
}

// Exporta a função para que possa ser usada em outros arquivos da aplicação
module.exports = autenticar;
