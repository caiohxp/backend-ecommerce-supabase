CREATE TABLE public.clientes (
  id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  data_criacao timestamp with time zone NOT NULL DEFAULT now(),
  nome text NOT NULL DEFAULT ''::text,
  email text NOT NULL DEFAULT ''::text,
  CONSTRAINT clientes_pkey PRIMARY KEY (id),
  CONSTRAINT clientes_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.pedido_itens (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  pedido_id bigint NOT NULL,
  produto_id bigint NOT NULL,
  quantidade integer NOT NULL DEFAULT 0,
  preco_unitario numeric NOT NULL DEFAULT '0'::numeric,
  CONSTRAINT pedido_itens_pkey PRIMARY KEY (id),
  CONSTRAINT pedido_itens_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id),
  CONSTRAINT pedido_itens_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produtos(id)
);
CREATE TABLE public.pedidos (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  data_pedido timestamp with time zone NOT NULL DEFAULT now(),
  status USER-DEFINED NOT NULL,
  total numeric DEFAULT '0'::numeric,
  cliente_id uuid NOT NULL,
  CONSTRAINT pedidos_pkey PRIMARY KEY (id),
  CONSTRAINT pedidos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id)
);
CREATE TABLE public.produtos (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nome text NOT NULL DEFAULT ''::text,
  descricao text DEFAULT ''::text,
  preco numeric NOT NULL,
  estoque bigint NOT NULL,
  CONSTRAINT produtos_pkey PRIMARY KEY (id)
);