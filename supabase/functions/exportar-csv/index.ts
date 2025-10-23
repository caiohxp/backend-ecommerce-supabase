import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    // Cria um cliente Supabase com a autenticação do usuário
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Pega o ID do usuário que está logado e pedindo o CSV
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    // Busca os pedidos desse cliente (usando a View que criamos!)
    const { data: pedidos, error } = await supabase
      .from('pedidos_detalhados') // Usando a View!
      .select('*')
      .eq('cliente_id', user.id); 

    if (error) {
      throw new Error('Erro ao buscar pedidos: ' + error.message);
    }

    // Converte os dados (JSON) para uma string CSV
    let csvString = "pedido_id,data_criacao,status,total\n"; // Cabeçalho do CSV

    for (const pedido of pedidos) {
      csvString += `${pedido.pedido_id},${pedido.created_at},${pedido.status},${pedido.total}\n`;
    }

    // Retorna o CSV como um arquivo de texto
    return new Response(csvString, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="meus_pedidos.csv"'
      },
      status: 200,
    });

  } catch (e) {
    console.error(e.message); // Loga o erro para depuração
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});