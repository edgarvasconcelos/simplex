import MatrizAumentada
import MetodoSimplex

class AplicarSimplex:

    def __init__(self, dict_object):
        self.dict_object = dict_object
        self.matriz_ajustada = []
        self.matriz_aumentada = []

    def aplicar_simplex(self):
        matriz_aumentada_class = MatrizAumentada.MatrizAumentada(self.dict_object)
        matriz_aumentada = matriz_aumentada_class.criar_matriz_aumentada()
        metodo_simplex_class = MetodoSimplex.MetodoSimplex(matriz_aumentada)
        dict_object = metodo_simplex_class.simplex()
        json_data = metodo_simplex_class.dict_to_json(dict_object)
        return json_data
