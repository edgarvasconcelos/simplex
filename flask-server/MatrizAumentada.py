import numpy as np
import sympy as sp


class MatrizAumentada:

    def __init__(self, dict_object):
        self.dict_object = dict_object


    def obterCondicao(self, condicao):
        if condicao == -1:
            return '<='
        elif condicao == 0:
            return '>='
        else:
            return '='

    def obter_matriz_ajustada(self):
        dictObject = self.dict_object
        restricoes = int(dictObject['restricoes']) + 1 # +1 da funcao z
        tipo_otimizacao = dictObject['tipo']
        dados_ajustados = []
        for i in range(restricoes):
            if(i==0):
                filter_string = 'z'
                filtered_dict = {k:v for (k,v) in dictObject.items() if filter_string in k}

            else:
                filter_string = 'x'+str(i)
                filtered_dict = {k:v for (k,v) in dictObject.items() if filter_string in k}
            
            row = list(map(float,list(filtered_dict.values())))

            if(i != 0):
                row[-2] = self.obterCondicao(row[-2])

            dados_ajustados.append(row)

        matriz_ajustada = np.array(dados_ajustados, dtype='object')
        self.matriz_ajustada = matriz_ajustada

        return matriz_ajustada, tipo_otimizacao

    def if_minimize(self, matrix):
        for i in range(len(matrix[0])):
            matrix[0][i] = matrix[0][i]*(-1)
        return matrix

    def fix_z(self, matrix, starting_variables, variables, M):
        constraints = len(matrix)
        for i in range(starting_variables, variables):
            if matrix[0][i] == M:
                for j in range(1, constraints):
                    if matrix[j][i] == 1:
                        constraint_row = matrix[j]
                        new_row = [value*(-M) for value in constraint_row[1:]]
                        for k in range(1,variables):
                            new_row[k-1] += matrix[0][k]
                matrix[0] = [matrix[0][0]] + new_row[:]
        return matrix

    def para_lista(self, linha):
        lista = []
        for i, valor in enumerate(linha):
            lista.append(valor)
        
        return lista

    def add_variables(self, matrix, variables, M):
        base = []
        starting_variables = variables
        constraints = len(matrix)-1
        for i in range(1,len(matrix)):
            if '<=' in  matrix[i] :
                for j in range(len(matrix)):
                    if i == j:
                        matrix[j] = matrix[j][:variables] + [1] + matrix[j][variables:]
                    else:
                        matrix[j] = matrix[j][:variables] + [0] + matrix[j][variables:]
                base = base + [variables+1]
            if '>=' in matrix[i]:
                for j in range(len(matrix)):
                    if j == 0:
                        matrix[j] = matrix[j][:variables] + [0] + [M] + matrix[j][variables:]
                    elif i == j:
                        matrix[j] = matrix[j][:variables] + [-1] + [1] + matrix[j][variables:]
                    else:
                        matrix[j] = matrix[j][:variables] + [0] + [0] + matrix[j][variables:]
                base = base + [variables+1]
                variables += 1
            if '=' in matrix[i]:
                for j in range(len(matrix)):
                    if j == 0:
                        matrix[j] = matrix[j][:variables] + [M] + matrix[j][variables:]
                    elif i == j:
                        matrix[j] = matrix[j][:variables] + [1] + matrix[j][variables:]
                    else:
                        matrix[j] = matrix[j][:variables] + [0] + matrix[j][variables:]
                base = base + [variables+1]
            variables += 1
        matrix[0] = matrix[0] + [0]
        matrix[0] = ['z'] + matrix[0]
        for i in range(1,len(matrix)):
            matrix[i] = ['x' + str(base[i-1])] + matrix[i][:variables] + matrix[i][-1:]

        matrix = self.fix_z(matrix, starting_variables+1, variables+2, M)
        #lista = [0] * len(matrix[0].len() - 1)
        matriz = []
        for i in range(len(matrix)):
            lista = self.para_lista(matrix[i][1:])
            matriz.append(lista)

        np_matriz = np.array(matriz)
        return np_matriz, variables


    def column_indexes(self, variables):
        column_index = ['base']
        for i in range(variables):
            column_index.append('x' + str(i))
        column_index.append('ld')
        return column_index
        
    def criar_matriz_aumentada(self):

        M = sp.symbols('M')
        # 0 - Minimizar, 1 - Maximizar
        matriz_ajustada, tipo_otimizacao = self.obter_matriz_ajustada()
        if tipo_otimizacao == 'max':
            matriz_ajustada = self.if_minimize(matriz_ajustada)

        variables = len(matriz_ajustada[0])

        matriz_aumentada, variables = self.add_variables(matriz_ajustada, variables, M)

        return matriz_aumentada
