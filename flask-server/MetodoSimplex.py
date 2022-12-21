import numpy as np
import sympy as sp
import json
class MetodoSimplex:
    
    # M = sp.symbols('M')
    
    def __init__(self, matriz_aumentada):
        self.matriz_aumentada = matriz_aumentada
        self.solucao_basica = []
        self.variaveis_basicas = []
        self.variaveis_nao_basicas = []
        self.multiplas_solucoes = False
        self.coluna_pivo_index = -1
        self.linha_pivo_index = -1
        self.numero_pivo = 0
        self.iteracao = 0
        self.solucao_otima = False
        self.iteracoes = {}
        self.M = sp.symbols('M')

    
    
    def obter_valores_nulo_z(self, coef):
        return 1 if (coef == 0) else 0

    def obter_primeiras_variaveis_basicas(self):
        solucao_basica = self.solucao_basica
        variaveis_basicas = []
        for i, item in enumerate(solucao_basica):
            if(item != 0):
                variaveis_basicas.append(i)

        return np.array(variaveis_basicas)

    def obter_primeira_solucao_basica(self):
        z = self.obter_coeficientes_z()
        lado_direito = list(self.obter_coluna_lado_direito())
        # Onde os valores da solucao basica devem ficar
        coeficientes_nulos = list(map(self.obter_valores_nulo_z, z))
        solucao_basica = list(map(lambda x: lado_direito.pop(0) if x == 1 else 0, coeficientes_nulos))
        return np.array(solucao_basica)

    def obter_variaveis_basicas_index(self):
        variaveis_basicas = self.variaveis_basicas
        coluna_pivo_index = self.coluna_pivo_index
        linha_pivo_index = self.linha_pivo_index

        # Muda o indice da antiga variavel basica para o indice nova
        variaveis_basicas[linha_pivo_index-1] = coluna_pivo_index
        return variaveis_basicas

    def obter_variaveis_nao_basicas_index(self):
        array = np.arange(len(self.solucao_basica))
        variaveis_nao_basicas = np.delete(array, list(self.variaveis_basicas))
        return variaveis_nao_basicas

    def obter_coef_z_vnb(self):
        coefs_z = self.obter_coeficientes_z()
        vnb = self.variaveis_nao_basicas
        coefs_z_vnb = coefs_z[vnb]
        return coefs_z_vnb

    def problema_tem_solucoes_multiplas(self):
        coefs_z_vnb = self.obter_coef_z_vnb()
        for i, valor in enumerate(coefs_z_vnb):
            coefs_z_vnb[i] = 1 if sp.sympify(valor) else valor
        valor_minimo = min(coefs_z_vnb)
        if (valor_minimo == 0):
            self.multiplas_solucoes = True
            return True

        return False

    def razao_minima(self, coluna_pivo, coluna_lado_direito):
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

    def obter_coeficientes_z(self):
        return self.matriz_aumentada[0][:-1]


    def obter_coeficiente_mais_negativo_em_z(self, exp):
        expr = sp.sympify(exp)
        # if (expr.coeff(self.M)):
        #     return expr.coeff(self.M) if expr.coeff(self.M) != 0 else 0
        
        return expr.coeff(self.M) if expr.coeff(self.M) != 0 else exp           

    def obter_coluna_pivo_index(self):
        if(self.multiplas_solucoes):
            coef_z_vnb = self.obter_coef_z_vnb()
            min_index = np.argmin(coef_z_vnb)
            return self.variaveis_nao_basicas[min_index] 

        coef_func = self.obter_coeficientes_z()
        row_without_artifical = np.array(list(map(self.obter_coeficiente_mais_negativo_em_z, coef_func)))
        max_value_index = np.argmin(row_without_artifical)
        coluna_pivo = max_value_index
        return coluna_pivo

    def obter_linha_pivo_index(self):
        matriz = self.matriz_aumentada
        coluna_pivo_index = self.coluna_pivo_index

        coluna_pivo = matriz[:,coluna_pivo_index]
        coluna_lado_direito = self.obter_coluna_lado_direito()
        linha_pivo_index = self.razao_minima(coluna_pivo, coluna_lado_direito)
        return linha_pivo_index


    def obter_coluna_lado_direito(self):
        return self.matriz_aumentada[1:,-1]

    def obter_coef_negativos_em_z(self, exp):
        expr = sp.sympify(exp)
        if(expr.coeff(self.M)):
            return expr.coeff(self.M) if expr.coeff(self.M) != 0 else 0

        return expr if expr < 0 else 0

    def teste_otimalidade(self, row_function):
        coeficientes_artificiais = np.array(list(map(self.obter_coef_negativos_em_z, row_function)))
        coeficientes_artificiais = self.round_values(coeficientes_artificiais,2)
        negativeValues = (coeficientes_artificiais<0).sum()
        if(negativeValues == 0):
            self.solucao_otima = True
            if(not self.multiplas_solucoes):
                self.iteracao += 1
                self.coluna_pivo_index = 'Não há'
                self.linha_pivo_index = 'Não há'
                self.numero_pivo
                self.atribuir_dados()
            return 1

        return 0

    def round_values(self, row, n=4):
        return np.array([round(item,n) for item in row],dtype='O')

    def round_symbolic_coef_f(self, coeff):
        args = coeff.args
        new_coeff_args = 0
        if not args:
            return coeff
        for var in args:
            symbols = var.free_symbols
            if symbols:
                new_coeff = round(var.xreplace({self.M: 1}),2)
                new_coeff_args += new_coeff*self.M
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

        basic_solution = self.obter_coluna_lado_direito()
        basic_solution_index = 0
        nova_solucao_basica = np.zeros(solucao_basica.shape)
        for i, solucao in enumerate(solucao_basica):
            # Adiciona novo valor na lista de solucao basica
            if(i == coluna_pivo_index):
                nova_solucao_basica[i] = basic_solution[linha_pivo_index]
                basic_solution_index += 1
            # Retira valor antigo da lista
            elif(i == variaveis_basicas[linha_pivo_index]):
                nova_solucao_basica[i] = 0
            # Atualiza valor da variavel da lista de solucao basica
            elif(solucao != 0):
                nova_solucao_basica[i] = basic_solution[basic_solution_index]
                basic_solution_index+=1

        return nova_solucao_basica

    def matriz_para_dict(self, matriz):
        matriz_dict = {}
        for i, row in enumerate(matriz):
            row_dict = dict(enumerate(row.flatten(), 1))
            # Parse symbolic values to string so json can show then
            # Only the first row has symoblic values
            if (i==0):
                for i,coef in row_dict.items():
                    row_dict[i] = str(coef).replace('*','')
            matriz_dict[i] = row_dict
        
        return matriz_dict

    def obter_valor_otimo(self):
        if (self.solucao_otima):
            return self.matriz_aumentada[0][-1]

        return ''

    def atribuir_dados(self):
        matriz = self.round_all(self.matriz_aumentada)
        self.solucao_basica = np.around(self.solucao_basica,2)
        self.numero_pivo = np.around(self.numero_pivo,2)
        linha_pivo = str(self.linha_pivo_index)
        dados = {
            'linha_pivo' : str(self.linha_pivo_index),
            'coluna_pivo' : self.coluna_pivo_index,
            'numero_pivo' : self.numero_pivo,
            'variaveis_basicas' : dict(enumerate(self.variaveis_basicas.flatten(), 1)),
            'solucao_basica' : dict(enumerate(self.solucao_basica.flatten(), 1)),
            'solucao_otima': self.solucao_otima,
            'multiplas_solucoes': self.multiplas_solucoes,
            'valor_otimo': self.obter_valor_otimo(),
            'matriz' : self.matriz_para_dict(matriz)
        }
        self.iteracoes[str(self.iteracao)] = dados

    def dict_to_json(self, dict_object):
        jsonStr = json.dumps(dict_object, default=myconverter)
        return jsonStr

    def simplex(self):
        self.solucao_basica = self.obter_primeira_solucao_basica()
        self.variaveis_basicas = self.obter_primeiras_variaveis_basicas()
        self.variaveis_nao_basicas = self.obter_variaveis_nao_basicas_index()
        #self.atribuir_dados()
        func_row = self.obter_coeficientes_z()
        while(1):

            if (self.teste_otimalidade(func_row) and not self.multiplas_solucoes):
                break

            self.iteracao += 1
            self.coluna_pivo_index = self.obter_coluna_pivo_index()
            self.linha_pivo_index = self.obter_linha_pivo_index()
            self.numero_pivo = self.matriz_aumentada[self.linha_pivo_index][self.coluna_pivo_index]
            self.atribuir_dados()
            self.matriz_aumentada = self.obter_nova_matriz();
            self.solucao_basica = self.obter_nova_solucao_basica()
            self.variaveis_basicas = self.obter_variaveis_basicas_index()
            self.variaveis_nao_basicas = self.obter_variaveis_nao_basicas_index()
            func_row = self.obter_coeficientes_z()

            if(self.multiplas_solucoes):
                self.iteracao += 1
                self.coluna_pivo_index = 'Não há'
                self.linha_pivo_index = 'Não há'
                self.numero_pivo
                self.atribuir_dados()
                break

            if(self.solucao_otima):
                self.iteracao += 1
                self.coluna_pivo_index = 'Não há'
                self.linha_pivo_index = 'Não há'
                self.numero_pivo
                self.atribuir_dados()
            
        return self.iteracoes

def myconverter(obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()

