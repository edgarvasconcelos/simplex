import matplotlib
matplotlib.use('Agg')
import pulp
from pulp import *
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.cm as cm
from matplotlib.patches import Polygon
import matplotlib.patches as patches
# from shapely.geometry import Polygon
class MetodoGrafico:

    def __init__(self, matriz_padrao):
        self.dados = []
        self.matriz_padrao = matriz_padrao
        self.imagem = ''
        self.valor_otimo = ''
        self.ponto_otimo = []


    def resolver_lp_problem(self):
        prob = LpProblem("Simple LP Problem", LpMaximize)
        x1 = LpVariable("x1", 0)
        x2 = LpVariable("x2", 0)
        dados = self.matriz_padrao

        for i, row in enumerate(dados):
            if (i == 0):
                prob += row[0]*x1 + row[1]*x2
            else:
                if (row[2] == ">="):
                    prob += row[0]*x1 + row[1]*x2 >= row[3], str(i)+"st constraint"
                elif (row[2] == "<="):
                    prob += row[0]*x1 + row[1]*x2 <= row[3], str(i)+"st constraint"
                else:
                    prob += row[0]*x1 + row[1]*x2 == row[3], str(i)+"st constraint"

        prob.solve()
        ponto_otimo= value(prob.objective)
        solucao_otima = []
        for v in prob.variables():
            solucao_otima.append(v.varValue)

        return ponto_otimo, solucao_otima

    def criar_retas(self):
        pontos = []
        #[1.0, 0.0, '<=', 4.0]
        for i, row in enumerate(self.matriz_padrao):
            # X1 = 0
            if (i == 0):
                continue
            else:
                if row[1] == 0:
                    d = [0, row[3]/row[0]]
                elif row[0] == 0:
                    d = [row[3]/row[1], 0]
                else:
                    d = [row[3]/row[1],row[3]/row[0]]
                    # pontos.append(d)
            pontos.append(d)


        #receber os pontos de restrição para plotar o grafico
        #fig, ax = plt.subplots()
        #import pdb;pdb.set_trace()
        for i, row in enumerate(pontos):
            if row[0] == 0:
                rest=plt.axvline(x = row[1])
            elif row[1] == 0:
                rest=plt.axhline(y = row[0])
            else:
                rest=plt.plot([0, row[1]], [row[0], 0])

        return pontos

    def criar_curvas_de_nivel(self, ponto_otimo):
        z=1
        marca=[]
        #[1.0, 0.0, '<=', 4.0]
        while(z<=ponto_otimo):
            for i, row in enumerate(self.matriz_padrao):
                # X1 = 0
                if (i == 0):
                    if row[1] == 0:
                        t = [0, z/row[0]]
                        z+=0.5
                    elif row[0] == 0:
                        t = [z/row[1], 0]
                        z+=0.5
                    else:
                        t = [z/row[1],z/row[0]]
                        z+=0.5
                marca.append(t)

        for i, row in enumerate(marca):

            if row[0] == 0:
                curva=plt.axvline(x = row[1])
                # plt.setp(curva, color='r', linewidth=0.5)
                # pares de strings
                plt.setp(curva, 'color', 'r', 'linewidth', 0.5)
            elif row[1] == 0:
                curva=plt.axhline(y = row[0])
                # plt.setp(curva, color='r', linewidth=0.5)
                # pares de strings
                plt.setp(curva, 'color', 'r', 'linewidth', 0.5)
            else:
                curva=plt.plot([0, row[1]], [row[0], 0])
                # plt.setp(curva, color='r', linewidth=2.0)
                # pares de strings
                plt.setp(curva, 'color', 'r', 'linewidth', 0.5)

    def retornar_limites_maximos(self, pontos_interseccao):
        x = []
        y = []
        for i, coord in enumerate(pontos_interseccao):
            x.append(coord[0])
            y.append(coord[1]) 
        
        return max(x), max(y)
    def encontrar_pontos(self, pontos_geradores_retas): 
        pontos_comuns = []
        par_restricoes_usadas = []

        for i, row in enumerate(self.matriz_padrao):
            # a soma de cada par de restricao sera considera para saber se para aquele
            #par de restricoes ja foram calculado os pontos.
            # sera considerado o 
            if(i == 0):
                continue

            # Encontrar pontos de interseccao com os eixos
            # i -1 pq o vetor coords graficos nao possui coords para criara reta z
            # coords_restr_atual = [y, x]
            coords_restr_atual = pontos_geradores_retas[i-1]
            coords_restr_atual = [coords_restr_atual[1], coords_restr_atual[0]]
            try:
                coords_restr_atual.index(0)
                ponto_interseccao = coords_restr_atual
                pontos_comuns.append(ponto_interseccao)
            except:
                a = [coords_restr_atual[0], 0]
                pontos_comuns.append(list(a))
                b = [0, coords_restr_atual[1]]
                pontos_comuns.append(list(b))


            # Encontrar pontos de interseccao com outras restricoes
            for j, restr in enumerate(self.matriz_padrao):
                soma = i + j

                if soma in par_restricoes_usadas: 
                    ja_encontrados =  True 
                else: 
                    ja_encontrados =  False 

                if(j == 0 or j == i or ja_encontrados):
                    continue

                a = [[row[0], row[1]], [restr[0], restr[1]]]
                b = [row[3],restr[3]]    
                ponto_interseccao = np.linalg.solve(a, b)
                pontos_comuns.append(list(ponto_interseccao))
                par_restricoes_usadas.append(soma)
            
        return pontos_comuns

    def encontrar_pontos_viaveis(self, pontos_interseccao):
        pontos_viaveis = []

        for i, p_coords in enumerate(pontos_interseccao):

            viable = True
            for j, restr in enumerate(self.matriz_padrao):
                if(j == 0):
                    continue

                tipo = restr[2]
                resultado_restr = restr[3]
                restr_coefs = [restr[0], restr[1]]

                soma = p_coords[0]*restr_coefs[0] + p_coords[1]*restr_coefs[1]
                # soma = round(np.dot(np.array(restr, p_coords)))
                match (tipo):
                    case ">=":
                        viable = (soma >= resultado_restr or np.isclose(soma, resultado_restr))
                    case "<=":
                        viable = (soma <= resultado_restr or np.isclose(soma, resultado_restr))
                    case "=":
                        viable = np.isclose(soma, resultado_restr)
                if (not viable):
                    break
            else:
                pontos_viaveis.append(p_coords)

        return pontos_viaveis

    def plotar_todos_os_pontos(self, pontos_interseccao, ponto_otimo):
        for i  in pontos_interseccao:
            if(i[0] == ponto_otimo[0] and i[1]==ponto_otimo[1]):
                ex=plt.plot(i[0],i[1], 'ro')
            else:
                ex=plt.plot(i[0],i[1], 'go')


    def criar_graficos(self):
        valor_otimo, ponto_otimo  = self.resolver_lp_problem()
        self.valor_otimo = valor_otimo
        self.ponto_otimo = ponto_otimo
        self.dados = self.matriz_padrao
        dados = self.matriz_padrao
        fig = plt.figure()
        pontos_geradores_retas = self.criar_retas()

        pontos_interseccao = self.encontrar_pontos(pontos_geradores_retas)
        pontos_viaveis = self.encontrar_pontos_viaveis(pontos_interseccao)
        pontos_interseccao = [[0, 0]] + pontos_interseccao
        pontos_viaveis = [[0, 0]] + pontos_viaveis
        pontos_viaveis[-2], pontos_viaveis[-1] = pontos_viaveis[-1], pontos_viaveis[-2]
        self.plotar_todos_os_pontos(pontos_interseccao, ponto_otimo)

        self.criar_curvas_de_nivel(valor_otimo)
        fig.savefig('../client/public/Assets/grafico-curvas.png', format='png')
        plt.clf()
        self.criar_retas()
        self.plotar_todos_os_pontos(pontos_interseccao, ponto_otimo)
        y = np.array(pontos_viaveis)
        pp = Polygon(y, color = '0.5')
        # fig, ax = plt.subplots()
        # x_max, y_max = self.retornar_limites_maximos(pontos_interseccao)
        # ax.add_patch(p)
        # ax.set_xlim([0,x_max])
        # ax.set_ylim([0,y_max])
        plt.gca().add_patch(patches.Polygon(y, color = '0.5'))
        plt.grid(True)

        fig.savefig('../client/public/Assets/grafico.png', format='png')


        plt.show()


# dados = [[3.0, 5.0], [1.0, 0.0, '<=', 4.0], [0.0, 2.0, '<=', 12.0], [3.0, 2.0, '<=', 18.0]]
# graf = MetodoGrafico(dados)
# graf.criar_graficos()
