// 📄 src/services/sqlQueries.js
const SQL = {
  ATUALIZAR_SENHA_POR_CODIGO:`
    UPDATE usuarios 
    SET senha = ? 
    WHERE codigo = ?
 `,
  ATUALIZAR_SENHA_POR_LOGIN:`
    UPDATE usuarios 
    SET senha = ? 
    WHERE login = ?
 `,
  ATUALIZAR_SENHA_EXTERNO_POR_CODIGO: `
    UPDATE usuarios_externos 
    SET senha = ? 
    WHERE codigo = ?
  `,
  ATUALIZAR_SENHA_EXTERNO_POR_LOGIN:`
    UPDATE usuarios_externos
    SET senha = ? 
    WHERE login = ?
 `,
   BUSCAR_USUARIO_POR_LOGIN:`
    SELECT codigo, login, senha, nivel, ativo, nome, email
    FROM usuarios
    WHERE login = ?
    ` ,
  BUSCAR_USUARIO_EXTERNO_POR_LOGIN: `
    SELECT codigo, login, senha, nivel, ativo, nome, email, cliente_id 
    FROM usuarios_externos 
    WHERE login = ?
  `,
  BUSCAR_USUARIO_INTERNO_ATIVO:`
    SELECT * 
    FROM usuarios 
    WHERE login = ? AND ativo = 1
 `,
  BUSCAR_USUARIO_EXTERNO_ATIVO:`     
    SELECT * 
    FROM usuarios_externos 
    WHERE login = ? AND ativo = 1
 `,
  DETALHES_PROCESSO: `
    SELECT 
        p.*
      , c.nome AS cliente
      , c.email
      , c.resp_email
      , u.nome AS encarregado_nome
      , u.email AS encarregado_email
      , t.nome AS tipo_acao_nome
    FROM processos p
    JOIN clientes c ON c.codigo = p.cliente_cod
    JOIN usuarios u ON u.codigo = p.encarregado
    LEFT JOIN tipos_acao t ON t.codigo = p.tipo_acao
    WHERE p.codigo = ?
  `,
  LISTAR_USUARIOS_ATIVOS: `
    SELECT codigo, login, nome
    FROM usuarios
    WHERE ativo = 1
    ORDER BY nome
  `,
  LISTAR_USUARIOS_ATIVOS:`
    SELECT codigo, nome 
    FROM usuarios 
    WHERE ativo = 1 ORDER BY nome
  `,
  LISTAR_USUARIOS_ATIVOS_COMPLETO:`
    SELECT codigo, login, nome 
    FROM usuarios 
    WHERE ativo = 1 
    ORDER BY nome
  `,
  LISTAR_ACESSOS_BASE:`
    SELECT id, login, nivel, data_hora 
    FROM acessos 
    WHERE 1 = 1
  `,
  LISTAR_ACESSOS_POR_DATA:`
    SELECT DATE_FORMAT(data_hora, '%Y-%m-%d') AS data, COUNT(*) AS total
       FROM acessos
       GROUP BY data
       ORDER BY data DESC
       LIMIT 10
  `,
  LISTAR_ACESSOS_POR_DIA:`
      SELECT 
        DATE_FORMAT(data, '%d/%m/%Y') AS dia, 
        COUNT(*) AS total
      FROM acessos
      GROUP BY dia
      ORDER BY data DESC
      LIMIT 30
  `,
  LISTAR_ACESSOS_POR_DIA_ULTIMOS_10:`
    SELECT DATE_FORMAT(data_hora, '%Y-%m-%d') AS data, COUNT(*) AS total
    FROM acessos
    GROUP BY data
    ORDER BY data DESC
    LIMIT 10
  `,
  LISTAR_ACESSOS_POR_DIA_ULTIMOS_30:`
    SELECT DATE_FORMAT(data, '%d/%m/%Y') AS dia, COUNT(*) AS total
    FROM acessos
    GROUP BY dia
    ORDER BY data DESC
    LIMIT 30
  `,
  LISTAR_LOGINS_ATIVOS:`
    SELECT login 
    FROM usuarios 
    WHERE ativo = 1
  `,
  LISTAR_PROCESSOS_PAGINADOS: `
    SELECT 
        p.codigo
      , p.numero
      , c.nome AS cliente
      , c.codigo AS cliente_id
      , p.reu_nome AS parte_contraria
      , p.prazo
      , p.audiencia
    FROM processos p
    JOIN clientes c ON c.codigo = p.cliente_cod
    WHERE
      p.fechado = 0
      AND (? = '' OR p.numero LIKE CONCAT('%', ?, '%'))
      AND (? = '' OR c.nome LIKE CONCAT('%', ?, '%'))
      AND (? = 'Todos' OR p.encarregado = ?)  
  `,
  MONTAR_MENU: `
    SELECT * 
    FROM tab_menu 
    ORDER BY nivel, ordem
  `,

  MOVIMENTOS_PROCESSO: `
    SELECT a.*, u.nome AS altpor_nome
    FROM andamento a
    JOIN usuarios u ON u.codigo = a.altpor
    WHERE a.processo = ?
    ORDER BY a.data DESC, a.tsand DESC
  `,
  EXTRAJUD_PROCESSO: `
    SELECT e.*, u.nome AS altpor_nome
    FROM extrajud e
    JOIN usuarios u ON u.codigo = e.altpor
    WHERE e.processo = ?
    ORDER BY e.data DESC, e.tsand DESC
`
};

module.exports = SQL;
