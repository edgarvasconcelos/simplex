
import * as React from 'react';

const TipoOtimizacao = props => {
    return (

        <div className="flex flex-wrap -mx-3 mb-6">
            <label for="tipo" className=" tracking-wide text-gray-700 text-lg  mb-2">Selecione o tipo do problema: </label>
            <select name="tipo" className=" ml-2 form-select appearance-none
  px-3
  py-0
  text-base
  font-normal
  text-gray-700
  bg-white bg-clip-padding bg-no-repeat
  border border-solid border-gray-300
  rounded
  transition
  ease-in-out
  mr-5
  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                <option value="max">Maximizar</option>
                <option value="min">Minimizar</option>
            </select>
        </div>
    )


}
export default TipoOtimizacao;