from flask import Flask
from flask_cors import CORS
import MetodoSimplex
import AplicarSimplex
import sympy as sp
import numpy as np
from flask import request, jsonify

app = Flask(__name__)
cors = CORS(app, resources={r'/simplex/*': {'origins':'http://localhost:3000'}})
# CORS(app)

# Simplex API route
@app.route("/simplex/apply-simplex/", methods=['GET', 'POST'])
def apply_simplex():
    data = request.get_json()
    apply_simplex = AplicarSimplex.AplicarSimplex(data)
    return apply_simplex.aplicar_simplex()



if __name__ == "__main__":
    app.run(debug=True)