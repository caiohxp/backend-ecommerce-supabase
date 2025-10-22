// Erro corrigido aqui: a importação agora é uma URL
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log('Função de e-mail iniciada.');

Deno.serve(async (req) => {
  try {
    const { pedido_id } = await req.json();

    // Chave de serviço (que você já salvou no 'secrets')
    const serviceKey = Deno.env.get('SERVICE_KEY');
    if (!serviceKey) {
      throw new Error("Chave de serviço (SERVICE_KEY) não encontrada.");
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceKey
    );

    // Busca os dados do pedido E o nome do cliente
    // (Lembre-se que sua tabela de clientes se chama 'clientes')
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        id,
        total,
        clientes ( id, nome ) 
      `)
      .eq('id', pedido_id)
      .single(); // .single() espera que venha só 1 resultado

    if (error) {
      throw new Error('Erro ao buscar pedido: ' + error.message);
    }
    
    // Checa se o cliente foi encontrado
    if (!data.clientes) {
      throw new Error("Cliente não encontrado para este pedido.");
    }

    const emailBody = `
      Olá, ${data.clientes.nome}!
      Seu pedido #${data.id} no valor de R$ ${data.total} foi confirmado!
    `;

    console.log("=== SIMULAÇÃO DE ENVIO DE E-MAIL ===");
    console.log(emailBody);
    console.log("=====================================");

    return new Response(JSON.stringify({ message: "E-mail de confirmação simulado com sucesso." }), {
      headers: { 'Content-Type': 'application/json' },
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