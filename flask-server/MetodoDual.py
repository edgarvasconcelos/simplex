import numpy as np

# Checa se há valores negativos na função ___
def is_negative(array):
    for number in array[1:]:
        if number < 0:
            return True
        else:
            return False


# Encontra o menor número negativo da função ___
def get_pivo_column(array):
    lowest = array[1]
    pivo_column = 1
    for column in range(2, len(array)):
        if array[column] < lowest:
            lowest = array[column]
            pivo_column = column
    return pivo_column


# Encontra a linha do número pivô
def get_pivo_row(array):
    lowest = array[0]
    pivo_row = 0
    for row in range(len(array)):
        if array[row] < lowest:
            lowest = array[row]
            pivo_row = row
    return pivo_row + 1

# Faz os cálculos para encontrar a linha pivô
def get_pivo(matrix, pivo_column):
    division = []
    rows = len(matrix)
    for row in range(1, rows):
        division.append(abs(matrix[0][pivo_column]/matrix[row][pivo_column]))
    pivo_row = get_pivo_row(division)
    return pivo_row

# Divide a linha pivô para que pivô = 1
def divide_pivo_row(matrix, pivo_row, pivo_number):
    for column in range(1, len(matrix[1])):
        matrix[pivo_row][column] = matrix[pivo_row][column]/pivo_number
    return matrix

# Faz os cálculos das outras linhas para que coluna pivô = 0
def calculate_other_rows(matrix, pivo_row, pivo_column, pivo_number):
    rows = len(matrix)
    columns = len(matrix[1])
    for row in range(rows):
        if row != pivo_row:
            multiply_by = matrix[row][pivo_column]
            for column in range(1, columns):
                matrix[row][column] = matrix[row][column] - multiply_by * matrix[pivo_row][column]        
    return matrix

# Arredonda os números para 2 casas decimais
def round_two(matrix):
    for row in range(len(matrix)):
        for column in range(1, len(matrix[1])):
            matrix[row][column] = round(matrix[row][column], 2)
    return matrix

def define_var_values(var_values, matrix, pivo_row, pivo_column):
    new_basic = int(matrix[pivo_row][0][-1])
    var_values[new_basic-1] = matrix[pivo_row][-1]
    var_values[pivo_column-1] = 0
    return var_values

def main():
    matrix = [['z', 2.7, 6, 6, 0, 0, 0], 
              ['y4', 0.3, 0.5, 0.6, 1, 0, 0.4],
              ['y5', 0.1, 0.5, 0.4, 0, 1, 0.5]]
    neg = is_negative(matrix[0])
    var_values = np.zeros(len(matrix[0])-2)
    non_basic_var = len(matrix)-1
    basic_var = len(matrix[0]) - 2 - non_basic_var
    
    while neg:
        pivo_column = get_pivo_column(matrix[0])
        base_variable = 'y' + str(pivo_column)
        pivo_row = get_pivo(matrix, pivo_column)
        pivo_number = matrix[pivo_row][pivo_column]
        matrix = divide_pivo_row(matrix, pivo_row, pivo_number)
        matrix = calculate_other_rows(matrix, pivo_row, pivo_column, pivo_number)
        var_values = define_var_values(var_values, matrix, pivo_row, pivo_column)
        matrix[pivo_row][0] = base_variable
        neg = is_negative(matrix[0])
    z_final = matrix[0][-1]
    print('Matriz final: ')
    matrix = round_two(matrix)
    print(matrix)
    print('Valores das variáveis:')
    print(var_values)
    print('Z* = ')
    print(z_final)
main()