import MatrizAumentada
import MetodoSimplex
import MetodoGrafico
import json
import numpy as np


class AplicarSimplex:

    def __init__(self, dict_object):
        self.dict_object = dict_object
        self.matriz_ajustada = []
        self.matriz_aumentada = []

    def aplicar_simplex(self):
        print(self.dict_object)
        metodo = self.dict_object['metodo']
        if(metodo == 'grafico'):
            data = self.aplicar_grafico()
        elif(metodo == 'primal'):
            data = self.aplicar_simplex_primal()
        else:
            data = self.aplicar_simplex_dual()

        return data
    def aplicar_simplex_primal(self):
        matriz_aumentada_class = MatrizAumentada.MatrizAumentada(self.dict_object)
        matriz_aumentada = matriz_aumentada_class.criar_matriz_aumentada()
        # ma = np.array([[ 3,  5,  0,  0,  0,  0],
        #         [ 1,  0,  1,  0,  0,  4],
        #         [ 0,  2,  0,  1,  0, 12],
        #         [ 3,  2,  0,  0,  1, 18]])
        print(matriz_aumentada)
        metodo_simplex_class = MetodoSimplex.MetodoSimplex(matriz_aumentada)
        dict_object = metodo_simplex_class.simplex()
        json_data = metodo_simplex_class.dict_to_json(dict_object)
        # print(json_data)
        return json_data

    def aplicar_grafico(self):
        matriz_ajustada, tipo_otimizacao = self.obter_matriz_ajustada()
        grafico = MetodoGrafico.MetodoGrafico(matriz_ajustada)
        grafico.criar_graficos()
        dados_grafico = {
            'imagem': grafico.imagem,
            'ponto_otimo': grafico.ponto_otimo
        }
        json_data = self.dict_to_json(dados_grafico)
        return json_data
        
    def aplicar_simplex_dual(self):
        return
    
    def dict_to_json(self, dict_object):
        jsonStr = json.dumps(dict_object, default=myconverter)
        return jsonStr
