import numpy as np
import sympy as sp

class MetodoSimplex:
    
    def __init__(self, matriz_aumentada):
        self.matriz_aumentada = matriz_aumentada
        self.solucao_basica = self.retornar_solucao_basica
        self.variaveis_basicas = self.retornar_variaveis_basicas
        self.coluna_pivo = -1
        self.linha_pivo = -1
        self.numero_pivo = 0
        self.iteracoes = self.adicionar_primeira_iteracao(self, matriz_aumentada)

    def adicionar_primeira_iteracao(self, matriz):
        self.iteracoes = []
        self.iteracoes.append(matriz)
    
    def retornar_variaveis_basicas():
        return np.array([2,3,5])
    
    def retornar_solucao_basica():
        return np.array([0,0,2.7,6,0,6])

    def obter_variaveis_basicas_index(self):
        variaveis_basicas = self.variaveis_basicas
        coluna_pivo_index = self.coluna_pivo_index
        linha_pivo_index = self.linha_pivo_index

        variaveis_basicas[linha_pivo_index-1] = coluna_pivo_index
        return variaveis_basicas

    def razao_minima(coluna_pivo, coluna_lado_direito):
        coluna_pivo = coluna_pivo[1:]
        razao_minima_list = []
        razao_minima_index = []
        for i, var in enumerate(coluna_pivo):
            if (var > 0):
                razao = coluna_lado_direito[i]/var
                razao_minima_index.append(i)
                razao_minima_list.append(razao)
        # coluna_pivo[coluna_pivo == 0] = float('-inf')
        minimo_value_index = razao_minima_list.index(min(razao_minima_list))
        linha_pivo_index = razao_minima_index[minimo_value_index] + 1

        return linha_pivo_index

    def obter_coeficientes_z(matriz):
        return matriz[0][:-1]


    def obter_coeficiente_mais_negativo_em_z(exp):
        expr = sp.sympify(exp)
        return expr.coeff(m) if expr.coeff(m) != 0 else 0

    def obter_coluna_pivo_index(self):
        matriz = self.matriz_aumentada
        var_row = self.obter_coeficientes_z(matriz)
        row_without_artifical = np.array(list(map(self.obter_coeficiente_mais_negativo_em_z, var_row)))
        max_value_index = np.argmin(row_without_artifical)
        coluna_pivo = max_value_index
        return coluna_pivo

    def obter_linha_pivo_index(self):
        matriz = self.matriz_aumentada
        coluna_pivo_index = self.coluna_pivo_index

        coluna_pivo = matriz[:,coluna_pivo_index]
        coluna_lado_direito = self.obter_coluna_lado_direito(matriz)
        linha_pivo_index = self.razao_minima(coluna_pivo, coluna_lado_direito)
        return linha_pivo_index


    def obter_coluna_lado_direito(matriz):
        return matriz[1:,-1]

    def obter_coef_negativos_em_z(exp):
        expr = sp.sympify(exp)
        return expr.coeff(m) if expr.coeff(m) != 0 else 0

    def teste_otimalidade(self.row_function):
        coeficientes_artificiais = np.array(list(map(self.obter_coef_negativos_em_z, row_function)))
        coeficientes_artificiais = self.round_values(coeficientes_artificiais,2)
        negativeValues = (coeficientes_artificiais<0).sum()
        if(negativeValues == 0):
            return 1

        return 0

    def round_values(row, n=4):
        return np.array([round(item,n) for item in row],dtype='O')

    def round_symbolic_coef_f(coeff):
        args = coeff.args
        new_coeff_args = 0
        if not args:
            return coeff
        for var in args:
            symbols = var.free_symbols
            if symbols:
                new_coeff = round(var.xreplace({m: 1}),2)
                new_coeff_args += new_coeff*m
            else:
                new_coeff = round(var, 2)
                new_coeff_args += new_coeff
        
        return new_coeff_args

    def round_symbolic_values_f(self, exp):
        expr = sp.sympify(exp)
        symbols = expr.free_symbols
        if symbols:
            return self.round_symbolic_coef_f(expr)
        else:
            return exp

    def round_all(self, matriz_iteracao):
        nova_matriz = np.zeros(matriz_iteracao.shape, dtype='O')

        for i, row in enumerate(matriz_iteracao):
            if(i == 0):
                nova_matriz[i] = list(map(self.round_symbolic_values_f,row))
            else:
                nova_matriz[i] = self.round_values(row,2)

        return nova_matriz

    def obter_nova_matriz(self):
        matriz_aumentada = self.matriz_aumentada
        linha_pivo_index = self.linha_pivo_index
        coluna_pivo_index = self.coluna_pivo_index
        numero_pivo = self.numero_pivo

        nova_matriz = np.zeros(matriz_aumentada.shape, dtype='O')
        linha_pivo = matriz_aumentada[linha_pivo_index]
        linha_pivo_update = self.round_values(linha_pivo * (1/numero_pivo))

        for i, row in enumerate(matriz_aumentada):
            if(i == linha_pivo_index):
                nova_matriz[i] = linha_pivo_update
            else:
                current_row_number = row[coluna_pivo_index]
                nova_matriz[i] = row - current_row_number*linha_pivo_update

        return nova_matriz

    def obter_nova_solucao_basica(self):
        matriz = self.matriz_aumentada
        solucao_basica = self.solucao_basica
        variaveis_basicas = self.variaveis_basicas
        coluna_pivo_index = self.coluna_pivo_index
        # Menos 1 pq para a solucao basica nao eh considerado a linha da funcao z
        linha_pivo_index = self.linha_pivo_index - 1 

        basic_solution = self.obter_coluna_lado_direito(matriz)
        basic_solution_index = 0
        nova_solucao_basica = np.zeros(solucao_basica.shape)
        for i, solucao in enumerate(solucao_basica):
            #Adiciona variavel na base
            if(i == coluna_pivo_index):
                nova_solucao_basica[i] = basic_solution[linha_pivo_index]
                basic_solution_index += 1
            # Retira variavel da base
            elif(i == variaveis_basicas[linha_pivo_index]):
                nova_solucao_basica[i] = 0
            # Atualiza valor da variavel da base
            elif(solucao != 0):
                nova_solucao_basica[i] = basic_solution[basic_solution_index]
                basic_solution_index+=1

        return nova_solucao_basica

    def matriz_para_dict(matriz):
        matriz_dict = {}
        for i, row in enumerate(matriz):
            matriz_dict[i] =dict(enumerate(row.flatten(), 1))
        
        return matriz_dict

    def atribuir_dados(self):
        matriz = self.round_all(self.matriz_aumentada)
        dados = {
            'linha_pivo' : self.linha_pivo_index,
            'coluna_pivo' : self.coluna_pivo_index,
            'numero_pivo' : self.numero_pivo,
            'variaveis_basicas' : dict(enumerate(self.variaveis_basicas.flatten(), 1)),
            'solucao_basica' : dict(enumerate(self.solucao_basica.flatten(), 1)),
            'matriz' : self.matriz_para_dict(matriz)
        }
        self.iteracoes.append(dados)

    def simplex(self):
        self.atribuir_dados()
        func_row = self.obter_coeficientes_z(self.matriz_aumentada)
        while(not self.teste_otimalidade(func_row)):
            self.coluna_pivo_index = self.obter_coluna_pivo_index()
            self.linha_pivo_index = self.obter_linha_pivo_index()
            self.numero_pivo = self.matriz_aumentada[self.linha_pivo_index][self.coluna_pivo_index]
            self.matriz_aumentada = self.obter_nova_matriz();
            self.solucao_basica = self.obter_nova_solucao_basica()
            self.variaveis_basicas = self.obter_variaveis_basicas_index()
            func_row = self.obter_coeficientes_z(self.matriz_aumentada)
            self.atribuir_dados()

        return self.iteracoes

        
    