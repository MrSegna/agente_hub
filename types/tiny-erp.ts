export interface TinyResponse<T> {
  retorno: T;
  status: string;
  status_processamento: number;
}

export interface TinyOrder {
  id: string;
  numero: string;
  data_pedido: string;
  data_prevista: string;
  cliente: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
  };
  situacao: {
    id: string;
    valor: string;
  };
  valor_total: string;
  itens: TinyOrderItem[];
}

export interface TinyOrderItem {
  item: {
    id: string;
    codigo: string;
    descricao: string;
    quantidade: string;
    valor_unitario: string;
    valor_total: string;
  };
}

export interface TinyProduct {
  id: string;
  codigo: string;
  nome: string;
  preco: string;
  preco_promocional: string;
  unidade: string;
  estoque: string;
  estoque_minimo: string;
  situacao: string;
  tipo: string;
}

export interface TinyTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface TinyContact {
  id: string;
  codigo: string;
  nome: string;
  fantasia: string;
  tipo_pessoa: string;
  cpf_cnpj: string;
  email: string;
  fone: string;
  celular: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade: string;
  uf: string;
  situacao: string;
}

export type TinyOrderStatus = 
  | "aberto"
  | "aprovado"
  | "cancelado"
  | "enviado"
  | "entregue"
  | "preparando";