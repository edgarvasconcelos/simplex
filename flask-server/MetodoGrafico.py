import pulp
from pulp import *
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.cm as cm
import random

class MetodoGrafico:

    def __init__(self, matriz_padrao):
        self.matriz_padrao = matriz_padrao
        self.imagem = ''
        self.ponto_otimo = ''


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

        return ponto_otimo

    def criar_graficos(self):
        ponto_otimo = self.resolver_lp_problem()
        self.ponto_otimo = ponto_otimo
        dados = self.matriz_padrao

        pontos = []
        #[1.0, 0.0, '<=', 4.0]
        for i, row in enumerate(dados):
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
        print(pontos)

        #receber os pontos de restrição para plotar o grafico
        #fig, ax = plt.subplots()
        #import pdb;pdb.set_trace()
        for i, row in enumerate(pontos):
            print(row)
            if row[0] == 0:
                rest=plt.axvline(x = row[1])
            elif row[1] == 0:
                rest=plt.axhline(y = row[0])
            else:
                rest=plt.plot([0, row[1]], [row[0], 0])



        z=1
        marca=[]
        #[1.0, 0.0, '<=', 4.0]
        while(z<=ponto_otimo):
            for i, row in enumerate(dados):
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
                plt.setp(curva, color='r', linewidth=1.0)
                # pares de strings
                plt.setp(curva, 'color', 'r', 'linewidth', 2.0)
            elif row[1] == 0:
                curva=plt.axhline(y = row[0])
                plt.setp(curva, color='r', linewidth=1.0)
                # pares de strings
                plt.setp(curva, 'color', 'r', 'linewidth', 2.0)
            else:
                curva=plt.plot([0, row[1]], [row[0], 0])
                plt.setp(curva, color='r', linewidth=2.0)
                # pares de strings
                plt.setp(curva, 'color', 'r', 'linewidth', 1.0)

        fig = plt.gcf()
        plt.show()
        imagem = 'grafico'+ random.random()+'.png'
        fig.savefig('grafico.png', format='png')


# dados = [[3.0, 5.0], [1.0, 0.0, '<=', 4.0], [0.0, 2.0, '<=', 12.0], [3.0, 2.0, '<=', 18.0]]
# graf = MetodoGrafico(dados)
# graf.criar_graficos()

