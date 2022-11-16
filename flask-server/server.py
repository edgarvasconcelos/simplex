from flask import Flask
from flask_cors import CORS
import MetodoSimplex
import sympy as sp
import numpy as np

app = Flask(__name__)
cors = CORS(app, resources={r'/simplex/*': {'origins':'http://localhost:3000'}})
# CORS(app)

# Simplex API route
@app.route("/simplex/apply-simplex")
def apply_simplex():
    M = sp.symbols('M')

    matriz_aumentada = np.array(
        [
            [-(1.1*M - 0.4), -(0.9*M - 0.5), 0, 0, M, 0, -12*M],
            [0.3, 0.1, 1, 0, 0, 0, 2.7],
            [0.5, 0.5, 0, 1, 0, 0, 6],
            [0.6, 0.4, 0, 0, -1, 1, 6]
        
        ]
    )

    apply_simplex = MetodoSimplex.MetodoSimplex(matriz_aumentada)
    dict = apply_simplex.simplex()

    json_data = apply_simplex.dict_to_json(dict)
    return json_data


if __name__ == "__main__":
    app.run(debug=True)